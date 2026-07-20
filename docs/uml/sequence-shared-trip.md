# Sequence Diagram — Shared Trip & Cost Split

A tourist marks a trip as shared; other tourists browse shared trips and can split the estimated cost. The `Trip` model exposes `isShared` and `peopleCount`; cost split is derived as `price / peopleCount`. Mirrors `trip.routes.js` (`shareTrip`, `getSharedTrips`, `duplicateTrip`).

```mermaid
sequenceDiagram
    actor O as Owner (Tourist)
    actor P as Peer (Tourist)
    participant C as Angular Client
    participant TR as Trip Controller
    participant DB as MongoDB (Trip)

    O->>C: Open trip detail
    C->>TR: PATCH /api/trips/:id/share {isShared:true}
    TR->>DB: Set Trip.isShared = true
    DB-->>TR: Saved
    TR-->>C: 200
    C-->>O: "Trip is now shared"

    P->>C: Open "Shared Trips"
    C->>TR: GET /api/trips/shared
    TR->>DB: Query Trip.find({isShared:true}).populate('places','touristId')
    DB-->>TR: Shared trip list
    TR-->>C: 200 {data:[...]}
    C-->>P: Show shared trips

    P->>C: View a shared trip + cost
    C->>C: Compute split = price / peopleCount
    C-->>P: Display per-person cost

    P->>C: "Join" (reuse itinerary)
    C->>TR: POST /api/trips/:id/duplicate
    TR->>DB: Clone Trip for P (isShared=false by default)
    DB-->>TR: New Trip
    TR-->>C: 201 {data: newTrip}
    C-->>P: "Added to your trips"
```
