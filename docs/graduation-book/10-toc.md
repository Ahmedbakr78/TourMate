# Chapter 10 — Table of Contents

This chapter provides a navigable index of the TourMate graduation book and its UML appendix. All links are relative to the `docs/` directory.

## Graduation Book Chapters

| # | Chapter | File |
|---|---------|------|
| 00 | Title Page | [00-title.md](00-title.md) |
| 01 | Introduction | [01-introduction.md](01-introduction.md) |
| 02 | System Architecture | [02-system-architecture.md](02-system-architecture.md) |
| 03 | Database Design | [03-database-design.md](03-database-design.md) |
| 04 | Backend Implementation | [04-backend-implementation.md](04-backend-implementation.md) |
| 05 | Frontend Implementation | [05-frontend-implementation.md](05-frontend-implementation.md) |
| 06 | UI/UX Design | [06-ui-ux-design.md](06-ui-ux-design.md) |
| 07 | System Testing | [07-system-testing.md](07-system-testing.md) |
| 08 | Quality Assurance | [08-quality-assurance.md](08-quality-assurance.md) |
| 09 | Conclusion and Future Work | [09-conclusion.md](09-conclusion.md) |
| — | Landing / Index | [index.md](index.md) |

## UML Diagram Appendix (`docs/uml/`)

| Diagram | File | Description |
|---------|------|-------------|
| Use Case | [use-case.md](uml/use-case.md) | Actors and per-module use cases |
| Class Diagram | [class-diagram.md](uml/class-diagram.md) | The 10 models and key relations |
| Sequence — Auth | [sequence-auth.md](uml/sequence-auth.md) | Register/login → JWT → guarded route |
| Sequence — Trip | [sequence-trip.md](uml/sequence-trip.md) | Create → assign → start → complete |
| Sequence — Shared Trip | [sequence-shared-trip.md](uml/sequence-shared-trip.md) | Share → view → cost split |
| Sequence — Tracking | [sequence-tracking.md](uml/sequence-tracking.md) | Polling-based location (no WebSockets) |
| Sequence — Lost & Found | [sequence-lost-found.md](uml/sequence-lost-found.md) | Report → found → notify |
| Sequence — Voting | [sequence-voting.md](uml/sequence-voting.md) | Vote on place → results |
| Activity — Tourist | [activity-tourist.md](uml/activity-tourist.md) | Tourist journey flow |
| Activity — Driver | [activity-driver.md](uml/activity-driver.md) | Driver journey flow |
| Activity — Guide | [activity-guide.md](uml/activity-guide.md) | Guide journey flow |
| ER Diagram | [erd.md](uml/erd.md) | Entity relationships (Mermaid erDiagram) |

## Quick Reading Path

1. Start with **00-title** and **01-introduction** for context and objectives.
2. Read **02-system-architecture** and **03-database-design** alongside the [class-diagram](uml/class-diagram.md) and [erd](uml/erd.md).
3. Study **04-backend-implementation** and **05-frontend-implementation** with the sequence diagrams.
4. Review **06-ui-ux-design**, **07-system-testing**, and **08-quality-assurance** for non-functional aspects.
5. Conclude with **09-conclusion** and the future-work roadmap.

## Conventions

- All sequence and activity diagrams use **Mermaid** fenced code blocks and are validated for syntax.
- Actor roles referenced in diagrams correspond to the `User.role` enum: `ADMIN`, `TOURIST`, `DRIVER`, `GUIDE`.
- Endpoint names in diagrams match the live Express routes under `server/src/modules/*/*.routes.js`.
