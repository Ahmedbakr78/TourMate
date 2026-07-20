# Chapter 1 — Introduction

## 1.1 Background

The global tourism sector has undergone a profound digital transformation, with travellers increasingly relying on web and mobile applications to discover destinations, organise itineraries, and coordinate local services such as transport and guiding. Despite the abundance of generic travel aggregators, there remains a gap for platforms that unify trip planning, personnel assignment (guides and drivers), real-time location awareness, collaborative decision-making, and community safety features (such as lost-and-found reporting) within a single coherent system.

**TourMate** was conceived as a graduation-capstone response to this gap. It is a full-stack web application that allows a registered tourist to compose a multi-stop itinerary, attach professional guides and drivers (with vehicles), estimate cost, share the trip with other travellers, and visually track an assigned driver's position on a map. Alongside the core trip-lifecycle, the platform provides collaborative voting on candidate places, a reviews subsystem, and a lost-and-found module that alerts users when items are reported or recovered.

## 1.2 Problem Statement

Travellers planning a visit to an unfamiliar region face several fragmented problems:

- **Discovery** — finding relevant points of interest (POIs) near a chosen location requires external, non-integrated tools.
- **Coordination** — assigning and managing guides, drivers, and vehicles is manual and error-prone.
- **Awareness** — tourists lack a simple way to know where their assigned driver is during an ongoing trip.
- **Collaboration** — group travellers have no structured mechanism to vote on which places to include.
- **Safety** — lost items during trips have no centralised reporting and notification channel.

## 1.3 Objectives

The primary objective of TourMate is to deliver an integrated, role-aware tourism platform. The specific objectives are:

1. Implement secure authentication with role-based access control (RBAC) for four actor roles: **Tourist, Driver, Guide, Admin**.
2. Provide a complete trip lifecycle: draft → pending → confirmed → ongoing → completed → cancelled, with guide/driver/vehicle assignment.
3. Integrate external geographic services (Overpass for POIs, OSRM/OpenRouteService for routing) with graceful fallback to mock data.
4. Provide a real-time location view using an HTTP **polling** model (no WebSockets) for maximum deployment simplicity and broad client compatibility.
5. Enable collaborative features: shared trips, place voting, reviews, notifications, and lost-and-found.

## 1.4 Scope

The system scope includes a Node.js/Express REST API, a MongoDB document store, and an Angular single-page application. Out of scope are native mobile applications, payment-gateway settlement (a payment component exists but integrates as a UI flow), and multi-tenant enterprise administration.

## 1.5 Methodology

TourMate follows an Agile, modular development methodology. The backend is decomposed into feature modules (auth, trip, tracking, external, vote, lost-item, notification, admin, and resource modules for guide/driver/vehicle/place/review/user). The frontend is built with Angular standalone components and Signals for reactive state. Continuous integration is configured via GitHub Actions (present under `.github/`), and containerised deployment is supported through `docker-compose.yml`.

## 1.6 Contributions

The principal contributions of this work are:

- A cohesive MEAN-stack reference implementation suitable for academic demonstration.
- A polling-based real-time tracking subsystem that avoids socket infrastructure complexity.
- A clean separation between a canonical data schema (shared across backend implementations) and extension fields used by advanced features (OSRM routes, geo-tracking).

## 1.7 Book Organisation

Chapters 2 through 9 present the architecture, database design, backend and frontend implementation, UI/UX, testing, quality assurance, and conclusions respectively. Chapter 10 provides a navigable table of contents, and an appendix of UML diagrams accompanies this book under `docs/uml/`.
