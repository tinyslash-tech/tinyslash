# 🔗 Tinyslash - Enterprise Link Management Platform

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

> **Tinyslash** is an industry-grade, SaaS-ready URL shortening and link management platform. Built for scale with a microservices-ready architecture, it features advanced analytics, custom domains, QR code generation, and team collaboration tools.

**Live Production:** [https://tinyslash.com](https://tinyslash.com)  
**Live Development:** [https://dev.tinyslash.com](https://dev.tinyslash.com)

---

## 📚 Table of Contents
1. [System Architecture & Design](#-system-architecture--design)
2. [Detailed Tech Stack](#-detailed-tech-stack)
3. [Project Structure](#-project-structure)
4. [Authentication Flow](#-authentication-flow)
5. [Core Features Implementation](#-core-features-implementation)
6. [Admin System](#-admin-system)
7. [Local Development Setup](#-local-development-setup)
8. [Contribution Guide for Interns](#-contribution-guide-for-interns)
9. [Troubleshooting](#-troubleshooting)

---

## 🏗️ System Architecture & Design

Tinyslash is built on a **Decoupled Client-Server Architecture** designed for high availability and horizontal scalability.

### 1. High-Level Architecture
- **Frontend (SPA):** A React 18 application handling the presentation layer. It communicates with the backend via RESTful APIs and utilizes JWT for stateless authentication.
- **Backend (API):** A Spring Boot 3.2 application acting as the core logic engine. It handles business rules, request validation, and database orchestration.
- **Data Layer (MongoDB):** We use MongoDB (NoSQL) for its flexible schema, allowing us to store complex analytics data in a single document (e.g., nesting click data by country/device within the URL document).
- **Edge Layer (Cloudflare):** Handles DNS, SSL termination for custom domains (SaaS), and serves as a global CDN to reduce latency.

### 2. Request Flow Lifecycle
1.  **User Request:** User clicks a short link (e.g., `tinyslash.com/xyz123`).
2.  **DNS Resolution:** Cloudflare routes traffic to our Render backend.
3.  **Backend Processing:**
    -   `UrlShorteningService` intercepts the request.
    -   Looks up `shortCode: xyz123` in Redis Cache (Hit) or MongoDB (Miss).
    -   Extracts metadata (Browser, OS, IP -> Country).
    -   **Async Analytics:** Fires an event to increment click counters without blocking the redirect.
4.  **Response:** Returns `302 Found` with the `Location` header set to the original URL.

---

## 🛠️ Detailed Tech Stack

### Frontend (`tinyslash-frontend`)
-   **Core:** React 18, TypeScript 5 (Strict Mode)
-   **Build Tool:** Vite (for fast HMR and optimized builds)
-   **Styling:** 
    -   **TailwindCSS 3:** Utility-first styling for rapid UI development.
    -   **Framer Motion:** Complex layout animations and transitions.
    -   **Lucide React:** Consistent icon set.
-   **State Management:** 
    -   **Context API:** For global app state (Auth, Theme).
    -   **React Query (TanStack):** For server state caching and synchronization.
-   **Routing:** React Router DOM v6
-   **Analytics Visualization:** Recharts (D3-based composable charts).
-   **HTTP Client:** Axios with interceptors for token refreshment.

### Backend (`tinyslash-backend`)
-   **Core:** Java 17 LTS, Spring Boot 3.2.0
-   **Database:** MongoDB 6.0 (via Spring Data MongoDB).
-   **Security:** 
    -   Spring Security 6 (FilterChain based).
    -   **JJWT:** For extensive JWT creation and validation.
    -   **Google OAuth2 Client:** For social login flows.
-   **Utilities:**
    -   **Lombok:** Reduces boilerplate (Getters/Setters/Builders).
    -   **Jackson:** JSON serialization/deserialization.
-   **Build Tool:** Maven 3.8+
-   **Testing:** JUnit 5, Mockito.

---

## 📂 Project Structure

### Backend (`tinyslash-backend/url-service`)
Follows a **Layered Architecture** ensuring separation of concerns:

```
src/main/java/com/urlshortener/
├── controller/         # API Layer: Handles HTTP requests, validation, and JSON responses.
│   ├── AuthController.java      # /api/v1/auth/** (Login, Register, Google)
│   ├── UrlController.java       # /api/v1/url/** (Create, Update, Delete)
│   └── RedirectController.java  # /{shortCode} (The public redirect endpoint)
├── service/            # Business Logic Layer: The complexity lives here.
│   ├── UrlShorteningService.java # Core logic for shortening and analytics.
│   └── UserService.java         # User management logic.
├── repository/         # Data Access Layer: Interfaces extending MongoRepository.
├── model/              # Domain Entities: POJOs mapped to MongoDB documents.
│   ├── ShortenedUrl.java        # Stores URL data + Embedded Analytics Maps.
│   └── User.java                # User profile + Role data.
├── config/             # Configuration Classes.
│   ├── SecurityConfig.java      # CORS, CSRF, and FilterChain rules.
│   └── MongoConfig.java         # Database connection settings.
├── security/           # Security Components.
│   └── JwtAuthenticationFilter.java # Intercepts requests to validate "Bearer" tokens.
└── admin/              # Admin Module.
```

### Frontend (`tinyslash-frontend`)
Organized by **Feature-First** structure:

```
src/
├── components/         # Atomic & Molecular Components.
│   ├── ui/             # Generic UI (Button, Input, Card).
│   └── features/       # Feature-specific (UrlList, AnalyticsChart).
├── pages/              # Page-level Components (Views).
│   ├── Dashboard.tsx
│   ├── LandingPage.tsx
│   └── Auth/           # Login/Register pages.
├── context/            # Global Contexts.
│   └── AuthContext.tsx # Handles User session state.
├── services/           # Service Layer (API calls).
│   ├── api.ts          # Axios instance configuration.
│   └── authService.ts  # Auth-related API calls.
├── hooks/              # Custom React Hooks.
│   └── useAnalytics.ts # Hook for fetching analytics data.
└── App.tsx             # Main Router configuration.
```

---

## � Authentication Flow

We use a **Hybrid Auth System** supporting both Email/Password and Google OAuth.

### 1. Email/Password (Standard)
1.  Client POSTs to `/api/v1/auth/login`.
2.  Backend authenticates credentials.
3.  On success, Backend returns a **JWT (Access Token)** validity: 24h.
4.  Frontend stores this token (Secure Storage/Memory).
5.  Frontend attaches `Authorization: Bearer <token>` to all subsequent requests.

### 2. Google OAuth (Social)
1.  Frontend uses `react-oauth/google` to get an `authorization_code`.
2.  Frontend sends this code to Backend: `/api/v1/auth/google/callback`.
3.  Backend exchanges code for a Google Access Token via `googleapis.com`.
4.  Backend fetches user profile from Google.
5.  Backend creates/updates user in local DB.
6.  Backend issues a valid **App JWT** to the Frontend.

---

## 🧩 Core Features Implementation

### 1. URL Shortening Algorithm
-   **Strategy:** Random String Gen with Collision Check.
-   **Logic:**
    1.  Generate a 6-character random alphanumeric string (Base62).
    2.  Check MongoDB: `existsByShortCode(code)`.
    3.  If exists -> User recursion/loop to generate again.
    4.  If unique -> Save to DB.
-   **Why:** Simple, stateless, and efficient for medium-scale.

### 2. Analytics Engine
-   **Data Model:** We utilize MongoDB's document model to store analytics *inside* the URL document.
-   **Fields:**
    -   `clicksByCountry`: `Map<String, Integer>` (e.g., `{"US": 50, "IN": 120}`)
    -   `clicksByDevice`: `Map<String, Integer>`
    -   `clicksByReferrer`: `Map<String, Integer>`
-   **Benefit:** Reading a single URL document gives all its analytics instantly. No expensive JOINs or aggregations needed for basic views.

---

## � Admin System

The Admin Dashboard provides superuser control over the platform.

### Capabilities
-   **User Oversight:** View all registered users, their plan status, and total URLs.
-   **Content Moderation:** ability to delete or ban URLs that violate policies (Phishing/Spam).
-   **Global Analytics:** View platform-wide growth metrics.

### Promoting a User to Admin
Currently done via Database Access:
```javascript
db.users.updateOne(
  { email: "your.email@example.com" },
  { $addToSet: { roles: "ROLE_ADMIN" } }
)
```

---

## 🚀 Local Development Setup

### 1. Database Setup (MongoDB)
1.  Install **MongoDB Community Server**.
2.  Start the service.
3.  Open MongoDB Compass (GUI) and create a connection: `mongodb://localhost:27017`.
4.  Create a database named: `tinyslash_dev`.

### 2. Backend Setup
1.  Navigate to: `cd tinyslash-backend/url-service`
2.  Create configuration: `src/main/resources/application-dev.yml`
    ```yaml
    spring:
      data:
        mongodb:
          uri: mongodb://localhost:27017/tinyslash_dev
    google:
      client:
        id: <YOUR_GOOGLE_CLIENT_ID> 
        secret: <YOUR_GOOGLE_CLIENT_SECRET>
    app:
        jwtSecret: <GENERATE_A_LONG_RANDOM_STRING>
        jwtExpirationMs: 86400000
    ```
3.  Run the server:
    ```bash
    mvn spring-boot:run
    ```
    *Server will start on `http://localhost:8080`*

### 3. Frontend Setup
1.  Navigate to: `cd tinyslash-frontend`
2.  Create `.env` file:
    ```env
    REACT_APP_API_URL=http://localhost:8080/api/v1
    REACT_APP_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
    ```
3.  Install & Start:
    ```bash
    npm install
    npm start
    ```
    *App will open on `http://localhost:3000`*

---

## 🤝 Contribution Guide for Interns

We follow a strict **Git Flow** process. Please adhere to these rules to maintain code quality.

### 1. Branching Strategy
-   **`main`**: 🛑 PROTECTED. Production code. Do not touch.
-   **`develop`**: 🟡 STAGING. This is your base branch.
-   **`feat/feature-name`**: 🟢 YOUR WORKSPACE. Create this from `develop`.
-   **`fix/bug-name`**: 🔴 BUG FIX. Create this from `develop`.

### 2. Contribution Workflow
1.  **Sync Upgrade:** Always pull the latest `develop` before starting.
    ```bash
    git checkout develop
    git pull origin develop
    ```
2.  **Branch Out:**
    ```bash
    git checkout -b feat/add-dark-mode
    ```
3.  **Commit Often:** Use Conventional Commits.
    -   `feat: add dark mode toggle`
    -   `fix: resolve login spinner issue`
    -   `style: update header padding`
    -   `docs: update readme`
4.  **Push & PR:**
    ```bash
    git push origin feat/add-dark-mode
    ```
    -   Go to GitHub, open a Pull Request (PR) against `develop`.
    -   Add a description and screenshots of your changes.
    -   Assign a senior developer for review.

---

## ❓ Troubleshooting

### Common Issues
1.  **"Connection Refused" (Backend)**
    -   **Cause:** MongoDB is not running.
    -   **Fix:** Check services (`brew services list` on Mac or Task Manager on Windows). Ensure connection URI is correct.

2.  **"CORS Error" (Frontend)**
    -   **Cause:** Frontend (`localhost:3000`) is trying to talk to Backend (`localhost:8080`) but Backend isn't allowing it.
    -   **Fix:** specific allowed origins are defined in `AuthController.java` or `SecurityConfig.java`. Ensure `@CrossOrigin(origins = "*")` is present for dev or `http://localhost:3000` is accepted.

3.  **"401 Unauthorized"**
    -   **Cause:** JWT Token expired or invalid.
    -   **Fix:** Logout and Login again. Check if `jwtSecret` in `application-dev.yml` matches what the server is using.

---

© 2025 Tinyslash Tech. Proprietary Software.
