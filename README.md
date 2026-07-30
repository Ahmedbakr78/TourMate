# TourMate - Smart Travel Companion

> All-in-One Tourism Management Platform  
> Built with MEAN Stack (MongoDB, Express, Angular, Node.js)

---

## Table of Contents

- [About](#about)
- [Website](#website)
- [Topics](#topics)
- [Provided](#provided)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Tunneling (Remote Access)](#tunneling-remote-access)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

---

## About

TourMate is a comprehensive tourism management platform that seamlessly connects Tourists, Tour Guides, and Drivers in a unified ecosystem. It solves the fragmentation of tourism services by bringing place discovery, guide booking, transportation management, trip planning, cost sharing, and logistics into a single platform with role-based access for each user type.

The platform includes a fully documented REST API with over 100 endpoints, a responsive Angular frontend with 12 feature modules, real-time notifications via Socket.IO, interactive maps via Leaflet.js and OpenStreetMap, image management through Cloudinary, and email integration for OTP verification and password reset.

### Key Highlights

- **Full MEAN Stack** - MongoDB, Express 5, Angular 17, Node.js
- **Role-Based Access** - Tourist, Guide, Driver, Admin with distinct dashboards and permissions
- **100+ REST Endpoints** - 11 modules with JWT auth, Zod validation, pagination
- **Real-Time Notifications** - Socket.IO WebSocket push for instant updates
- **Interactive Maps** - Leaflet.js with OpenStreetMap, Overpass POI discovery, OSRM routing
- **Live GPS Tracking** - Polling-based driver location monitoring during active trips
- **Cloudinary Integration** - Cloud-based image upload, storage, and CDN delivery
- **Multi-Language** - i18n with English, Arabic, and French translation files

---

## Website

- **GitHub Repository:** [https://github.com/Ahmedbakr78/TourMate](https://github.com/Ahmedbakr78/TourMate)
- **Main Branch:** `main` - Complete integrated project
- **Other Branches:** Individual team branches for parallel development

### Access

| Method | URL | Description |
|---|---|---|
| Local | `http://localhost:3000` | Development server (API + Angular SPA) |
| Cloudflare Tunnel | `https://*.trycloudflare.com` | Remote demo (auto-generated URL) |
| SSH Tunnel | `*.localhost.run` | Fallback remote access |

---

## Topics

`tourism` `travel` `trip-planner` `tour-guide` `driver` `mean-stack` `angular` `express` `mongodb` `nodejs` `mongoose` `socket-io` `jwt` `rest-api` `full-stack` `leaflet` `openstreetmap` `cloudinary` `typescript` `geolocation` `real-time-tracking` `i18n` `role-based-access-control` `review-system` `voting-system` `lost-and-found` `notification-system`

---

## Provided

### Platform Capabilities

#### For Tourists
- **Place Discovery** - Browse, search, filter by city/category, nearby POIs via OpenStreetMap
- **Trip Building** - Custom itineraries with multiple destinations, date ranges, cost estimation
- **Group Voting** - Like/dislike places during shared trip planning
- **Shared Trips** - Join shared trip invitations, view cost splits, check vehicle capacity
- **Live Driver Tracking** - Monitor driver GPS on Leaflet map (5-second polling)
- **Reviews & Ratings** - Rate guides, drivers, and places with star ratings and comments
- **Real-Time Notifications** - Socket.IO push for trip updates and bookings
- **Lost & Found** - Report and track lost items with photo uploads and status updates
- **Saved Places** - Bookmark favorite destinations

#### For Guides
- Profile management with biography, languages, experience
- Certificate upload for verification
- Availability toggle
- Trip schedule dashboard

#### For Drivers
- Vehicle management (multiple vehicles per driver with photos)
- GPS location sending during active trips
- Availability toggle
- Trip history

#### For Administrators
- System dashboard with statistics
- User management (view, search, promote, block, delete)
- Guide/driver verification (approve/reject certificates and applications)
- Trip oversight (assign resources, update status, confirm payments)
- Content moderation

### Technical Deliverables

| Deliverable | Description |
|---|---|
| REST API | 100+ endpoints across 11 modules, JWT auth, Zod validation, pagination |
| Angular SPA | 12 lazy-loaded modules, Angular Material, Leaflet maps, i18n |
| Express Backend | Layered architecture (routes -> controllers -> services -> repositories -> models) |
| Database | 11 Mongoose schemas with geospatial/text/compound/TTL indexes |
| Real-Time | Socket.IO server and client for notification push |
| Seed Script | 7 demo accounts (all roles), 24 sample places, reviews |
| Startup Script | `start.sh` with seed, build, start, tunnel, and test modes |
| Documentation | UML diagrams (use case, class, sequence, activity, ERD), full API reference |

---

## Features

- **Auth:** Signup, login, email OTP verification, password reset, JWT with refresh tokens, role-based access, logout with token blacklisting
- **Places:** Full CRUD, search, filter by city/category, geospatial nearby discovery, popular ranking, save/unsave favorites
- **Trips:** Complete lifecycle (draft -> pending -> confirmed -> ongoing -> completed), multi-destination itineraries, cost estimation, guide/driver/vehicle assignment, sharing, joining, duplicating, route visualization
- **Guides:** Profile CRUD, certificate upload/delete, availability toggle, search, public listing
- **Drivers:** Profile CRUD, availability toggle, search, public listing
- **Vehicles:** CRUD per driver, photo upload, search, filter by driver
- **Votes:** Like/dislike places in trip itineraries, change/remove votes, aggregated counts
- **Reviews:** Star ratings (1-5) with comments for guides, drivers, and places; update/delete own reviews
- **Notifications:** Socket.IO real-time push, mark read/unread, unread count badge, delete
- **Location Tracking:** Driver GPS updates (10s), tourist polling (5s), in-memory store
- **Lost & Found:** Report with photo, status tracking, found/close/reopen
- **Admin Dashboard:** Statistics, user management, guide/driver verification, trip oversight, reports

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Angular 17+ | SPA framework |
| Angular Material | UI components |
| Leaflet.js | OpenStreetMap maps |
| Socket.IO Client | Real-time notifications |
| RxJS | Reactive state management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 18+ | Runtime |
| Express 5 | HTTP server |
| Mongoose 8+ | MongoDB ODM |
| JWT + bcrypt | Authentication |
| Zod | Request validation |
| Multer | File uploads |
| Cloudinary SDK | Image cloud storage |
| Nodemailer | Email delivery |
| Socket.IO | WebSocket server |

### Database
- MongoDB 6+ with geospatial (2dsphere), text, compound, and TTL indexes
- 11 collections: users, guides, drivers, vehicles, places, trips, votes, reviews, notifications, lost_items, blacklisted_tokens

### External APIs
- Overpass API (OpenStreetMap POI discovery)
- OSRM (route calculation)
- Cloudinary (image CDN)
- trycloudflare + localhost.run (remote tunnels)

---

## System Architecture

```
Browser (Angular SPA)
       |
       | HTTP/HTTPS + WebSocket
       v
Express 5 Server (Port 3000)
  +-- Middleware: CORS -> Helmet -> Compression -> JSON -> Auth -> Validation -> Upload
  +-- 11 Module Routers -> Controllers -> Services -> Repositories
  +-- MongoDB (Mongoose) - 11 Collections
  +-- External: Overpass API, OSRM, Cloudinary, Nodemailer
  +-- In-Memory: Location Store, Socket.IO Connections
```

### Backend Layers
1. **Routes** - URL mappings with middleware attachment
2. **Controllers** - HTTP request/response handling
3. **Services** - Business logic and orchestration
4. **Repositories** - Database access abstraction (CRUD, queries)
5. **Models** - Mongoose schemas with validation, indexes, hooks

### Frontend Modules (12 lazy-loaded)
- `auth` - Login, signup, confirm email, password reset
- `home` - Landing page
- `places` - Discovery, detail, create/edit
- `trips` - Builder, my-trips, detail, shared, payment
- `guide` - Dashboard, list, onboarding
- `driver` - Dashboard, list, onboarding
- `vehicle` - List, form
- `reviews` - List, form
- `lost-item` - Reports listing
- `notifications` - Inbox
- `admin` - Dashboard, users, verifications, trip management
- `profile` - Settings, password, photo

---

## Getting Started

### Quick Start
```bash
git clone https://github.com/Ahmedbakr78/TourMate.git
cd TourMate
bash start.sh --seed --tunnel
```

### Manual Setup

**1. Backend**
```bash
cd "TourMate-backend_node.js (2)/TourMate-backend_node.js"
npm install
# Edit .env with MongoDB URI, JWT secrets, Cloudinary keys, email credentials
npx tsx src/index.ts
```

**2. Frontend**
```bash
cd tourmate_frontend/tourmate-frontend
npm install
npm run build -- --configuration production
```

**3. Seed Database**
```bash
cd /path/to/TourMate
npx tsx seed/seed.ts
```

### Demo Accounts
| Name | Email | Password | Role |
|---|---|---|---|
| Admin | admin@tourmate.com | 123456 | Admin |
| Ahmed Tour Guide | ahmed.guide@tourmate.com | 123456 | Guide |
| Sara Tour Guide | sara.guide@tourmate.com | 123456 | Guide |
| Mohamed Driver | mohamed.driver@tourmate.com | 123456 | Driver |
| Ali Driver | ali.driver@tourmate.com | 123456 | Driver |
| Test Tourist | tourist@tourmate.com | 123456 | Tourist |
| Laila Tourist | laila@tourmate.com | 123456 | Tourist |

---

## Project Structure

```
TourMate/
+-- start.sh                    Unified launcher
+-- start-cloudflare.sh         Cloudflare tunnel wrapper
+-- README.md
+-- .gitignore
+-- _redirects
+-- seed/seed.ts                Database seeder
+-- docs/uml/                   UML diagrams (PlantUML + Markdown)
+-- TourMate-backend_node.js (2)/TourMate-backend_node.js/
|   +-- src/
|   |   +-- index.ts            Server entry point
|   |   +-- db/                 Connection, 11 models, 12 repositories
|   |   +-- middlewares/        Auth, authorization, validation, upload
|   |   +-- modules/            Auth, admin, guide, driver, vehicle, place, trip, vote, review, notifications, lost_item, location, user
|   |   +-- socket/             Socket.IO initialization and handlers
|   |   +-- common/             Enums, interfaces, constants
|   |   +-- utils/              Encryption, errors, pagination, response helpers, external services
|   +-- .env
+-- tourmate_frontend/tourmate-frontend/
    +-- src/
        +-- app/
            +-- core/           Models, services, guards, interceptors
            +-- shared/         Navbar, map, loading spinner, confirm dialog, language selector
            +-- features/       12 lazy-loaded modules
        +-- environments/       API URL config
        +-- assets/i18n/        en.json, ar.json, fr.json
```

---

## API Endpoints

**Auth** (`/auth`): signup, signin, confirm_email, send_otp_again, forgot_password, verify_reset_code, reset_password, refresh_token, change_password, logout, me

**Places** (`/place`): create_place, get/:id, all, update/:id, places/:id, search, filter, nearby, popular, save/:id, save/:id (DELETE)

**Trips** (`/trip`): create_trip, get/:id, all, my_trips, :id/update, :id/cancel, :id/join, :id/share, :id/duplicate, :id/delete, :id/assign-guide, :id/assign-driver, :id/assign-vehicle, :id/start, :id/complete, calculate-price, :id/route, shared

**Guides** (`/guide`): create_guide, update/:id, delete/:id, get/:id, all, search, update-availability/:id, upload-certificate/:id, delete-certificate/:id

**Drivers** (`/driver`): create_driver, update/:id, delete/:id, get/:id, all, search, update-availability/:id

**Vehicles** (`/vehicle`): create_vehicle, update/:id, delete/:id, get/:id, all, search, driver/:driverId, upload-images/:id, delete-image/:id

**Reviews** (`/review`): create_review, all, get/:id, :id/update, :id/delete, :tripId/reviews, :placeId/place_reviews, guide/:guideId, driver/:driverId, my-reviews

**Votes** (`/vote`): create_vote, :id/update, :id/delete, :tripId/place/:placeId, user

**Notifications** (`/notifications`): notifications, get/:id, unread-count, create, :id/mark-as-read, mark-all-as-read, :id/delete, delete-all

**Lost Items** (`/lost_item`): create_lost_item, get/:id, :tripId/trip_lost_items, my_lost_items, :id/update, :id/status, :id/delete, :id/report-found, :id/close, :id/reopen

**Location** (`/location`): update, driver/:driverId, trip/:tripId

**Admin** (`/admin`): dashboard, system-statistics, users, pending-guides, pending-drivers, reports, :id/role, :id/status, :id/delete, trip/:id/delete, driver/:id/verification-status, guide/:id/verification-status, trip/:id/assign-resources, trip/:id/status, trip/:id/confirm-payment

**User** (`/user`): current_user_id, :id, update_user, profile_image, delete_image, delete_account

---

## Tunneling (Remote Access)

For remote demos without cloud deployment:

```bash
# Cloudflare (primary - zero config)
bash start.sh --tunnel

# SSH tunnel (auto-fallback if Cloudflare is unavailable)
```

- Cloudflare uses `cloudflared` to create `https://*.trycloudflare.com`
- Falls back to `localhost.run` SSH tunnel (`*.localhost.run`)
- No account or domain needed for either method

---

## Testing

```bash
bash start.sh --seed
```

The script runs 20+ automated tests covering:
- All Angular routes return 200
- Public endpoints (auth, place filter, popular places)
- Authenticated endpoints (places, trips, guides, drivers with JWT)
- Protected routes (401 without token)
- Admin endpoints (dashboard, users, verifications)

---

## Deployment

Currently runs locally (port 3000) with optional remote tunnels. Planned:
- Docker containerization
- CI/CD pipeline
- Cloud deployment (Render, Vercel, or AWS)

---

## License

All rights reserved (c) 2026 TourMate Team.

---

<p align="center">
  <strong>TourMate</strong> - Making Travel Smarter, Together
</p>
