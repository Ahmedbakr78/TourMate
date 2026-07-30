# System Architecture Document

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │              Angular 16 SPA (Lazy-Loaded Modules)              │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐  │  │
│  │  │ Auth │ │Admin │ │Trips │ │Places│ │Driver│ │  Review   │  │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────────┘  │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐  │  │
│  │  │Guide │ │Vehicle│ │Lost  │ │Notif │ │Profile│ │   Home   │  │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                             │                                       │
│                    HTTP / Socket.IO                                  │
│                             ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                 EXPRESS 5 SERVER (Node.js)                    │  │
│  │                                                               │  │
│  │  ┌──────────┐ ┌───────────┐ ┌────────────┐ ┌──────────────┐  │  │
│  │  │  Helmet  │ │  CORS     │ │Compression │ │   Express    │  │  │
│  │  │ Security │ │  Policy   │ │  Middleware │ │  JSON Parser │  │  │
│  │  └──────────┘ └───────────┘ └────────────┘ └──────────────┘  │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │                 ROUTER LAYER                              │  │  │
│  │  │  /auth  /admin  /user  /driver  /guide  /vehicle         │  │  │
│  │  │  /trip  /vote   /place  /review  /lost_item  /notif      │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │            CONTROLLER → SERVICE  LAYER                   │  │  │
│  │  │    (Business logic, orchestration, validation)            │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │            REPOSITORY LAYER (Data Access)                 │  │  │
│  │  │   Base CRUD + module-specific queries + pagination        │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                             │                                       │
│                             ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    MONGODB DATABASE                            │  │
│  │  11 Collections: Users, Drivers, Guides, Vehicles, Trips,     │  │
│  │  Places, Reviews, Votes, LostItems, Notifications, BlackTokens│  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  EXTERNAL INTEGRATIONS                                        │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────┐             │  │
│  │  │ Cloudinary │  │ Overpass API │  │   OSRM   │             │  │
│  │  │ Image CDN  │  │ OSM Places  │  │  Routing │             │  │
│  │  └────────────┘  └──────────────┘  └──────────┘             │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Backend Architecture

The backend follows a **Controller-Service-Repository** pattern with clear separation of concerns:

### Layer Responsibilities

**Controller Layer** (`src/modules/*/*.controller.ts`)
- Defines Express router with endpoint routes
- Applies middleware (authentication, authorization, file upload)
- Delegates request handling to service layer
- Each module has its own controller file

**Service Layer** (`src/modules/*/service/*.service.ts`)
- Contains all business logic
- Orchestrates data from multiple repositories
- Handles validation, transformation, and error handling
- Communicates with external APIs (Cloudinary, Overpass, OSRM)
- Sends notifications via the notification service

**Repository Layer** (`src/db/repo/*.repo.ts`)
- Generic base repository with standard CRUD operations
- Module-specific repositories extending the base
- Handles MongoDB query building with pagination support
- Uses `mongoose-paginate-v2` for all list endpoints

### Middleware Stack (applied globally)

| Middleware | Purpose |
|-----------|---------|
| `cors()` | Cross-origin resource sharing (all origins during development) |
| `helmet({ contentSecurityPolicy: false })` | HTTP security headers (CSP disabled for SPA) |
| `compression()` | Gzip response compression |
| `express.json()` | JSON body parsing |

### Custom Middleware

| Middleware | File | Purpose |
|-----------|------|---------|
| Authentication | `authentication.middleware.ts` | Verifies JWT, checks blacklist, loads user |
| Authorization | `authorization.middleware.ts` | Role-based access control (admin/driver/guide/tourist) |
| Upload | `upload.middlewares.ts` | Multer + Cloudinary integration |
| Validation | `validation.middleware.ts` | Zod schema validation |

### Error Handling

A global error handler at the Express app level catches all errors:
- Custom `httpException` class with status code + message
- Returns uniform JSON error response `{ status, message, error, statusCode }`
- Unhandled errors fall through to 500 Internal Server Error

## Frontend Architecture

### Module Structure

The Angular frontend uses **lazy-loaded feature modules** with `PreloadAllModules` strategy:

```
AppModule
├── SharedModule         (Navbar, Map, Loading, ConfirmDialog — eagerly loaded)
├── HomeComponent        (Landing page — eagerly loaded)
│
├── AuthModule           (Login, Signup, ConfirmEmail, ForgotPassword, ResetPassword)
├── AdminModule          (Dashboard, UserManagement, Verifications, TripManagement)
├── TripsModule          (TripBuilder, TripDetail, MyTrips)
├── PlacesModule         (PlaceList, PlaceDetail, PlaceForm)
├── DriverModule         (DriverOnboarding, DriverList)
├── GuideModule          (GuideOnboarding, GuideList)
├── VehicleModule        (VehicleForm, VehicleList)
├── LostItemModule       (LostItemList)
├── NotificationsModule  (NotificationList)
└── ProfileModule        (UserProfile)
```

### Core Services

