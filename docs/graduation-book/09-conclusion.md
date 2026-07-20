# Chapter 9 — Conclusion and Future Work

## 9.1 Summary of Achievements

TourMate successfully delivers an integrated, role-aware tourism platform built on the MEAN stack. The completed system realises every objective set out in Chapter 1:

- A secure **JWT + RBAC** authentication subsystem supporting four roles (Tourist, Driver, Guide, Admin).
- A full **trip lifecycle** with guide, driver, and vehicle assignment, price estimation, and sharing.
- **External geographic integration** with Overpass (POIs) and OSRM/OpenRouteService (routing), resilient through caching and mock fallback.
- A **polling-based real-time tracking** subsystem that deliberately avoids WebSockets for deployment simplicity.
- Collaborative features — **shared trips, place voting, reviews, notifications, and lost-and-found** — that round out the tourist experience.

The implementation is modular on both server and client, documented via Swagger and a Postman collection, and supported by CI and container-orchestration scaffolding.

## 9.2 Contributions

The project contributes a coherent reference implementation demonstrating how a modern Angular standalone application with Signals can consume a clean Express/Mongoose REST API. Its polling-tracking design offers a pragmatic alternative to socket-heavy real-time architectures, and its dual-purpose schema (canonical + extension fields) illustrates backward-compatible schema evolution. The accompanying UML appendix provides an accurate, code-derived model valuable for academic review.

## 9.3 Lessons Learned

- **Modularity pays off** — the route/controller/service separation made the system easy to extend (e.g., adding the lost-item module) without disturbing existing flows.
- **Defence in depth** — enforcing RBAC on both server middleware and client guards improved confidence and UX clarity.
- **Resilience by default** — the mock-fallback strategy for external APIs proved essential for offline development and testing.
- **Documentation discipline** — generating diagrams and chapters directly from source prevented drift between the book and the running system.

## 9.4 Limitations

Despite its completeness, TourMate has boundaries: the payment flow is a UI component without a settled gateway; automated test coverage is anchored on the Postman collection rather than a full unit/integration suite; real-time tracking relies on polling, which trades immediacy for simplicity; and native mobile clients are out of scope.

## 9.5 Future Work

Several natural extensions are recommended:

1. **Real-time upgrade path** — optionally introduce WebSockets or Server-Sent Events as a configurable transport alongside polling for lower-latency tracking.
2. **Payment settlement** — integrate a real payment gateway (e.g., Stripe) to complete the transaction lifecycle implied by `PaymentComponent`.
3. **Automated testing** — expand Jest/Supertest and Karma/Jasmine suites, and add load testing for the polling tracker.
4. **Recommendation engine** — leverage Vote and Review data to suggest places and guides.
5. **Mobile applications** — wrap the Angular SPA or build native clients sharing the same API.
6. **Analytics dashboards** — extend admin `stats`/`reports` with time-series and geographic visualisations.
7. **Accessibility audit** — formal WCAG evaluation and remediation.

## 9.6 Final Remarks

TourMate stands as a fully functional, well-structured graduation project that integrates planning, personnel coordination, real-time awareness, collaboration, and community safety into one platform. Its adherence to clean architecture, security best practices, and accurate documentation makes it both a credible academic deliverable and a solid foundation for future productisation.
