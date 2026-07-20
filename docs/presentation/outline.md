# TourMate — Presentation Outline

Proposed defense slide deck (~20 slides). Each slide lists title, bullet points, and the
diagram/screenshot to insert. UML sources live in `docs/uml/`; screenshots are captured from the
running apps.

## Slide 1 — Title
- Project name: **TourMate**
- MEAN-stack graduation project
- Team, supervisor, date
- *Visual:* Project logo / hero banner

## Slide 2 — Problem & Motivation
- Tourists struggle to coordinate transport, guides, and safety on trips
- Fragmented tools; lack of live tracking & trust
- *Visual:* Pain-point diagram (simple)

## Slide 3 — Objectives
- Unified multi-role platform (Tourist, Driver, Guide, Admin)
- POI discovery, trip booking, live tracking, reviews, lost & found
- *Visual:* Goal list

## Slide 4 — Stakeholders & Roles
- Four roles and their goals (from README table)
- *Visual:* Role matrix table

## Slide 5 — System Architecture
- MEAN stack: MongoDB, Express, Angular 17+, Node.js
- Layered backend (middleware → services → controllers → routes)
- Server-side external proxy + polling-based tracking
- *Visual:* `docs/uml/class-diagram.md` (architecture overview) + `docs/graduation/chapter-system-architecture.md`

## Slide 6 — Use Cases
- Core actor–system interactions
- *Visual:* `docs/uml/use-case.md`

## Slide 7 — Data Model (ERD)
- Users, Trips, Places, Vehicles, Reviews, Votes, LostItems, Notifications
- *Visual:* `docs/uml/erd.md`

## Slide 8 — Authentication Flow
- Register → verify email → login → JWT access/refresh
- RBAC enforcement
- *Visual:* `docs/uml/sequence-authentication.md`

## Slide 9 — Feature Modules Overview
- Auth, User, Admin, Trip, Place, Vote, Review, Vehicle, Notification, Lost&Found, Driver, Guide, Tracking
- *Visual:* Module map

## Slide 10 — Trip Booking Flow
- Create trip → calculate price → assign guide/driver/vehicle → start/complete
- *Visual:* `docs/uml/sequence-trip-booking.md` + `docs/uml/activity-trip.md`

## Slide 11 — Live Tracking (Polling)
- Driver pushes location; clients poll; no WebSockets (firewall-resilient)
- *Visual:* `docs/uml/sequence-polling.md`

## Slide 12 — External Integration
- Overpass POI + routing proxy with caching
- *Visual:* `docs/uml/sequence-overpass.md`

## Slide 13 — RBAC & Security
- `authenticate` + `rbac(...)` middleware; image-only upload filter
- *Visual:* Role/permission table

## Slide 14 — Tourist App Demo (screenshots)
- Home, My Trips, New Trip builder, Places, Favorites, Tools, Tips, Shared Trips, Lost&Found, Profile, Settings
- *Visual:* Screenshot montage

## Slide 15 — Driver & Guide Apps
- Driver: Dashboard, availability, send location, history, vehicles
- Guide: Dashboard, accept/reject, schedule, history, certificate
- *Visual:* Screenshots

## Slide 16 — Admin App
- Dashboard stats, User/Guide/Driver management + pending approvals, Vehicle management, Trip monitoring
- *Visual:* Screenshots

## Slide 17 — i18n & RTL
- English / Arabic switch; RTL layout
- *Visual:* Side-by-side EN/LTR vs AR/RTL screenshot

## Slide 18 — Testing & QA
- Unit (services), Integration (Postman/curl), Manual E2E
- Edge cases: capacity limit, concurrent booking, RBAC, upload type, polling latency, lost-item lifecycle, notification read
- *Visual:* Test pyramid + `docs/testing/test-cases.md` summary table

## Slide 19 — Demo Walkthrough
- Live click-by-click: book → approve → track → lost item → review
- *Visual:* Reference `docs/presentation/demo-script.md`

## Slide 20 — Results, Challenges & Future Work
- Outcomes, lessons (polling vs WS, RBAC), future: WebSockets, payments, mobile
- *Visual:* Bullets

## Slide 21 — Conclusion & Q&A
- Summary, contributions, thanks
- *Visual:* Closing slide

## Slide 22 — Backup / Appendix
- API endpoint reference, env config, repo link
- *Visual:* Route list table
