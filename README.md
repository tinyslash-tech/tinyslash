# 🔗 Tinyslash - Enterprise Link Management Platform

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

> **Tinyslash** is an industry-grade, SaaS-ready URL shortening and link management platform. Built for scale with a microservices-ready architecture, it features advanced analytics, custom domains, QR code generation, and team collaboration tools.

**Live Production:** [https://tinyslash.com](https://tinyslash.com)  
**Live Development:** [https://dev.tinyslash.com](https://dev.tinyslash.com)  

---

## 🎯 Platform Overview

Tinyslash allows businesses and individuals to brand, track, and share their links. It is architected to support high-volume traffic with a clear separation between development and production environments, ensuring stability and reliability.

---

## 🧾 Pricing Plans

Tinyslash offers a transparent, scalable pricing model designed for everyone from individuals to enterprises.

| Feature | **Free** | **Starter** (₹99/mo) | **Pro** (₹299/mo) | **Business** (₹999/mo) |
| :--- | :---: | :---: | :---: | :---: |
| **Short Links** | 50 | 1,000 | **Unlimited** | **Unlimited** |
| **QR Codes** | 50 | **Unlimited** | **Unlimited** | **Unlimited** |
| **File Sharing** | 5 | 100 | **Unlimited** | **Unlimited** |
| **Custom Domains** | ❌ | 1 | 5 | **Unlimited** |
| **Team Members** | ❌ | ❌ | 5 | **Unlimited** |
| **Password Protection** | ❌ | ✅ | ✅ | ✅ |
| **Analytics History** | 7 Days | 30 Days | **Unlimited** | **Unlimited** |
| **API Access** | ❌ | ❌ | ✅ | ✅ |

> **Note:** Yearly plans offer a **20% discount**.

---

### 🌟 Key Capabilities
- **🚀 Scalable Architecture** - Split frontline (React) and backend (Spring Boot) services.
- **🔐 Dual-Environment Workflow** - Strictly isolated `Dev` and `Prod` environments to prevent data leakage.
- **🌍 Custom Domains** - Automated SSL provisioning for user custom domains via Cloudflare.
- **📊 Deep Analytics** - Geo-location, device, browser, and OS tracking with interactive charts.
- **💼 Team Workspaces** - Invite members, assign roles (Admin, Editor, Viewer), and collaborate.
- **📱 Smart QR Codes** - Fully customizable QR codes with logo integration.
- **📁 File Hosting** - Secure file uploads with expiration and password protection.

---

## 🏗️ Architecture & Technology Stack

### Frontend (`tinyslash-frontend`)
- **Core:** React 18, TypeScript, Vite/CRA
- **Styling:** TailwindCSS, Framer Motion
- **State:** Context API + React Query
- **Charts:** Chart.js / Recharts
- **Hosting:** Vercel (Edge Network)

### Backend (`tinyslash-backend`)
- **Core:** Java 17, Spring Boot 3.2
- **Security:** Spring Security, JWT, Google OAuth 2.0
- **Database:** MongoDB Atlas (Sharded Cluster)
- **Caching:** Redis (Session & Data Caching)
- **Hosting:** Render / Cloud Containers

### Infrastructure Services
- **Auth:** Google OAuth, Custom JWT
- **Email:** SendGrid
- **Payments:** Razorpay
- **Domains:** Cloudflare for SaaS (SSL/Termination)

---

## 🔄 Development Workflow (DevOps)

We follow a strict Git-flow inspired workflow to ensure code quality and stability.

### Branching Strategy
1.  **`develop` Branch**: The integration branch for ongoing work.
    -   Automatically deploys to **Dev Environment** (`dev.tinyslash.com`).
    -   Connects to **Dev Database** (`tinyslash_dev`).
2.  **`main` Branch**: The production-ready branch.
    -   Automatically deploys to **Production Environment** (`tinyslash.com`).
    -   Connects to **Production Database** (`pebly-database`).

### Environment Isolation & Dynamic Resolution
To prevent configuration errors, the application uses **Dynamic Environment Resolution**:

- **Frontend**: `api.ts` determines the API endpoint based on the hostname:
    -   Visiting `dev.tinyslash.com` -> Requests `tinyslash-backend-dev.onrender.com`.
    -   Visiting `tinyslash.com` -> Requests `tinyslash-backend-prod.onrender.com`.
- **Authentication**: `googleAuth.ts` dynamically sets the Redirect URI:
    -   Login on `dev` -> Redirects back to `dev` -> Writes to `dev` DB.
    -   Login on `prod` -> Redirects back to `prod` -> Writes to `prod` DB.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+
- Java JDK 17+
- MongoDB (Local or Atlas URI)
- Maven 3.8+

### 1. Clone the Repository
```bash
git clone https://github.com/tinyslash-tech/tinyslash.git
cd tinyslash
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd tinyslash-backend/url-service
```

Create `src/main/resources/application-dev.yml` (if not exists) with your credentials:
```yaml
spring:
  data:
    mongodb:
      uri: mongodb+srv://<user>:<pass>@cluster.mongodb.net/tinyslash_dev
google:
  client:
    id: <YOUR_GOOGLE_CLIENT_ID>
    secret: <YOUR_GOOGLE_CLIENT_SECRET>
```

Run the application:
```bash
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080`*

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../../tinyslash-frontend
```

Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
```

Install and start:
```bash
npm install
npm start
```
*Frontend runs on `http://localhost:3000`*

---

## 📦 Deployment Guide

### Deployment Checklist
Before merging `develop` to `main`, ensure:
1.  [ ] All tests pass locally.
2.  [ ] `application-prod.yml` in backend has correct production DB credentials.
3.  [ ] Google Cloud Console has `https://tinyslash.com/auth/callback` in Authorized Redirect URIs.

### Triggering a Deployment
1.  **Dev Deploy**: Push commit to `develop`.
    -   Vercel builds frontend to `dev.tinyslash.com`.
    -   Render builds backend to `tinyslash-backend-dev`.
2.  **Prod Deploy**: Merge `develop` into `main`.
    -   Vercel builds frontend to `tinyslash.com`.
    -   Render builds backend to `tinyslash-backend-prod`.

---

## 📂 Project Structure

```
tinyslash/
├── tinyslash-frontend/          # React Single Page Application
│   ├── src/
│   │   ├── components/         # Atomic UI components
│   │   ├── pages/              # Route views (Dashboard, Auth, etc.)
│   │   ├── services/           # API integration (api.ts, googleAuth.ts)
│   │   └── context/            # Global state (AuthContext.tsx)
│   ├── public/
│   └── package.json
│
├── tinyslash-backend/           # Spring Boot Microservice
│   └── url-service/
│       ├── src/main/java/com/urlshortener/
│       │   ├── controller/     # API Endpoints
│       │   ├── service/        # Business Logic
│       │   ├── model/          # MongoDB Documents
│       │   └── config/         # Security & App Config
│       └── pom.xml
│
└── README.md                   # Project Documentation
```

---

## 🔒 Security & Compliance

- **JWT Authentication**: Stateless, secure token-based auth with HTTP-only cookies (in progress).
- **CORS Policies**: Strict origin allow-lists for Dev vs Prod.
- **CSRF Protection**: Enabled for state-changing operations.
- **Data Privacy**: GDPR-compliant user data handling.

## 🤝 Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

© 2024 Tinyslash Tech. All rights reserved.
