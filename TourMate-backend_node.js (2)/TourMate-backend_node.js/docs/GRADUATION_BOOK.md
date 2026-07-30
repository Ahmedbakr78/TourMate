# TourMate — Smart Tourism Trip Planner

## Graduation Project Book

**Faculty of Computer and Information Sciences**

**Supervised by**: Dr. [Supervisor Name]

**Team Members**: Ahmed Abo Bakr, Jamal Hassan, Bavly, Mai, Ramadan

**Academic Year**: 2025-2026

---

## Chapter 1: Introduction

### 1.1 Project Vision

TourMate envisions a world where travel planning is seamless, collaborative, and enriched by local expertise. The platform aims to bridge the gap between tourists seeking authentic experiences and local service providers — drivers and guides — who can offer personalized, safe, and memorable journeys. By leveraging modern web technologies and open geospatial data, TourMate provides an all-in-one solution for trip discovery, planning, execution, and reflection.

The tourism industry has seen a significant shift toward digital platforms, yet many existing solutions focus on either accommodation booking or generic itinerary generation. TourMate differentiates itself by offering a complete ecosystem: place discovery powered by OpenStreetMap data, collaborative trip building with sharing capabilities, professional driver and guide integration with verified credentials, and post-trip engagement through reviews and lost-item recovery.

### 1.2 Project Objectives

The primary objectives of the TourMate project are to design and implement a full-stack web application that enables tourists to plan and manage their trips efficiently. The system provides role-based access for tourists, drivers, guides, and administrators, ensuring each user type has tailored functionality. The platform integrates real-time communication through Socket.IO for instant notifications, uses geospatial queries for location-aware place discovery, and employs cloud-based image management via Cloudinary for all media assets.

A key objective is to demonstrate the practical application of the MEAN stack (MongoDB, Express, Angular, Node.js) in building a production-ready web application. The project also aims to showcase modern software engineering practices including the controller-service-repository architectural pattern, JWT-based authentication with refresh token rotation, role-based authorization, and comprehensive error handling.

### 1.3 Project Scope

The scope of TourMate encompasses 14 functional modules covering the complete trip lifecycle. The authentication module handles user registration with email verification, secure login, and password management. The core trip planning module allows users to create itineraries by selecting places, specifying dates and group size, with automatic price calculation. The trip sharing feature enables collaborative planning by allowing other users to join existing trips.

The platform includes dedicated modules for driver and guide management with a verification workflow administered by platform administrators. Vehicle management allows drivers to register multiple vehicles with images and capacity details. The place discovery module integrates with OpenStreetMap data and provides geospatial nearby search. Post-trip features include reviews with ratings for trips, places, drivers, and guides, as well as a voting system for itinerary places. A lost and found module helps users track lost items across trips, and the notification system delivers real-time updates via Socket.IO. Finally, the admin dashboard provides system-wide statistics and user management capabilities.

---

## Chapter 2: System Architecture

### 2.1 Technology Stack

TourMate is built on the MEAN stack, a widely adopted full-stack JavaScript framework. MongoDB serves as the NoSQL database, providing flexible schema design, powerful geospatial indexing, and horizontal scalability. Express 5, the latest version of the popular Node.js web framework, handles HTTP routing, middleware orchestration, and request processing with improved error handling and async support.

Angular 16 powers the frontend with its component-based architecture, lazy-loaded modules for optimized bundle sizes, and Angular Material for a consistent Material Design user interface. The frontend communicates with the backend through RESTful HTTP endpoints for CRUD operations and Socket.IO for real-time bidirectional communication. Leaflet is integrated for interactive map rendering, enabling place visualization and trip route display. TypeScript is used throughout both the backend and frontend, providing type safety, better IDE support, and improved code maintainability.

### 2.2 Architecture Diagram Description

