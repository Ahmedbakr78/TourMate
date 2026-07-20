# Sequence Diagram — Location Tracking (Polling)

**Important:** TourMate uses HTTP **polling**, NOT WebSockets. The driver periodically pushes its location; the tourist/admin periodically polls for the latest known position. Mirrors `tracking.routes.js` and `tracking.service.ts`.

```mermaid
sequenceDiagram
    actor D as Driver
    actor T as Tourist
    participant DC as Driver App (Angular)
    participant TC as Tourist App (Angular)
    participant TS as TrackingService
    participant TR as Tracking Controller
    participant DB as MongoDB (Driver.currentLocation)

    Note over D,DB: DRIVER PUSHES LOCATION (source of truth)
    D->>DC: Device geolocation updates
    DC->>TS: pushLocation(driverId, lng, lat, {heading,speed,tripId})
    TS->>TR: POST /api/tracking/driver/:driverId/location
    TR->>DB: Upsert Driver.currentLocation + lastSeen
    DB-->>TR: Saved
    TR-->>DC: 200 {data: DriverLocation}
    Note right of DC: Repeated on an interval (polling)

    Note over T,DB: TOURIST POLLS LOCATION (no socket)
    T->>TC: Open trip tracking view
    TC->>TS: pollDriver(driverId)
    TS->>TR: GET /api/tracking/driver/:driverId
    TR->>DB: Read latest currentLocation
    DB-->>TR: DriverLocation
    TR-->>TS: 200 {data: DriverLocation}
    TS-->>TC: Emit location
    TC-->>T: Render marker on map
    Note right of TC: Repeated on an interval -> map updates

    T->>TC: (optional) View all active trips
    TC->>TS: pollActiveTrips()
    TS->>TR: GET /api/tracking/active-trips
    TR->>DB: Read all active driver locations
    DB-->>TR: DriverLocation[]
    TR-->>TS: 200 {data:[...]}
    TS-->>TC: Emit list
    TC-->>T: Render all markers
```
