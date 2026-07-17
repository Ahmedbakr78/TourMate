<!-- TourMate — professional README -->

<p align="center">
  <img src="https://via.placeholder.com/1200x300.png?text=TourMate+%7C+Smart+Tourism+Platform" alt="TourMate Banner" />
</p>

<p align="center">
  <a href="https://github.com/Ahmedbakr78/TourMate/actions"><img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/stack-MEAN-green" alt="MEAN Stack" /></a>
  <a href="https://angular.io/"><img src="https://img.shields.io/badge/angular-17%2B-red" alt="Angular 17+" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D18-339933" alt="Node 18+" /></a>
</p>

# TourMate

> A smart, multi-role tourism platform connecting **Tourists**, **Drivers**, **Guides**, and
> **Administrators** through a unified MEAN-stack ecosystem with real-time location tracking,
> POI discovery, and route intelligence.

TourMate helps travellers discover points of interest, book trusted transport and guided
experiences, and track ongoing trips for safety and coordination — while giving operators a
consolidated dashboard to supervise users and live activity.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Team Roles](#team-roles)
- [Feature Modules](#feature-modules)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [API Reference](#api-reference)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Continuous Integration](#continuous-integration)
- [License](#license)

---

## Project Overview

TourMate is organized around four client applications sharing a single stateless REST API:

| App | Audience | Primary Goal |
|-----|----------|--------------|
| Tourist | End travellers | Discover POIs, book trips, track drivers, review |
| Driver | Transport providers | Manage vehicles, share live location, accept trips |
| Guide | Local experts | Publish profile/certificates, manage availability |
| Admin | Platform operators | User governance, statistics, live trip monitoring |

The backend is built with **Node.js + Express + MongoDB** and follows a clean layered
architecture (middleware → services → controllers → routes). The frontend is an **Angular 17+**
standalone-component SPA. External intelligence (POIs, routing) is proxied server-side with
caching. Live tracking uses **polling** (no WebSockets) for simplicity and firewall resilience.

---

## Team Roles

| Member | Role | Responsibility |
|--------|------|----------------|
| Ahmed Abo Bakr | Team Manager / Lead Fullstack / Architecture & UML | MEAN architecture, Guide/Driver/Vehicle/Admin APIs, auth architecture, Overpass/OSRM integration, polling tracking, frontend shell + auth UI + admin dashboard, all UML & docs |
| Jamal | Backend — Auth endpoints | Login / register / forgot-password controllers |
| Bavly | Frontend — Tourist app | Tourist flows & booking UI |
| Mai | Backend — Notifications | Notification module & delivery |
| Ramadan | Frontend — Driver/Guide apps | Driver & Guide client apps |

> This branch (`Ahmed`) contains only Ahmed's scoped work. Files owned by teammates live on
> their respective branches and are never overwritten here.

---

## Feature Modules

TourMate is composed of 14 logical modules. Those delivered in this branch are marked
**(Ahmed)**; others are owned by teammates and integrated via their branches.

1. **Auth (Ahmed architecture)** — JWT issue/verify, bcrypt hashing, RBAC middleware. Endpoints owned by Jamal.
2. **User (Ahmed)** — profile model, admin user listing, block/unblock.
3. **Admin (Ahmed)** — statistics dashboard, user management, active trip monitoring.
4. **Guide (Ahmed)** — CRUD, geo + text search, availability, certificate upload/delete.
5. **Driver (Ahmed)** — CRUD, search, availability.
6. **Vehicle (Ahmed)** — CRUD, per-driver vehicle listing, image upload/delete.
7. **Trip** — lifecycle (Draft → Pending → Confirmed → Ongoing → Completed). Booking flow coordinated with Driver/Guide.
8. **Vote (Ahmed schema)** — up/down votes on trips.
9. **Place (Ahmed schema)** — POI storage sourced from Overpass.
10. **Review (Ahmed schema)** — ratings for drivers, guides, places, trips.
11. **Notification (Ahmed schema; delivery by Mai)** — notification documents & models.
12. **Lost Item (Ahmed schema)** — report / mark-found.
13. **Location Tracking (Ahmed)** — polling-based driver position store & poll endpoints (no WebSockets).
14. **External Integrations (Ahmed)** — Overpass POI proxy with TTL cache, OSRM/OpenRouteService routing.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Database | MongoDB + Mongoose | Document persistence (10 schemas) |
| API | Node.js + Express | Routing, middleware, business logic |
| Auth | JSON Web Token + bcryptjs | Stateless authN, password hashing |
| Geo Data | Overpass API | POI discovery (OpenStreetMap) |
| Routing | OSRM / OpenRouteService | Route geometry & ETA |
| Client | Angular 17+ (standalone) | SPA, route guards, HTTP client |
| Realtime | Polling (HTTP) | Driver location without WebSockets |
| Infra | GitHub Actions | CI build/lint for server + client |

---

## System Architecture

```mermaid
graph TD
  A[Angular 17+ SPA] -->|HTTPS + JWT| B[Express API]
  B -->|Mongoose| C[(MongoDB)]
  B --> D[Overpass Proxy + TTL Cache]
  B --> E[OSRM / ORS Router]
  B --> F[In-memory Tracking Store]
  D --> G[(Overpass API)]
  E --> H[(OSRM / ORS)]
```

### Auth flow
Clients authenticate via Jamal's auth endpoints; the issued JWT is attached by the Angular
`authInterceptor` and validated by `authenticate` middleware. `authorize(role)` enforces RBAC.

### Polling-based tracking (no WebSockets)
Drivers `POST /api/tracking/driver/:id/location`; clients `GET /api/tracking/active-trips`
on a fixed interval and re-render map markers. This removes socket infrastructure while meeting
latency needs.

See [`docs/architecture.md`](docs/architecture.md) and [`docs/uml/`](docs/uml) for the full set
of UML diagrams (Use Case, Sequence ×4, Class, Activity, ERD).

---

## API Reference

Base URL: `http://localhost:4000/api`

### Guides
```
GET    /api/guides
POST   /api/guides                 # admin
GET    /api/guides/search?lat=&lng=&radius=
PATCH  /api/guides/:id/availability # guide
POST   /api/guides/:id/certificate  # guide (multipart)
```

### Drivers
```
GET    /api/drivers
POST   /api/drivers                # admin
PATCH  /api/drivers/:id/availability # driver
```

### Vehicles
```
GET    /api/vehicles
POST   /api/vehicles               # admin, driver
GET    /api/vehicles/driver/:driverId
POST   /api/vehicles/:id/image      # multipart
```

### External / Geo
```
GET    /api/external/pois?lat=&lng=&radius=&categories=
GET    /api/external/route?startLng=&startLat=&endLng=&endLat=
```

### Tracking (polling)
```
POST   /api/tracking/driver/:id/location   # driver
GET    /api/tracking/active-trips          # admin, tourist
GET    /api/tracking/driver/:id
```

### Admin
```
GET    /api/admin/users
PATCH  /api/admin/users/:id/block
PATCH  /api/admin/users/:id/unblock
GET    /api/admin/stats
```

---

## Environment Configuration

Copy `server/.env.example` to `server/.env` and adjust:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Access token signing |
| `JWT_REFRESH_SECRET` | Refresh token signing |
| `OVERPASS_URL` / `OVERPASS_TIMEOUT_MS` | POI upstream + 2s cap |
| `OVERPASS_CACHE_TTL_MS` | POI cache lifetime |
| `OSRM_BASE_URL` / `ORS_API_KEY` | Routing provider |
| `UPLOAD_DIR` / `MAX_FILE_SIZE_MB` | File storage |

---

## Local Development

### Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev          # http://localhost:4000  (health: /health)
```

### Frontend
```bash
cd client
npm install
ng serve             # http://localhost:4200
```

The client points at `http://localhost:4000/api` (edit
`client/src/environments/environment.ts`).

---

## Continuous Integration

A GitHub Actions workflow installs, lints, and builds both `server` and `client` on every push
and pull request. See the pipeline summary in [`README`](#continuous-integration) and the
workflow referenced from `.github/workflows/ci.yml`.

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE).