The system follows a three-tier architecture with clear separation between presentation, application, and data layers. The presentation layer is a single-page application built with Angular 16 that runs in the browser and communicates with the backend exclusively through HTTP and WebSocket protocols. The Angular app uses lazy loading to split the codebase into feature modules that are loaded on demand, reducing initial load time.

The application layer is an Express 5 server that implements the controller-service-repository pattern. Controllers define routes and apply middleware for authentication and authorization. Services contain business logic and orchestrate data operations across multiple repositories. Repositories abstract database access and provide a clean API for CRUD operations with built-in pagination support via mongoose-paginate-v2. The server also initializes Socket.IO for real-time notification delivery, with an authentication middleware that verifies JWT tokens before allowing socket connections.

The data layer consists of MongoDB with 11 collections, designed to support the application's data requirements while maintaining referential integrity through ObjectId references. Geospatial indexes on the places and drivers collections enable efficient location-based queries. The BlackListedTokens collection uses a TTL index to automatically expire and remove entries.

### 2.3 Deployment Architecture

The application is designed for simplified deployment where the Angular frontend is built into static files and served directly by the Express server. The `start.sh` script automates the entire deployment process: it checks prerequisites, installs dependencies, builds the Angular application, starts MongoDB if running locally, launches the Express server, and runs health checks against key endpoints. This single-command deployment makes the application easy to set up on any Linux or macOS system with Node.js and MongoDB installed.

For development, the frontend can be served separately using `ng serve` on port 4200 with hot-reload, while the backend runs with `tsx watch` for automatic TypeScript recompilation. The application supports Cloudflare Tunnel for public access, allowing the team to share a running instance with stakeholders without complex networking configuration.

---

## Chapter 3: Database Design

### 3.1 Entity-Relationship Description

The TourMate database consists of 11 MongoDB collections designed to model the relationships between users, service providers, trips, and content. The User collection is the central entity, with one-to-one relationships to Driver and Guide collections (a user can be a driver or a guide, represented by separate documents linked by `userId`). Users have a one-to-many relationship with Trips (a user can have many trips as a tourist), Reviews (a user can write many reviews), Votes (a user can vote on many places), LostItems (a user can report many lost items), and Notifications (a user can receive many notifications).

The Trip collection is the most interconnected entity. Each trip belongs to a tourist (via `touristId`), contains references to multiple Place documents, and optionally references a Driver, Guide, and Vehicle. The `sharedTripId` self-reference field enables trip sharing, where multiple Trip documents can reference the same original trip. The `routePath` field stores the calculated route as an array of coordinate pairs. The Driver collection has a one-to-many relationship with Vehicle (a driver can register multiple vehicles).

### 3.2 Schema Details

The User schema stores name, email (unique with lowercase enforcement), phone (unique), password (with `select: false` to exclude from default queries), profile image (as a Cloudinary object with `secure_url` and `public_id`), gender, role (defaulting to tourist), status (active/blocked/pending), OTPs (an array of hashed OTP values with expiry dates and types), and email verification flag.

The Place schema is designed for geospatial queries with a GeoJSON `Point` coordinate field and a `2dsphere` index. Each place has an `osmId` for OpenStreetMap integration, name, city, category, description, price, and computed fields `averageRating` and `reviewsCount`. The Trip schema includes date fields for start and end, price (auto-calculated), people count, and a status field with six possible states: active, pending, confirmed, ongoing, completed, and cancelled.

### 3.3 Indexing Strategy

Database indexing is critical for query performance in TourMate. The Place collection uses a `2dsphere` geospatial index on the coordinates field to enable efficient `$near` and `$geoNear` queries for nearby place discovery. The Driver collection has a similar `2dsphere` index on `currentLocation` for finding available drivers near a location. The Vote collection has a compound unique index on `{ tripId, placeId, userId }` that enforces the business rule that a user can only vote once per place within a trip.

