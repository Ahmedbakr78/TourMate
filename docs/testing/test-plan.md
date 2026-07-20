# TourMate — Test Plan

## 1. Introduction

This document defines the overall QA strategy for **TourMate**, a multi-role tourism platform
built on the MEAN stack (MongoDB, Express, Angular 17+, Node.js). The system exposes a single
stateless REST API consumed by four Angular client applications: **Tourist**, **Driver**,
**Guide**, and **Admin**. Live trip tracking is implemented with **HTTP polling** (no WebSockets).

The goal of testing is to verify that every module behaves correctly in isolation (unit), that
the API contract holds end-to-end (integration), and that the role-specific user journeys work
as a whole (manual E2E).

## 2. Scope

### In Scope
- All backend modules: `auth`, `user`, `admin`, `trip`, `place`, `vote`, `review`, `vehicle`,
  `notification`, `lost_item`, `driver`, `guide`, `tracking`, `external`.
- RBAC enforcement on protected routes.
- File uploads (profile image, vehicle image, guide certificate) — image-only filter.
- Real-time location polling (driver push → client poll).
- i18n (English / Arabic) and RTL layout switching.

### Out of Scope
- Third-party external APIs (Overpass POI, routing) beyond the server-side proxy wrapper.
- Load/performance/security penetration testing (recommended as future work).

## 3. Test Levels

### 3.1 Unit Testing (Services)
- **Target:** backend service layer (`server/src/modules/**/*.service.js`) and pure client helpers.
- **Tooling:** Jest (Node) for backend services; Jasmine/Karma or Vitest for Angular services.
- **Focus:**
  - Business rules: price calculation, vehicle capacity validation, lost-item lifecycle state
    transitions, RBAC role checks, notification read-status toggling.
  - Input validation and error mapping (`ApiError` → HTTP status).
  - Pure functions (formatting, geo-distance, i18n key resolution).
- **Mocking:** MongoDB access mocked with `mongodb-memory-server` or sinon stubs; external HTTP
  calls stubbed.

### 3.2 Integration Testing (API)
- **Target:** full HTTP request → controller → service → DB path.
- **Tooling:** Postman (collection committed under `postman/` and `.postman/`) and `curl` for
  ad-hoc checks. Optionally Supertest against the Express app with a test MongoDB.
- **Coverage:** every route in `server/src/modules/*/*.routes.js`, including:
  - happy path + error path (401/403/404/422).
  - auth middleware (`authenticate`) and `rbac(...)` role boundaries.
  - multipart upload endpoints with valid and invalid file types.
- **Data:** seeded test fixtures; each run cleans up created records.

### 3.3 End-to-End / Manual Testing
- **Target:** complete user journeys through the Angular UIs.
- **Tooling:** Manual execution on a staging build; optionally Cypress/Playwright for smoke flows.
- **Coverage:** the cross-role demo flow (Tourist books → Admin approves guide/driver → Driver
  shares location → Tourist tracks → Lost item reported → Review submitted). See
  `../presentation/demo-script.md`.

## 4. Environments

| Environment | Purpose | Backend | Frontend | DB |
|-------------|---------|---------|----------|----|
| Local (dev) | Development | `npm run dev` (server) | `ng serve` (client) | local MongoDB |
| CI | Automated unit/integration | GitHub Actions runner | n/a | `mongodb-memory-server` |
| Staging | Manual E2E / demo | Docker container | Docker container | MongoDB container |
| Production | Defense demo | Docker Compose (`docker-compose.yml`) | Docker Compose | MongoDB container |

All environments share the same `.env` contract (`PORT`, `MONGODB_URI`, `JWT_SECRET`,
`UPLOAD_DIR`, `UPLOAD_MAX_FILE_SIZE_MB`, external API keys).

## 5. Test Data Strategy
- Role accounts pre-seeded: one `admin`, one `tourist`, one `driver`, one `guide`.
- Deterministic fixtures for places, vehicles, and a sample trip.
- Upload tests use a real small PNG (valid) and a `.txt` (invalid) fixture.

## 6. Entry Criteria
- Code merged to `main` and building (CI green).
- API documentation (route list) matches implementation.
- Test environment provisioned and reachable.
- Seed/fixture scripts available.

## 7. Exit Criteria
- 100% of integration routes exercised (happy + at least one error path each).
- All P1/P2 test cases in `test-cases.md` passing.
- No open Critical/High severity defects.
- Manual E2E demo flow completed successfully on staging.
- Known limitations documented.

## 8. Defect Management
- Severity: Critical (data loss / security), High (core flow broken), Medium (minor UX),
  Low (cosmetic).
- Triage in weekly QA sync; Critical/High must be fixed before exit.

## 9. Risks & Mitigations
- **Polling latency** can make tracking feel laggy → test with realistic poll intervals and
  document expected latency.
- **RBAC regressions** easily slip → integration tests assert 403 on forbidden roles.
- **Upload filter bypass** → negative tests with non-image MIME types.