| Service | Responsibility |
|---------|---------------|
| `AuthService` | Login state, current user observable, token management |
| `TokenStorageService` | JWT persistence in localStorage |
| `SocketService` | Socket.IO connection, real-time notification stream |
| `NotificationService` | Notification CRUD API calls |
| `TripService` / `PlaceService` / etc. | Per-module HTTP service wrappers |

### State Management

- **User state**: `AuthService` holds a `BehaviorSubject<IUser | null>` that drives the navbar and guards
- **Token refresh**: On app bootstrap, `APP_INITIALIZER` fetches `/user/current_user_id` if a valid token exists
- **Real-time notifications**: `SocketService.newNotification$` Subject pushes new notifications to the navbar

### Routing & Guards

| Guard | Purpose |
|-------|---------|
| `AuthGuard` | Prevents access to authenticated routes without valid JWT |
| `RoleGuard` | Restricts routes by user role (e.g., admin-only pages) |

### UI Framework

- **Angular Material** 16 — all components use Material Design (cards, tables, dialogs, snack-bars, buttons)
- **Leaflet** — interactive maps for place discovery, trip routes, and driver locations
- **Responsive** — SCSS with breakpoints for mobile and desktop

## Database Design

### Collections (11)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Users ──┬──► Drivers (1:1 via userId)                                     │
│           │    ├── licenseNumber (unique)                                   │
│           │    ├── currentLocation (2dsphere index)                         │
│           │    ├── verificationStatus (pending/approved/rejected)            │
│           │    └── availability (boolean)                                   │
│           │                                                                 │
│           ├──► Guides (1:1 via userId)                                     │
│           │    ├── languages (string[])                                     │
│           │    ├── certificate (Cloudinary ref)                             │
│           │    ├── verificationStatus (pending/approved/rejected)            │
│           │    └── availability (boolean)                                   │
│           │                                                                 │
│           ├──► Trips (1:N via touristId)                                   │
│           │    ├── places (ObjectId[] → Place)                             │
│           │    ├── guideId / driverId / vehicleId (nullable)                │
│           │    ├── startDate / endDate / price / peopleCount                │
│           │    ├── status (active/pending/confirmed/ongoing/completed/cancelled│
│           │    ├── routePath ([[lng,lat]])                                  │
│           │    ├── sharedTripId (self-ref for sharing)                     │
│           │    └── isPaid (boolean)                                         │
│           │                                                                 │
│           ├──► Reviews (1:N via touristId)                                 │
│           │    ├── tripId / driverId / guideId / placeId (polymorphic)     │
│           │    └── rating (1-5) + comment                                  │
│           │                                                                 │
│           ├──► Votes (1:N via userId)                                      │
│           │    ├── tripId + placeId + userId (compound unique index)       │
│           │    └── voteValue (like/dislike)                                 │
│           │                                                                 │
│           ├──► LostItems (1:N via userId)                                  │
│           │    ├── tripId / title / description / image                    │
│           │    └── status (pending/found/closed)                           │
│           │                                                                 │
│           ├──► Notifications (1:N via receiverId)                         │
│           │    ├── senderId / title / message / isRead                     │
│           │    └── timestamps                                              │
│           │                                                                 │
│           └──► BlackListedTokens (TTL index on expiresAt)                  │
│                                                                              │
│  Drivers ──┬──► Vehicles (1:N via driverId)                                │
│             │    ├── brand / vehicleModel / capacity / plateNumber (unique) │
│             │    └── carImages (Cloudinary ref[])                           │
│                                                                              │
│  Places (2dsphere index on coordinates)                                     │
│      ├── osmId (unique), name, city, category, description                 │
│      ├── coordinates (GeoJSON Point)                                        │
│      └── averageRating / reviewsCount                                       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Indexing Strategy

| Collection | Index | Purpose |
|-----------|-------|---------|
| Places | `{ coordinates: "2dsphere" }` | Geospatial nearby queries |
| Drivers | `{ currentLocation: "2dsphere" }` | Nearby driver search |
| Votes | `{ tripId: 1, placeId: 1, userId: 1 }` (unique) | One vote per user per trip-place |
| BlackListedTokens | `{ expiresAt: 1 }` (TTL) | Auto-delete expired tokens |
| Users | `{ email: 1 }` (unique) | Login lookup |
| Users | `{ phone: 1 }` (unique) | Duplicate prevention |
| Drivers | `{ licenseNumber: 1 }` (unique) | License uniqueness |
| Vehicles | `{ plateNumber: 1 }` (unique) | Plate uniqueness |

## Authentication Flow

```
┌──────┐          ┌──────────────┐          ┌───────────┐          ┌──────────┐
│ User │          │  Controller  │          │  Service   │          │ MongoDB  │
└──┬───┘          └──────┬───────┘          └─────┬─────┘          └────┬─────┘
   │                     │                        │                     │
   │  POST /auth/signup  │                        │                     │
   │────────────────────▶│                        │                     │
   │                     │  Hash password(bcrypt) │                     │
   │                     │───────────────────────▶│                     │
   │                     │                        │  Create User Doc    │
   │                     │                        │────────────────────▶│
   │                     │                        │◀────────────────────│
   │                     │  Generate OTP + Send   │                     │
   │                     │  Email (Nodemailer)    │                     │
   │                     │◀───────────────────────│                     │
   │◀────────────────────│                        │                     │
   │                     │                        │                     │
   │  POST /auth/confirm_email                    │                     │
   │────────────────────▶│                        │                     │
   │                     │  Verify OTP            │                     │
   │                     │───────────────────────▶│                     │
   │                     │                        │  Update isVerified  │
   │                     │                        │────────────────────▶│
   │                     │  Generate JWT Pair     │                     │
   │                     │  (access + refresh)    │                     │
   │                     │◀───────────────────────│                     │
   │◀──── {token,user}───│                        │                     │
   │                     │                        │                     │
   │  POST /auth/signin  │                        │                     │
   │────────────────────▶│                        │                     │
   │                     │  Verify credentials    │                     │
   │                     │───────────────────────▶│                     │
   │                     │                        │  Find User + Compare│
   │                     │                        │────────────────────▶│
   │                     │  Generate JWT Pair     │                     │
   │                     │◀───────────────────────│                     │
   │◀──── {token,user}───│                        │                     │
   │                     │                        │                     │
   │  [All Auth'd Req]   │                        │                     │
   │───── Authorization: Bearer <accessToken>─────│─────────────────────│
   │                     │                        │                     │
   │  Authentication     │                        │                     │
   │  Middleware:        │                        │                     │
   │  1. Verify JWT      │                        │                     │
   │  2. Check Blacklist │                        │                     │
   │  3. Load User       │                        │                     │
   │  4. Check Status    │                        │                     │
   │  5. Check Verified  │                        │                     │
```

### Key Implementation Details

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Tokens**: Access token (1d expiry) + Refresh token (30d expiry)
3. **Token Blacklisting**: On logout, token JTI stored in `BlackListedTokens` collection with TTL
4. **Email Verification**: 6-digit OTP sent via Nodemailer, stored as hashed value with 10min expiry
5. **Password Reset**: OTP-based flow with separate `reset_password` OTP type
6. **Refresh Token Flow**: `POST /auth/refresh_token` generates a new access/refresh pair

## API Design Principles

- **RESTful URLs**: Resources mapped to `/module/action` pattern (e.g., `/trip/create_trip`, `/place/get/:id`)
- **HTTP Methods**: GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE (delete)
- **Authentication**: JWT Bearer token in `Authorization` header for protected endpoints
- **Pagination**: All list endpoints use `mongoose-paginate-v2` with `page` and `limit` query params
- **Error Responses**: Uniform JSON format `{ status: "fail", message, error, statusCode }`
- **Success Responses**: Uniform JSON format `{ status: "success", message, data }`
- **File Uploads**: Multer middleware → Cloudinary CDN → `{ secure_url, public_id }` stored in DB

## Socket.IO Integration

### Connection Flow

1. Client connects with JWT in `auth.token` handshake parameter
2. Server middleware verifies the JWT and maps `userId → socketId[]` in `connectedUsers` Map
3. On disconnect, socket ID is removed from the mapping

### Notification Delivery

- When an event occurs (e.g., trip assigned, driver verified), the server emits to the specific user's socket(s)
- `sendNotification.ts` utility fetches the receiver's socket IDs from `connectedUsers` and emits
- The Angular `SocketService` listens for `newNotification` events and pushes to a Subject
- The Navbar component subscribes to this Subject and shows a Material snack-bar with a "View" action

### `connectedUsers` Map Structure

```
Map<string, string[]>
  key:   userId (MongoDB ObjectId as string)
  value: array of active socket IDs for that user (supports multiple tabs)
```

## Third-Party Integrations

| Service | Purpose | Integration Point |
|---------|---------|-------------------|
| **Cloudinary** | Image/file upload and CDN | Multer middleware uploads to Cloudinary; `secure_url` + `public_id` stored in DB |
| **Overpass API** | OpenStreetMap place search | Used in place creation/search to fetch POI data from OSM |
| **OSRM** | Open Source Routing Machine | Calculates optimal route path between trip places |

## Security Measures

| Measure | Implementation |
|---------|---------------|
| **HTTP Security Headers** | Helmet middleware (CSP disabled for SPA) |
| **CORS** | Enabled for all origins (development) |
| **Password Hashing** | bcrypt with 10 salt rounds |
| **JWT Authentication** | Access token (1d) + Refresh token (30d) |
| **Token Blacklisting** | Logout tokens stored with TTL auto-delete |
| **Email Verification** | Required before accessing protected routes |
| **Account Blocking** | `statusUserEnum.BLOCKED` checked in auth middleware |
| **Role-Based Access** | Authorization middleware restricts endpoints by role |
| **Input Validation** | Zod schemas in validation middleware |
| **File Upload Validation** | Multer type restriction (images/applications only) |
| **Sensitive Field Exclusion** | Password field has `select: false` by default |
| **Error Sanitization** | Global error handler prevents stack trace leaks |