The BlackListedTokens collection uses a TTL (Time-To-Live) index on the `expiresAt` field, causing MongoDB to automatically delete expired documents. This provides efficient token blacklist cleanup without application-level garbage collection. The User collection benefits from MongoDB's default unique index on the `_id` field, with additional unique indexes on `email` and `phone` for fast lookup during authentication.

---

## Chapter 4: Backend Implementation

### 4.1 Module Structure

The backend is organized into 12 Express router modules, each following the controller-service-repository pattern. The Auth module handles the complete authentication lifecycle including registration, email verification via OTP, login with JWT generation, token refresh, password reset with OTP, password change, and logout with token blacklisting. The Admin module provides system management endpoints protected by role-based authorization, including dashboard statistics, user management, driver and guide verification, and trip resource assignment.

The Driver, Guide, and Vehicle modules share a similar CRUD pattern with additional business logic for verification workflows and file uploads. The Trip module is the most feature-rich, handling trip creation with automatic price calculation based on places, dates, and group size. It also supports trip updates, cancellation, and a join mechanism for shared trips. The Place module integrates with the Overpass API for OpenStreetMap data and implements geospatial nearby search using MongoDB's `$geoNear` aggregation stage.

### 4.2 Authentication Implementation

Authentication in TourMate follows industry best practices for web applications. Passwords are hashed using bcrypt with 10 salt rounds before storage. On signup, a 6-digit OTP is generated, hashed, and stored with a 10-minute expiry. The OTP is sent to the user's email via Nodemailer using a Gmail SMTP transport. Email confirmation is required before the user can access protected routes.

Upon successful login or email confirmation, the server generates a JWT access token with a 1-day expiry and a refresh token with a 30-day expiry. Both tokens are signed with separate secrets. The access token contains the user ID (`_id`), role, and a unique token identifier (`jti`). The authentication middleware verifies the access token on every protected request, checks the blacklist for the token's `jti`, loads the user from the database, and verifies the account is active and email-verified. On logout, the token's `jti` is stored in the BlackListedTokens collection with a TTL matching the token's remaining lifespan.

### 4.3 API Design

All API endpoints follow a consistent RESTful design with uniform response formats. Successful responses return `{ status: "success", message, data }` while error responses return `{ status: "fail", message, error, statusCode }`. List endpoints support pagination through `page` and `limit` query parameters, returning metadata including `totalDocs`, `totalPages`, and `hasNextPage`/`hasPrevPage` flags through mongoose-paginate-v2.

File upload endpoints use Multer middleware configured to upload to Cloudinary's CDN. The middleware validates file types (allowing only images for profiles, vehicles, and lost items; images and PDFs for guide certificates) and limits file sizes. After successful upload to Cloudinary, the `secure_url` and `public_id` are stored in the relevant document. The Cloudinary public ID enables future deletion or transformation of the uploaded asset.

### 4.4 Socket.IO Integration

Real-time notifications are delivered through Socket.IO, which is initialized on the same HTTP server as the Express application. The Socket.IO server uses an authentication middleware that extracts the JWT from the `auth.token` handshake parameter, verifies it, and maps the user's ID to their socket connection(s). This mapping supports multiple browser tabs by storing an array of socket IDs per user.

When a notification-triggering event occurs — such as a driver being verified, a trip resource being assigned, or a lost item being found — the `sendNotification` utility creates a Notification document in the database and emits a `newNotification` event to all socket IDs associated with the target user. The Angular frontend's SocketService listens for these events and pushes them through a Subject that the Navbar component subscribes to for displaying snack-bar alerts and updating the unread count.

---

## Chapter 5: Frontend Implementation

### 5.1 Angular Application Structure

The frontend is an Angular 16 single-page application organized into feature modules that are lazy-loaded through the router. The `AppModule` bootstraps the application and eagerly loads the `SharedModule` (containing the navbar, map component, loading spinner, and confirmation dialog) and the `HomeComponent` (landing page). All other modules — Auth, Admin, Trips, Places, Driver, Guide, Vehicle, LostItem, Notifications, and Profile — are loaded on demand when the user navigates to their routes.

