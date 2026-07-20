# TourMate — Graduation Book (Index)

**TourMate** is a MEAN-stack tourism platform enabling tourists to plan trips, assign guides/drivers/vehicles, track driver location via HTTP polling (no WebSockets), vote on places, review experiences, and report lost-and-found items. This index merges the graduation book chapters and the UML appendix into a single landing point.

## About This Document

This `index.md` is the consolidated entry point for the TourMate graduation documentation. It links to:

- **Graduation book** — `docs/graduation-book/` (chapters 00–10).
- **UML appendix** — `docs/uml/` (use-case, class, sequence, activity, and ER diagrams).

All content is derived directly from the committed source code (`server/src`, `client/src`), ensuring the documentation matches the working system.

## Chapters

- [00 — Title Page](graduation-book/00-title.md)
- [01 — Introduction](graduation-book/01-introduction.md)
- [02 — System Architecture](graduation-book/02-system-architecture.md)
- [03 — Database Design](graduation-book/03-database-design.md)
- [04 — Backend Implementation](graduation-book/04-backend-implementation.md)
- [05 — Frontend Implementation](graduation-book/05-frontend-implementation.md)
- [06 — UI/UX Design](graduation-book/06-ui-ux-design.md)
- [07 — System Testing](graduation-book/07-system-testing.md)
- [08 — Quality Assurance](graduation-book/08-quality-assurance.md)
- [09 — Conclusion and Future Work](graduation-book/09-conclusion.md)
- [10 — Table of Contents](graduation-book/10-toc.md)

## UML Diagrams

- [Use Case](uml/use-case.md)
- [Class Diagram](uml/class-diagram.md)
- [Sequence — Authentication](uml/sequence-auth.md)
- [Sequence — Trip Lifecycle](uml/sequence-trip.md)
- [Sequence — Shared Trip](uml/sequence-shared-trip.md)
- [Sequence — Location Tracking (Polling)](uml/sequence-tracking.md)
- [Sequence — Lost & Found](uml/sequence-lost-found.md)
- [Sequence — Voting](uml/sequence-voting.md)
- [Activity — Tourist](uml/activity-tourist.md)
- [Activity — Driver](uml/activity-driver.md)
- [Activity — Guide](uml/activity-guide.md)
- [Entity-Relationship Diagram](uml/erd.md)

## Key Facts at a Glance

| Aspect | Value |
|--------|-------|
| Stack | MongoDB, Express.js, Angular, Node.js |
| Roles | ADMIN, TOURIST, DRIVER, GUIDE |
| Auth | JWT bearer + RBAC |
| Real-time | HTTP polling (no WebSockets) |
| Collections | 10 (User, Driver, Guide, Vehicle, Place, Trip, Vote, Review, LostItem, Notification) |
| External APIs | Overpass (POIs), OSRM/OpenRouteService (routing) |

## How to Use

Begin with the [Table of Contents](graduation-book/10-toc.md) for the recommended reading order, or jump straight to a chapter or diagram above. The UML diagrams are embedded as Mermaid code blocks and can be rendered by any Mermaid-capable Markdown viewer.
