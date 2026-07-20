# Chapter 7 — System Testing

## 7.1 Testing Strategy

TourMate adopts a multi-layered testing strategy aligned with its modular architecture. Because the backend exposes a well-defined REST contract and the frontend consumes it through typed services, testing is organised into (a) API/contract verification, (b) unit and integration coverage of business logic, and (c) end-to-end behavioural checks of critical user flows. The repository ships a Postman collection (`TourMate.postman_collection.json`, `postman/`, `.postman/`) that documents and exercises the live endpoints, serving as an executable API specification and a manual integration test harness.

## 7.2 API Contract Testing with Postman

The Postman collection enumerates requests for authentication, trips, tracking, votes, places, reviews, lost-items, notifications, and admin operations. Testers can run the collection against a running instance to validate:

- Successful registration/login and token issuance.
- Role-restricted endpoints returning `401`/`403` when unauthenticated/unauthorized.
- Trip lifecycle transitions (create → assign → start → complete).
- Polling endpoints returning the latest driver location.
- External endpoints (`/pois`, `/route`) returning data or graceful mock fallbacks.

This collection is the primary artefact for black-box verification and onboarding new contributors.

## 7.3 Backend Test Considerations

Although the committed suite is centred on the Postman collection, the controller/route separation enables straightforward automated testing with Supertest + Jest/Mocha. Key scenarios to validate:

1. **Authentication** — invalid credentials rejected; JWT verified; refresh-token rotation.
2. **RBAC** — a tourist cannot access `PATCH /api/admin/users/:id/block`; a driver can push location but not poll admin-only aggregates improperly.
3. **Trip constraints** — only one vote per user per place per trip (unique compound index); `peopleCount ≥ 1`; non-negative `price`.
4. **Tracking** — `POST /location` stores coordinates; subsequent `GET` returns the same; `2dsphere` queries locate nearby drivers.
5. **External resilience** — Overpass/OSRM failures yield mock data without throwing.

## 7.4 Frontend Test Considerations

The standalone-component architecture with injected services is amenable to Angular's `TestBed`. Recommended component and service tests:

- **Role guard** — `roleGuard(['admin'])` redirects a tourist to `/login`.
- **Auth interceptor** — attaches `Authorization` header; refreshes on `401`.
- **Trip-new component** — calculates price after debounce; creates trip; opens payment when price > 0.
- **Layout** — renders role-scoped nav; updates unread badge from `NotificationService`.
- **Tracking service** — `pollDriver` maps to `GET /tracking/driver/:id`; `pushLocation` maps to `POST`.

## 7.5 Continuous Integration

The `.github/` directory contains workflow definitions that automate build and test execution on push/pull-request. CI ensures that lint, build, and test stages pass before merges, providing a safety net for collaborative development.

## 7.6 Test Environment and Data

The `docker-compose.yml` and `run.sh` scripts provision a reproducible environment (API + MongoDB), enabling deterministic integration testing. Seed or fixture data can be inserted into MongoDB to exercise trip, vote, and lost-item flows without external dependencies.

## 7.7 Coverage and Limitations

Manual and collection-based testing cover the principal happy paths and authorization boundaries. Automated unit/integration coverage, performance/load testing of the polling tracker under high concurrency, and formal accessibility audits represent areas for expansion. The mock-fallback design of external services simplifies offline testing but should be complemented by contract tests against staging instances of Overpass and OSRM.

## 7.8 Summary

Testing in TourMate is pragmatic and contract-first: a thorough Postman collection mirrors the real API, role and validation rules are enforceable at the route layer, and the modular code structure invites automated unit/integration tests. This foundation supports confident deployment and future test automation growth.