The `CoreModule` (implemented as services provided at the root level) contains HTTP service wrappers for each API module, TypeScript model interfaces, authentication and role guards, an HTTP interceptor that automatically attaches the JWT to outgoing requests, and the Socket.IO service. The `SharedModule` exports common UI components and Material Design modules used across feature modules, preventing duplicate imports.

### 5.2 Component Architecture

Each feature module follows a consistent component structure. List components display paginated data using Angular Material tables or cards, with search and filter controls. Detail components show full information for a single entity. Form components handle create and update operations using Angular reactive forms with validation. The admin module includes specialized components for dashboard statistics (using charts or stat cards), user management tables, and verification workflow interfaces.

The trip builder is a multi-step component that guides users through selecting places on a map, setting dates, specifying group size, and reviewing the calculated price before confirmation. The map component, built with Leaflet, is reused across multiple features: place discovery shows markers for places with popup information, trip detail displays the route as a polyline connecting waypoints, and nearby search visualizes places within a radius of the user's location.

### 5.3 State Management and Data Flow

TourMate uses Angular services with RxJS BehaviorSubjects for state management rather than a dedicated state management library like NgRx. The AuthService maintains a `currentUser$` observable that drives the navbar display, guards, and API authorization headers throughout the application. On app bootstrap, an `APP_INITIALIZER` factory checks for an existing JWT in localStorage and fetches the current user profile to restore the session without requiring re-login on page refresh.

The HTTP interceptor automatically attaches the `Authorization: Bearer <token>` header to every outgoing request when a token exists. On 401 responses, the interceptor could trigger a token refresh flow. The SocketService manages the WebSocket connection lifecycle, connecting when the user logs in and disconnecting on logout. Real-time notifications received through the socket are emitted through a Subject that components can subscribe to without tight coupling to the socket implementation.

### 5.4 Internationalization

While the current implementation primarily uses English for the user interface, the architecture supports future internationalization through Angular's i18n capabilities. Template strings are prepared with interpolation-friendly patterns, and service messages are returned in a consistent JSON format that could be mapped to locale-specific strings on the frontend. The backend error messages and email templates are currently in English and Arabic mixed, with plans to standardize on a locale-based approach in future iterations.

---

## Chapter 6: UI/UX Design

### 6.1 Design Philosophy

TourMate's user interface follows Material Design guidelines as implemented by Angular Material, providing a clean, accessible, and responsive experience across devices. The design philosophy prioritizes task completion — each screen is focused on a primary action (browsing places, building a trip, reviewing past trips) with secondary actions accessible through navigation drawers or contextual menus. The color scheme uses a calming blue primary palette, symbolizing trust and travel, with warm accent colors for call-to-action buttons.

The navigation is structured hierarchically: the top navbar shows the application name, primary navigation links (Places, Trips), user-specific actions (Profile, Notifications), and authentication controls (Login/Logout). Based on the user's role, additional navigation items appear (Admin panel for administrators, Driver/Guide dashboards for service providers). The home page serves as a landing dashboard with quick access to key features, recent trips, and popular places.

### 6.2 Responsive Design

The application is designed to be fully responsive across desktop, tablet, and mobile viewports. Angular Material's responsive layout system (Flex Layout and grid list) ensures components adapt their arrangement based on screen width. On desktop, list views display multiple columns with side panels for filters. On mobile, the layout collapses to single-column stacks with a hamburger menu replacing the horizontal navbar. The map component adjusts its dimensions proportionally and supports touch interactions on mobile devices.

Forms are designed with mobile-first considerations: input fields span full width, date pickers use native mobile date inputs where supported, and submit buttons are placed within easy thumb reach at the bottom of the form. The notification snack-bar supports swipe-to-dismiss on touch devices, and the confirmation dialog buttons are sized for touch targets. Image uploads trigger the device camera on mobile browsers supporting the File API.

