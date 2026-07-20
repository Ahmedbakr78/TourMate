# Chapter 8 — Quality Assurance

## 8.1 Quality Assurance Objectives

Quality Assurance (QA) for TourMate extends beyond defect detection to encompass maintainability, security, performance, and standards compliance. Given the project's role as a graduation capstone, QA also validates that the delivered system faithfully matches its documented design — a principle honoured by this very book, whose diagrams and chapters are derived directly from the source code.

## 8.2 Code Quality and Standards

- **Consistent structure** — every backend module follows the `routes → controller → (service)` pattern; every frontend feature is a standalone component with a co-located service.
- **Naming and typing** — Mongoose schemas declare field types and constraints; Angular services return typed models (e.g., `Place` from `place.service.ts`, `Role` from `user.model.ts`).
- **Linting/formatting** — enforced within CI to keep the codebase uniform and reviewable.

## 8.3 Security Assurance

Security is a first-class QA dimension:

1. **Authentication** — JWT bearer tokens with access/refresh separation; passwords hashed and excluded from serialization (`select: false`, `toSafeJSON()`).
2. **Authorization** — RBAC middleware and Angular `roleGuard` provide defence-in-depth, verified both server- and client-side.
3. **Input validation** — Mongoose schema constraints (enums, ranges, uniqueness) and Express body parsing limits reduce injection and malformed-data risk.
4. **Transport hardening** — `helmet()` sets security headers; CORS is scoped to `env.corsOrigin`.
5. **Secret management** — secrets reside in `config/env.js` (environment variables), not in source control.

## 8.4 Data Integrity Assurance

QA verifies referential integrity through Mongoose `ref` declarations and uniqueness indexes (`email`, `phone`, `licenseNumber`, `plateNumber`, `osmId`). The compound unique index on `Vote {tripId, placeId, userId}` guarantees vote integrity. `2dsphere` indexes assure spatial query correctness for driver/place proximity.

## 8.5 Performance and Scalability

- **Polling over sockets** — while introducing more requests, polling avoids persistent connection state, simplifying horizontal scaling behind ordinary load balancers. QA notes the trade-off: client poll interval should be tuned to balance freshness and load.
- **Caching** — the Overpass adapter caches POI queries (`cache.service.js`), reducing external-call volume and latency.
- **Lazy loading** — Angular `loadComponent` splits the bundle per route, improving initial load time.

## 8.6 Resilience and Fault Tolerance

A core QA strength is graceful degradation: external geographic services fall back to mock data on timeout/error, ensuring the platform remains operational during upstream outages. The `error.middleware.js` centralises error formatting, preventing stack-trace leakage to clients.

## 8.7 Documentation and Traceability

- **API documentation** — Swagger (`/api-docs`) is generated from `server/src/docs/swagger.js`, keeping docs adjacent to code.
- **UML accuracy** — the UML appendix in this book is reverse-engineered from actual routes and models, ensuring diagrams are not aspirational but factual.
- **README and task distribution** — `README.md` and `TEAM_TASKS_DISTRIBUTION.md` record setup and responsibilities, supporting auditability.

## 8.8 Known Limitations and Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Polling latency under high driver counts | Stale positions | Tune interval; consider future WebSocket opt-in |
| External API rate limits | Degraded POI/routing | Caching + mock fallback |
| Manual test coverage gaps | Undetected regressions | Expand automated suites in CI |
| Payment component not settled | Incomplete transactions | UI flow present; gateway integration future work |

## 8.9 QA Summary

TourMate demonstrates disciplined QA through modular design, layered security, data-integrity constraints, resilient external integration, and accurate documentation. The combination of route-level RBAC, schema validation, caching, and graceful fallback yields a robust, auditable system appropriate for academic demonstration and extensible for production hardening.
