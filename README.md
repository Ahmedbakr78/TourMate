# 🌍 TourMate — Smart Travel Companion

> **All-in-One Tourism Management Platform**  
> Built with MEAN Stack (MongoDB, Express, Angular, Node.js)  
> Final Graduation Project — Faculty of Computer Science

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Team & Responsibilities](#-team--responsibilities)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [UML Diagrams](#-uml-diagrams)
- [Project Structure](#-project-structure)
- [Tunneling (Remote Access)](#-tunneling-remote-access)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

TourMate is a comprehensive tourism management platform designed to connect **tourists**, **tour guides**, and **drivers** in a seamless, all-in-one ecosystem. The platform enables users to discover places, build custom trips, assign guides and drivers, vote on destinations, share trip costs, track locations in real-time, report lost items, and manage everything through an intuitive web interface.

### Key Capabilities

| Capability | Description |
|---|---|
| 🗺️ **Trip Builder** | Drag-and-drop places, set dates, estimate costs |
| 👥 **Role System** | Tourist, Guide, Driver, Admin — each with distinct dashboards |
| 🗳️ **Group Voting** | Vote on places within a shared trip itinerary |
| 📍 **Live Tracking** | Polling-based driver location updates (no WebSockets) |
| 🔔 **Notifications** | Real-time Socket.IO notifications for bookings & updates |
| 🔗 **Trip Sharing** | Share trips, join shared trips, split costs |
| 🗣️ **Reviews** | Rate and review guides, drivers, and places |
| 🧳 **Lost & Found** | Report and track lost items during trips |

---

## ✨ Features

### For Tourists
- 🔍 **Discover Places** — Search, filter by city/category, view nearby POIs with OpenStreetMap integration
- 📅 **Build Trips** — Create custom itineraries with multiple destinations, date range, and cost estimation
- 🗳️ **Vote** — Like/dislike places during trip planning phase
- 👥 **Join Shared Trips** — Accept shared trip links, see cost splits, check vehicle capacity
- 📍 **Track Driver** — Poll driver GPS location every 5 seconds on an interactive map
- 📝 **Review** — Submit ratings and comments for guides, drivers, and places
- 🔔 **Notifications** — Receive real-time updates about trip status changes
- 🧳 **Lost Items** — Report lost belongings during trips, track recovery status
- ❤️ **Saved Places** — Bookmark favourite destinations for future trips

### For Guides
- ✅ **Profile Management** — Create and manage guide profile, languages, experience
- 📜 **Certificates** — Upload qualification certificates for admin verification
- 🔄 **Availability** — Toggle availability on/off
- 📊 **Trip Schedule** — View assigned upcoming, ongoing, and completed trips

### For Drivers
- 🚗 **Vehicle Management** — Register and manage multiple vehicles with images
- 📍 **Location Updates** — Send GPS coordinates every 10 seconds during active trips
- 🔄 **Availability** — Toggle availability for trip assignments
- 📊 **Trip History** — View assigned trip history and earnings

### For Administrators
- 📊 **Dashboard** — System-wide statistics and metrics
- 👥 **User Management** — View, block, promote/demote users
- ✅ **Verification** — Approve or reject guide and driver applications
- 📋 **Trip Oversight** — Assign resources, monitor active trips, confirm payments
- 🗑️ **Content Moderation** — Delete inappropriate reviews, trips, or users
- 📈 **Reports** — Generate system usage reports

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Angular 17+** | SPA framework with modular architecture |
| **Angular Material** | UI component library |
| **Leaflet.js** | OpenStreetMap interactive maps |
| **Socket.IO Client** | Real-time notifications |
| **RxJS** | Reactive state management |
| **NgRx (partial)** | State management for auth & trips |
| **i18n** | Multi-language support infrastructure |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express 5** | HTTP server & routing |
| **Mongoose** | MongoDB ODM with schemas & indexes |
| **JWT** | Access & refresh token authentication |
| **bcrypt** | Password hashing |
| **Zod** | Request validation |
| **Multer** | File upload handling |
| **Cloudinary** | Image & file cloud storage |
| **Nodemailer** | Email OTP delivery |
| **Socket.IO** | WebSocket real-time notifications |

### Database
| Component | Detail |
|---|---|
| **MongoDB** | NoSQL document database |
| **Indexes** | Geospatial (2dsphere), text, compound, TTL |
| **Collections** | 11 collections: users, guides, drivers, vehicles, places, trips, votes, reviews, notifications, lost_items, blacklisted_tokens |

### External APIs
| API | Purpose |
|---|---|
| **Overpass API** | OpenStreetMap POI search & retrieval |
| **OSRM** | Open Source Routing Machine for route calculation |
| **Cloudinary** | Image upload and CDN delivery |
| **trycloudflare** | Quick tunnel for remote demo access |
| **localhost.run** | SSH tunnel fallback |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────┐
│                     Browser                            │
│         (Angular SPA — 12 Feature Modules)             │
└────────────────────────┬─────────────────────────────┘
                         │ HTTP / WebSocket
                         ▼
┌──────────────────────────────────────────────────────┐
│              Express 5 Server (Port 3000)              │
│                                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │              Middleware Pipeline                   │ │
│  │  CORS → Helmet → Compression → JSON → Auth → ... │ │
│  └──────────────────────────────────────────────────┘ │
│                                                       │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │  Auth  │ │  Trip  │ │ Place  │ │ Guide  │  ...    │
│  │ Router │ │ Router │ │ Router │ │ Router │        │
│  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘        │
│      │          │          │          │               │
│  ┌───┴────┐ ┌───┴────┐ ┌───┴────┐ ┌───┴────┐        │
│  │Auth    │ │Trip    │ │Place   │ │Guide   │  ...    │
│  │Service │ │Service │ │Service │ │Service │        │
│  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘        │
│      │          │          │          │               │
│  ┌───┴──────────┴──────────┴──────────┴────┐         │
│  │           MongoDB (Mongoose)             │         │
│  └──────────────────────────────────────────┘         │
│                                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │         External Integrations                     │ │
│  │  Overpass API ← → OSRM ← → Cloudinary ← → ...   │ │
│  └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 👥 Team & Responsibilities

| Member | Role | Backend Modules | Frontend Features | Documentation |
|---|---|---|---|---|
| **Ahmed Abo Bakr** | Team Leader, Fullstack & Architecture | Guide, Driver, Vehicle, Location Tracking, Auth System, CI/CD | Layout, Navigation, Auth UI, Admin Dashboard, Route Guards | ALL UML Diagrams, README, System Architecture, Setup Guide |
| **Jamal** | Database Architect, Backend Core | Auth (signup/login/JWT), User CRUD, Admin (dashboard/users/reports/verification) | Booking Flow UI, Shared Trip UI, Payment UI | API Docs (Swagger), Database Design chapter, Backend Implementation chapter |
| **Bavly** | Frontend Lead, Tourist App | Trip Builder, Voting System, Shared Trips | Trip Builder (map/estimate), Place Selection, Group Voting UI, Leaflet.js Maps | Frontend Implementation chapter, UI/UX Design chapter, i18n docs |
| **Mai** | Provider/Admin Frontend & QA | Admin Dashboard, Notifications (CRUD/Socket.IO), Lost Items, Reviews, Ratings | Driver App UI, Guide App UI, Responsive Design, i18n | Test Plan, Test Case Matrix, QA chapter, User Manual |
| **Ramadan** | DevOps, Shared UI & Documentation | Places (search/filter/nearby/popular/save), Reviews (CRUD/ratings) | Shared Components (cards/modals/tables), Lost & Found UI, Reviews UI, Notification Center | Graduation Book compilation, Presentation Slides, Demo Script, Backup Video |

---

## 📸 Screenshots

> *(Screenshots will be added before final presentation)*

| Page | Description |
|---|---|
| 🏠 **Home** | Welcome page with featured destinations and quick actions |
| 🔐 **Login/Register** | JWT-based authentication with email OTP verification |
| 🗺️ **Place Discovery** | Search, filter, and browse places with map integration |
| 📅 **Trip Builder** | Multi-step form with place selection, date picker, cost estimate |
| 🗳️ **Voting** | Like/dislike places in a shared trip itinerary |
| 👤 **Profile** | User profile with saved places, trip history, and settings |
| 📊 **Admin Dashboard** | System stats, user management, verification requests |
| 🚗 **Driver Dashboard** | Trip assignments, availability toggle, location updates |
| 🧳 **Lost Items** | Report and track lost items per trip |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | ≥ 18.x | JavaScript runtime |
| npm | ≥ 9.x | Package manager |
| MongoDB | ≥ 6.x | Database (local or Atlas) |
| Angular CLI | ≥ 17.x | Frontend build tool (optional) |
| Cloudflared | Latest | Quick tunnel for remote access (optional) |

### Quick Start (One Command)

```bash
# Clone the repository
git clone https://github.com/Ahmedbakr78/TourMate.git
cd TourMate

# Run everything (seed + start + tunnel + test)
bash start.sh --seed --tunnel
```

### Manual Setup

#### 1. Backend Setup

```bash
cd "TourMate-backend_node.js (2)/TourMate-backend_node.js"

# Install dependencies
npm install

# Configure environment
# Edit .env with your MongoDB URI, JWT secrets, Cloudinary keys, and email credentials

# Start development server
npx tsx src/index.ts
```

#### 2. Frontend Setup

```bash
cd tourmate_frontend/tourmate-frontend

# Install dependencies
npm install

# Build for production
npm run build

# The built files are served by Express at /dist
```

#### 3. Seed Database

```bash
# From project root
npx tsx seed/seed.ts
```

### Access

| URL | Description |
|---|---|
| `http://localhost:3000` | Main application (Angular SPA + API) |
| `https://*.trycloudflare.com` | Remote tunnel URL (if using --tunnel) |

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

## 🌐 API Endpoints

### Authentication (`/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /auth/signup | ✗ | Register new account |
| POST | /auth/signin | ✗ | Login with email & password |
| POST | /auth/confirm_email | ✗ | Verify email with OTP |
| POST | /auth/send_otp_again | ✗ | Resend verification OTP |
| POST | /auth/forgot_password | ✗ | Request password reset OTP |
| POST | /auth/verify_reset_code | ✗ | Verify reset code |
| PATCH | /auth/reset_password | ✗ | Set new password |
| POST | /auth/refresh_token | ✗ | Get new access token |
| PATCH | /auth/change_password | ✓ | Change password (logged in) |
| POST | /auth/logout | ✓ | Invalidate tokens |
| GET | /auth/me | ✓ | Get current user profile |

### Places (`/place`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /place/create_place | ✓ | Create a new place |
| GET | /place/get/:id | ✓ | Get place by ID |
| GET | /place/all | ✓ | Get all places (paginated) |
| PUT | /place/update/:id | ✓ | Update place |
| DELETE | /place/places/:id | ✓ | Delete place |
| GET | /place/search | ✓ | Search places by name/city/category |
| GET | /place/filter | ✗ | Filter places by city & category |
| GET | /place/nearby | ✓ | Get nearby places (geospatial) |
| GET | /place/popular | ✗ | Get highest-rated places |
| POST | /place/save/:id | ✓ | Save place to favourites |
| DELETE | /place/save/:id | ✓ | Unsave place |

### Trips (`/trip`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /trip/create_trip | ✓ | Create new trip |
| GET | /trip/get/:id | ✓ | Get trip by ID |
| GET | /trip/all | ✓ | Get all trips (paginated) |
| GET | /trip/my_trips | ✓ | Get current user's trips |
| PATCH | /trip/:id/update | ✓ | Update trip details |
| PATCH | /trip/:id/cancel | ✓ | Cancel trip |
| PATCH | /trip/:id/join | ✓ | Join a shared trip |
| PATCH | /trip/:id/share | ✓ | Share trip with others |
| POST | /trip/:id/duplicate | ✓ | Duplicate an existing trip |
| DELETE | /trip/:id/delete | ✓ | Delete trip |
| PATCH | /trip/:id/assign-guide | ✓ | Assign guide to trip |
| PATCH | /trip/:id/assign-driver | ✓ | Assign driver to trip |
| PATCH | /trip/:id/assign-vehicle | ✓ | Assign vehicle to trip |
| PATCH | /trip/:id/start | ✓ | Start trip (status → ongoing) |
| PATCH | /trip/:id/complete | ✓ | Complete trip |
| POST | /trip/calculate-price | ✓ | Estimate trip cost |
| GET | /trip/:id/route | ✓ | Get trip route path |
| GET | /trip/shared | ✓ | Get all shared trips |

### Guides (`/guide`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /guide/create_guide | ✓ | Register as guide |
| PATCH | /guide/update/:id | ✓ | Update guide profile |
| DELETE | /guide/delete/:id | ✓ | Delete guide profile |
| GET | /guide/get/:id | ✗ | Get guide by ID |
| GET | /guide/all | ✗ | Get all guides |
| GET | /guide/search | ✗ | Search guides by criteria |
| PATCH | /guide/update-availability/:id | ✓ | Toggle availability |
| POST | /guide/upload-certificate/:id | ✓ | Upload certificate |
| DELETE | /guide/delete-certificate/:id | ✓ | Delete certificate |

### Drivers (`/driver`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /driver/create_driver | ✓ | Register as driver |
| PATCH | /driver/update/:id | ✓ | Update driver profile |
| DELETE | /driver/delete/:id | ✓ | Delete driver profile |
| GET | /driver/get/:id | ✗ | Get driver by ID |
| GET | /driver/all | ✗ | Get all drivers |
| POST | /driver/search | ✗ | Search drivers |
| PATCH | /driver/update-availability/:id | ✓ | Toggle availability |

### Vehicles (`/vehicle`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /vehicle/create_vehicle | ✓ | Register vehicle |
| PATCH | /vehicle/update/:id | ✓ | Update vehicle |
| DELETE | /vehicle/delete/:id | ✓ | Delete vehicle |
| GET | /vehicle/get/:id | ✗ | Get vehicle by ID |
| GET | /vehicle/all | ✗ | Get all vehicles |
| GET | /vehicle/search | ✗ | Search vehicles |
| GET | /vehicle/driver/:driverId | ✗ | Get driver's vehicles |
| POST | /vehicle/upload-images/:id | ✓ | Upload vehicle photos |
| DELETE | /vehicle/delete-image/:id | ✓ | Delete vehicle photo |

### Reviews (`/review`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /review/create_review | ✓ | Submit review |
| GET | /review/all | ✓ | Get all reviews |
| GET | /review/get/:id | ✓ | Get review by ID |
| PATCH | /review/:id/update | ✓ | Update review |
| DELETE | /review/:id/delete | ✓ | Delete review |
| GET | /review/:tripId/reviews | ✓ | Get trip reviews |
| GET | /review/:placeId/place_reviews | ✓ | Get place reviews |
| GET | /review/guide/:guideId | ✓ | Get guide reviews |
| GET | /review/driver/:driverId | ✓ | Get driver reviews |
| GET | /review/my-reviews | ✓ | Get current user's reviews |

### Votes (`/vote`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /vote/create_vote | ✓ | Vote on a place in a trip |
| PATCH | /vote/:id/update | ✓ | Change vote |
| DELETE | /vote/:id/delete | ✓ | Remove vote |
| GET | /vote/:tripId/place/:placeId | ✓ | Get votes for a place in a trip |
| GET | /vote/user | ✓ | Get user's votes |

### Notifications (`/notifications`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /notifications/notifications | ✓ | List notifications |
| GET | /notifications/get/:id | ✓ | Get notification by ID |
| GET | /notifications/unread-count | ✓ | Get unread count |
| POST | /notifications/create | ✓ | Create notification |
| PATCH | /notifications/:id/mark-as-read | ✓ | Mark as read |
| PATCH | /notifications/mark-all-as-read | ✓ | Mark all as read |
| DELETE | /notifications/:id/delete | ✓ | Delete notification |
| DELETE | /notifications/delete-all | ✓ | Delete all notifications |

### Lost Items (`/lost_item`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /lost_item/create_lost_item | ✓ | Report lost item |
| GET | /lost_item/get/:id | ✓ | Get lost item by ID |
| GET | /lost_item/:tripId/trip_lost_items | ✓ | Get trip's lost items |
| GET | /lost_item/my_lost_items | ✓ | Get user's lost items |
| PATCH | /lost_item/:id/update | ✓ | Update lost item |
| PATCH | /lost_item/:id/status | ✓ | Update status |
| DELETE | /lost_item/:id/delete | ✓ | Delete lost item |
| PATCH | /lost_item/:id/report-found | ✓ | Mark as found |
| PATCH | /lost_item/:id/close | ✓ | Close case |
| PATCH | /lost_item/:id/reopen | ✓ | Reopen case |

### Location (`/location`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /location/update | ✓ (Driver) | Send GPS coordinates |
| GET | /location/driver/:driverId | ✓ | Poll driver location |
| GET | /location/trip/:tripId | ✓ | Get trip location data |

### Admin (`/admin`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /admin/dashboard | ✓ (Admin) | System statistics |
| GET | /admin/system-statistics | ✓ (Admin) | Detailed metrics |
| GET | /admin/users | ✓ (Admin) | List all users |
| GET | /admin/pending-guides | ✓ (Admin) | Unverified guides |
| GET | /admin/pending-drivers | ✓ (Admin) | Unverified drivers |
| GET | /admin/reports | ✓ (Admin) | System reports |
| PATCH | /admin/:id/role | ✓ (Admin) | Change user role |
| PATCH | /admin/:id/status | ✓ (Admin) | Block/unblock user |
| DELETE | /admin/:id/delete | ✓ (Admin) | Delete user |
| DELETE | /admin/trip/:id/delete | ✓ (Admin) | Delete trip |
| PATCH | /admin/driver/:id/verification-status | ✓ (Admin) | Verify driver |
| PATCH | /admin/guide/:id/verification-status | ✓ (Admin) | Verify guide |
| PATCH | /admin/trip/:id/assign-resources | ✓ (Admin) | Assign resources |
| PATCH | /admin/trip/:id/status | ✓ (Admin) | Update trip status |
| PATCH | /admin/trip/:id/confirm-payment | ✓ (Admin) | Confirm payment |

### User (`/user`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /user/current_user_id | ✓ | Get logged-in user profile |
| GET | /user/:id | ✓ | Get user by ID |
| PUT | /user/update_user | ✓ | Update own profile |
| POST | /user/profile_image | ✓ | Upload profile picture |
| DELETE | /user/delete_image | ✓ | Delete profile picture |
| DELETE | /user/delete_account | ✓ | Delete own account |

---

## 📐 UML Diagrams

All UML diagrams are available in Markdown format in `docs/uml/`:

| Diagram | File | Contents |
|---|---|---|
| 🎯 **Use Case** | `docs/uml/use-case.md` | 98 use cases across 8 actor groups with full relationships |
| 🧩 **Class Diagram** | `docs/uml/class-diagram.md` | 13 entity classes, 7 packages, all fields/methods/enums/relationships |
| 🔄 **Sequence** | `docs/uml/sequence-diagram.md` | 7 flows: Login, Create Trip, Voting, Real-Time Tracking, Review, Lost & Found, Admin Assign |
| 🏃 **Activity** | `docs/uml/activity-diagram.md` | 5 flows: Registration, Trip Lifecycle (Create→Start→Complete), Location Tracking, Lost Item, Admin Resources |
| 🗄️ **ERD** | `docs/uml/erd.md` | 9 collections, full schema with indexes/constraints/TTL/2dsphere, referential integrity map |

---

## 📁 Project Structure

```
TourMate/
├── start.sh                          # 🚀 Unified launcher (seed + build + start + test + tunnel)
├── start-cloudflare.sh               # ☁️ Thin wrapper for start.sh --tunnel
├── README.md                         # 📖 This file
├── .gitignore
│
├── seed/
│   └── seed.ts                       # 🌱 Database seeder (7 users, 24 places, reviews)
│
├── docs/
│   ├── uml/                          # 📐 UML diagrams (Markdown format)
│   │   ├── use-case.md
│   │   ├── class-diagram.md
│   │   ├── sequence-diagram.md
│   │   ├── activity-diagram.md
│   │   └── erd.md
│   └── checklists/                   # ✅ Per-member checklists
│
├── TourMate-backend_node.js (2)/
│   └── TourMate-backend_node.js/
│       ├── src/
│       │   ├── index.ts              # Express server entry point
│       │   ├── db/                   # Database connection & models
│       │   │   ├── models/           # 11 Mongoose schemas
│       │   │   │   ├── user.model.ts
│       │   │   │   ├── guide.model.ts
│       │   │   │   ├── driver.model.ts
│       │   │   │   ├── vehicle.model.ts
│       │   │   │   ├── place.model.ts
│       │   │   │   ├── trip.model.ts
│       │   │   │   ├── vote.model.ts
│       │   │   │   ├── review.model.ts
│       │   │   │   ├── notification.model.ts
│       │   │   │   ├── lostIem.model.ts
│       │   │   │   └── black-listed-token.model.ts
│       │   │   └── repo/             # Repository pattern (CRUD base)
│       │   ├── modules/              # 11 feature modules
│       │   │   ├── auth/             # Authentication (JWT, OTP, roles)
│       │   │   ├── admin/            # Admin dashboard & management
│       │   │   ├── guide/            # Guide profiles & certificates
│       │   │   ├── driver/           # Driver profiles & location
│       │   │   ├── vehicle/          # Vehicle CRUD & images
│       │   │   ├── place/            # Places & Overpass integration
│       │   │   ├── trip/             # Trip builder & lifecycle
│       │   │   ├── vote/             # Voting system
│       │   │   ├── review/           # Reviews & ratings
│       │   │   ├── location/         # In-memory location store
│       │   │   ├── notifications/    # Notification CRUD
│       │   │   ├── lost_item/        # Lost & found management
│       │   │   └── user/             # User profile
│       │   ├── middlewares/          # Auth, authorization, validation, upload
│       │   ├── socket/               # Socket.IO real-time
│       │   ├── common/               # Enums, interfaces, constants
│       │   └── utils/                # Helpers, errors, encryption, services
│       └── .env                      # Environment configuration
│
└── tourmate_frontend/
    └── tourmate-frontend/
        ├── src/
        │   └── app/
        │       ├── core/             # Services, interceptors, guards, models
        │       │   ├── services/     # 14 API services
        │       │   ├── interceptors/ # JWT auth interceptor
        │       │   └── guards/       # AuthGuard, RoleGuard
        │       ├── features/         # 12 feature modules
        │       │   ├── auth/         # Login, signup, confirm email, password reset
        │       │   ├── admin/        # Dashboard, users, verifications, trips
        │       │   ├── home/         # Landing page
        │       │   ├── places/       # List, detail, form
        │       │   ├── trips/        # Builder, my-trips, detail, shared, payment
        │       │   ├── guide/        # Dashboard, list, onboarding
        │       │   ├── driver/       # Dashboard, list, onboarding
        │       │   ├── vehicle/      # List, form
        │       │   ├── reviews/      # List, form
        │       │   ├── lost-item/     # List
        │       │   ├── notifications/ # List
        │       │   └── profile/      # Settings, password, image
        │       └── shared/           # Shared UI components
        └── environments/             # Dev & prod API URLs
```

---

## ☁️ Tunneling (Remote Access)

For remote demo access without deploying to a cloud provider, TourMate supports **two tunneling methods**:

### 1. Cloudflare (trycloudflare.com) — Primary
```bash
bash start.sh --tunnel
# Or
bash start-cloudflare.sh
```
- Zero configuration (no Cloudflare account needed)
- Auto-fallback to SSH tunnel if rate-limited
- DNS propagation wait: up to 30 seconds

### 2. localhost.run (SSH) — Fallback
- Activated automatically when Cloudflare is unavailable
- Uses SSH reverse tunnel (port 80 → localhost:3000)
- No captcha, HTTP 200 guaranteed

---

## 🧪 Testing

### Automated Endpoint Tests
The `start.sh` script runs 20+ automated tests after startup:

```bash
bash start.sh --seed
# Tests cover:
#   - SPA routing (all Angular routes return 200)
#   - Public endpoints (auth, popular places, filters)
#   - Authenticated endpoints (requires JWT)
#   - Protected routes (401 without token)
#   - Admin-only endpoints
```

### Manual Testing
Each team member performed manual testing on their assigned modules:
- Cross-browser (Chrome, Firefox, Edge)
- Mobile responsiveness
- Edge cases (vehicle capacity, date conflicts, duplicate votes)

---

## 🚀 Deployment

### Current Status: Local-Only
- ✅ Local development server (Express + Angular)
- ✅ Quick tunnels for remote demos (Cloudflare / localhost.run)
- ❌ Docker containerization (planned)
- ❌ CI/CD pipeline (planned)
- ❌ Cloud deployment (Render / Vercel / AWS — planned)

### Planned Cloud Deployment
```bash
# TODO: Docker setup
docker-compose up -d

# TODO: Deploy to cloud (Render, Vercel, or AWS)
```

---

## 📚 Graduation Book Chapters

| Chapter | Author | Status |
|---|---|---|
| 1. Introduction | Ahmed | ✅ |
| 2. System Architecture | Ahmed | ✅ |
| 3. Database Design | Jamal | ✅ |
| 4. Backend Implementation | Jamal | ✅ |
| 5. Frontend Implementation | Bavly | ✅ |
| 6. UI/UX Design | Bavly | ✅ |
| 7. System Testing & QA | Mai | ✅ |
| 8. Conclusion | Ramadan | ✅ |

---

## 🤝 Contributing

This is a graduation project. Contributions are closed to external collaborators.  
Team members should follow the branching strategy:

1. Each member works on their assigned modules
2. Code is reviewed by the team lead (Ahmed)
3. All UML and architecture decisions are centralized

---

## 📄 License

This project is developed for educational purposes as a graduation requirement for the Faculty of Computer Science.  
All rights reserved © 2026 TourMate Team.

---

<p align="center">
  <strong>TourMate</strong> — Making Travel Smarter, Together 🌍
</p>