### 6.3 Theme and Visual Identity

The application uses Angular Material's theming system with a custom palette. The primary color is a deep blue (#1565C0) evoking sky and ocean, complemented by an amber accent (#FFB300) for highlights and call-to-action elements. Typography uses the Roboto font family with a clear hierarchy: headlines for page titles, subheadings for section headers, and body text for content. The map component uses a custom Leaflet tile style that matches the application's color scheme for visual cohesion.

Card-based layouts are used extensively for displaying places, trips, drivers, and guides. Each card presents a concise summary with an image (where available), title, key metadata (rating, price, dates), and action buttons. Cards use elevation shadows to create depth and visual hierarchy. Loading states are handled with Material progress spinners and skeleton placeholders to maintain perceived performance during API calls.

---

## Chapter 7: System Testing

### 7.1 Testing Approach

TourMate employs a multi-layered testing strategy combining automated endpoint testing through the startup script and manual functional testing of the user interface. The `start.sh` script includes automated smoke tests that verify key endpoints return expected HTTP status codes — confirming the server is running, the SPA is serving correctly, and the API is responsive. These tests cover static file serving, SPA routing (all unknown routes return index.html), and API endpoint availability.

Manual testing follows predefined test scenarios covering the complete user journey: registration, email verification, login, place browsing, trip creation with place selection, trip sharing via the join mechanism, driver and guide registration with verification workflow, review creation after trip completion, lost item reporting and status updates, and admin dashboard functionality. Each scenario documents expected behavior, input data, and success criteria.

### 7.2 Test Cases and Results

The authentication flow was tested with valid and invalid credentials, expired OTPs, duplicate email registrations, and concurrent session management. All edge cases were handled correctly with appropriate error messages. The trip creation flow was verified with valid place selections, overlapping date ranges, and group size limits — the system correctly validated all inputs and calculated prices using the trip pricing service.

The geospatial nearby place search was tested with coordinates in Cairo, Alexandria, and Sharm El-Sheikh, returning places within specified radiuses with accurate distance sorting. File upload functionality was tested with valid images, oversized files, and invalid file types — Multer correctly rejected invalid files and Cloudinary integration stored and returned accessible URLs. Socket.IO notification delivery was verified by triggering events in one browser tab and observing real-time updates in another tab logged in as the same user.

### 7.3 Known Issues and Limitations

The current testing infrastructure does not include automated unit tests or end-to-end testing frameworks. While the manual testing process covers the primary workflows, regression testing is performed ad-hoc rather than through an automated suite. Some edge cases in race conditions — such as multiple users joining the same trip simultaneously — require further testing with concurrent request simulation.

The application has been tested primarily on modern Chromium-based browsers and Firefox. Some styling inconsistencies may appear on older browsers or Safari, particularly with CSS Grid and Flexbox layouts. Mobile testing has been performed using browser developer tools device emulation rather than physical devices, so touch interaction behavior on actual mobile devices may vary.

---

## Chapter 8: Quality Assurance

### 8.1 Security Measures

Security is a fundamental consideration throughout TourMate's architecture. Password security is enforced through bcrypt hashing with 10 salt rounds, ensuring that even if the database is compromised, passwords remain computationally infeasible to crack. JWT tokens are signed with distinct secrets for access and refresh tokens, and the access token short expiry (1 day) limits the damage window if a token is leaked.

The authentication middleware implements multiple security checks on each protected request: token signature verification, blacklist check (ensuring logged-out tokens cannot be reused), user existence and active status verification, and email confirmation check. The authorization middleware restricts endpoint access based on user roles, preventing privilege escalation. HTTP security headers are set by Helmet, including X-Content-Type-Options, X-Frame-Options, and X-XSS-Protection, though Content Security Policy is disabled to allow the SPA to load external resources like Leaflet tiles and Cloudinary images.

