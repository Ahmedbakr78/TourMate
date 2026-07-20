# Chapter 4 — Backend Implementation

## 4.1 Server Bootstrap

The entry point `server/src/index.js` constructs an Express application and applies global middleware: `helmet()` for security headers, `cors({ origin: env.corsOrigin })`, `morgan` HTTP logging, JSON and URL-encoded body parsing, and a static `/uploads` directory. Health endpoints (`/`, `/health`) support orchestration liveness checks, and Swagger UI is mounted at `/api-docs`. Module routers are registered under their respective `/api/*` prefixes, followed by `notFound` and `errorHandler` terminal middleware. When not running on Vercel, the server connects to MongoDB and listens on `env.port`.

## 4.2 Module Structure

Each feature area is a folder under `server/src/modules/` containing a `*.routes.js` and `*.controller.js`, and sometimes a `service/` subdirectory. Controllers use `asyncHandler` wrapping and a consistent `{ status, data }` response envelope. The routes below were read directly from source and reflect the live API surface.

### 4.2.1 Auth (`/api/auth`)
`POST /register`, `/login`, `/logout`, `/refresh-token`, `GET /profile`, `PATCH /profile`, `PATCH /change-password`, `/forgot-password`, `/verify-reset-code`, `/reset-password`, `/verify-email`, `/resend-verification`. Passwords are hashed; JWT access and refresh tokens are issued on login. The `authenticate` middleware protects profile routes.

### 4.2.2 User (`/api/users`)
`GET /me`, `PATCH /me`, `GET /:id`, `POST /profile-image` (multipart upload), `DELETE /profile-image`, `DELETE /account`. Uploads use `upload.middleware.js` (multer).

### 4.2.3 Trip (`/api/trips`)
`GET /my`, `/shared`, `POST /calculate-price`, `GET /`, `POST /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`, and lifecycle/assignment patches: `assign-guide`, `assign-driver`, `assign-vehicle`, `start`, `complete`, `cancel`, `share`, `duplicate`, plus `GET /:id/route`. Creation and mutation are restricted to `tourist`/`admin`; `start`/`complete` allow `driver` and `guide` as well; `share` toggles `isShared`.

### 4.2.4 Tracking (`/api/tracking`)
`POST /driver/:driverId/location` (driver-only push), `GET /driver/:driverId` (poll), `GET /all`, `GET /active-trips` (admin/tourist), `DELETE /driver/:driverId`. This is the polling-based real-time subsystem described in Chapter 2.

### 4.2.5 External (`/api/external`)
`GET /pois` (Overpass), `GET /route` (OSRM/ORS), `GET /cache` (cache stats). These proxy and normalise third-party geographic data with caching and mock fallback.

### 4.2.6 Vote (`/api/votes`)
`GET /user`, `/place/:placeId`, `POST /`, `PATCH /:id`, `DELETE /:id` — all authenticated; enforces the unique one-vote-per-user-per-place-per-trip constraint.

### 4.2.7 Place (`/api/places`)
Public reads: `GET /search`, `/filter`, `/nearby`, `/popular`, `/`, `/:id`; admin writes: `POST /`, `POST /save`, `PATCH /:id`, `DELETE /:id`.

### 4.2.8 Review, Lost-Item, Notification
Review: trip/guide/driver/place/my listings plus CRUD. Lost-item: `GET /my`, `/trip/:tripId`, `/`, `POST /`, `GET /:id`, `PATCH /:id`, `PATCH /:id/status`, `/report-found`, `/close`, `/reopen`, `DELETE /:id`. Notification: create, list, unread-count, mark-read, mark-all-read, delete.

### 4.2.9 Admin (`/api/admin`)
Protected wholesale by `authenticate` + `rbac('admin')`. Endpoints manage pending guides/drivers, users (block/unblock/delete), trips, approval/rejection of guides and drivers, platform `stats`, and `reports`.

### 4.2.10 Resource Modules (Guide/Driver/Vehicle)
Standard CRUD plus availability toggles and certificate/image uploads, with role-appropriate RBAC (admin creates; owner updates; drivers manage their vehicles).

## 4.3 Cross-Cutting Concerns

- **Error handling** — `apiError.js` provides `ApiError` and `httpStatus`; `error.middleware.js` centralises `notFound` and `errorHandler`.
- **Uploads** — `upload.middleware.js` (multer) handles single-file image uploads for profiles, certificates, and vehicle images.
- **Configuration** — `config/env.js` and `config/db.js` externalise secrets and the MongoDB connection.

## 4.4 External Service Adapters

`external/service/overpass.service.js` builds an Overpass QL bounding-box query from latitude/longitude/radius, caches results by a key derived from coordinates, and returns mock POIs on failure. `osrm.service.js` requests a route from OSRM (or OpenRouteService when an API key is configured) and returns `{ distanceMeters, durationSeconds, geometry, provider }`, falling back to a haversine mock. This resilience ensures the API remains functional offline or during upstream outages.

## 4.5 Implementation Observations

The backend demonstrates a disciplined, modular REST contract. Routes declare their authentication and RBAC requirements explicitly at mount time, controllers remain thin orchestrators over models and services, and the data envelope is uniform. The deliberate separation between canonical schema fields and extension fields (geo-routing, polling tracking) keeps the code readable and upgrade-safe.
