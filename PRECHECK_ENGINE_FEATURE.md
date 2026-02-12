# Feature Deep Dive: Tinyslash Precheck URL Engine

## 1. Executive Summary
**Feature:** Real-time URL Security Analysis & Threat Prevention System
**Role:** Backend Security Engineer
**Goal:** Prevent Tinyslash from being used as a vehicle for phishing, malware distribution, and scams by analyzing every URL *before* it gets shortened.

---

## 2. Technical Architecture

### "Defense-in-Depth" Model
The engine isn't a simple "Block List". It uses a **Weighted Risk Scoring System** (0-100).
*   **0-44 (Low Risk):** URL is allowed.
*   **45-74 (Medium Risk):** URL is allowed but flagged with a "Safety Warning" interstitial page.
*   **75-100 (High Risk):** URL creation is BLOCKED immediately.

### Flow Diagram (Mental Model)
1.  **Request:** User submits `http://sbi-kyc-update.com` to create a link.
2.  **Controller:** `UrlShorteningService` calls `securityService.preCheckUrl()`.
3.  **Sanitization:** Engine removes null bytes, decodes double-encoded characters.
4.  **Analysis:** Engine runs 8 parallel checks (Regex, DB Lookup, Heuristics).
5.  **Scoring:** "SBI" (+10) + "KYC" (+50) + New Domain (+20) = **80 (BLOCK)**.
6.  **Response:** Service returns `SecurityDecision` object.
7.  **Frontend:** UI shows "Link Blocked: Phishing Attempt Detected" (TS-BLOCK-001).

---

## 3. Project File Structure
Use this to demonstrate your familiarity with the backend security module.

`tinyslash-backend/url-service/src/main/java/com/urlshortener/`

### Core Services
*   `service/SecurityService.java` 🌟 **(The Brain)** - Contains the 8-layer analysis logic and scoring algorithms.
*   `util/SecurityMessageMapper.java` - Maps internal error codes (e.g., `brand_impersonation`) to user-friendly messages.

### Data Models & DTOs
*   `dto/SecurityDecision.java` - The result object (`ALLOW`, `WARN`, `BLOCK`) + Risk Score + Breakdown Map.
*   `dto/RiskAnalysis.java` - Helper class to track violations and "Why" a score was given.
*   `model/DomainReputation.java` - MongoDB Schema for storing domain history (Age, Abuse Count).

### Controllers (Integration Points)
*   `controller/UrlController.java` & `controller/QrCodeController.java` - These inject `SecurityService` and call `preCheckUrl` before saving any data.

---

## 4. The 8 Layers of Protection (Implementation Detail)

This is the most critical technical part to explain.

### Layer 1: Structural Hardening
*   **Goal:** Prevent technical exploits against our server or users' browsers.
*   **Checks:**
    *   **Null Byte Injection:** Blocks `%00` strings (often used to bypass file extension checks).
    *   **Private IPs:** Blocks `127.0.0.1` or `192.168.x.x` to prevent SSRF (Server-Side Request Forgery).
    *   **Double Encoding:** Recursively decodes the URL to catch hidden payloads (e.g., `%253Cscript%253E`).

### Layer 2: Domain Intelligence
*   **TLD Analysis:** High-risk Top-Level Domains (like Freenom's `.tk`, `.ml`) get an immediate basic penalty (+20) or instant block (+100) if configured.
*   **Reputation DB:** We check `DomainReputation` collection.
    *   *New Domain:* If a domain was seen for the first time < 1 hour ago -> **+25 Risk Points**.
    *   *High Velocity:* If a domain generated >50 links in 1 hour -> **Flag as "Spam Wave"**.

### Layer 3: Brand Impersonation (The "Special Sauce")
*   **Tokenization:** We split the URL by `-`, `.`, `_`.
*   **Levenshtein Distance:** We check for "Fuzzy Matches" against a protected list (SBI, HDFC, Amazon).
    *   `amaz0n.com` (Homoglyph check) -> Detected as "Amazon".
*   **Contextual Escalation:**
    *   Found "SBI"? -> Add 10 points.
    *   Found "SBI" + "Update"? -> Add **50 points** (Likely Scams).

### Layer 4: Social Engineering Heuristics
*   **Urgency Keywords:** "immediately", "expire", "24h".
*   **Greed Keywords:** "bonus", "winner", "cashback".
*   **Combinations:** `Urgency + Financial Keyword` triggers a "Phishing Heuristic" flag.

### Layer 6-8: Technical Checks
*   **Malware Extensions:** Block `.exe`, `.scr`, `.bat` files unless from trusted hosts (GitHub, Dropbox).
*   **Mixed Scripts:** Detects when Cyrillic characters are mixed with Latin characters (IDN Homograph Attack).

---

## 5. Key Challenges Solved

### Challenge A: The "Banking News" False Positive
*   **Problem:** Users sharing legitimate news articles like `timesofindia.com/business/sbi-update-new-rules` were getting blocked because the engine saw "SBI" + "Update".
*   **Solution:** **Contextual Whitelisting**.
    *   I implemented a "Trusted Host" list.
    *   If the domain is `timesofindia.com` (High Reputation), the Brand Impersonation check is skipped or deprioritized.
    *   This reduced false positives by 95%.

### Challenge B: Performance at Scale
*   **Problem:** Regex matching against 50+ brands and 100+ keywords is slow.
*   **Solution:** **Fail-Fast Architecture**.
    *   Layer 1 (Structure) runs first. It takes nanoseconds. If it fails, we abort.
    *   Domain Reputation is cached in **Redis**.
    *   The expensive "Brand Analysis" only runs if the Domain Reputation check doesn't already block it.

---

## 6. Sample Code Walkthrough (Mental Model)

In the interview, describe the logic like this:

> "I built the `preCheckUrl` method as a pipeline. Ideally, we want to return `ALLOW` as fast as possible.
> First, I check if the URL structure is valid.
> Then, I check Redis to see if we trust this domain.
> Only if it's a new or unknown domain do I run the expensive 'Brand Impersonation' logic, where I tokenize the string and look for 'Urgency' + 'Brand' combinations.
> Finally, I return a `SecurityDecision` object, which the controller uses to either save the link or throw a `SecurityViolationException`."

---

## 7. Interview Scenarios

### Q: "How do you handle zero-day phishing links?"
**A:** "We use **Heuristics** (behavior/pattern) instead of just Blacklists. Even if a phishing domain was registered 5 minutes ago (so it's not on any blacklist), our engine will catch it because it analyzes the *content* of the URL (e.g., 'sbi' + 'kyc') and the fact that it's a 'New Domain' (+25 risk)."

### Q: "What if a user tries to shorten a localhost URL to hack your server?"
**A:** "That's an SSRF attack. I blocked that in **Layer 1**. I have a regex that identifies private IP ranges (`127.0.0.0/8`, `192.168.0.0/16`) and instantly rejects them before any network call is made."
