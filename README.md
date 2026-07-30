# Bavly — Trips, Voting & Payment

## Overview

Bavly owns the trip lifecycle — building trips (with place/guide/driver/vehicle selection), listing my trips, viewing trip details (with reviews, votes, lost items), sharing trips for others to join, and a payment simulation. Also owns the vote/rating system for trips and the core `TripService` and `VoteService`.

## Files (12 total)

### `src/app/core/models/`
| File | Type | Description |
|---|---|---|
| `trip.model.ts` | Model | `ITrip`, `ICreateTripPayload` — full trip structure with nested driver, guide, place, vehicle, user refs |
| `vote.model.ts` | Model | `IVote` — vote on trips with vote value, linked to place and user |

### `src/app/core/services/`
| File | Type | Description |
|---|---|---|
| `trip.service.ts` | Service | Trip API — CRUD, join shared trip, status transitions |
| `trip.service.spec.ts` | Test | TripService unit tests |
| `vote.service.ts` | Service | Vote API — cast and retrieve votes |

### `src/app/features/trips/`
| File | Type | Description |
|---|---|---|
| `trips.module.ts` | Module | Trips feature module |
| `trips-routing.module.ts` | Module | Trip routes (builder, my-trips, shared, payment, detail) |
| `trip-builder/trip-builder.component.ts` | Component | Multi-step trip planner — choose place, guide, driver, vehicle, date |
| `my-trips/my-trips.component.ts` | Component | List user's trips with status filtering |
| `trip-detail/trip-detail.component.ts` | Component | Full trip view — details, reviews, votes, lost items, status actions |
| `shared-trip/shared-trip.component.ts` | Component | Browse trips shared by others, join with vehicle selection |
| `payment/payment.component.ts` | Component | Payment simulation for a trip |

## Dependencies

### From `shared/`
- `AuthGuard` — route protection
- `SharedModule` — shared UI components
- `TripStatusEnum`, `VoteValueEnum`
- `ConfirmDialogComponent`
- `environment` — API base URL
- `ISuccessResponse`, `IPaginateResult` — response wrapping
- `IUser` — user model used in trip/vote models

### From `Ramadan/` (cross-member)
- `PlaceService` — used by trip-builder to list/select places
- `IPlace` — place model used in trip and vote models

### From `Ahmed_Abo_Bakr/` (cross-member)
- `GuideService`, `DriverService`, `VehicleService` — used by trip-builder for entity selection
- `IGuide`, `IDriver`, `IVehicle` — used in trip model and trip-builder

### From `Mai/` (cross-member)
- `LostItemService` — used by trip-detail for lost item reporting
- `ILostItem` — imported by trip-detail

### From `Ramadan/` (cross-member)
- `ReviewService` — used by trip-detail for reviews display
- `IReview` — imported by trip-detail

## Consumers (who depends on Bavly)

| Consumer | What they use |
|---|---|
| `shared/` (app-routing.module.ts) | Lazy-loads `TripsModule` |
| `Jamal/` | `AdminService` imports `ITrip`; `AdminTripManagementComponent` imports `TripService`, `ITrip` |
| `Ahmed_Abo_Bakr/` | `guide-dashboard` and `driver-dashboard` import `TripService`, `ITrip` |
| `Ramadan/` | `review.model` imports `ITrip`; `review-form` imports `TripService` |
| `Mai/` | `lost-item.model` imports `ITrip` |

## Known Issues

1. `trip-builder.component.ts` imports `PlaceService`, `GuideService`, `DriverService`, `VehicleService`, `IPlace`, `IGuide`, `IDriver`, `IVehicle` from `../../../core/` paths that resolve within Bavly. These belong to Ramadan and Ahmed_Abo_Bakr. Paths need updating to point to the correct member folders.
2. `trip-detail.component.ts` imports `ReviewService`, `LostItemService`, `IPlace`, `IReview`, `ILostItem` from `../../../core/` paths that resolve within Bavly. These belong to Ramadan and Mai.
3. `shared-trip.component.ts` imports `IVehicle` from Ahmed_Abo_Bakr — path resolves within Bavly.
4. `trip.model.ts` imports `IDriver`, `IGuide`, `IVehicle`, `IPlace` — models owned by other members.
5. `vote.model.ts` imports `IPlace` — model owned by Ramadan.
