# TourMate — Sequence Diagrams

---

## 1. Authentication — Login Flow

```
 User              Frontend              AuthController         AuthService           User Model
  │                    │                      │                     │                     │
  │  POST /auth/signin │                      │                     │                     │
  │───────────────────>│                      │                     │                     │
  │                    │                      │                     │                     │
  │                    │  signIn(req, res)    │                     │                     │
  │                    │─────────────────────>│                     │                     │
  │                    │                      │                     │                     │
  │                    │                      │ signIn(email, pwd)  │                     │
  │                    │                      │────────────────────>│                     │
  │                    │                      │                     │                     │
  │                    │                      │                     │  findOne({ email })  │
  │                    │                      │                     │────────────────────>│
  │                    │                      │                     │                     │
  │                    │                      │                     │     User | null     │
  │                    │                      │                     │<────────────────────│
  │                    │                      │                     │                     │
  │                    │                      │           ┌─ if !user → 401 Unauthorized │
  │                    │                      │                     │                     │
  │                    │                      │                     │  bcrypt.compare()    │
  │                    │                      │                     │────────────────┐    │
  │                    │                      │                     │                │    │
  │                    │                      │                     │<───────────────┘    │
  │                    │                      │                     │                     │
  │                    │                      │           ┌─ if wrong → 401              │
  │                    │                      │                     │                     │
  │                    │                      │                     │  generateTokenPair() │
  │                    │                      │                     │────────────────┐    │
  │                    │                      │                     │                │    │
  │                    │                      │                     │<───────────────┘    │
  │                    │                      │                     │                     │
  │                    │                      │      { accessToken, refreshToken }        │
  │                    │                      │<────────────────────│                     │
  │                    │                      │                     │                     │
  │                    │   200 { tokens, user }│                    │                     │
  │                    │<─────────────────────│                     │                     │
  │                    │                      │                     │                     │
  │    Store tokens    │                      │                     │                     │
  │<───────────────────│                      │                     │                     │
```

**Error flows:**
- Invalid email → `401 { message: "Invalid email or password" }`
- Account blocked → `401 { message: "Account blocked, contact admin" }`
- Email not verified → `401 { message: "Please verify your email first" }`

---

## 2. Create Trip Flow

```
 User            Frontend           TripController         TripService           Place    Guide/Driver
  │                  │                    │                     │                   │          │
  │  POST /trips     │                    │                     │                   │          │
  │─────────────────>│                    │                     │                   │          │
  │                  │                    │                     │                   │          │
  │                  │  createTrip(req)   │                     │                   │          │
  │                  │───────────────────>│                     │                   │          │
  │                  │                    │                     │                   │          │
  │                  │                    │  calculatePrice()   │                   │          │
  │                  │                    │────────────────────>│                   │          │
  │                  │                    │                     │     validate      │          │
  │                  │                    │                     │     each place    │          │
  │                  │                    │                     │──────────────────>│          │
  │                  │                    │                     │     Place[]       │          │
  │                  │                    │                     │<──────────────────│          │
  │                  │                    │                     │                   │          │
  │                  │                    │          ┌─ if any place invalid → 400  │          │
  │                  │                    │                     │                   │          │
  │                  │                    │   check avail.     │                   │          │
  │                  │                    │   guide/driver/    │                   │          │
  │                  │                    │   vehicle          │                   │          │
  │                  │                    │────────────────────────────────────────────────>│
  │                  │                    │                     │                   │          │
  │                  │                    │   Availability     │                   │          │
  │                  │                    │<────────────────────────────────────────────────│
  │                  │                    │                     │                   │          │
  │                  │                    │   create trip       │                   │          │
  │                  │                    │   (status: draft)   │                   │          │
  │                  │                    │────────────────────>│                   │          │
  │                  │                    │                     │   save to DB      │          │
  │                  │                    │                     │──────────────────┐│          │
  │                  │                    │                     │                  ││          │
  │                  │                    │                     │<─────────────────┘│          │
  │                  │                    │                     │                   │          │
  │                  │   201 { trip }    │                     │                   │          │
  │                  │<───────────────────│                     │                   │          │
  │                  │                    │                     │                   │          │
  │     Show trip    │                    │                     │                   │          │
  │<─────────────────│                    │                     │                   │          │
```

---

## 3. Voting During Trip Flow

