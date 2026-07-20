# Sequence Diagram — Voting on a Place

Trip members create votes (UP/DOWN) on candidate places; results are aggregated. Mirrors `vote.routes.js`. The unique index `{tripId, placeId, userId}` enforces one vote per user per place.

```mermaid
sequenceDiagram
    actor U as Trip Member (Tourist)
    participant C as Angular Client
    participant V as Vote Controller
    participant DB as MongoDB (Vote, Place, Trip)

    U->>C: Open trip voting view
    C->>V: GET /api/votes/place/:placeId (or /user)
    V->>DB: Query votes by placeId / userId
    DB-->>V: Votes[]
    V-->>C: 200 {data:[...]}
    C-->>U: Show current tallies

    U->>C: Cast / change vote
    C->>V: POST /api/votes {tripId, placeId, userId, voteValue:UP}
    V->>DB: Insert Vote (unique index guards duplicates)
    alt duplicate (same user+place+trip)
        DB-->>V: E11000 duplicate key
        V-->>C: 409 / update existing via PATCH /:id
    else success
        DB-->>V: Saved
        V-->>C: 201 {data: vote}
    end
    C-->>U: Tally updates

    U->>C: View aggregated results
    C->>V: GET /api/votes/place/:placeId
    V->>DB: Count UP vs DOWN
    DB-->>V: Result
    V-->>C: 200 {data:{up, down}}
    C-->>U: Display results
```