### 8.2 Performance Optimization

The application implements several performance optimizations. Response compression via the `compression` middleware reduces bandwidth usage for API responses. The Angular frontend uses lazy loading for feature modules, reducing the initial bundle size to only the code needed for the landing page. The `PreloadAllModules` preloading strategy then loads remaining modules in the background after the initial render, balancing fast initial load with seamless navigation.

Database query performance is optimized through strategic indexing: the `2dsphere` index on places enables efficient geospatial queries, compound indexes on votes prevent full collection scans for uniqueness checks, and TTL indexes on blacklisted tokens provide automatic cleanup without application-level processing. The repository layer uses `mongoose-paginate-v2` for all list endpoints, which enables efficient pagination using MongoDB's cursor-based approach rather than loading all documents into memory.

### 8.3 Code Quality

The backend codebase is written in TypeScript with strict mode enabled, catching type errors at compile time rather than runtime. The code follows the controller-service-repository pattern consistently across all modules, making the codebase predictable and easy to navigate. Error handling is centralized through a global Express error handler that catches both custom `httpException` instances and unexpected errors, returning uniform JSON responses and preventing stack trace leakage in production.

The frontend codebase follows Angular style guidelines with consistent component structure, service injection patterns, and reactive form usage. Components are kept focused on presentation logic, delegating data access to services and business logic to utility functions. The shared module pattern prevents code duplication by extracting common UI components and Material module imports into a single shared location.

---

## Chapter 9: Conclusion

### 9.1 Project Summary

TourMate successfully demonstrates the development of a comprehensive smart tourism trip planning platform using the MEAN stack. The project delivers 14 integrated modules covering the complete trip lifecycle from discovery and planning to execution and reflection. The system supports four user roles — tourist, driver, guide, and administrator — each with tailored functionality and appropriate access controls. Real-time notifications, geospatial place discovery, cloud-based image management, and interactive maps create a rich user experience that meets the needs of modern travelers.

The project was developed by a team of five members following an organized module allocation strategy. Each team member was responsible for both backend and frontend implementation of their assigned modules, ensuring end-to-end ownership and reducing integration complexity. The adoption of TypeScript, consistent architectural patterns, and thorough middleware protection resulted in a codebase that is maintainable, secure, and extensible.

### 9.2 Lessons Learned

The development of TourMate reinforced several important software engineering principles. The controller-service-repository pattern proved effective for maintaining separation of concerns, making the codebase testable and modifiable without ripple effects across layers. The decision to use TypeScript on both backend and frontend reduced integration bugs caused by type mismatches between the API and its consumption. The lazy-loading architecture in Angular significantly improved initial load times compared to an eager-loaded alternative.

Real-time notification integration taught the team about WebSocket lifecycle management, reconnection strategies, and the importance of robust authentication for persistent connections. The geospatial query implementation highlighted the power of MongoDB's geospatial indexes for location-based features, though it also required careful index design to maintain query performance as data volume grows. File upload with Cloudinary simplified image management but required careful error handling for upload failures and storage quota limits.

### 9.3 Future Work

Several enhancements are planned for future iterations of TourMate. A mobile application built with React Native or Flutter would provide native device features such as push notifications, offline trip access, and GPS-based automatic check-ins at trip places. Payment gateway integration (Stripe or PayPal) would enable in-app payment processing for trip bookings and service provider fees, replacing the current manual payment confirmation workflow.

Machine learning integration could enhance place recommendations based on user preferences, past trip patterns, and collaborative filtering from similar users. A review sentiment analysis system could automatically extract insights from review comments and update place ratings more intelligently. A real-time chat system between trip participants, drivers, and guides would enhance coordination during active trips. Finally, a comprehensive automated testing suite with unit tests, integration tests, and end-to-end tests would improve release confidence and prevent regressions.
