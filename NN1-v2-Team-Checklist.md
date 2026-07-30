# 🗺️ NN1-v2 – Project Checklist

> **Instruction**: Mark `[ ]` → `[x]` as each task is completed.  
> **Last updated**: $(date "+%Y-%m-%d")

---

## 1. Ahmed Abo Bakr – Team Manager, Fullstack & UML/Architecture

### Guide Module
- [ ] Create Guide (Backend)
- [ ] Update Guide (Backend)
- [ ] Delete Guide (Backend)
- [ ] Get Guide (Backend)
- [ ] Get All Guides (Backend)
- [ ] Search Guides (Backend)
- [ ] Update Availability (Backend)
- [ ] Upload Certificate (Backend)
- [ ] Delete Certificate (Backend)

### Driver Module
- [ ] Create Driver (Backend)
- [ ] Update Driver (Backend)
- [ ] Delete Driver (Backend)
- [ ] Get Driver (Backend)
- [ ] Get All Drivers (Backend)
- [ ] Search Drivers (Backend)
- [ ] Update Availability (Backend)

### Vehicle Module
- [ ] Create Vehicle (Backend)
- [ ] Update Vehicle (Backend)
- [ ] Delete Vehicle (Backend)
- [ ] Get Vehicle (Backend)
- [ ] Get All Vehicles (Backend)
- [ ] Get Driver Vehicles (Backend)
- [ ] Upload Vehicle Images (Backend)
- [ ] Delete Vehicle Image (Backend)

### Frontend Tasks
- [ ] Global Application Layout, Navigation & Theme Setup
- [ ] Authentication UI (Login, Register, Forgot Password)
- [ ] Route Guards
- [ ] Admin Dashboard UI (User mgmt, system stats, live trip monitoring)

### Backend & Technical
- [ ] Initialize MEAN stack repo + CI/CD pipelines
- [ ] Backend Auth (JWT, bcrypt, RBAC)
- [ ] Overpass API – backend proxy + caching
- [ ] OSRM / OpenRouteService integration (route calc)
- [ ] Polling-based location tracking (no WebSockets)

### UML Diagrams (ALL)
- [ ] Use Case Diagram
- [ ] Sequence Diagrams
- [ ] Class Diagram
- [ ] Activity Diagram
- [ ] ERD (Entity Relationship Diagram)

### Documentation
- [ ] README.md + Setup Guide + System Architecture doc
- [ ] Graduation Book: Introduction chapter
- [ ] Graduation Book: System Architecture chapter
- [ ] Final code reviews + project timeline + presentation delivery

---

## 2. Jamal – Database, Backend Core & API Docs

### Auth Module
- [ ] Register
- [ ] Login
- [ ] Verify Email
- [ ] Resend Verification Code
- [ ] Forgot Password
- [ ] Verify Reset Code
- [ ] Reset Password
- [ ] Change Password
- [ ] Refresh Token
- [ ] Logout
- [ ] Get Logged-In User

### User Module
- [ ] Get Profile
- [ ] Get User By Id
- [ ] Update Profile
- [ ] Upload Profile Image
- [ ] Delete Profile Image
- [ ] Delete Account

### Admin Module
- [ ] Dashboard Statistics
- [ ] Get All Users
- [ ] Get User By Id
- [ ] Block User
- [ ] Unblock User
- [ ] Get Pending Guides
- [ ] Approve Guide
- [ ] Reject Guide
- [ ] Get Pending Drivers
- [ ] Approve Driver
- [ ] Reject Driver
- [ ] Delete User
- [ ] Delete Trip
- [ ] Get Reports

### Frontend Tasks
- [ ] Booking Flow UI (Draft → Pending → Confirmed → Ongoing → Completed)
- [ ] Shared Trip UI (join, capacity check, cost-split display)
- [ ] Mock Payment UI (success / failure states)

### Backend – 10 MongoDB Schemas
- [ ] User Schema
- [ ] Driver Schema
- [ ] Guide Schema
- [ ] Vehicle Schema
- [ ] Place Schema
- [ ] Trip Schema
- [ ] Vote Schema
- [ ] Review Schema
- [ ] Lost Item Schema
- [ ] Notification Schema

### Backend – REST APIs
- [ ] Trip Builder APIs
- [ ] Voting APIs
- [ ] Shared Trip APIs
- [ ] Booking APIs
- [ ] Driver APIs
- [ ] Guide APIs
- [ ] Review APIs
- [ ] Lost & Found APIs
- [ ] Notification APIs

### Database Ops
- [ ] Indexing
- [ ] Seeders
- [ ] Scalability checks

### Documentation
- [ ] API Docs (Swagger / Postman)
- [ ] Graduation Book: Database Design chapter
- [ ] Graduation Book: Backend Implementation chapter

