# TourMate — System Architecture Document

## 1. Overview
TourMate is a tourism platform with four client applications (Tourist, Driver, Guide, Admin)
built on the **MEAN** stack:

- **MongoDB** — document store for all 10 schemas.
- **Express** — RESTful API layer (this repository's `server/`).
- **Angular 17+** — standalone-component SPA (this repository's `client/`).
- **Node.js** — runtime for the Express API.

## 2. High-Level Flow

```
┌────────────┐      HTTPS/JSON       ┌────────────────┐      Mongoose      ┌──────────┐
│ Angular 17 │  ───────────────────▶ │ Express API    │ ────────────────▶ │ MongoDB │
│ (4 apps)   │ ◀─────────────────── │ (Node.js)      │ ◀─────────────── │ Atlas   │
└────────────┘      JWT Bearer       └────────────────┘                   └──────────┘
                                   │        │         │
                          ┌────────┘        │         └────────┐
                          ▼                 ▼                  ▼
                   Overpass API      OSRM / ORS         In-memory Tracking
                   (POIs + cache)    (route/ETA)         Store (polling)
```

## 3. Backend Layering
- **Middleware** — `auth.middleware` (JWT verify), `rbac.middleware` (role gate),
  `upload.middleware` (multer image handling), `error.middleware` (central handler).
- **Services** — pure logic isolated from HTTP:
  - `cache.service` — generic TTL in-memory cache.
  - `overpass.service` — builds Overpass QL, enforces a 2s `AbortController` timeout,
    returns cached or mock (graceful offline) data.
  - `osrm.service` — computes routes/ETA via OSRM, falls back to OpenRouteService or a
    haversine mock when offline.
  - `tracking.service` — holds live driver locations in memory for polling.
- **Controllers / Routes** — HTTP binding per module (Guide, Driver, Vehicle,
  External, Tracking).

## 4. External API Integration
### 4.1 Overpass (POIs)
A backend **proxy + cache** prevents the Angular clients from calling Overpass directly
(CORS, rate limits, no API key management in the browser). The cache key is derived from
coordinates + radius + categories and lives for 1 hour. A hard 2-second timeout guarantees
responsiveness; on failure a deterministic mock is returned so the app stays usable offline.

### 4.2 OSRM / OpenRouteService (routing)
Routes are calculated server-side. If `ORS_API_KEY` is set, OpenRouteService is preferred;
otherwise OSRM public instance is used; otherwise a haversine-based mock.

## 5. Polling-Based Location Tracking (NO WebSockets)
- The **driver client** `POST /api/tracking/driver/:id/location` (authenticated, role=driver).
  The server persists `currentLocation` on the Driver doc and updates the in-memory
  `tracking.service` snapshot.
- **Client apps** poll:
  - `GET /api/tracking/driver/:id` — single driver,
  - `GET /api/tracking/active-trips` — all trips currently in progress (Admin/Tourist).
- The Angular `TripMonitoringComponent` runs a `setInterval(5000)` loop, refreshing markers.
  This achieves "near real-time" without socket infrastructure, simplifying scaling and
  firewall traversal.

## 6. Authentication & Authorization
- Passwords hashed with **bcrypt** on creation.
- **JWT** issued on login (`signToken`), sent as `Authorization: Bearer` by the Angular
  `authInterceptor`.
- `authenticate` middleware validates the token and populates `req.user`.
- `authorize('admin' | 'tourist' | 'driver' | 'guide')` enforces RBAC per route.

## 7. Non-Functional Notes
- Stateless API → horizontal scaling friendly.
- Central error handler standardizes `{ status, message }` responses.
- `.env` drives all configuration; no secrets committed.
- Frontend uses standalone components, `provideHttpClient`, and functional route guards.
