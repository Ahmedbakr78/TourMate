# Ramadan — Full Checklist
**Role:** DevOps, Shared Frontend, QA & Documentation Lead
**Modules:** Place + Review

## Backend — Place Module
- [ ] POST `/place/create_place`
- [ ] GET `/place/all`
- [ ] GET `/place/get/:id`
- [ ] PUT `/place/update/:id`
- [ ] DELETE `/place/places/:id`
- [ ] GET `/place/search`
- [ ] GET `/place/filter`
- [ ] GET `/place/nearby`
- [ ] GET `/place/popular`
- [ ] POST `/place/save/:id`
- [ ] DELETE `/place/save/:id`

## Backend — Review Module
- [ ] POST `/review/create_review`
- [ ] GET `/review/all`
- [ ] GET `/review/get/:id`
- [ ] PATCH `/review/:id/update`
- [ ] DELETE `/review/:id/delete`
- [ ] GET `/review/:tripId/reviews`
- [ ] GET `/review/:placeId/place_reviews`
- [ ] GET `/review/guide/:guideId`
- [ ] GET `/review/driver/:driverId`
- [ ] GET `/review/my-reviews`

## Overpass API
- [ ] `overpass.service.ts` — POI data queries

## Tests
- [ ] `place.service.test.ts`

## Frontend — Shared UI Components (Angular Material)
- [ ] Custom cards
- [ ] Modals/Dialogs
- [ ] Data tables
- [ ] Form inputs

## Frontend — Places UI
- [ ] Place List
- [ ] Place Form
- [ ] Place Detail

## Frontend — Review UI
- [ ] Review List
- [ ] Review Form (with rating)

## Frontend
- [ ] Notification Center (bell icon, dropdown, unread count)
- [ ] Lost & Found UI

## DevOps — Cloud Deployment
- [ ] Backend deployed (Render/Vercel/AWS)
- [ ] Frontend deployed
- [ ] "Cloud deployment ready" per SRS

## Docker
- [ ] Dockerfile backend
- [ ] Dockerfile frontend
- [ ] Docker Compose

## Seed Data
- [ ] `seed/seed.ts`
- [ ] Mock data for presentation
- [ ] Login credentials output

## Config
- [ ] package.json, tsconfig.json, .env
- [ ] start.sh, start-cloudflare.sh

## QA — Manual Testing
- [ ] Cross-browser
- [ ] Mobile responsive
- [ ] Edge cases (vehicle capacity, etc.)

## Documentation & Presentation
- [ ] Compile & format entire Graduation Book
- [ ] Format UML diagrams to university standards
- [ ] Design Presentation Slides
- [ ] Demo Script
- [ ] Backup video walkthrough
- [ ] Track team progress
- [ ] Weekly meeting minutes
- [ ] Graduation Book: "Conclusion" chapter