```
 User              Frontend            VoteController          VoteService          DB
  │                    │                    │                     │                  │
  │  POST /votes       │                    │                     │                  │
  │───────────────────>│                    │                     │                  │
  │                    │                    │                     │                  │
  │                    │  createVote(req)   │                     │                  │
  │                    │───────────────────>│                     │                  │
  │                    │                    │                     │                  │
  │                    │                    │  create(voteData)   │                  │
  │                    │                    │────────────────────>│                  │
  │                    │                    │                     │                  │
  │                    │                    │                     │  Check unique    │
  │                    │                    │                     │  (trip+place+    │
  │                    │                    │                     │   user)          │
  │                    │                    │                     │────────────────>│
  │                    │                    │                     │                  │
  │                    │                    │           ┌─ duplicate → 400          │
  │                    │                    │                     │                  │
  │                    │                    │                     │  INSERT vote     │
  │                    │                    │                     │────────────────>│
  │                    │                    │                     │                  │
  │                    │                    │   201 { vote }     │                  │
  │                    │                    │<────────────────────│                  │
  │                    │                    │                     │                  │
  │                    │  201 { vote }     │                     │                  │
  │                    │<───────────────────│                     │                  │
  │                    │                    │                     │                  │
  │    Show vote       │                    │                     │                  │
  │<───────────────────│                    │                     │                  │
```

---

## 4. Real-Time Location Tracking

```
 Driver App            Frontend            LocationController    LocationStore       Tourist App
     │                    │                      │                    │                  │
     │  POST /locations   │                      │                    │                  │
     │───────────────────>│                      │                    │                  │
     │  { lat, lng }     │                      │                    │                  │
     │                    │                      │                    │                  │
     │                    │  updateLocation(req) │                    │                  │
     │                    │─────────────────────>│                    │                  │
     │                    │                      │                    │                  │
     │                    │                      │  setLocation()     │                  │
     │                    │                      │───────────────────>│                  │
     │                    │                      │                    │                  │
     │                    │                      │                    │  Store in Map    │
     │                    │                      │    200 OK          │                  │
     │                    │                      │<───────────────────│                  │
     │    200 OK          │                      │                    │                  │
     │<───────────────────│                      │                    │                  │
     │                    │                      │                    │                  │
     │      repeat every 10s                     │                    │                  │
     │─────────────────────────────────────────────────────────────────────────────────>│
     │                    │                      │                    │                  │
     │                    │   GET /locations/     │                   │                  │
     │                    │     :driverId         │                   │                  │
     │                    │──────────────────────────────────────────────────────────────>│
     │                    │                      │                    │                  │
     │                    │                      │  getLocation()     │                  │
     │                    │                      │───────────────────>│                  │
     │                    │                      │                    │                  │
     │                    │                      │   LocationData     │                  │
     │                    │                      │<───────────────────│                  │
     │                    │                      │                    │                  │
     │                    │   200 { lat, lng }   │                    │                  │
     │                    │<──────────────────────────────────────────────────────────────│
     │                    │                      │                    │                  │
     │                    │  Update map marker    │                   │                  │
     │                    │<──────────────────────────────────────────────────────────────│
     │                    │                      │                    │                  │
     │      repeat every 5s (tourist polls)      │                   │                  │
```

---

## 5. Review Submission Flow

```
 User              Frontend           ReviewController        ReviewService          DB
  │                    │                     │                     │                  │
  │ POST /reviews      │                     │                     │                  │
  │───────────────────>│                     │                     │                  │
  │                    │                     │                     │                  │
  │                    │  createReview(req)  │                     │                  │
  │                    │────────────────────>│                     │                  │
  │                    │                     │                     │                  │
  │                    │                     │  create(dto)        │                  │
  │                    │                     │────────────────────>│                  │
  │                    │                     │                     │                  │
  │                    │                     │                     │  INSERT review   │
  │                    │                     │                     │────────────────>│
  │                    │                     │                     │                  │
  │                    │                     │                     │  Recalc rating   │
  │                    │                     │                     │  (guide/driver/  │
  │                    │                     │                     │   place)         │
  │                    │                     │                     │────────────────>│
  │                    │                     │                     │                  │
  │                    │                     │                     │  Send notif      │
  │                    │                     │                     │  to relevant     │
  │                    │                     │                     │  party           │
  │                    │                     │                     │────────────────>│
  │                    │                     │                     │                  │
  │                    │                     │  201 { review }    │                  │
  │                    │                     │<────────────────────│                  │
  │                    │                     │                     │                  │
  │                    │  201 { review }    │                     │                  │
  │                    │<────────────────────│                     │                  │
  │                    │                     │                     │                  │
  │   Show review      │                     │                     │                  │
  │<───────────────────│                     │                     │                  │
```

