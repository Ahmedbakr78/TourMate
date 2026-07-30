# TourMate — Smart Tourism Trip Planner

**TourMate** is a comprehensive smart tourism trip planning platform that connects tourists with local drivers, guides, and curated destinations. Built with the MEAN stack, it enables end-to-end trip management — from place discovery and itinerary building to real-time ride coordination and post-trip reviews.

## Features

| # | Module | Description |
|---|--------|-------------|
| 1 | **Authentication** | JWT-based signup/login, email verification, password reset, refresh tokens |
| 2 | **User Management** | Profile CRUD, avatar upload, account deletion |
| 3 | **Admin Dashboard** | System stats, user/role/status management, driver/guide verification, trip assignment |
| 4 | **Driver Management** | Driver registration, licensing, availability, verification workflow |
| 5 | **Guide Management** | Guide registration, certificate upload, language/experience, verification |
| 6 | **Vehicle Management** | Multi-vehicle per driver, image upload, capacity tracking |
| 7 | **Trip Planning** | Create, update, cancel trips; place selection; price calculation |
| 8 | **Trip Sharing** | Share trip links; other users can join shared trips |
| 9 | **Voting** | Like/dislike places within a trip itinerary |
| 10 | **Place Discovery** | Browse, search, filter; nearby places via geospatial queries (Overpass API) |
| 11 | **Reviews** | Rate and review trips, places, drivers, and guides |
| 12 | **Lost & Found** | Report and track lost items per trip with status workflow |
| 13 | **Notifications** | In-app real-time notifications via Socket.IO |
| 14 | **Location Services** | Map integration (Leaflet), route calculation (OSRM), geocoding |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Database** | MongoDB with Mongoose ODM, geospatial indexes, pagination |
| **Backend** | Node.js (ES2022), Express 5, TypeScript |
| **Frontend** | Angular 16, Angular Material, Leaflet |
| **Real-time** | Socket.IO (both server and client) |
| **Auth** | JWT (access + refresh), bcrypt, encryption utilities |
| **File Upload** | Cloudinary (images for profiles, vehicles, lost items, guide certificates) |
| **External APIs** | Overpass API (OpenStreetMap places), OSRM (route optimization) |
| **Security** | Helmet, CORS, compression, rate limiting (implicit via Express), token blacklisting |

## Architecture Overview

```
┌───────────────────────┐     ┌──────────────────────┐
│   Angular 16 SPA      │────▶│   Express 5 Server    │
│   (Lazy Modules)      │◀────│   (REST + Socket.IO)  │
└───────┬───────────────┘     └──────────┬───────────┘
        │                                │
        │  Leaflet Maps                  │  Mongoose ODM
        │  Socket.IO Client              │
        │                                ▼
        │                       ┌──────────────────┐
        │                       │     MongoDB       │
        └──────────────────────▶│   (11 Collections)│
                                └──────────────────┘

External Integrations:
  ◈ Cloudinary  ── image/file upload & CDN
  ◈ Overpass API ── OpenStreetMap place search
  ◈ OSRM        ── route/path optimization
```

## Prerequisites

- **Node.js** 18+ (developed with 22+)
- **MongoDB** (local `mongod` or remote Atlas URI)
- **Angular CLI** 16 (`npm install -g @angular/cli@^16`)
- **Cloudflare Tunnel** (optional, for public sharing via `--tunnel`)

## Quick Start

```bash
# Clone and enter the project
cd TourMate

# Full startup (installs deps, builds frontend, starts server)
bash start.sh

# With database seeding (populates sample places from Overpass)
bash start.sh --seed

# With Cloudflare tunnel (exposes localhost publicly)
bash start.sh --tunnel

# With both
bash start.sh --seed --tunnel
```

The script:
1. Verifies Node.js and MongoDB
2. Installs npm dependencies for both backend and frontend
3. Builds the Angular app into `dist/`
4. Starts the Express server on **port 3000**
5. Runs health-check tests against key endpoints

### Manual Start

