# Ahmed Abo Bakr — Full Checklist

**Role:** Team Manager, Leader, Fullstack & ALL UML/Architecture Docs  
**Modules:** Guide + Driver + Vehicle  

---

## Backend — Guide Module
- [ ] POST `/guide/create_guide` — Create guide
- [ ] PATCH `/guide/update/:id` — Update guide
- [ ] DELETE `/guide/delete/:id` — Delete guide
- [ ] GET `/guide/get/:id` — Get guide
- [ ] GET `/guide/all` — All guides
- [ ] GET `/guide/search` — Search guides
- [ ] PATCH `/guide/update-availability/:id` — Update availability
- [ ] POST `/guide/upload-certificate/:id` — Upload certificate
- [ ] DELETE `/guide/delete-certificate/:id` — Delete certificate

## Backend — Driver Module
- [ ] POST `/driver/create_driver` — Create driver
- [ ] PATCH `/driver/update/:id` — Update driver
- [ ] DELETE `/driver/delete/:id` — Delete driver
- [ ] GET `/driver/get/:id` — Get driver
- [ ] GET `/driver/all` — All drivers
- [ ] POST `/driver/search` — Search drivers
- [ ] PATCH `/driver/update-availability/:id` — Update availability

## Backend — Vehicle Module
- [ ] POST `/vehicle/create_vehicle` — Create vehicle
- [ ] PATCH `/vehicle/update/:id` — Update vehicle
- [ ] DELETE `/vehicle/delete/:id` — Delete vehicle
- [ ] GET `/vehicle/get/:id` — Get vehicle
- [ ] GET `/vehicle/all` — All vehicles
- [ ] GET `/vehicle/search` — Search vehicles
- [ ] GET `/vehicle/driver/:driverId` — Driver vehicles
- [ ] POST `/vehicle/upload-images/:id` — Upload images
- [ ] DELETE `/vehicle/delete-image/:id` — Delete image

## Backend — Location Module (Polling-Based Tracking)
- [ ] `location.controller.ts` — Location API controller
- [ ] `location.store.ts` — In-memory location store (no WebSockets)
- [ ] Polling endpoint for driver location updates

## Backend — External Integrations
- [ ] Overpass API proxy/caching (for places/POI data)
- [ ] OSRM integration for route calculation
- [ ] OpenRouteService integration (fallback route service)

## Backend — Authentication (JWT, bcrypt, Roles)
- [ ] JWT token generation and verification
- [ ] bcrypt password hashing
- [ ] Role-based access control (tourist, guide, driver, admin)

## Frontend — Global Layout, Navigation, Theme
- [ ] Application shell/layout component
- [ ] Navigation bar / sidebar
- [ ] Theme setup (colors, fonts, styling)
- [ ] Responsive layout structure

## Frontend — Authentication UI
- [ ] Login page
- [ ] Register page
- [ ] Forgot Password page
- [ ] Reset Password page
- [ ] Confirm Email page
- [ ] Route Guards (auth.guard.ts, role.guard.ts)
- [ ] Auth Interceptor (auth.interceptor.ts)
- [ ] Token storage service

## Frontend — Admin Dashboard UI
- [ ] Admin Dashboard component (stats overview)
- [ ] User Management page
- [ ] Trip Management page
- [ ] Verifications page (approve/reject guides/drivers)

## Frontend — Home Page
- [ ] Home component with landing layout

## Documentation & UML (ALL Diagrams)
- [ ] Use Case Diagram
- [ ] Sequence Diagrams
- [ ] Class Diagram
- [ ] Activity Diagram
- [ ] ERD (Entity Relationship Diagram)
- [ ] README.md
- [ ] Setup Guide
- [ ] System Architecture Document
- [ ] FEATURES_CHECKLIST.md
- [ ] COMPREHENSIVE_CHECKLIST.md
- [ ] CLOUDFLARE_DEPLOY.md

## Graduation Book
- [ ] "Introduction" chapter
- [ ] "System Architecture" chapter

## Project Management
- [ ] Initialize MEAN stack repository
- [ ] Set up CI/CD pipelines
- [ ] Conduct final code reviews
- [ ] Manage project timeline
- [ ] Lead final presentation delivery
