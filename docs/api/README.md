# Tinyslash - API Documentation

## 🎯 Overview

The Tinyslash API provides programmatic access to all platform features including URL shortening, QR code generation, file sharing, analytics, and team collaboration.

## 🔗 Base URLs

| Environment | Base URL |
|-------------|----------|
| **Production** | `https://api.tinyslash.com/api/v1` |
| **Development** | `https://tinyslash-backend-dev.onrender.com/api/v1` |
| **Local** | `http://localhost:8080/api/v1` |

## 🔐 Authentication

All API requests (except public endpoints) require a Bearer Token in the Authorization header.

```http
Authorization: Bearer <your_jwt_token>
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user account |
| `POST` | `/auth/login` | Login and receive JWT token |
| `POST` | `/auth/google` | Authenticate with Google |
| `POST` | `/auth/validate` | Validate current session token |
| `POST` | `/auth/refresh` | Refresh an expired access token |
| `GET` | `/auth/profile/{email}` | Get user profile by email |
| `GET` | `/auth/heartbeat` | Check system and session health |

---

## 🔗 URL Management

Manage shortened URLs and redirects.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/urls` | Create a new short URL |
| `GET` | `/urls/info/{shortCode}` | Get details of a short URL |
| `PUT` | `/urls/{shortCode}` | Update a short URL (title, etc.) |
| `DELETE` | `/urls/{shortCode}` | Delete a short URL |
| `POST` | `/urls/bulk-delete` | Delete multiple URLs at once |
| `GET` | `/urls/user/{userId}` | List all URLs for a specific user |
| `POST` | `/urls/{shortCode}/click` | Record a click event (Internal/Public) |

**Create URL Payload:**
```json
{
  "originalUrl": "https://example.com/long-page",
  "userId": "user_id_here",
  "customAlias": "my-link", 
  "title": "My Link",
  "expirationDays": 30,
  "password": "optional-password"
}
```

---

## 📱 QR Codes

Generate and manage dynamic QR codes.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/qr` | Create a new QR code |
| `GET` | `/qr/{qrCodeId}` | Get QR code details |
| `PUT` | `/qr/{qrCodeId}` | Update QR code styling/content |
| `DELETE` | `/qr/{qrCodeId}` | Delete a QR code |
| `POST` | `/qr/bulk-delete` | Delete multiple QR codes |
| `GET` | `/qr/user/{userId}` | List all QR codes for a user |
| `POST` | `/qr/{qrCodeId}/scan` | Record a scan event |

---

## 📂 File Sharing

Upload and manage shared files.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/files/upload` | Upload a file (Multipart form-data) |
| `GET` | `/files/{fileCode}/info` | Get file metadata |
| `GET` | `/files/{fileCode}` | Download file content |
| `PUT` | `/files/{fileCode}` | Update file details |
| `DELETE` | `/files/{fileCode}` | Delete a file |
| `GET` | `/files/user/{userId}` | List user's files |

---

## 📊 Analytics

Retrieve detailed stats for links and users.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analytics/url/{shortCode}` | Get stats for a specific URL |
| `GET` | `/analytics/user/{userId}` | Get aggregate stats for a user |
| `GET` | `/analytics/realtime/{userId}` | Get real-time activity stream |
| `GET` | `/analytics/admin/summary` | Get system-wide stats (Admin only) |

---

## 👥 Teams

Collaboration features for enterprise users.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/teams` | Create a new team |
| `GET` | `/teams/my` | Get current user's teams |
| `GET` | `/teams/{teamId}` | Get team details |
| `PUT` | `/teams/{teamId}` | Update team info |
| `DELETE` | `/teams/{teamId}` | Delete a team |
| `POST` | `/teams/{teamId}/invite` | Invite a member to the team |
| `GET` | `/teams/{teamId}/members` | List team members |

---

## 🎫 Support

Ticketing system for user support.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/support/tickets` | Create a support ticket |
| `GET` | `/support/tickets/user/{userId}` | List user's tickets |
| `GET` | `/support/tickets/{ticketId}` | Get ticket details |
| `POST` | `/support/tickets/{ticketId}/responses` | Reply to a ticket |
| `GET` | `/support/metadata` | Get categories and priorities |

---

## ⚠️ Error Handling

The API uses standard HTTP status codes:

- `200 OK`: Success
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions (e.g. Premium feature)
- `404 Not Found`: Resource does not exist
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side issue

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description here"
}
```