---

## 6. Lost Item — Report & Found

```
 User             Frontend          LostItemController       LostItemService        DB
  │                   │                     │                     │                │
  │ POST /lost-items  │                     │                     │                │
  │──────────────────>│                     │                     │                │
  │                   │                     │                     │                │
  │                   │  createLostItem(dto)│                     │                │
  │                   │────────────────────>│                     │                │
  │                   │                     │                     │                │
  │                   │                     │  create(dto)        │                │
  │                   │                     │────────────────────>│                │
  │                   │                     │                     │                │
  │                   │                     │                     │  INSERT        │
  │                   │                     │                     │────────────────>│
  │                   │                     │                     │                │
  │                   │                     │                     │  Notify admin  │
  │                   │                     │                     │────────────────>│
  │                   │                     │                     │                │
  │                   │                     │  201 { lostItem }  │                │
  │                   │                     │<────────────────────│                │
  │                   │                     │                     │                │
  │  201 { lostItem } │                     │                     │                │
  │<──────────────────│                     │                     │                │
  │                   │                     │                     │                │
  │                   │                     │                     │                │
  │   LATER: Admin marks found              │                     │                │
  │                   │                     │                     │                │
  │                   │  PATCH /lost-items/  │                    │                │
  │                   │    :id/found        │                     │                │
  │                   │────────────────────>│                     │                │
  │                   │                     │                     │                │
  │                   │                     │  reportFound(id)   │                │
  │                   │                     │────────────────────>│                │
  │                   │                     │                     │                │
  │                   │                     │                     │  UPDATE status │
  │                   │                     │                     │  = "found"     │
  │                   │                     │                     │────────────────>│
  │                   │                     │                     │                │
  │                   │                     │                     │  Notify user   │
  │                   │                     │                     │────────────────>│
  │                   │                     │                     │                │
  │                   │                     │  200 { lostItem }  │                │
  │                   │                     │<────────────────────│                │
  │                   │                     │                     │                │
  │                   │  200 { lostItem }  │                     │                │
  │                   │<────────────────────│                     │                │
```

---

## 7. Admin — Assign Resources to Trip

```
 Admin            Frontend          AdminController          TripService          DB
  │                   │                    │                     │                │
  │ PUT /trips/:id/   │                    │                     │                │
  │ assign-guide      │                    │                     │                │
  │──────────────────>│                    │                     │                │
  │                   │                    │                     │                │
  │                   │ assignGuide(req)   │                     │                │
  │                   │───────────────────>│                     │                │
  │                   │                    │                     │                │
  │                   │                    │ assignGuide(id,     │                │
  │                   │                    │   guideId)          │                │
  │                   │                    │────────────────────>│                │
  │                   │                    │                     │                │
  │                   │                    │                     │  Validate trip │
  │                   │                    │                     │  exists        │
  │                   │                    │                     │────────────────>│
  │                   │                    │                     │                │
  │                   │                    │                     │  Validate guide│
  │                   │                    │                     │  (pending/     │
  │                   │                    │                     │   approved)    │
  │                   │                    │                     │────────────────>│
  │                   │                    │                     │                │
  │                   │                    │                     │  Check date    │
  │                   │                    │                     │  availability  │
  │                   │                    │                     │────────────────>│
  │                   │                    │                     │                │
  │                   │                    │                     │  UPDATE trip   │
  │                   │                    │                     │  set guideId   │
  │                   │                    │                     │────────────────>│
  │                   │                    │                     │                │
  │                   │                    │                     │  Notify guide  │
  │                   │                    │                     │────────────────>│
  │                   │                    │                     │                │
  │                   │                    │  200 { trip }      │                │
  │                   │                    │<────────────────────│                │
  │                   │                    │                     │                │
  │                   │ 200 { trip }      │                     │                │
  │                   │<───────────────────│                     │                │
  │                   │                    │                     │                │
  │   Confirm         │                    │                     │                │
  │<──────────────────│                    │                     │                │
```