---

## 3. Bavly – Frontend Lead, Tourist App & Map

### Trip Module
- [ ] Create Trip
- [ ] Update Trip
- [ ] Delete Trip
- [ ] Get Trip
- [ ] Get All Trips
- [ ] Get My Trips
- [ ] Get Shared Trips
- [ ] Assign Guide
- [ ] Assign Driver
- [ ] Assign Vehicle
- [ ] Start Trip
- [ ] Complete Trip
- [ ] Cancel Trip
- [ ] Share Trip
- [ ] Duplicate Trip
- [ ] Calculate Trip Price
- [ ] Get Trip Route

### Vote Module
- [ ] Create Vote
- [ ] Update Vote
- [ ] Delete Vote
- [ ] Get Place Votes
- [ ] Get User Votes

### Frontend Tasks
- [ ] Angular 17+ architecture, routing, global state (NgRx/Signals)
- [ ] Tourist Application UI: Trip Builder + Place Selection + Group Voting
- [ ] Leaflet.js integration (OSM map, POI markers, route viz)
- [ ] Polling-based tracking UI (driver location, route path, ETA)

### Backend Tasks
- [ ] Places Module APIs (search by city, filter by category, save to DB)
- [ ] Backend caching (Redis / in-memory) – Overpass API load reduction
- [ ] Ensure API response time < 2s
- [ ] Frontend-backend data sync & map error handling

### Documentation
- [ ] Graduation Book: Frontend Implementation chapter
- [ ] Graduation Book: UI/UX Design chapter
- [ ] i18n docs, component structure, responsive design guidelines

---

## 4. Mai – Frontend Providers, Admin Backend & QA

### Notification Module
- [ ] Create Notification
- [ ] Get Notifications
- [ ] Get Notification By Id
- [ ] Mark Notification As Read
- [ ] Mark All Notifications As Read
- [ ] Delete Notification
- [ ] Delete All Notifications
- [ ] Get Unread Count

### Lost Item Module
- [ ] Create Lost Item
- [ ] Update Lost Item
- [ ] Update Lost Item Status
- [ ] Delete Lost Item
- [ ] Get Lost Item
- [ ] Get Trip Lost Items
- [ ] Get My Lost Items
- [ ] Report Found Item
- [ ] Close Lost Item
- [ ] Reopen Lost Item

### Frontend Tasks
- [ ] Driver Application UI (accept/reject trips, availability, location polls)
- [ ] Guide Application UI (view schedule, accept/reject trips, history)
- [ ] Responsive UI design across all 4 apps
- [ ] Multi-language support (i18n)

### Backend Tasks
- [ ] Admin Dashboard APIs (verify drivers/guides, manage issues, system stats)
- [ ] Notification Module Backend (create, mark read, trigger on booking/lost item)
- [ ] Review Module Backend (avg ratings, store comments)

### Documentation
- [ ] Test Plan + Test Case Matrix (covering all 14 modules)
- [ ] Graduation Book: System Testing chapter
- [ ] Graduation Book: QA chapter
- [ ] User Manual (Tourist, Driver, Guide, Admin apps)

---

## 5. Ramadan – DevOps, Shared Frontend, QA & Docs Lead

### Place Module
- [ ] Create Place
- [ ] Update Place
- [ ] Delete Place
- [ ] Get Place
- [ ] Get All Places
- [ ] Search Places
- [ ] Filter Places
- [ ] Get Nearby Places
- [ ] Get Popular Places
- [ ] Save Place

### Review Module
- [ ] Create Review
- [ ] Update Review
- [ ] Delete Review
- [ ] Get Review
- [ ] Get All Reviews
- [ ] Get Trip Reviews
- [ ] Get Guide Reviews
- [ ] Get Driver Reviews
- [ ] Get Place Reviews
- [ ] Get My Reviews

### Frontend Tasks
- [ ] Shared reusable UI components (Angular Material: cards, modals, tables, forms)
- [ ] Lost & Found UI (report lost item, update status)
- [ ] Review Submission UI
- [ ] Notification Center UI (bell icon, dropdown, unread counts)

### DevOps & QA
- [ ] Cloud Deployment (Node backend + Angular frontends → Render / Vercel / AWS)
- [ ] Docker containers for local dev consistency
- [ ] Mock data / seeders for final presentation
- [ ] Manual Testing (cross-browser, mobile responsiveness, edge cases)

### Documentation & Presentation
- [ ] Compile & format Graduation Book (all chapters + UML diagrams → uni standards)
- [ ] Design & animate final Presentation Slides
- [ ] Demo Script (step-by-step for defense)
- [ ] Backup video walkthrough of the system
- [ ] Track team progress & weekly meeting minutes
- [ ] Graduation Book: Conclusion chapter
