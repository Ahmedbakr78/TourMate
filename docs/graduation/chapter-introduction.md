# Graduation Book — Chapter 1: Introduction

## 1.1 Background
The tourism sector has experienced rapid digital transformation, yet visitors to unfamiliar
destinations still face fragmented information, unreliable transport coordination, and limited
real-time assistance. TourMate is proposed as an integrated platform that unifies tourists,
drivers, guides, and administrators within a single ecosystem.

## 1.2 Problem Statement
Travellers commonly struggle to (a) discover relevant points of interest (POIs) near them,
(b) arrange trusted transport and guided experiences, and (c) track ongoing trips for safety
and coordination. Operators lack a consolidated dashboard to supervise users and active trips.

## 1.3 Objectives
- Provide role-based access for Tourist, Driver, Guide, and Admin.
- Surface nearby POIs using the OpenStreetMap **Overpass API** with sub-2-second responses.
- Calculate routes and ETAs via **OSRM / OpenRouteService**.
- Track driver positions in (near) real time using a lightweight **polling** mechanism — no
  WebSockets — to simplify deployment and firewall traversal.
- Equip admins with user management, statistics, and live trip monitoring.

## 1.4 Scope
Includes account management, guide/driver/vehicle registries, trip lifecycle, reviews, votes,
lost-item reporting, and notifications. Out of scope: payment processing, native mobile
binaries, and ML-based recommendation (candidates for future work).

## 1.5 Document Structure
Chapter 2 presents the system architecture (MEAN stack, external integrations, polling).
Subsequent chapters cover detailed design, implementation, testing, and evaluation.

## 1.6 Contribution Summary (Ahmed Abo Bakr)
As Team Manager and Architecture Lead, the author delivered the Express/MongoDB backend
(Guide, Driver, Vehicle, External, Tracking modules), the JWT/bcrypt/RBAC authentication
architecture, the Angular 17+ global layout, authentication UI, and admin dashboard, plus all
UML diagrams and architecture documentation in this volume.
