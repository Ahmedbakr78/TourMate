# Chapter 2 — System Architecture

## 2.1 Architectural Overview

TourMate is engineered as a classic **MEAN-stack** application: **M**ongoDB (data), **E**xpress.js (HTTP server/API), **A**ngular (client SPA), and **N**ode.js (runtime). The architecture follows a strict separation between a stateless REST API and a client-side rendered single-page application. The server exposes a versioned `/api` surface, while the Angular application consumes it through an `ApiService` wrapper and an `authInterceptor` that attaches bearer tokens.

The high-level layering is:

- **Client layer** — Angular standalone components, Signals-based store (`AppStore`), role guards, and service classes per domain.
- **API gateway layer** — Express router mounts per-module; global middleware applies `helmet`, `cors`, `morgan`, JSON body parsing, and static uploads.
- **Business logic layer** — controllers per module, calling Mongoose models and external service adapters.
- **Data & integration layer** — MongoDB via Mongoose, plus outbound integration with Overpass and OSRM/OpenRouteService.

## 2.2 Technology and Runtime

The Node.js server (see `server/src/index.js`) bootstraps Express, connects to MongoDB through `connectDB()`, and mounts routers under paths such as `/api/trips`, `/api/tracking`, `/api/auth`, and `/api/external`. Swagger documentation is served at `/api-docs`. The Angular client (`client/src`) is configured in `app.config.ts` with `provideRouter`, `provideHttpClient(withInterceptors([authInterceptor]))`, animations, and an `APP_INITIALIZER` that pre-loads the translation service for bilingual (English/Arabic) support.

## 2.3 Authentication and Authorization

Security is realised through **JWT (JSON Web Token) bearer authentication** combined with **role-based access control (RBAC)**. The `authenticate` middleware (`server/src/middlewares/auth.middleware.js`) validates the `Authorization: Bearer <token>` header, verifies the signature with `env.jwt.secret`, and attaches `req.user`. The `rbac(...roles)` middleware (`server/src/middlewares/rbac.middleware.js`) then compares `req.user.role` against an allowed set, returning `403 FORBIDDEN` when mismatched.

Four roles are defined on the `User` model: `ADMIN`, `TOURIST`, `DRIVER`, `GUIDE`. Refresh tokens are supported (`signRefreshToken`, `/api/auth/refresh-token`). On the client, `roleGuard(allowedRoles)` (`client/src/app/core/guards/role.guard.ts`) protects routes by checking `AuthService.isAuthenticated()` and `hasRole(...)`.

## 2.4 Real-Time Location Through Polling (No WebSockets)

A defining architectural decision is the **absence of WebSockets**. Real-time driver tracking is achieved with an HTTP **polling** model implemented in the `tracking` module:

- The driver client periodically calls `POST /api/tracking/driver/:driverId/location`, pushing its current coordinates, heading, speed, and active `tripId` (`tracking.controller.pushLocation`).
- Tourist/Admin clients periodically call `GET /api/tracking/driver/:driverId` or `GET /api/tracking/active-trips` to retrieve the latest known positions (`TrackingService.pollDriver`, `pollActiveTrips`).

This design favours deployment simplicity, firewall friendliness, and effortless scaling behind ordinary HTTP load balancers, at the acceptable cost of slightly higher latency and request volume. The client service explicitly documents this with the comment *"Driver pushes location (polling source — NO WebSockets)"*.

## 2.5 External Geographic Integration

The `external` module mediates two third-party services:

- **Overpass API** (`overpass.service.js`) — queries OpenStreetMap POIs within a bounding box; results are cached (`cache.service.js`) and gracefully fall back to mock data on timeout/failure.
- **OSRM / OpenRouteService** (`osrm.service.js`) — computes route distance, duration, and GeoJSON geometry between two coordinates; falls back to a haversine-based mock route when the upstream is unavailable.

These integrations are consumed by trip price calculation and route preview endpoints.

## 2.6 Module Topology

The API is organised into the following mounted modules: `auth`, `user`, `trip`, `tracking`, `external`, `vote`, `place`, `review`, `lost_item`, `notifications`, `admin`, `guide`, `driver`, `vehicle`. Each module owns its routes, controller, and (where relevant) service files, promoting cohesion and independent testability.

## 2.7 Deployment Topology

The repository includes a `docker-compose.yml` and a `run.sh` bootstrap script, indicating a container-friendly deployment where the Node API, the MongoDB instance, and the static Angular build may be orchestrated together. CI workflows under `.github/` automate build and test steps.

## 2.8 Design Rationale Summary

The architecture privileges clarity, modularity, and operational simplicity. By choosing polling over sockets, JWT+RBAC over session cookies, and standalone Angular components over `NgModule`-based bootstrapping, the system remains approachable for academic review while demonstrating industry-relevant patterns.
