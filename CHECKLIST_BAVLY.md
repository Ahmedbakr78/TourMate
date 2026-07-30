# Bavly — Full Checklist
**Role:** Frontend Lead, Tourist App & UI/UX Docs
**Modules:** Trip + Vote

## Backend — Trip Module
- [ ] POST `/trip/create_trip`
- [ ] GET `/trip/all`
- [ ] GET `/trip/get/:id`
- [ ] GET `/trip/my_trips`
- [ ] GET `/trip/shared`
- [ ] PATCH `/trip/:id/update`
- [ ] PATCH `/trip/:id/cancel`
- [ ] PATCH `/trip/:id/join`
- [ ] PATCH `/trip/:id/share`
- [ ] POST `/trip/:id/duplicate`
- [ ] DELETE `/trip/:id/delete`
- [ ] PATCH `/trip/:id/assign-guide`
- [ ] PATCH `/trip/:id/assign-driver`
- [ ] PATCH `/trip/:id/assign-vehicle`
- [ ] PATCH `/trip/:id/start`
- [ ] PATCH `/trip/:id/complete`
- [ ] POST `/trip/calculate-price`
- [ ] GET `/trip/:id/route`

## Backend — Vote Module
- [ ] POST `/vote/create_vote`
- [ ] PATCH `/vote/:id/update`
- [ ] DELETE `/vote/:id/delete`
- [ ] GET `/vote/:tripId/place/:placeId`
- [ ] GET `/vote/user`

## Backend — Caching & Utilities
- [ ] `cache.service.ts` (in-memory/Redis)
- [ ] `tripPrice.service.ts`
- [ ] API response time < 2s

## Places Module APIs (shared)
- [ ] Search by city
- [ ] Filter by category
- [ ] Save to DB

## Frontend — Angular Architecture
- [ ] Angular 17+ setup
- [ ] Routing configuration
- [ ] State management (NgRx/Signals)

## Frontend — Tourist App UI
- [ ] Trip Builder (arrange places, estimate cost)
- [ ] Place Selection
- [ ] Group Voting

## Frontend — Map Integration (Leaflet.js)
- [ ] OpenStreetMap display
- [ ] POI markers
- [ ] Interactive route visualization
- [ ] Polling-based tracking UI (driver location, route, ETA)

## Frontend — Data Sync
- [ ] Frontend-backend sync
- [ ] Map error handling

## Documentation
- [ ] Graduation Book: "Frontend Implementation" chapter
- [ ] Graduation Book: "UI/UX Design" chapter
- [ ] i18n documentation
- [ ] Component structure docs
- [ ] Responsive design guidelines
