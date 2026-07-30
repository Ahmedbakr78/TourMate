# Mai — Full Checklist
**Role:** Frontend Providers, Admin Backend & QA Docs
**Modules:** Notification + Lost Item

## Backend — Notification Module
- [ ] POST `/notifications/create`
- [ ] GET `/notifications/notifications`
- [ ] GET `/notifications/get/:id`
- [ ] GET `/notifications/unread-count`
- [ ] PATCH `/notifications/:id/mark-as-read`
- [ ] PATCH `/notifications/mark-all-as-read`
- [ ] DELETE `/notifications/:id/delete`
- [ ] DELETE `/notifications/delete-all`

## Backend — Lost Item Module
- [ ] POST `/lost_item/create_lost_item`
- [ ] GET `/lost_item/get/:id`
- [ ] GET `/lost_item/:tripId/trip_lost_items`
- [ ] GET `/lost_item/my_lost_items`
- [ ] PATCH `/lost_item/:id/update`
- [ ] PATCH `/lost_item/:id/status`
- [ ] DELETE `/lost_item/:id/delete`
- [ ] PATCH `/lost_item/:id/report-found`
- [ ] PATCH `/lost_item/:id/close`
- [ ] PATCH `/lost_item/:id/reopen`

## Backend — Socket.IO (Real-Time)
- [ ] `socket.ts` — Socket.IO server
- [ ] `sendNotification.ts` — Real-time push
- [ ] Trigger notifications on booking/lost item updates

## Admin Dashboard Backend APIs
- [ ] Verify drivers
- [ ] Verify guides
- [ ] System statistics
- [ ] Manage reports

## Review Module (shared)
- [ ] Calculate average ratings
- [ ] Store comments

## Frontend — Driver App UI
- [ ] Driver Onboarding
- [ ] Driver Dashboard (accept/reject trips, availability, location polls)
- [ ] Driver List

## Frontend — Guide App UI
- [ ] Guide Onboarding
- [ ] Guide Dashboard (schedule, accept/reject, history)
- [ ] Guide List

## Frontend
- [ ] Notification module
- [ ] Lost & Found module
- [ ] Responsive design across all 4 apps
- [ ] Multi-language (i18n)

## Documentation
- [ ] Test Plan
- [ ] Test Case Matrix (14 modules)
- [ ] Graduation Book: "System Testing" chapter
- [ ] Graduation Book: "Quality Assurance" chapter
- [ ] User Manual (Tourist, Driver, Guide, Admin)
