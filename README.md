# TourMate - Smart Travel Companion

> All-in-One Tourism Management Platform  
> Built with MEAN Stack (MongoDB, Express, Angular, Node.js)  
> Final Graduation Project - Faculty of Computer Science  
> Helwan University

---

## Table of Contents

- [About](#about)
- [Website](#website)
- [Topics](#topics)
- [Provided](#provided)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Team and Responsibilities](#team-and-responsibilities)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [UML Diagrams](#uml-diagrams)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Real-Time Architecture](#real-time-architecture)
- [Tunneling (Remote Access)](#tunneling-remote-access)
- [Testing](#testing)
- [Deployment](#deployment)
- [Graduation Book Chapters](#graduation-book-chapters)
- [Contributing](#contributing)
- [License](#license)

---

## About

TourMate is a comprehensive tourism management platform designed and developed as the final graduation project for the Faculty of Computer Science at Helwan University. The platform is a fully functional, production-ready web application that seamlessly connects Tourists, Tour Guides, and Drivers in a unified ecosystem.

The problem TourMate solves is the fragmentation of tourism services. Travelers typically need to use multiple platforms to discover places, find guides, book transportation, plan itineraries, share trip costs, and manage logistics. TourMate brings all of these capabilities into a single, coherent platform with a role-based access system that gives each user type a tailored experience.

The project was built over several months by a team of five developers following a structured software engineering methodology. It includes comprehensive UML documentation (use case diagrams, class diagrams, sequence diagrams, activity diagrams, and entity-relationship diagrams), a fully documented REST API with over 100 endpoints, a responsive Angular frontend with 12 feature modules, a real-time notification system powered by Socket.IO, and a complete database schema with 11 MongoDB collections.

### Key Highlights

- **Complete MEAN Stack Implementation** - MongoDB for persistent storage, Express 5 for the HTTP API layer, Angular 17 for the single-page application frontend, and Node.js as the runtime environment.
- **Role-Based Access Control** - Four distinct user roles (Tourist, Guide, Driver, Admin) each with their own dashboards, permissions, and workflows.
- **Real-Time Notifications** - Socket.IO WebSocket integration for instant notification delivery without page refreshes.
- **Geospatial Features** - OpenStreetMap integration via Leaflet.js for interactive maps, Overpass API for point-of-interest discovery, and OSRM for route calculation.
- **Live Location Tracking** - Polling-based GPS tracking system that allows tourists to monitor their driver's location during active trips.
- **Image Management** - Cloudinary integration for cloud-based image storage, serving, and optimization.
- **Email Integration** - Nodemailer-based email delivery for OTP verification, password reset, and account notifications.
- **Multi-Language Support** - i18n infrastructure with English, Arabic, and French language files prepared.
- **Comprehensive API** - Over 100 RESTful endpoints across 11 modules with JWT authentication and role-based authorization.
- **Remote Demo Support** - Built-in tunneling support via Cloudflare and localhost.run for remote presentation access.

---

## Website

The TourMate project is hosted and maintained on GitHub under the organization of Ahmed Abo Bakr. The primary repository contains all source code, documentation, UML diagrams, database seeders, and deployment scripts.

### Repository
- **GitHub URL:** [https://github.com/Ahmedbakr78/TourMate](https://github.com/Ahmedbakr78/TourMate)
- **Main Branch:** `main` - Contains the complete NN1-v2 project with integrated frontend and backend
- **Other Branches:** Individual team member branches for parallel development

### Access Methods

#### Local Development Server
When running locally, the application is accessible at:
- **Application URL:** `http://localhost:3000`
- **API Base URL:** `http://localhost:3000` (same server, serves both API and Angular SPA)

#### Remote Demo via Tunnel
Two tunneling methods are supported for remote access during presentations:
- **Cloudflare Tunnel:** `https://<random-subdomain>.trycloudflare.com` (primary, zero-config)
- **SSH Tunnel (localhost.run):** `<random>.localhost.run` (fallback, no captcha required)

### Online Presence
- The project is available as open-source on GitHub for academic review and collaboration.
- All documentation (UML diagrams, API reference, architecture guides, graduation book chapters) is included directly in the repository.
- No dedicated website or domain has been deployed yet; the project runs locally with optional tunneling for remote access.

---

## Topics

### Primary Topics
- `tourism` - Core domain of the application
- `travel` - Travel planning and management
- `trip-planner` - Itinerary building and trip management
- `tour-guide` - Guide discovery, profiles, and assignment
- `driver` - Driver management and location tracking
- `mean-stack` - Technology stack used (MongoDB, Express, Angular, Node.js)
- `angular` - Frontend framework
- `express` - Backend HTTP framework
- `mongodb` - Database technology
- `nodejs` - Runtime environment
- `mongoose` - MongoDB ODM library
- `socket-io` - Real-time WebSocket communication
- `jwt` - Authentication mechanism
- `rest-api` - API architecture style
- `graduation-project` - Academic context
- `full-stack` - Full-stack web development
- `leaflet` - Interactive map library
- `openstreetmap` - Map data source
- `cloudinary` - Image storage and CDN
- `typescript` - Programming language used

### Secondary Topics
- `geolocation` - GPS-based location tracking
- `real-time-tracking` - Live driver location monitoring
- `i18n` - Internationalization and multi-language support
- `role-based-access-control` - RBAC implementation
- `payment` - Trip payment management
- `review-system` - Ratings and reviews for guides, drivers, and places
- `voting-system` - Group voting on trip destinations
- `lost-and-found` - Lost item reporting and tracking
- `notification-system` - Real-time notification delivery
- `email-verification` - OTP-based email verification
- `file-upload` - Image and certificate upload management
- `responsive-design` - Mobile-friendly interface
- `agile-development` - Development methodology
- `uml` - Software modeling and documentation
- `software-architecture` - System design and architecture

---

## Provided

TourMate provides a complete, end-to-end tourism management solution with the following deliverables and capabilities:

### Platform Capabilities

#### For Tourists (End Users)
1. **Place Discovery** - Browse, search, and filter points of interest by city, category, or name with OpenStreetMap integration for nearby place discovery.
2. **Trip Building** - Create custom itineraries by selecting multiple destinations, setting date ranges, and receiving automatic cost estimations based on distance and duration.
3. **Group Voting** - Participate in democratic trip planning by liking or disliking places within a shared trip itinerary during the planning phase.
4. **Shared Trips** - Receive, accept, and join shared trip invitations with cost-split visibility and vehicle capacity checking.
5. **Live Driver Tracking** - Monitor the assigned driver's GPS location on an interactive Leaflet map with 5-second polling intervals during active trips.
6. **Reviews and Ratings** - Submit ratings and written reviews for guides, drivers, and places visited, helping the community make informed decisions.
7. **Notifications** - Receive real-time Socket.IO push notifications for trip status changes, booking confirmations, and other updates.
8. **Lost and Found** - Report lost items during or after trips, track recovery status, upload photos, and communicate through status updates.
9. **Saved Places** - Bookmark favorite destinations for quick access and future trip planning.

#### For Tour Guides
1. **Profile Management** - Create and manage a professional guide profile including biography, spoken languages, years of experience, and contact information.
2. **Certificate Upload** - Upload qualification certificates as images for admin verification and approval.
3. **Availability Toggle** - Easily switch between available and unavailable status to control trip assignments.
4. **Trip Schedule** - View all assigned upcoming, ongoing, and completed trips in a dedicated dashboard.
5. **Public Listing** - Appear in searchable public guide listings that tourists can browse and filter.

#### For Drivers
1. **Vehicle Management** - Register and manage multiple vehicles with make, model, year, capacity, license plate, and photos.
2. **Location Updates** - Send GPS coordinates to the server during active trips (10-second intervals) for tourist tracking.
3. **Availability Toggle** - Control availability for new trip assignments.
4. **Trip History** - View complete history of assigned trips including status, dates, and associated tourists and guides.
5. **Public Listing** - Appear in searchable public driver listings.

#### For Administrators
1. **System Dashboard** - View comprehensive system statistics including user counts, trip counts, revenue metrics, and system health indicators.
2. **User Management** - View all users, search and filter, promote or demote roles, block or unblock accounts, and delete users.
3. **Verification System** - Review and approve or reject guide certificate submissions and driver applications.
4. **Trip Oversight** - View all trips, assign drivers and guides, assign vehicles, update trip statuses, and confirm payments.
5. **Content Moderation** - Delete inappropriate reviews, trips, or user accounts as needed.
6. **Reports** - Generate and view system usage reports and analytics.

### Technical Deliverables

#### 1. Fully Documented REST API
- 100+ endpoints across 11 modules
- JWT-based authentication with access and refresh tokens
- Role-based authorization middleware
- Request validation using Zod schemas
- Consistent response format across all endpoints
- Pagination support for list endpoints
- Comprehensive error handling with custom exception classes

#### 2. Angular 17 Single-Page Application
- 12 lazy-loaded feature modules
- Responsive design with Angular Material components
- Custom theming (Nile Teal primary, Desert Gold accent)
- Route guards for authentication and role protection
- HTTP interceptor for automatic JWT attachment and refresh
- 14 API service classes for backend communication
- Reusable shared components (navbar, map, loading spinner, confirm dialog)
- Multi-language support (English, Arabic, French)
- Production build configuration with optimization

#### 3. Express 5 Backend Server
- Layered architecture (routes -> controllers -> services -> repositories -> models)
- 11 Mongoose schemas with indexes (geospatial, text, compound, TTL)
- Repository pattern for database access abstraction
- Socket.IO integration for real-time notifications
- Cloudinary integration for image upload and management
- Nodemailer integration for email OTP delivery
- Overpass API proxy for OpenStreetMap POI discovery
- OSRM integration for route calculation
- In-memory location store for driver GPS tracking
- Comprehensive middleware pipeline (CORS, Helmet, compression, JSON parsing, authentication, authorization, validation, file upload)

#### 4. Database Seed Script
- Seeds 7 demo accounts across all roles
- Creates 24 sample places in multiple cities
- Generates sample reviews and ratings

#### 5. Documentation Package
- Complete UML diagrams (use case, class, sequence, activity, ERD) in both Markdown and PlantUML formats
- Full API reference with endpoint descriptions
- Architecture documentation
- Graduation book chapters
- Presentation scripts
- Per-member task checklists

#### 6. DevOps and Deployment
- Unified startup script (start.sh) with seed, build, start, tunnel, and test modes
- Cloudflare tunnel integration for remote access
- localhost.run SSH tunnel as fallback
- .gitignore configuration for proper source control
- Production build configuration for Angular frontend

---

## Features

### Authentication System
- Email and password registration with validation
- Email OTP verification for account activation
- Login with JWT access token issuance
- Refresh token mechanism for seamless session extension
- Password change (authenticated users)
- Password reset flow (forgot password -> OTP -> new password)
- Logout with token blacklisting
- Role-based access control (Tourist, Guide, Driver, Admin)
- Account deletion with cascade cleanup

### Place Management
- Create, read, update, delete places with full details
- Rich place data model (name, description, location, category, images, contact info, operating hours, price range)
- Search places by name, city, or category
- Filter places by city and category (public, no auth required)
- Geospatial nearby place discovery using MongoDB 2dsphere indexes
- Popular places ranking based on average ratings
- Save and unsave places to personal favorites

### Trip Management
- Complete trip lifecycle (Draft -> Pending -> Confirmed -> Ongoing -> Completed)
- Create trips with multiple destination places
- Set date ranges (start date, end date)
- Automatic cost estimation based on distance and duration
- Assign guides, drivers, and vehicles to trips
- Share trips with other users via share links
- Join shared trips with capacity checking
- Duplicate existing trips for repeat planning
- Cancel trips with status tracking
- Start and complete trips with status transitions
- Route path generation for trip visualization

### Guide System
- Guide profile creation with personal details
- Biography, languages spoken, years of experience
- Certificate upload and management for verification
- Availability status toggle
- Search guides by criteria
- Public guide listing with ratings

### Driver System
- Driver profile creation with personal details
- License information and experience
- Availability status toggle
- Public driver listing with ratings
- Search drivers by criteria

### Vehicle Management
- Vehicle registration (make, model, year, color, capacity, license plate)
- Multiple vehicles per driver
- Vehicle photo upload and management
- Filter vehicles by driver
- Search vehicles

### Voting System
- Vote on places within trip itineraries
- Change or remove votes
- View aggregated vote counts per place
- View user's voting history

### Review System
- Submit ratings and reviews for guides, drivers, and places
- Star rating (1-5) with written comments
- Update and delete own reviews
- View reviews by trip, place, guide, or driver
- View personal review history

### Notification System
- Real-time Socket.IO push notifications
- Create notifications for various events
- Mark individual notifications as read
- Mark all notifications as read
- Unread notification count
- Delete individual or all notifications
- Live badge and toast display in navbar

### Location Tracking
- Driver GPS location updates during active trips
- Polling-based location retrieval for tourists (5-second intervals)
- In-memory location storage for low-latency access
- Trip-specific location data

### Lost and Found
- Report lost items during trips
- Upload photos of lost items
- Status tracking (reported, found, closed, reopened)
- Report found items
- Close and reopen cases
- Trip-specific lost item listing
- Personal lost item history

### Admin Dashboard
- System statistics dashboard (user counts, trip counts, revenue)
- User listing with search and filter
- User role management (promote, demote)
- User account status management (block, unblock)
- User account deletion
- Guide verification (approve/reject certificates)
- Driver verification (approve/reject applications)
- Trip management (view all, assign resources, update status, confirm payment)
- Trip deletion
- System reports

### User Profile
- View and edit personal information
- Profile picture upload and deletion
- Password change
- Account deletion
- Self-service guide and driver profile management
- Saved places listing
- Personal trip history

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Angular | 17+ | Single-page application framework with modular architecture, lazy loading, and standalone components |
| Angular Material | 17+ | Material Design component library for consistent UI (cards, tables, dialogs, forms, navigation) |
| Leaflet.js | Latest | Open-source JavaScript library for interactive OpenStreetMap maps |
| Socket.IO Client | Latest | WebSocket client library for real-time notification push |
| RxJS | Latest | Reactive programming library for async operations and state management |
| TypeScript | 5+ | Typed superset of JavaScript for maintainable, scalable code |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime environment for server-side execution |
| Express | 5 | HTTP server framework with middleware pipeline, routing, and error handling |
| Mongoose | 8+ | MongoDB ODM with schema validation, indexing, population, and middleware |
| TypeScript | 5+ | Type-safe JavaScript for backend business logic |
| JSON Web Token (JWT) | Latest | Stateless authentication with access and refresh tokens |
| bcrypt | Latest | Password hashing with salt rounds for secure credential storage |
| Zod | Latest | Schema-based request validation with TypeScript inference |
| Multer | Latest | Multipart file upload handling for images and certificates |
| Cloudinary SDK | Latest | Cloud-based image upload, transformation, and CDN delivery |
| Nodemailer | Latest | Email delivery for OTP verification and password reset |
| Socket.IO | Latest | WebSocket server for real-time bidirectional communication |

### Database
| Component | Detail |
|---|---|
| Database System | MongoDB 6+ (NoSQL document database) |
| ODM | Mongoose 8+ with schema validation and middleware |
| Indexes | Geospatial (2dsphere), text search, compound, TTL (auto-expire) |
| Collections | 11 collections: users, guides, drivers, vehicles, places, trips, votes, reviews, notifications, lost_items, blacklisted_tokens |

### External Integrations
| API/Service | Purpose | Integration Method |
|---|---|---|
| Overpass API | OpenStreetMap POI search and retrieval | Server-side proxy with TTL caching |
| OSRM (Open Source Routing Machine) | Route geometry and travel time calculation | Server-side HTTP client |
| Cloudinary | Image and file cloud storage with CDN | Server-side SDK with signed uploads |
| trycloudflare | Quick tunnel for remote demo access | Cloudflared CLI subprocess |
| localhost.run | SSH tunnel fallback for remote access | SSH reverse tunnel |

### Development Tools
| Tool | Purpose |
|---|---|
| Visual Studio Code | Primary IDE |
| Obsidian | UML diagram authoring and documentation |
| PlantUML | UML diagram code generation from textual descriptions |
| Postman / curl | API testing and debugging |
| Git / GitHub | Version control and collaboration |
| Angular CLI | Frontend scaffolding, build, and development server |
| tsx (TypeScript Execute) | Backend TypeScript development without compilation step |

---

## System Architecture

### High-Level Architecture

```
+------------------------------------------------------------------+
|                       Browser (Client)                            |
|            Angular 17 SPA - 12 Feature Modules                   |
|    Angular Material UI + Leaflet Maps + Socket.IO Client         |
+-----------------------------+------------------------------------+
                              | HTTP/HTTPS + WebSocket
                              v
+------------------------------------------------------------------+
|                    Express 5 Server (Port 3000)                    |
|                                                                    |
|  +--------------------------------------------------------------+  |
|  |                   Middleware Pipeline                         |  |
|  |  CORS -> Helmet -> Compression -> JSON Parse -> Auth -> ...  |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  +----------+  +----------+  +----------+  +----------+          |
|  |   Auth   |  |   Trip   |  |  Place   |  |  Guide   |  ...    |
|  |  Router  |  |  Router  |  |  Router  |  |  Router  |          |
|  +----+-----+  +----+-----+  +----+-----+  +----+-----+          |
|       |             |             |             |                 |
|  +----+-----+  +----+-----+  +----+-----+  +----+-----+          |
|  |   Auth   |  |   Trip   |  |  Place   |  |  Guide   |  ...    |
|  |  Service |  |  Service |  |  Service |  |  Service |          |
|  +----+-----+  +----+-----+  +----+-----+  +----+-----+          |
|       |             |             |             |                 |
|  +----+-------------+-------------+-------------+-----+          |
|  |                    MongoDB (Mongoose)                      |   |
|  |  11 Collections - Geospatial Indexes - TTL - Text Search  |   |
|  +----------------------------------------------------------+   |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |                   External Integrations                       | |
|  |  Overpass API <-> OSRM <-> Cloudinary <-> Nodemailer         | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |              In-Memory Systems                                | |
|  |  Location Tracking Store - Socket.IO Connections              | |
|  +--------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

### Layered Architecture (Backend)

The backend follows a strict layered architecture pattern:

1. **Routes Layer** - Defines URL mappings and attaches middleware (auth, validation, upload). Each module has its own router file.

2. **Controllers Layer** - Handles HTTP request/response cycle. Extracts parameters from request, calls services, formats and sends responses.

3. **Services Layer** - Contains business logic. Orchestrates operations, enforces rules, coordinates between repositories and external services.

4. **Repositories Layer** - Abstracts database operations. Provides CRUD methods for each collection with query building, filtering, pagination, and sorting.

5. **Models Layer** - Defines Mongoose schemas with field types, validators, indexes, hooks (pre/post), and instance/static methods.

### Middleware Pipeline

Each request passes through a configurable chain of middleware:

1. **CORS** - Cross-Origin Resource Sharing headers for browser security
2. **Helmet** - HTTP security headers (XSS, content-type sniffing, etc.)
3. **Compression** - Gzip/brotli response compression for bandwidth optimization
4. **JSON Body Parser** - Parse incoming JSON request bodies
5. **URL-encoded Parser** - Parse form data in URL-encoded format
6. **Static File Serving** - Serve Angular production build from dist directory
7. **Authentication Middleware** - Verify JWT, attach user to request object
8. **Authorization Middleware** - Check user role against required role(s)
9. **Validation Middleware** - Validate request body/params/query using Zod schemas
10. **Upload Middleware** - Handle multipart file uploads via Multer
11. **Error Handling Middleware** - Global error handler with consistent response format

### Angular Frontend Architecture

```
src/app/
  core/                    - Singleton services, guards, interceptors, models
    models/                - TypeScript interfaces matching backend schemas
    services/              - HTTP service classes (one per backend module)
    guards/                - AuthGuard (authentication check), RoleGuard (role check)
    interceptors/          - JWT auth interceptor (attach token, auto-refresh on 401)
  
  shared/                  - Reusable components, pipes, directives
    components/            - Navbar, map, loading spinner, confirm dialog, language selector
    pipes/                 - Translation pipe for i18n
  
  features/                - Lazy-loaded feature modules (12 total)
    auth/                  - Login, signup, confirm email, forgot/reset password
    home/                  - Landing page with hero section and featured content
    places/                - Place discovery, list, detail, create, edit
    trips/                 - Trip builder, my trips, trip detail, shared trips, payment
    guide/                 - Guide dashboard, public guide list, onboarding
    driver/                - Driver dashboard, public driver list, onboarding
    vehicle/               - Vehicle list, vehicle form (create/edit)
    reviews/               - Review list, review form (create/edit)
    lost-item/             - Lost item reports listing
    notifications/         - Notification inbox with real-time updates
    admin/                 - Admin dashboard, user management, verifications, trip management
    profile/               - User profile, settings, password change, photo management
```

### Data Flow Example: Trip Creation

1. User fills out trip builder form in Angular (places selection, dates, preferences)
2. Angular TripService sends POST /trip/create_trip with JWT in Authorization header
3. Auth interceptor attaches the JWT automatically
4. Express CORS middleware allows the request
5. Express JSON parser parses the request body
6. Authentication middleware verifies JWT and attaches user object
7. Validation middleware validates request body against Zod schema
8. Trip controller receives validated data and calls TripService
9. TripService checks user permissions, validates date ranges, checks place existence
10. TripService creates trip document via TripRepository
11. TripRepository saves to MongoDB trips collection
12. Success response returns to Angular with created trip data
13. NotificationService creates a booking notification for any involved parties
14. Response received by Angular, TripService parses it
15. Angular component updates UI with success message and navigates to trip detail

---

## Team and Responsibilities

| Member | Role | Backend Modules | Frontend Features | Documentation |
|---|---|---|---|---|
| Ahmed Abo Bakr | Team Leader, Fullstack & Architecture | Guide, Driver, Vehicle, Location Tracking, Auth System (architecture), Admin, External Integrations | Layout, Navigation, Auth UI, Admin Dashboard, Route Guards, Map Component | ALL UML Diagrams (Use Case, Class, Sequence, Activity, ERD), README, System Architecture, Setup Guide |
| Jamal | Database Architect, Backend Core | Auth (signup, login, JWT, OTP, password reset), User CRUD, Admin (dashboard, users, reports, verification) | Booking Flow UI, Shared Trip UI, Payment UI | API Documentation (Swagger), Database Design chapter, Backend Implementation chapter |
| Bavly | Frontend Lead, Tourist App Developer | Trip Builder, Voting System, Shared Trips | Trip Builder (map, estimate, drag-drop), Place Selection, Group Voting UI, Leaflet.js Maps | Frontend Implementation chapter, UI/UX Design chapter, i18n documentation |
| Mai | Provider/Admin Frontend & QA | Admin Dashboard (assistance), Notifications (CRUD + Socket.IO), Lost Items, Reviews, Ratings | Driver App UI, Guide App UI, Responsive Design, i18n implementation | Test Plan, Test Case Matrix, QA chapter, User Manual |
| Ramadan | DevOps, Shared UI & Documentation | Places (search, filter, nearby, popular, save), Reviews (CRUD, ratings) | Shared Components (cards, modals, tables), Lost & Found UI, Reviews UI, Notification Center | Graduation Book compilation, Presentation Slides, Demo Script, Backup Video |

---

## Screenshots

> (Screenshots will be added before final presentation. Below are descriptions of each page.)

| Page | Description | Key Elements |
|---|---|---|
| Home | Welcome landing page with hero section, featured destinations, and quick action buttons | Animated route line connecting waypoints, search bar, popular places grid |
| Login | Email and password authentication form | Form fields, submit button, link to signup, forgot password link |
| Register | New user registration form | Name, email, password, confirm password fields, role selection |
| Confirm Email | OTP verification page | 6-digit code input, resend code button, timer display |
| Forgot Password | Password reset request form | Email input, send OTP button |
| Reset Password | Set new password form | New password, confirm password, OTP verification |
| Place Discovery | Browse and search points of interest | Search bar with debounce, city/category filters, place cards grid, map view toggle |
| Place Detail | Full place information page | Images, description, location map, rating, reviews, operating hours, save button |
| Place Form | Create or edit place details | Name, description, location picker, category, images, contact info, price range |
| Trip Builder | Multi-step trip creation wizard | Step 1: Trip details (name, dates), Step 2: Place selection with search, Step 3: Review and cost estimate |
| My Trips | User's trip listing | Trip cards with status badges, upcoming/ongoing/completed tabs, cancel action |
| Trip Detail | Full trip view | Places itinerary, assigned guide/driver, map route, voting tab, reviews tab, lost items tab, sharing options |
| Shared Trip | Shared trip invitation page | Trip details, cost split, capacity info, join button |
| Voting | Vote on trip places | Place cards with like/dislike buttons, vote tally, results display |
| Payment | Trip payment confirmation | Amount display, payment status, admin confirmation button |
| Guide Dashboard | Guide's personal dashboard | Assigned trips list, availability toggle, profile summary, certificates |
| Guide List | Public guide directory | Guide cards with photo, languages, rating, experience, search/filter |
| Guide Onboarding | Guide registration form | Personal info, biography, languages, certificate upload |
| Driver Dashboard | Driver's personal dashboard | Assigned trips list, availability toggle, location update controls, profile summary |
| Driver List | Public driver directory | Driver cards with photo, rating, vehicle info, search/filter |
| Driver Onboarding | Driver registration form | Personal info, license details, experience, vehicle association |
| Vehicle List | Driver's vehicles listing | Vehicle cards with photo, make, model, capacity, edit/delete actions |
| Vehicle Form | Add or edit vehicle | Make, model, year, color, capacity, license plate, photos |
| Reviews | Review listing | Review cards with star rating, comment, user info, date, edit/delete for own reviews |
| Review Form | Submit a review | Star selector, comment textarea, submit button |
| Lost Items | Lost item reports listing | Report cards with photo, status badge, trip info, date |
| Admin Dashboard | System statistics overview | User count, trip count, revenue, charts, recent activity feed |
| Admin Users | User management table | User rows with name, email, role, status, actions (block/edit/delete), search/filter |
| Admin Verifications | Guide and driver verification requests | Request cards with documents, approve/reject buttons, search/filter by status |
| Admin Trips | All trips management | Trip table with status, dates, assigned resources, actions (assign/confirm/delete) |
| Notifications | Notification inbox | Notification list with read/unread styling, mark-as-read, delete actions |
| Profile | User profile and settings | Profile picture, name, email, role, edit form, password change, saved places, account deletion |
| Navbar | Top navigation bar | Logo, navigation links based on role, notification badge with live count, user menu, language selector |

---

## Getting Started

### Prerequisites

| Tool | Minimum Version | Purpose | Installation |
|---|---|---|---|
| Node.js | 18.x | JavaScript runtime | https://nodejs.org/ |
| npm | 9.x | Package manager | Bundled with Node.js |
| MongoDB | 6.x | Database server | https://www.mongodb.com/try/download/community |
| Angular CLI | 17.x | Frontend build tools (optional) | `npm install -g @angular/cli` |
| Cloudflared | Latest | Quick tunnel for remote access (optional) | https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/ |
| Git | Latest | Version control (optional) | https://git-scm.com/ |

### Quick Start (One Command)

```bash
# Clone the repository
git clone https://github.com/Ahmedbakr78/TourMate.git
cd TourMate

# Run everything (seed database + build frontend + start server + tunnel + run tests)
bash start.sh --seed --tunnel
```

### Manual Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/Ahmedbakr78/TourMate.git
cd TourMate
```

#### 2. Backend Setup

```bash
cd "TourMate-backend_node.js (2)/TourMate-backend_node.js"

# Install all dependencies
npm install

# Configure environment variables
# Create a .env file in the backend root with the following:
#
# MONGODB_URI=mongodb://localhost:27017/tourmate
# JWT_SECRET=your-jwt-secret-key
# JWT_EXPIRES_IN=15m
# JWT_REFRESH_SECRET=your-jwt-refresh-secret-key
# JWT_REFRESH_EXPIRES_IN=7d
# CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud
# CLOUDINARY_API_KEY=your-cloudinary-api-key
# CLOUDINARY_API_SECRET=your-cloudinary-api-secret
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-email-app-password

# Start the development server (with hot-reload via tsx)
npx tsx src/index.ts
```

#### 3. Frontend Setup

```bash
cd tourmate_frontend/tourmate-frontend

# Install all dependencies
npm install

# Build for production (output goes to dist/tourmate-frontend/)
npm run build -- --configuration production

# The production build is automatically served by Express at /
# No separate server needed for production
```

#### 4. Seed the Database

```bash
# From the project root directory
cd /path/to/TourMate
npx tsx seed/seed.ts
```

This creates the following demo accounts:

| Name | Email | Password | Role |
|---|---|---|---|
| Admin | admin@tourmate.com | 123456 | Admin |
| Ahmed Tour Guide | ahmed.guide@tourmate.com | 123456 | Guide |
| Sara Tour Guide | sara.guide@tourmate.com | 123456 | Guide |
| Mohamed Driver | mohamed.driver@tourmate.com | 123456 | Driver |
| Ali Driver | ali.driver@tourmate.com | 123456 | Driver |
| Test Tourist | tourist@tourmate.com | 123456 | Tourist |
| Laila Tourist | laila@tourmate.com | 123456 | Tourist |

Plus 24 sample places in Cairo, Alexandria, and other Egyptian cities with sample reviews.

#### 5. Start the Application

```bash
cd "TourMate-backend_node.js (2)/TourMate-backend_node.js"
npx tsx src/index.ts
```

The server will start on port 3000. Open your browser to `http://localhost:3000`.

#### 6. (Optional) Remote Tunnel for Demo

```bash
# From the project root
bash start.sh --tunnel
# Or
bash start-cloudflare.sh
```

This creates a publicly accessible URL that forwards to your local server.

### Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| MONGODB_URI | Yes | mongodb://localhost:27017/tourmate | MongoDB connection string |
| JWT_SECRET | Yes | (none) | Secret key for signing access tokens |
| JWT_EXPIRES_IN | Yes | 15m | Access token expiration duration |
| JWT_REFRESH_SECRET | Yes | (none) | Secret key for signing refresh tokens |
| JWT_REFRESH_EXPIRES_IN | Yes | 7d | Refresh token expiration duration |
| CLOUDINARY_CLOUD_NAME | Yes | (none) | Cloudinary cloud name for image uploads |
| CLOUDINARY_API_KEY | Yes | (none) | Cloudinary API key |
| CLOUDINARY_API_SECRET | Yes | (none) | Cloudinary API secret |
| EMAIL_HOST | No | smtp.gmail.com | SMTP server hostname |
| EMAIL_PORT | No | 587 | SMTP server port |
| EMAIL_USER | No | (none) | SMTP authentication email |
| EMAIL_PASS | No | (none) | SMTP authentication password |

---

## Project Structure

```
TourMate/
|
+-- start.sh                                    Unified launcher script (seed, build, start, tunnel, test)
+-- start-cloudflare.sh                         Cloudflare tunnel wrapper for start.sh
+-- README.md                                   This file
+-- .gitignore                                  Git ignore rules
+-- _redirects                                  Deployment redirects configuration
|
+-- seed/
|   +-- seed.ts                                 Database seed script (7 users, 24 places, reviews)
|
+-- docs/
|   +-- uml/                                    UML diagrams in Markdown and PlantUML formats
|   |   +-- use-case.puml                       Use case diagram (PlantUML source)
|   |   +-- use-case.md                         Use case diagram documentation (98 use cases)
|   |   +-- class-diagram.puml                  Class diagram (PlantUML source)
|   |   +-- class-diagram.md                    Class diagram documentation (13 entities)
|   |   +-- sequence-diagram.puml               Sequence diagram (PlantUML source)
|   |   +-- sequence-diagram.md                 Sequence diagram documentation (7 flows)
|   |   +-- activity-diagram.puml               Activity diagram (PlantUML source)
|   |   +-- activity-diagram.md                 Activity diagram documentation (5 flows)
|   |   +-- erd.puml                            Entity-relationship diagram (PlantUML source)
|   |   +-- erd.md                              ERD documentation (9 collections)
|   |   +-- .obsidian/                          Obsidian vault configuration for diagram editing
|   +-- checklists/                             Per-team-member task checklists
|
+-- TourMate-backend_node.js (2)/
|   +-- TourMate-backend_node.js/
|       +-- package.json                         Backend dependencies and scripts
|       +-- tsconfig.json                        TypeScript configuration
|       +-- .env                                 Environment variables (not committed)
|       +-- docs/
|       |   +-- API.md                           API documentation
|       |   +-- ARCHITECTURE.md                  Architecture documentation
|       |   +-- GRADUATION_BOOK.md               Graduation book content
|       |   +-- PRESENTATION_SCRIPT.md            Presentation script
|       |   +-- uml/                             Additional UML diagram sources
|       +-- src/
|           +-- index.ts                         Express server entry point
|           +-- db/
|           |   +-- db.connection.ts             MongoDB connection setup
|           |   +-- index.ts                     Database barrel export
|           |   +-- models/                      11 Mongoose schemas
|           |   |   +-- user.model.ts            User schema (name, email, password, role, status, timestamps)
|           |   |   +-- guide.model.ts           Guide schema (userId, bio, languages, experience, certificates, availability)
|           |   |   +-- driver.model.ts          Driver schema (userId, license, experience, availability)
|           |   |   +-- vehicle.model.ts         Vehicle schema (driverId, make, model, year, capacity, images)
|           |   |   +-- place.model.ts           Place schema (name, description, location[2dsphere], category, images, rating)
|           |   |   +-- trip.model.ts            Trip schema (userId, places, dates, guide, driver, vehicle, status, cost)
|           |   |   +-- vote.model.ts            Vote schema (userId, tripId, placeId, vote type)
|           |   |   +-- review.model.ts          Review schema (userId, targetId, targetType, rating, comment)
|           |   |   +-- notification.model.ts    Notification schema (userId, type, message, read status, tripId)
|           |   |   +-- lostIem.model.ts         Lost item schema (userId, tripId, description, photo, status)
|           |   |   +-- black-listed-token.model.ts  Blacklisted JWT tokens (TTL index for auto-expiry)
|           |   +-- repo/                        Repository pattern classes
|           |       +-- base.repo.ts             Generic CRUD base repository
|           |       +-- user.repo.ts             User-specific database operations
|           |       +-- guide.repo.ts            Guide-specific database operations
|           |       +-- driver.repo.ts           Driver-specific database operations
|           |       +-- vehicle.repo.ts          Vehicle-specific database operations
|           |       +-- place.repo.ts            Place-specific database operations (includes geospatial queries)
|           |       +-- trip.repo.ts             Trip-specific database operations
|           |       +-- vote.repo.ts             Vote-specific database operations
|           |       +-- review.repo.ts           Review-specific database operations
|           |       +-- notification.repo.ts     Notification-specific database operations
|           |       +-- lostItem.repo.ts         Lost item-specific database operations
|           |       +-- black-listed.repository.ts  Token blacklist database operations
|           +-- middlewares/
|           |   +-- authentication.middleware.ts  JWT verification and user attachment
|           |   +-- authorization.middleware.ts   Role-based access control
|           |   +-- validation.middleware.ts      Zod schema validation
|           |   +-- upload.middlewares.ts         Multer file upload configuration
|           |   +-- index.ts                      Middleware barrel export
|           +-- modules/
|           |   +-- controller.index.ts           Module controller registration
|           |   +-- auth/
|           |   |   +-- auth.controller.ts        Auth HTTP handlers
|           |   |   +-- service/auth.service.ts   Auth business logic (signup, signin, OTP, tokens)
|           |   +-- admin/
|           |   |   +-- admin.controller.ts       Admin HTTP handlers
|           |   |   +-- service/admin.service.ts  Admin business logic (dashboard, users, verifications)
|           |   +-- guide/
|           |   |   +-- guide.controller.ts       Guide HTTP handlers
|           |   |   +-- service/guide.service.ts  Guide business logic
|           |   +-- driver/
|           |   |   +-- driver.controller.ts      Driver HTTP handlers
|           |   |   +-- service/driver.service.ts Driver business logic
|           |   +-- vehicle/
|           |   |   +-- vehicle.controller.ts     Vehicle HTTP handlers
|           |   |   +-- service/vehicle.service.ts Vehicle business logic
|           |   +-- place/
|           |   |   +-- place.controller.ts       Place HTTP handlers
|           |   |   +-- service/place.service.ts  Place business logic
|           |   |   +-- service/place.service.test.ts  Place service unit tests
|           |   |   +-- service/overpass.service.ts Overpass API integration
|           |   +-- trip/
|           |   |   +-- trip.controller.ts        Trip HTTP handlers
|           |   |   +-- service/trip.service.ts   Trip business logic (lifecycle, pricing, sharing)
|           |   +-- vote/
|           |   |   +-- vote.controller.ts        Vote HTTP handlers
|           |   |   +-- service/vote.service.ts   Vote business logic
|           |   +-- review/
|           |   |   +-- review.controller.ts      Review HTTP handlers
|           |   |   +-- service/review.service.ts Review business logic
|           |   +-- notifications/
|           |   |   +-- notification.controller.ts  Notification HTTP handlers
|           |   |   +-- service/nofification.service.ts Notification business logic
|           |   +-- lost_item/
|           |   |   +-- lost_item.controller.ts   Lost item HTTP handlers
|           |   |   +-- service/lost_item.service.ts  Lost item business logic
|           |   +-- location/
|           |   |   +-- location.controller.ts    Location HTTP handlers
|           |   |   +-- location.store.ts         In-memory location data store
|           |   +-- user/
|           |       +-- user.controller.ts        User profile HTTP handlers
|           |       +-- service/user.service.ts   User profile business logic
|           +-- socket/
|           |   +-- index.ts                      Socket.IO server initialization
|           |   +-- socket.ts                     Socket connection event handlers
|           |   +-- sendNotification.ts           Notification push utility
|           +-- common/
|           |   +-- enums/user.enum.ts            User-related enumerations (roles, statuses)
|           |   +-- constants/file.constant.ts    File upload constants
|           |   +-- interfaces/user.interface.ts  User TypeScript interfaces
|           |   +-- interfaces/respone.interface.ts  Standard API response interface
|           |   +-- index.ts                      Common barrel export
|           +-- utils/
|               +-- encryption/
|               |   +-- hash.utils.ts             bcrypt password hashing
|               |   +-- token.utils.ts            JWT sign/verify utilities
|               |   +-- crypro.utils.ts           Additional cryptographic utilities
|               +-- errors/
|               |   +-- exception.utils.ts        Base exception class
|               |   +-- http-exception.utils.ts   HTTP-specific exception classes (400, 401, 403, 404, 500)
|               +-- response/
|               |   +-- respone-helper.utils.ts   Standardized response formatting
|               +-- pagination/
|               |   +-- pagination.utils.ts       Pagination helper (page, limit, skip, sort)
|               +-- services/
|               |   +-- email.utils.ts            Nodemailer email delivery
|               |   +-- cloudinary.service.ts     Cloudinary image upload
|               |   +-- cache.service.ts          In-memory cache for external API responses
|               |   +-- osrm.service.ts           OSRM route calculation
|               |   +-- openroute.service.ts      OpenRouteService integration
|               |   +-- tripPrice.service.ts      Trip cost estimation
|               |   +-- createnotification.service.ts  Notification creation helper
|               +-- index.ts                      Utils barrel export
|
+-- tourmate_frontend/
    +-- tourmate-frontend/
        +-- package.json                          Frontend dependencies and scripts
        +-- angular.json                          Angular workspace configuration
        +-- tsconfig.json                         TypeScript configuration
        +-- tsconfig.app.json                     TypeScript app configuration
        +-- tsconfig.spec.json                    TypeScript test configuration
        +-- .editorconfig                         Editor configuration
        +-- .gitignore                            Frontend git ignore
        +-- README.md                             Frontend-specific documentation
        +-- src/
            +-- index.html                        SPA entry HTML
            +-- main.ts                           Angular bootstrap
            +-- styles.scss                       Global styles and Material theme
            +-- favicon.ico                       Browser tab icon
            +-- assets/
            |   +-- i18n/                         Internationalization translation files
            |       +-- en.json                   English translations
            |       +-- ar.json                   Arabic translations
            |       +-- fr.json                   French translations
            +-- environments/
            |   +-- environment.ts                Development environment config
            |   +-- environment.prod.ts           Production environment config
            +-- app/
                +-- app.module.ts                 Root Angular module
                +-- app-routing.module.ts         Root routing configuration
                +-- app.component.ts              Root component
                +-- app.component.html            Root component template
                +-- app.component.spec.ts         Root component tests
                +-- core/                         Core module (singletons)
                |   +-- models/                   14 TypeScript interfaces
                |   +-- services/                 14 Angular service classes
                |   +-- guards/                   2 route guards (AuthGuard, RoleGuard)
                |   +-- interceptors/             1 HTTP interceptor (JWT auth)
                +-- shared/                       Shared module (reusable components)
                |   +-- components/               5 shared components
                |   +-- pipes/                    1 translation pipe
                +-- features/                     12 lazy-loaded feature modules
                    +-- auth/                     Authentication (login, signup, confirm, reset)
                    +-- home/                     Landing page
                    +-- places/                   Place discovery and management
                    +-- trips/                    Trip builder and management
                    +-- guide/                    Guide features
                    +-- driver/                   Driver features
                    +-- vehicle/                  Vehicle management
                    +-- reviews/                  Review system
                    +-- lost-item/                Lost and found
                    +-- notifications/            Notification inbox
                    +-- admin/                    Admin panel
                    +-- profile/                  User profile
```

---

## API Endpoints

### Authentication (`/auth`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /auth/signup | No | Register a new user account |
| POST | /auth/signin | No | Login with email and password, returns JWT tokens |
| POST | /auth/confirm_email | No | Verify email address with OTP code |
| POST | /auth/send_otp_again | No | Resend email verification OTP |
| POST | /auth/forgot_password | No | Request password reset OTP via email |
| POST | /auth/verify_reset_code | No | Verify password reset OTP code |
| PATCH | /auth/reset_password | No | Set new password after OTP verification |
| POST | /auth/refresh_token | No | Exchange refresh token for new access token |
| PATCH | /auth/change_password | Yes | Change password (requires current password) |
| POST | /auth/logout | Yes | Invalidate current refresh token |
| GET | /auth/me | Yes | Get authenticated user's profile |

### Places (`/place`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /place/create_place | Yes | Create a new place |
| GET | /place/get/:id | Yes | Get place by ID |
| GET | /place/all | Yes | Get paginated list of all places |
| PUT | /place/update/:id | Yes | Update place details |
| DELETE | /place/places/:id | Yes | Delete a place |
| GET | /place/search | Yes | Search places by name, city, or category |
| GET | /place/filter | No | Filter places by city and category (public) |
| GET | /place/nearby | Yes | Get nearby places using geospatial coordinates |
| GET | /place/popular | No | Get highest-rated places (public) |
| POST | /place/save/:id | Yes | Save place to user's favorites |
| DELETE | /place/save/:id | Yes | Remove place from user's favorites |

### Trips (`/trip`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /trip/create_trip | Yes | Create a new trip |
| GET | /trip/get/:id | Yes | Get trip by ID |
| GET | /trip/all | Yes | Get paginated list of all trips |
| GET | /trip/my_trips | Yes | Get current user's trips |
| PATCH | /trip/:id/update | Yes | Update trip details |
| PATCH | /trip/:id/cancel | Yes | Cancel a trip |
| PATCH | /trip/:id/join | Yes | Join a shared trip |
| PATCH | /trip/:id/share | Yes | Share trip with other users |
| POST | /trip/:id/duplicate | Yes | Duplicate an existing trip |
| DELETE | /trip/:id/delete | Yes | Delete a trip |
| PATCH | /trip/:id/assign-guide | Yes | Assign a guide to the trip |
| PATCH | /trip/:id/assign-driver | Yes | Assign a driver to the trip |
| PATCH | /trip/:id/assign-vehicle | Yes | Assign a vehicle to the trip |
| PATCH | /trip/:id/start | Yes | Start the trip (status to ongoing) |
| PATCH | /trip/:id/complete | Yes | Complete the trip |
| POST | /trip/calculate-price | Yes | Estimate trip cost |
| GET | /trip/:id/route | Yes | Get trip route path |
| GET | /trip/shared | Yes | Get all shared trips |

### Guides (`/guide`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /guide/create_guide | Yes | Register as a guide |
| PATCH | /guide/update/:id | Yes | Update guide profile |
| DELETE | /guide/delete/:id | Yes | Delete guide profile |
| GET | /guide/get/:id | No | Get guide by ID (public) |
| GET | /guide/all | No | Get all guides (public) |
| GET | /guide/search | No | Search guides by criteria (public) |
| PATCH | /guide/update-availability/:id | Yes | Toggle guide availability |
| POST | /guide/upload-certificate/:id | Yes | Upload qualification certificate |
| DELETE | /guide/delete-certificate/:id | Yes | Delete certificate |

### Drivers (`/driver`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /driver/create_driver | Yes | Register as a driver |
| PATCH | /driver/update/:id | Yes | Update driver profile |
| DELETE | /driver/delete/:id | Yes | Delete driver profile |
| GET | /driver/get/:id | No | Get driver by ID (public) |
| GET | /driver/all | No | Get all drivers (public) |
| POST | /driver/search | No | Search drivers by criteria (public) |
| PATCH | /driver/update-availability/:id | Yes | Toggle driver availability |

### Vehicles (`/vehicle`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /vehicle/create_vehicle | Yes | Register a vehicle |
| PATCH | /vehicle/update/:id | Yes | Update vehicle details |
| DELETE | /vehicle/delete/:id | Yes | Delete vehicle |
| GET | /vehicle/get/:id | No | Get vehicle by ID (public) |
| GET | /vehicle/all | No | Get all vehicles (public) |
| GET | /vehicle/search | No | Search vehicles (public) |
| GET | /vehicle/driver/:driverId | No | Get driver's vehicles (public) |
| POST | /vehicle/upload-images/:id | Yes | Upload vehicle photos |
| DELETE | /vehicle/delete-image/:id | Yes | Delete vehicle photo |

### Reviews (`/review`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /review/create_review | Yes | Submit a review |
| GET | /review/all | Yes | Get paginated list of all reviews |
| GET | /review/get/:id | Yes | Get review by ID |
| PATCH | /review/:id/update | Yes | Update own review |
| DELETE | /review/:id/delete | Yes | Delete own review |
| GET | /review/:tripId/reviews | Yes | Get reviews for a trip |
| GET | /review/:placeId/place_reviews | Yes | Get reviews for a place |
| GET | /review/guide/:guideId | Yes | Get reviews for a guide |
| GET | /review/driver/:driverId | Yes | Get reviews for a driver |
| GET | /review/my-reviews | Yes | Get current user's reviews |

### Votes (`/vote`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /vote/create_vote | Yes | Vote on a place in a trip |
| PATCH | /vote/:id/update | Yes | Change existing vote |
| DELETE | /vote/:id/delete | Yes | Remove vote |
| GET | /vote/:tripId/place/:placeId | Yes | Get votes for a place in a trip |
| GET | /vote/user | Yes | Get current user's votes |

### Notifications (`/notifications`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | /notifications/notifications | Yes | List user's notifications |
| GET | /notifications/get/:id | Yes | Get notification by ID |
| GET | /notifications/unread-count | Yes | Get unread notification count |
| POST | /notifications/create | Yes | Create a notification |
| PATCH | /notifications/:id/mark-as-read | Yes | Mark notification as read |
| PATCH | /notifications/mark-all-as-read | Yes | Mark all notifications as read |
| DELETE | /notifications/:id/delete | Yes | Delete a notification |
| DELETE | /notifications/delete-all | Yes | Delete all notifications |

### Lost Items (`/lost_item`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /lost_item/create_lost_item | Yes | Report a lost item |
| GET | /lost_item/get/:id | Yes | Get lost item by ID |
| GET | /lost_item/:tripId/trip_lost_items | Yes | Get trip's lost items |
| GET | /lost_item/my_lost_items | Yes | Get user's lost items |
| PATCH | /lost_item/:id/update | Yes | Update lost item details |
| PATCH | /lost_item/:id/status | Yes | Update lost item status |
| DELETE | /lost_item/:id/delete | Yes | Delete lost item record |
| PATCH | /lost_item/:id/report-found | Yes | Report item as found |
| PATCH | /lost_item/:id/close | Yes | Close lost item case |
| PATCH | /lost_item/:id/reopen | Yes | Reopen closed case |

### Location (`/location`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | /location/update | Yes (Driver) | Update driver's GPS location |
| GET | /location/driver/:driverId | Yes | Poll driver's current location |
| GET | /location/trip/:tripId | Yes | Get trip's location data |

### Admin (`/admin`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | /admin/dashboard | Yes (Admin) | System statistics overview |
| GET | /admin/system-statistics | Yes (Admin) | Detailed system metrics |
| GET | /admin/users | Yes (Admin) | List all users |
| GET | /admin/pending-guides | Yes (Admin) | List unverified guides |
| GET | /admin/pending-drivers | Yes (Admin) | List unverified drivers |
| GET | /admin/reports | Yes (Admin) | System reports |
| PATCH | /admin/:id/role | Yes (Admin) | Change user role |
| PATCH | /admin/:id/status | Yes (Admin) | Block or unblock user |
| DELETE | /admin/:id/delete | Yes (Admin) | Delete user account |
| DELETE | /admin/trip/:id/delete | Yes (Admin) | Delete a trip |
| PATCH | /admin/driver/:id/verification-status | Yes (Admin) | Verify or reject driver |
| PATCH | /admin/guide/:id/verification-status | Yes (Admin) | Verify or reject guide |
| PATCH | /admin/trip/:id/assign-resources | Yes (Admin) | Assign resources to trip |
| PATCH | /admin/trip/:id/status | Yes (Admin) | Update trip status |
| PATCH | /admin/trip/:id/confirm-payment | Yes (Admin) | Confirm trip payment |

### User (`/user`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | /user/current_user_id | Yes | Get logged-in user's complete profile |
| GET | /user/:id | Yes | Get user by ID |
| PUT | /user/update_user | Yes | Update own profile |
| POST | /user/profile_image | Yes | Upload profile picture |
| DELETE | /user/delete_image | Yes | Delete profile picture |
| DELETE | /user/delete_account | Yes | Delete own account (cascade) |

---

## UML Diagrams

All UML diagrams are available in Markdown format in `docs/uml/`. Both PlantUML source files (.puml) and rendered Markdown documentation (.md) are provided.

| Diagram | File | Description |
|---|---|---|
| Use Case | `docs/uml/use-case.md` | 98 use cases across 8 actor groups with complete relationships, extensions, and include/exclude dependencies |
| Class Diagram | `docs/uml/class-diagram.md` | 13 entity classes, 7 architectural packages, all fields, methods, enumerations, and relationships with cardinality |
| Sequence Diagram | `docs/uml/sequence-diagram.md` | 7 interaction flows: Login/Signup, Trip Creation, Group Voting, Real-Time Location Tracking, Review Submission, Lost & Found Lifecycle, Admin Resource Assignment |
| Activity Diagram | `docs/uml/activity-diagram.md` | 5 workflow flows: User Registration, Complete Trip Lifecycle (Create -> Start -> Complete), Driver Location Tracking, Lost Item Reporting, Admin Resource Management |
| Entity-Relationship | `docs/uml/erd.md` | 9 database collections with complete schema, field types, indexes (including 2dsphere geospatial), constraints, TTL expiration, and referential integrity map |

### Use Case Diagram Summary
- **Actors:** Tourist, Guide, Driver, Admin (primary), plus Email System, Payment Gateway, Map Service, Notification System (secondary)
- **Tourist Use Cases (28):** Register, Login, Verify Email, Reset Password, Search Places, Filter Places, View Place Details, Save Place, Create Trip, Update Trip, Cancel Trip, Share Trip, Join Shared Trip, Vote on Place, Submit Review, View Trip Details, Track Driver, Report Lost Item, View Notifications, Manage Profile, Upload Photo, Change Password, Delete Account, View Saved Places, View Trip History, Filter by City, Filter by Category, View Popular Places
- **Guide Use Cases (12):** Register as Guide, Update Profile, Upload Certificate, Delete Certificate, Toggle Availability, View Assignments, Accept Trip, Complete Trip, View Reviews, Respond to Review, View Schedule, Manage Languages
- **Driver Use Cases (10):** Register as Driver, Update Profile, Manage Vehicles, Toggle Availability, Send Location, View Assignments, Accept Trip, Complete Trip, View History, Upload Vehicle Photos
- **Admin Use Cases (18):** View Dashboard, View System Stats, List Users, Search Users, Change User Role, Block User, Unblock User, Delete User, View Pending Guides, Verify Guide, Reject Guide, View Pending Drivers, Verify Driver, Reject Driver, View All Trips, Assign Resources, Confirm Payment, Delete Trip

### Class Diagram Summary
- **Packages:** Auth, User, Trip, Place, Guide, Driver, Notification
- **Key Entities:** User (base), Tourist, Guide, Driver, Admin (roles), Trip, Place, Vehicle, Review, Vote, Notification, LostItem, BlacklistedToken
- **Relationships:** User 1->* Trip, Trip *->* Place, Trip 1->1 Guide, Trip 1->1 Driver, Driver 1->* Vehicle, User 1->* Review, User 1->* Vote, Trip 1->* Review, Trip 1->* Vote, Trip 1->* LostItem, User 1->* Notification, User 1->* BlacklistedToken

### Sequence Diagram Flows
1. **Login Flow:** User -> Login Form -> AuthController -> AuthService -> UserRepository -> MongoDB -> JWT Token -> Response -> Browser stores token -> Redirect to Dashboard
2. **Trip Creation Flow:** User -> Trip Builder -> TripController -> TripService -> PlaceRepository -> UserRepository -> TripRepository -> MongoDB -> NotificationService -> Socket.IO -> Response -> Trip Detail Page
3. **Voting Flow:** User -> Trip Detail -> VoteController -> VoteService -> TripRepository -> VoteRepository -> MongoDB -> Updated Vote Counts -> UI Updates
4. **Location Tracking Flow:** Driver -> Location Update Button -> LocationController -> LocationStore (Memory) -> Tourist -> Polling Service -> LocationController -> LocationStore -> Current Position -> Map Update
5. **Review Flow:** User -> Review Form -> ReviewController -> ReviewService -> ReviewRepository -> MongoDB -> Trip Average Rating Recalculation -> Response -> Updated Reviews List
6. **Lost and Found Flow:** User -> Report Lost Item -> LostItemController -> LostItemService -> LostItemRepository -> MongoDB -> Notification to Trip Members -> Status Tracking -> Close/Reopen
7. **Admin Resource Assignment:** Admin -> Trip Management -> AdminController -> AdminService -> TripRepository -> GuideRepository -> DriverRepository -> VehicleRepository -> MongoDB -> Trip Updated -> Notification to Assigned Users

---

## Database Schema

### Collections Overview

| Collection | Document Count (Seeded) | Key Indexes | Description |
|---|---|---|---|
| users | 7 | email (unique) | User accounts with role, status, auth fields |
| guides | 2 | userId (unique), languages (text) | Guide profiles with certificates |
| drivers | 2 | userId (unique) | Driver profiles with license info |
| vehicles | 3 | driverId | Vehicle details with images |
| places | 24 | location (2dsphere), name (text), city+catergory (compound) | Points of interest |
| trips | 0 (created by users) | userId, status | Trip itineraries with lifecycle |
| votes | 0 | userId+tripId+placeId (compound unique) | Place votes within trips |
| reviews | 5 | targetId+targetType (compound) | Ratings and comments |
| notifications | 0 | userId, createdAt (-1) | User notifications |
| lost_items | 0 | tripId | Lost item reports |
| blacklisted_tokens | 0 | token (unique), expiresAt (TTL) | Invalidated JWT tokens |

### User Schema
```
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed),
  role: Enum [tourist, guide, driver, admin] (default: tourist),
  status: Enum [active, blocked] (default: active),
  emailConfirmed: Boolean (default: false),
  confirmEmailOTP: String,
  confirmEmailExpires: Date,
  passwordResetOTP: String,
  passwordResetExpires: Date,
  profileImage: String (URL),
  gender: Enum [male, female],
  phone: String,
  address: String,
  favoritePlaces: [ObjectId] (references Place),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Place Schema
```
{
  _id: ObjectId,
  name: String (required),
  description: String,
  location: {
    type: Point (2dsphere index),
    coordinates: [longitude, latitude],
    address: String
  },
  category: Enum [historical, museum, park, beach, restaurant, hotel, shopping, entertainment, religious, natural],
  city: String,
  images: [String] (Cloudinary URLs),
  operatingHours: String,
  priceRange: String,
  contactPhone: String,
  website: String,
  averageRating: Number (default: 0),
  ratingCount: Number (default: 0),
  createdBy: ObjectId (references User),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Trip Schema
```
{
  _id: ObjectId,
  userId: ObjectId (references User, required),
  name: String (required),
  description: String,
  places: [{
    placeId: ObjectId (references Place),
    order: Number,
    day: Number
  }],
  startDate: Date (required),
  endDate: Date (required),
  status: Enum [pending, confirmed, ongoing, completed, cancelled] (default: pending),
  guideId: ObjectId (references Guide),
  driverId: ObjectId (references Driver),
  vehicleId: ObjectId (references Vehicle),
  isShared: Boolean (default: false),
  sharedWith: [ObjectId] (references User),
  totalCost: Number,
  isPaid: Boolean (default: false),
  routePath: [{
    lat: Number,
    lng: Number
  }],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Guide Schema
```
{
  _id: ObjectId,
  userId: ObjectId (references User, unique, required),
  bio: String,
  languages: [String],
  yearsOfExperience: Number,
  certificates: [{
    url: String (Cloudinary URL),
    name: String,
    uploadedAt: Date
  }],
  isVerified: Boolean (default: false),
  isAvailable: Boolean (default: true),
  averageRating: Number (default: 0),
  ratingCount: Number (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Vehicle Schema
```
{
  _id: ObjectId,
  driverId: ObjectId (references Driver, required),
  make: String (required),
  model: String (required),
  year: Number,
  color: String,
  capacity: Number (required),
  licensePlate: String (required),
  images: [String] (Cloudinary URLs),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Notification Schema (with TTL)
```
{
  _id: ObjectId,
  userId: ObjectId (references User, required),
  type: Enum [booking, trip_update, verification, review, system],
  title: String,
  message: String,
  tripId: ObjectId (references Trip),
  isRead: Boolean (default: false),
  createdAt: Date (auto, TTL index: 30 days auto-delete)
}
```

---

## Authentication Flow

### Registration Flow
1. User submits registration form (name, email, password)
2. Server validates input (email format, password strength, required fields)
3. Server checks for existing user with same email
4. Password is hashed using bcrypt (10 salt rounds)
5. User document is created in MongoDB with status active and emailConfirmed false
6. OTP code is generated (6-digit random number with 10-minute expiry)
7. OTP is sent to user's email via Nodemailer/SMTP
8. User receives email and enters OTP on confirmation page
9. Server verifies OTP matches and has not expired
10. emailConfirmed set to true
11. User can now log in

### Login Flow
1. User submits email and password
2. Server looks up user by email in MongoDB
3. If not found, returns 401 Unauthorized
4. Server compares password hash using bcrypt.compare
5. If mismatch, returns 401 Unauthorized
6. Server checks if email is confirmed; if not, returns 403 with instruction to verify
7. Server checks if user is blocked; if blocked, returns 403 Forbidden
8. Access token is generated (JWT with userId, role, expires in 15 minutes)
9. Refresh token is generated (JWT with userId, expires in 7 days)
10. Both tokens are returned to client
11. Client stores tokens (access in memory, refresh in localStorage)
12. Auth interceptor attaches access token to all subsequent requests

### Token Refresh Flow
1. Client receives 401 response (access token expired)
2. Auth interceptor catches the 401 before it reaches the component
3. Interceptor calls POST /auth/refresh_token with the refresh token
4. Server verifies refresh token signature and expiry
5. Server checks refresh token against blacklist
6. New access token is generated and returned
7. Interceptor retries the original request with new access token
8. If refresh also fails, user is redirected to login

### Password Reset Flow
1. User clicks "Forgot Password" and enters email
2. Server checks if email exists in database
3. OTP code is generated (6-digit, 10-minute expiry)
4. OTP is sent to user's email
5. User enters OTP on verification page
6. Server verifies OTP
7. User is prompted to enter new password
8. Password is hashed and updated in database
9. All existing sessions remain valid (or optionally invalidate all)

### Role-Based Authorization
1. Each route specifies required role(s) in its route definition
2. After authentication middleware verifies JWT, authorization middleware checks user.role
3. If role does not match, returns 403 Forbidden
4. Admin routes require role === 'admin'
5. Driver-specific routes require role === 'driver'
6. Guide-specific routes require role === 'guide'
7. Some routes are accessible by multiple roles
8. Some routes check ownership (user can only modify own resources)

---

## Real-Time Architecture

### Socket.IO Integration

The real-time notification system uses Socket.IO for WebSocket-based bidirectional communication.

**Server Setup (socket/index.ts):**
- Socket.IO server is initialized with the HTTP server
- CORS is configured to allow the Angular frontend origin
- Connection events are handled in socket.ts
- Each connected client is associated with a userId (sent during connection handshake)
- Clients join a room named after their userId for targeted notifications

**Client Setup (SocketService):**
- SocketService connects when user logs in (or at app bootstrap if valid token exists)
- Connection is authenticated by passing the JWT token as a query parameter
- Service listens for 'new-notification' events
- On receiving a notification, it updates the notification badge count
- It also emits an event to show a toast notification in the navbar
- Socket disconnects on logout

**Notification Flow:**
1. An event occurs (trip created, guide assigned, review submitted)
2. Backend service calls createNotification utility
3. Notification document is saved to MongoDB
4. Socket.IO emits 'new-notification' event to the target user's room
5. Angular client receives the event and updates UI in real-time

### Location Tracking (Polling)

Driver location tracking uses HTTP polling rather than WebSockets for simplicity and firewall compatibility.

**Driver Side:**
- Driver's vehicle sends GPS coordinates via POST /location/update every 10 seconds
- Server stores latest position in-memory (LocationStore) associated with driverId
- No database write for performance (positions are ephemeral)

**Tourist Side:**
- Client polls GET /location/driver/:driverId every 5 seconds
- Returns latest known position from in-memory store
- Leaflet map marker is updated with new position
- Map auto-centers on the marker if it hasn't been manually moved

**Advantages of Polling over WebSockets:**
- No persistent connection needed (works through restrictive firewalls)
- Simpler server infrastructure (no sticky sessions)
- Easier to debug and test
- Adequate for the 5-10 second update frequency requirement

---

## Tunneling (Remote Access)

For remote demo access without deploying to a cloud provider, TourMate supports two tunneling methods:

### 1. Cloudflare Tunnel (trycloudflare.com) - Primary Method

```bash
bash start.sh --tunnel
# Or
bash start-cloudflare.sh
```

- Zero configuration (no Cloudflare account or domain needed)
- Uses Cloudflared CLI to create a secure tunnel
- Generates a random subdomain at trycloudflare.com
- Auto-fallback to SSH tunnel if Cloudflare rate-limits the request
- DNS propagation wait: up to 30 seconds after tunnel creation
- HTTPS support (no mixed content warnings with relative API URLs)

### 2. localhost.run SSH Tunnel - Fallback Method

- Activated automatically when Cloudflare is unavailable
- Uses SSH reverse tunnel command: `ssh -R 80:localhost:3000 localhost.run`
- Creates a public URL like `https://<random-id>.localhost.run`
- No captcha required
- HTTP 200 guaranteed
- Different lifecycle management (persists until SSH connection drops)

### How It Works in start.sh

1. Script checks if --tunnel flag is passed
2. Tries Cloudflare tunnel first (cloudflared tunnel --url http://localhost:3000)
3. Runs in background and captures the tunnel URL from output
4. Waits for DNS propagation (30 seconds)
5. Tests the tunnel URL with an HTTP request
6. If Cloudflare fails, falls back to SSH tunnel (localhost.run)
7. Displays the tunnel URL for sharing with presentation audience
8. Tunnel runs in background until script is stopped

---

## Testing

### Automated Endpoint Tests

The `start.sh` script includes an automated test suite that runs after server startup. The tests verify:

```bash
bash start.sh --seed
```

The test suite covers:

#### SPA Route Tests
- All Angular frontend routes return HTTP 200 (index.html served for all routes)
- Verifies client-side routing works correctly

#### Public Endpoint Tests
- POST /auth/signup - User registration (expects 200)
- POST /auth/signin - User login (expects 200)
- GET /place/filter - Public place filtering (expects 200)
- GET /place/popular - Popular places (expects 200)

#### Authenticated Endpoint Tests
- POST /auth/signin - Log in and capture JWT token
- GET /auth/me - Get current user with valid token (expects 200)
- GET /place/all - Get all places with auth (expects 200)
- GET /place/search - Search places with auth (expects 200)
- GET /trip/my_trips - Get user's trips with auth (expects 200)
- GET /guide/all - Get all guides (public, expects 200)
- GET /driver/all - Get all drivers (public, expects 200)

#### Protected Route Tests
- GET /place/all without token - Verify 401 response
- GET /auth/me without token - Verify 401 response
- GET /place/search without token - Verify 401 response
- GET /place/get/:id without token - Verify 401 response

#### Admin Tests
- Sign in as admin
- Access admin dashboard (expects 200)
- Access admin users (expects 200)
- Access pending guides (expects 200)

### Manual Testing

Each team member performed comprehensive manual testing on their assigned modules:

| Test Category | Details |
|---|---|
| Cross-Browser Testing | Chrome, Firefox, Edge |
| Mobile Responsiveness | Viewport sizes, touch interactions, navigation |
| Edge Cases | Vehicle capacity limits, date conflicts, duplicate votes, empty states |
| Form Validation | Required fields, email format, password strength, file upload limits |
| Error Handling | Server errors, network errors, timeout handling |
| Authentication | Token expiry, refresh flow, unauthorized access, role enforcement |
| Data Integrity | Create, read, update, delete operations on all entities |
| Real-Time Features | Notification delivery, Socket.IO connection/disconnection |

---

## Deployment

### Current Status: Local-Only Development Server

The application is currently designed for local deployment with optional tunneling for remote demonstrations.

#### What Is Deployed:
- Local development server (Express 5 on port 3000)
- Angular production build served from Express static files
- Quick tunnels for remote demos (Cloudflare / localhost.run)

#### What Is NOT Yet Deployed:
- Docker containerization (not implemented)
- CI/CD pipeline (not implemented)
- Cloud infrastructure deployment (not implemented)
- Production domain or SSL certificate (not configured)

### Planned Deployment Options

#### Option 1: Docker (Planned)
```bash
# TODO: Create Dockerfile for backend
docker build -t tourmate-backend -f Dockerfile.backend .
docker run -p 3000:3000 --env-file .env tourmate-backend

# TODO: Create Docker Compose for full stack
docker-compose up -d
```

#### Option 2: Cloud Deployment (Render)
1. Push code to GitHub
2. Create a Web Service on Render pointing to the backend
3. Set environment variables in Render dashboard
4. Configure static file serving for Angular production build
5. Enable auto-deploy from GitHub

#### Option 3: Cloud Deployment (Vercel + MongoDB Atlas)
1. Deploy Angular frontend to Vercel
2. Configure serverless functions or deploy Express on another platform
3. Use MongoDB Atlas for cloud database
4. Configure environment variables in both platforms

---

## Graduation Book Chapters

| Chapter Number | Title | Author | Status |
|---|---|---|---|
| 1 | Introduction - Problem statement, objectives, scope, and methodology | Ahmed Abo Bakr | Complete |
| 2 | System Architecture - High-level architecture, technology choices, design patterns | Ahmed Abo Bakr | Complete |
| 3 | Database Design - Entity-relationship model, schema design, indexing strategy | Jamal | Complete |
| 4 | Backend Implementation - API design, authentication, business logic, integrations | Jamal | Complete |
| 5 | Frontend Implementation - Component architecture, state management, routing, services | Bavly | Complete |
| 6 | UI/UX Design - Design system, responsive layouts, user flows, accessibility | Bavly | Complete |
| 7 | System Testing and Quality Assurance - Test plan, test cases, automated testing, results | Mai | Complete |
| 8 | Conclusion - Summary, challenges faced, lessons learned, future work | Ramadan | Complete |

---

## Contributing

This is a graduation project developed by a team of five students at the Faculty of Computer Science, Helwan University. Contributions are currently closed to external collaborators.

### Internal Team Workflow

1. Each team member works on their assigned modules in their own feature branch
2. The branch naming convention is `<member-name>/<feature-name>` or just `<member-name>`
3. Code is reviewed by the team lead (Ahmed) before integration
4. All UML diagrams and architecture decisions are centralized and reviewed by the full team
5. The main branch represents the integrated, working version of the project
6. Backend and frontend are developed in parallel with clear API contracts

### Git Branch Strategy

| Branch | Purpose | Owner |
|---|---|---|
| main | Integrated, working version of the full project | Team |
| Ahmed | Ahmed's scoped work (architecture, admin, guide, driver, vehicle, docs) | Ahmed Abo Bakr |
| Jamal | Jamal's scoped work (auth backend, user management, database) | Jamal |
| bavly-branch | Bavly's scoped work (tourist frontend, maps, trip builder) | Bavly |
| mai | Mai's scoped work (notifications, lost items, admin frontend, QA) | Mai |
| mai-notification | Mai's notification-specific feature branch | Mai |
| Ramadan | Ramadan's scoped work (places, shared UI, reviews, docs) | Ramadan |
| backend_node.js | Backend development branch | Team |
| meanstack/jamal-integration | Integration branch for Jamal's backend work | Jamal |

---

## License

This project is developed for educational purposes as a graduation requirement for the Faculty of Computer Science, Helwan University.

All rights reserved (c) 2026 TourMate Team.

The source code is made publicly available on GitHub for academic review and evaluation purposes. Commercial use, redistribution, or modification without explicit permission from the team is not permitted.

---

## Acknowledgments

- **Faculty of Computer Science, Helwan University** - For guidance and academic support throughout the project lifecycle.
- **Project Supervisors** - For their valuable feedback and direction.
- **Open Source Community** - For the libraries and tools that made this project possible: Angular, Express, MongoDB, Mongoose, Socket.IO, Leaflet.js, and many others.

---

<p align="center">
  <strong>TourMate</strong> - Making Travel Smarter, Together
</p>
<p align="center">
  Faculty of Computer Science - Helwan University
</p>
<p align="center">
  Graduation Project 2026
</p>
