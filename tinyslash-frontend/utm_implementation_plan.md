# UTM Implementation Analysis & Plan

## Current State of UTM in TinySlash
The current UTM implementation in TinySlash is a strong foundation for an industry-standard SaaS, but it primarily focuses on the **Standard Short Links** feature. 

### What is currently implemented (The Good Parts):
1. **UTM Auto-Appending**: The `UrlShorteningService` automatically appends `utm_source`, `utm_medium`, and `utm_campaign` to the destination URL before redirecting the user.
2. **Analytics Aggregation**: The `AnalyticsSection` and `Analytics.tsx` perfectly capture and display campaign performance broken down by Source, Medium, and Campaign.
3. **Link Editing**: Users can edit and add UTMs via the `EditLinkModal.tsx`.

### Is it "Industry SaaS Level"?
**Partially.** An enterprise SaaS level implementation requires UTM tracking to be a first-class citizen across *all* sharing primitives, not just basic links. It also requires features like UTM templates and strict validation.

---

## Feature Breakdown

### 1. Short Links (URLs)
✅ **Implemented.** Users can define UTMs when creating/editing a short link. 

### 2. File-to-URL
❌ **Not Implemented.** 
Currently, the `FileController` and `FileLink` models do not natively support appending UTM parameters to the downloaded file or the landing page that hosts the file.
**Why it's needed:** If a user shares a PDF report link on LinkedIn vs. an Email newsletter, they need to know which channel drove the download.

### 3. QR Codes
⚠️ **Partially/Indirectly Implemented.**
Currently, QR codes do not have a dedicated UI for UTM parameters during creation. *However*, since QR codes often wrap a TinySlash short link, a user *could* manually create a short link with UTMs, and then generate a QR code for that short link. 
**Why it's needed:** This is a terrible user experience. Users should be able to generate a "Conference Flyer" QR code and natively attach `utm_source=offline&utm_medium=qr&utm_campaign=q1_flyer` directly in the QR creation modal.

---

## Implementation Plan & Ideas (What needs to be implemented)

To make TinySlash's UTM tracking a true Tier-1 SaaS feature, here are the required improvements:

### 1. File-to-URL UTM Support
- **Backend:** Update the `FileLink` entity to include `utmSource`, `utmMedium`, and `utmCampaign`. 
- **Backend Redirect:** When someone visits `/f/{fileCode}`, append the UTM parameters to the final redirect or track them in the `FileView` analytics event before serving the file.
- **Frontend:** Add the advanced UTM dropdown menu to the `FileToUrlManager` creation and edit modals.

### 2. QR Code Native UTM Support
- **Frontend:** In the QR Code creation modal, add a "Campaign Tracking (UTM)" section.
- **Backend:** When the QR Code generates its underlying short URL, inject these UTM parameters into the short URL's configuration.

### 3. "SaaS-Level" Premium Capabilities (Ideas)
- **UTM Presets / Templates:** Allow Pro/Business users to save UTM templates (e.g., "Standard LinkedIn Post", "Monthly Newsletter") so they don't have to type them every time.
- **Forced UTMs (Team Feature):** Allow Team Admins to toggle a setting that *forces* team members to include UTM parameters before a link can be created.
- **Dynamic UTM Variables:** Allow users to use variables like `{date}` or `{user_name}` in their UTM configurations.
