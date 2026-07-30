# Ahmed Abo Bakr — Full Checklist
**Role:** Team Manager, Leader, Fullstack & ALL UML/Architecture Docs
**Modules:** Guide + Driver + Vehicle

## Backend — Guide Module
- [ ] POST `/guide/create_guide`
- [ ] PATCH `/guide/update/:id`
- [ ] DELETE `/guide/delete/:id`
- [ ] GET `/guide/get/:id`
- [ ] GET `/guide/all`
- [ ] GET `/guide/search`
- [ ] PATCH `/guide/update-availability/:id`
- [ ] POST `/guide/upload-certificate/:id`
- [ ] DELETE `/guide/delete-certificate/:id`

## Backend — Driver Module
- [ ] POST `/driver/create_driver`
- [ ] PATCH `/driver/update/:id`
- [ ] DELETE `/driver/delete/:id`
- [ ] GET `/driver/get/:id`
- [ ] GET `/driver/all`
- [ ] POST `/driver/search`
- [ ] PATCH `/driver/update-availability/:id`

## Backend — Vehicle Module
- [ ] POST `/vehicle/create_vehicle`
- [ ] PATCH `/vehicle/update/:id`
- [ ] DELETE `/vehicle/delete/:id`
- [ ] GET `/vehicle/get/:id`
- [ ] GET `/vehicle/all`
- [ ] GET `/vehicle/search`
- [ ] GET `/vehicle/driver/:driverId`
- [ ] POST `/vehicle/upload-images/:id`
- [ ] DELETE `/vehicle/delete-image/:id`

## Backend — Location Module
- [ ] `location.controller.ts`
- [ ] `location.store.ts`
- [ ] Polling-based tracking (no WebSockets)

## External Integrations
- [ ] Overpass API proxy/caching
- [ ] OSRM integration (route calculation)
- [ ] OpenRouteService integration

## Backend Authentication
- [ ] JWT token generation & verification
- [ ] bcrypt password hashing
- [ ] Role-based access control

## Frontend Tasks
- [ ] Global Layout, Navigation, Theme
- [ ] Auth UI (Login, Register, Forgot Password)
- [ ] Route Guards (`auth.guard.ts`, `role.guard.ts`)
- [ ] Auth Interceptor (`auth.interceptor.ts`)
- [ ] Admin Dashboard UI (users, stats, trips, verifications)
- [ ] Home Page

## UML Diagrams
- [ ] Use Case Diagram
- [ ] Sequence Diagrams
- [ ] Class Diagram
- [ ] Activity Diagram
- [ ] ERD

## Documentation
- [ ] README.md
- [ ] Setup Guide
- [ ] System Architecture Document
- [ ] FEATURES_CHECKLIST.md, COMPREHENSIVE_CHECKLIST.md, CLOUDFLARE_DEPLOY.md, NN1-v2 checklists
- [ ] Graduation Book: "Introduction" & "System Architecture" chapters

## Project Management
- [ ] Initialize MEAN stack repo
- [ ] CI/CD pipelines
- [ ] Final code reviews
- [ ] Project timeline
- [ ] Final presentation delivery
