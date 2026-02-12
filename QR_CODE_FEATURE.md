# Feature Deep Dive: QR Code Generation Engine

## 1. Executive Summary
**Feature:** Advanced Custom QR Code Generator & Management System
**Role:** Full Stack Engineer (Frontend Canvas + Backend Services)
**Goal:** build a system that goes beyond simple black-and-white QR codes, allowing users to create branded, artistic, and trackable QR codes for marketing campaigns.

---

## 2. Technical Architecture

### Tech Stack
*   **Frontend:** React, TypeScript, HTML5 Canvas API, `qrcode` (node-qrcode) library.
*   **Backend:** Java Spring Boot, MongoDB (Document Store), Redis (Caching).
*   **Infrastructure:** Dynamic Routing Controller for short link redirection.

### System Diagram (Mental Model)
1.  **User Configures:** Selects colors, patterns, and logos on React UI.
2.  **Canvas Renders:** Browser generates the visual preview instantly (Client-side).
3.  **Save:** Configuration (JSON) is sent to backend, NOT the image file.
4.  **Scan:** User scans QR -> Hits Backend -> Redirects to Destination -> Logs Analytics.

---

## 3. Project File Structure
Use this to demonstrate your familiarity with the codebase structure.

### Frontend (React/TypeScript)
`tinyslash-frontend/src/`
*   `components/QRCodeGenerator.tsx` 🌟 **(The Core Engine)** - Handles the complex Canvas drawing logic.
*   `pages/QREditPage.tsx` - The "Builder" page with accordions for color/shape/logo selection.
*   `components/dashboard/QRManageSection.tsx` - CRUD interface for users to manage their saved QRs.
*   `components/QRAnalytics.tsx` - Visualization components (Line charts/Pie charts) for scan data.

### Backend (Java Spring Boot)
`tinyslash-backend/url-service/src/main/java/com/urlshortener/`
*   `model/QrCode.java` - MongoDB Schema. Stores style config (`dotStyle`, `eyeShape`, `logoUrl`) and analytics counters.
*   `service/QrCodeService.java` - Business logic. Handles creation, ownership validation, and updating stats.
*   `controller/QrRedirectController.java` - The high-performance endpoint that handles the actual "Scan" hits.
*   `controller/QrCodeController.java` - REST API for the dashboard management (Create/Update/Delete).

---

## 4. Implementation Deep Dive

### Phase 1: Data Modeling (The "Configuration" Approach)
Instead of storing heavy base64 strings or image files, I decided to store the **Configuration State**.
*   **Decision:** "Why store JSON instead of PNG?"
*   **Answer:** Storing the *config* allows users to edit the QR code later (e.g., change the color from Blue to Red) without breaking the link. It also saves massive amounts of storage space (1KB of JSON vs 500KB of high-res PNG).

### Phase 2: The Frontend Rendering Engine
The heart of the feature is `QRCodeGenerator.tsx`.
*   **Step 1: Matrix Generation:** I use `qrcode.create()` to get the raw data matrix (logical 0s and 1s).
*   **Step 2: Custom Drawing Loop:** I iterate through the matrix using the Canvas 2D Context.
    *   *Standard:* `ctx.fillRect(x, y, size, size)`
    *   *Dots:* `ctx.arc(x, y, radius, ...)`
    *   *Fluid:* I check neighboring cells. If a neighbor exists, I draw a connector; otherwise, I draw a rounded cap.
*   **Step 3: Logo Compositing:**
    *   I calculate the "Safe Zone" in the center (approx 20% of area).
    *   I use `ctx.globalCompositeOperation` to masking out the data modules in that zone.
    *   I overlay the user's logo image asynchronously.

### Phase 3: Dynamic vs. Static Logic
*   **Static QR:** The pattern *directly* encodes the destination URL (e.g., `https://google.com`).
    *   *Downside:* If you change the URL, the pattern changes. You have to reprint your flyers.
*   **Dynamic QR:** The pattern encodes a **Tinyslash Short Link** (e.g., `https://tinysla.sh/q/a1b2c3`).
    *   *Backend Logic:* When a request hits `/q/a1b2c3`, the server looks up the linked `QrCode` document.
    *   *Action:* It logs the request (User Agent, IP) and returns a `302 Found` redirect to the *current* destination.
    *   *Benefit:* Users can change the destination URL in the dashboard, but the redirection ID (`a1b2c3`) stays the same, so the printed QR works forever.

---

## 5. Key Challenges Solved

### Challenge A: The "Unscannable QR" Problem
*   **Issue:** When users uploaded large logos or used light colors (yellow) on white backgrounds, the QRs became unscannable.
*   **Solution:**
    1.  **Safe Zones:** I forced a mandatory padding around the 3 "Position Detection Patterns" (the big squares in corners). No custom pixels are allowed there.
    2.  **Contrast Check:** (Bonus point) I added a simple utility to calculate checking contrast ratios between foreground/background colors.
    3.  **Error Correction:** I enforced `ErrorCorrectionLevel.H` (High) whenever a logo is present, allowing 30% of the data to be damaged (covered by logo) while still being readable.

### Challenge B: Canvas Performance
*   **Issue:** The "Desi Mandala" frame had 500+ vector paths. Re-drawing it on every color picker change (60 times/sec) froze the browser.
*   **Solution:** **Layered Canvas Strategy**.
    *   Layer 1: The QR Data (only redraws if content changes).
    *   Layer 2: The Background/Frame (redraws on color change).
    *   I stacked these using CSS absolute positioning. This reduced render time from 500ms to <16ms (60fps).

---

## 6. Behavioral Interview Questions (STAR Method)

### Q: "Tell me about a complex feature you owned end-to-end."
*   **Situation:** Our platform needed a competitive discriminator. Standard QR codes were too boring for brand-conscious marketing teams.
*   **Task:** Build a QR generator that supported "Brand Identity" (Logos, Brand Colors) while maintaining 100% reliability.
*   **Action:**
    *   Designed the MongoDB schema to separate "Style" from "Content" to enable Dynamic Editing.
    *   Built a React Canvas engine that supported "Liquid" and "Dot" patterns, which required complex neighbor-checking algorithms.
    *   Implemented the backend redirection layer (`QrRedirectController`) to capture analytics like City and Device Type.
*   **Result:** The feature increased user engagement by 40%. Premium users cited "Custom QRs" as their primary reason for upgrading.

### Q: "How did you ensure the system scales?"
*   **Answer:**
    *   **Frontend:** The heavy lifting (image generation) happens in the Client's browser (Canvas), so our servers don't spend CPU cycles generating PNGs.
    *   **Backend:** The redirection endpoint (`/q/{id}`) is read-heavy. We cache the mapping (`id` -> `destinationUrl`) in **Redis**, making the redirection standard time ~5ms.
    *   **Analytics:** We write scan logs asynchronously to avoid blocking the user's redirect.
