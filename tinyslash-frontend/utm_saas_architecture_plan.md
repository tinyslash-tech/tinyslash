# Scaling UTM to Tier-1 SaaS Level: The UTM Templates Feature
## Executive Summary (Product Manager & CTO Level Analysis)

Based on industry standards (like Dub) and the current architecture of TinySlash, this document outlines the end-to-end plan to implement a highly scalable, secure, and user-friendly **UTM Templates** feature.

This analysis covers what to build, how to scale it to handle millions of links, and how to keep it strictly secure.

---

## 1. Product Manager Analysis: What Are We Building?

**The Problem:** Power users and marketing teams generate hundreds of links. Typing `utm_source=newsletter&utm_medium=email&utm_campaign=summer_sale` every single time is tedious and error-prone. A single typo ruins tracking and analytics aggregations.
**The Solution:** Build a **UTM Templates** feature that allows users to save preset UTM parameters and apply them with one click during link creation.

### Key Capabilities (MVP Scope):
*   **Template Creation Modal:** A dedicated UI to define a template (Name, Source, Medium, Campaign, Term, Content, Referral).
*   **Template Selection Dropdown:** Inside the `Create Link`, `File-to-URL`, and `QR Code` flows, a searchable dropdown allows users to apply a saved template instantly.
*   **Team Scoping (Crucial for SaaS):** Templates must belong to a *Workspace* or *Team*, not just an individual user. This allows a marketing manager to set up standard templates that the entire team *must* use.

### Phase 2 Considerations (Future Scope):
*   **Dynamic Variables:** Supporting variables in templates like `{date}` or `{user_initials}`.
*   **Enforced UTMs:** A workspace setting that requires team members to use a template before creating any short link.

---

## 2. CTO Analysis: System Architecture & Scalability

To build this securely and ensure it scales without degrading link creation performance, we need to architect the database, caching, and API layers correctly.

### Database Schema Design (PostgreSQL/MySQL)
We need a new table: `utm_templates`.

```sql
CREATE TABLE utm_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    referral VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure template names are unique per team
    CONSTRAINT unique_template_name_per_team UNIQUE (team_id, name)
);
-- Index for fast lookups during link creation
CREATE INDEX idx_utm_templates_team_id ON utm_templates(team_id);
```

### Backend API Design (Java Spring Boot)
The API must be strictly authenticated and scoped to the user's active team.

*   `POST /api/v1/teams/{teamId}/utm-templates` -> Create a new template.
*   `GET /api/v1/teams/{teamId}/utm-templates` -> List all templates for the team namespace.
*   `PUT /api/v1/teams/{teamId}/utm-templates/{templateId}` -> Update an existing template.
*   `DELETE /api/v1/teams/{teamId}/utm-templates/{templateId}` -> Delete a template.

### Caching Strategy (Performance & Scalability)
*   **The Problem:** Every time a user opens the "Create Link" modal, the frontend needs the list of templates. Querying the DB for this every time across thousands of active users will cause unnecessary DB load.
*   **The Solution:** Implement a **Redis Cache Layer** for the `GET` endpoint.
    *   **Cache Key:** `team:{teamId}:utm_templates`
    *   **TTL:** 24 hours.
    *   **Invalidation:** Whenever a `POST`, `PUT`, or `DELETE` request hits the template API for a `teamId`, immediately evict the `team:{teamId}:utm_templates` cache key. This ensures 100% data consistency while serving 99% of requests from memory.

### Security Posture & Validation
*   **Data Validation:** Block restricted characters. UTM parameters should be strictly validated (alphanumeric, hyphens, underscores) to prevent malicious payloads or broken URLs. Use a regex validator on the backend.
*   **XSS Prevention:** Ensure all template outputs are properly URL-encoded before being appended to the destination URL.
*   **Authorization:** Implement strict checks so a user cannot query, edit, or delete templates belonging to a `teamId` they are not a confirmed member of.

---

## 3. Frontend Implementation Plan (React/TypeScript)

To mimic the industry-standard UI (like the Dub reference):

### Component 1: `CreateUtmTemplateModal.tsx`
*   A clean modal with inputs for the Template Name and the standard UTM fields (Source, Medium, Campaign, Term, Content, Referral).
*   Use `react-hook-form` and `yup`/`zod` for strict client-side validation.
*   Use a React Query mutation to submit the data, automatically invalidating the `['utm-templates', teamId]` query cache on success to instantly reflect the new template in the UI.

### Component 2: `TemplateSelector.tsx`
*   A combobox (searchable dropdown) integrated into the Link Builder, File-to-URL Builder, and QR Code Builder.
*   When a template is selected, it automatically populates the UTM input fields in the builder.
*   **UX Detail:** If a user selects a template, they can still manually override individual fields (e.g., select the "Summer Promo" template, but tweak the `utm_content`).

---

## Next Steps for Immediate Execution
If we proceed to build this today, the execution order should be:

1.  **Backend (Day 1):** Create the `UtmTemplate` Entity, Repository, and Controller with the Redis caching logic.
2.  **Frontend (Day 2):** Build the `CreateUtmTemplateModal` and wire up the API endpoints using React Query.
3.  **Integration (Day 3):** Drop the `TemplateSelector` into the Link, File, and QR builders to finalize the loop.