```bash
# Backend
cd TourMate-backend_node.js\ \(2\)/TourMate-backend_node.js
npm install
npm run dev        # tsx watch — live reload

# Frontend (separate terminal)
cd tourmate_frontend/tourmate-frontend
npm install
ng serve           # http://localhost:4200
```

## Project Structure

```
TourMate/
├── start.sh                                          # One-click launcher
│
├── TourMate-backend_node.js (2)/TourMate-backend_node.js/
│   ├── src/
│   │   ├── index.ts                                  # Express app entry
│   │   ├── db/
│   │   │   ├── db.connection.ts                      # MongoDB connection
│   │   │   ├── models/                               # 11 Mongoose models
│   │   │   └── repo/                                 # Repository layer (CRUD)
│   │   ├── modules/
│   │   │   ├── auth/                                 # Auth controller + service
│   │   │   ├── admin/                                # Admin controller + service
│   │   │   ├── user/                                 # User controller + service
│   │   │   ├── driver/                               # Driver controller + service
│   │   │   ├── guide/                                # Guide controller + service
│   │   │   ├── vehicle/                              # Vehicle controller + service
│   │   │   ├── trip/                                 # Trip controller + service
│   │   │   ├── vote/                                 # Vote controller + service
│   │   │   ├── place/                                # Place controller + service
│   │   │   ├── review/                               # Review controller + service
│   │   │   ├── lost_item/                            # Lost item controller + service
│   │   │   ├── notifications/                        # Notification controller + service
│   │   │   └── controller.index.ts                   # Router aggregator
│   │   ├── middlewares/
│   │   │   ├── authentication.middleware.ts          # JWT verification
│   │   │   ├── authorization.middleware.ts           # Role-based access
│   │   │   ├── upload.middlewares.ts                 # Multer + Cloudinary
│   │   │   └── validation.middleware.ts              # Zod schemas
│   │   ├── socket/
│   │   │   ├── socket.ts                             # Socket.IO init + auth
│   │   │   ├── sendNotification.ts                   # Notification emitter
│   │   │   └── index.ts
│   │   ├── common/                                   # Enums, interfaces, constants
│   │   └── utils/                                    # Encryption, pagination, errors
│   └── package.json
│
└── tourmate_frontend/tourmate-frontend/
    └── src/app/
        ├── app-routing.module.ts                     # Lazy-loaded routes
        ├── core/
        │   ├── guards/                               # Auth + role guards
        │   ├── interceptors/                         # HTTP interceptor (JWT attach)
        │   ├── models/                               # TypeScript interfaces
        │   └── services/                             # API + Socket services
        ├── features/
        │   ├── auth/                                 # Login, signup, confirm email
        │   ├── admin/                                # Dashboard, users, verifications
        │   ├── trips/                                # Trip builder, detail, my trips
        │   ├── places/                               # Place list, detail, map
        │   ├── driver/                               # Driver onboarding + list
        │   ├── guide/                                # Guide onboarding + list
        │   ├── vehicle/                              # Vehicle form + list
        │   ├── review/                               # Reviews (part of trips/places)
        │   ├── lost-item/                            # Lost item list + detail
        │   ├── notifications/                        # Notification list
        │   ├── profile/                              # User profile
        │   └── home/                                 # Landing page
        └── shared/
            ├── components/                           # Navbar, map, loading, dialog
            └── shared.module.ts
```

## Team Members

| Name | Role | Module |
|------|------|--------|
| **Ahmed Abo Bakr** | Backend & Frontend Developer | Guide, Driver, Vehicle modules |
| **Jamal Hassan** | Backend & Frontend Developer | Auth, User, Admin modules |
| **Bavly** | Backend & Frontend Developer | Trip, Vote modules |
| **Mai** | Backend & Frontend Developer | Notification, Lost Item modules |
| **Ramadan** | Backend & Frontend Developer | Place, Review modules |

## API Documentation

Full API reference is available at:
[`docs/API.md`](TourMate-backend_node.js%20(2)/TourMate-backend_node.js/docs/API.md)

## License

ISC
