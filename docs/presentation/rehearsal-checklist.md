# TourMate — Rehearsal & Defense Checklist

Use this before the defense to confirm everything is ready.

## A. Environment & Build
- [ ] `docker-compose.yml` brings up server + client + MongoDB cleanly (or local `npm run dev` + `ng serve`).
- [ ] All four seeded accounts (admin, tourist, driver, guide) can log in.
- [ ] App loads without console errors; no 404 on static assets.
- [ ] `.env` values present: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `UPLOAD_DIR`, `UPLOAD_MAX_FILE_SIZE_MB`, external API keys.

## B. Demo Readiness (from `demo-script.md`)
- [ ] Scene 1: tourist can create trip, calculate price, assign guide/driver/vehicle (capacity ≥ travellers).
- [ ] Scene 2: admin sees pending guide/driver and can approve (notification fires).
- [ ] Scene 3: driver availability toggle works; location push succeeds.
- [ ] Scene 4: tourist map shows driver marker within poll latency.
- [ ] Scene 5: lost-item lifecycle open → found → closed works; illegal transition blocked.
- [ ] Scene 6: review submit succeeds and appears on profiles.
- [ ] Backup plan ready if live tracking lags (show `sequence-polling.md`).

## C. Slides (`outline.md`)
- [ ] 20–22 slides prepared; order verified.
- [ ] UML diagrams inserted: use-case, ERD, class/architecture, authentication, trip-booking, polling, overpass.
- [ ] Screenshots captured for Tourist/Driver/Guide/Admin apps + EN/LTR vs AR/RTL.
- [ ] Test summary slide references `testing/test-cases.md`.

## D. QA Evidence (`testing/`)
- [ ] `test-plan.md` reviewed; entry/exit criteria clear.
- [ ] Postman collection (`postman/`, `.postman/`) imports and runs; key 401/403/422 cases pass.
- [ ] P1 test cases from `test-cases.md` all passing on staging.
- [ ] Edge cases verified: vehicle capacity limit, concurrent booking, RBAC boundaries, invalid upload type, notification read status, i18n/RTL.

## E. Content & Speaking
- [ ] Every presenter knows their module(s) and speaks to architecture + own contributions.
- [ ] Demo narration rehearsed end-to-end (≈10 min).
- [ ] Q&A prep: RBAC design, polling vs WebSockets choice, capacity/concurrency handling, upload security, i18n approach.
- [ ] Repo, README, and `docs/` are committed and accessible.

## F. Logistics
- [ ] Laptop + charger; projector/adapter tested.
- [ ] Backup PDF of slides + offline copy of demo (or recorded video) in case of network failure.
- [ ] Printed/quick-reference of API endpoints and role matrix.
- [ ] Time budget: ~10 min demo + ~10 min talk + Q&A.
