# TourMate — Test Cases

Consolidated manual + integration test cases for all modules. Priority: **P1** (Critical),
**P2** (High), **P3** (Medium). Columns: ID, Module, Scenario, Steps, Expected, Priority.

---

## Authentication (`auth`)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| AUTH-01 | Authentication | Register new tourist | POST `/api/auth/register` with valid email/password/role | 201; user created; verification email triggered | P1 |
| AUTH-02 | Authentication | Login with correct credentials | POST `/api/auth/login` | 200; returns access + refresh token | P1 |
| AUTH-03 | Authentication | Login with wrong password | POST `/api/auth/login` wrong password | 401; generic error (no user enumeration) | P1 |
| AUTH-04 | Authentication | Access profile without token | GET `/api/auth/profile` no Authorization header | 401; `Authentication required` | P1 |
| AUTH-05 | Authentication | Refresh token | POST `/api/auth/refresh-token` with valid refresh | 200; new access token issued | P2 |
| AUTH-06 | Authentication | Forgot / reset password | POST `/forgot-password` → `/verify-reset-code` → `/reset-password` | 200 each; password updated; old token invalidated | P2 |
| AUTH-07 | Authentication | Change password (authed) | PATCH `/api/auth/change-password` | 200; password changed | P2 |
| AUTH-08 | Authentication | Verify email | POST `/api/auth/verify-email` with code | 200; emailVerified=true | P2 |
| AUTH-09 | Authentication | Resend verification | POST `/api/auth/resend-verification` | 200; new code sent; rate not abused | P3 |
| AUTH-10 | Authentication | Logout | POST `/api/auth/logout` (authed) | 200; refresh token revoked | P2 |
| AUTH-11 | Authentication | Form validation (register) | Submit empty / invalid email / short password | 422; field-level errors returned | P2 |
| AUTH-12 | Authentication | Login with unverified email | Login before verifying email | 200 token OR 403 with "verify email" message (per policy) | P3 |

---

## User (`user`)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| USER-01 | User | Get own profile | GET `/api/user/me` (authed) | 200; own profile returned | P1 |
| USER-02 | User | Update own profile | PATCH `/api/user/me` with fields | 200; updated values persisted | P2 |
| USER-03 | User | Get public user by id | GET `/api/user/:id` (no auth) | 200; public profile only | P2 |
| USER-04 | User | Upload profile image (valid) | POST `/api/user/profile-image` multipart image/png | 201; image URL stored | P2 |
| USER-05 | User | Upload profile image (invalid type) | POST `/api/user/profile-image` with `.txt` | 422; `Only image files are allowed` | P2 |
| USER-06 | User | Delete profile image | DELETE `/api/user/profile-image` | 200; image removed from storage | P3 |
| USER-07 | User | Delete account | DELETE `/api/user/account` (authed) | 200; account and owned data soft/hard removed | P1 |
| USER-08 | User | Update another user's profile | PATCH `/api/user/me` as user A targeting B | 403/400; cannot modify others | P2 |
| USER-09 | User | Form validation (profile) | Send invalid phone / empty name | 422; validation errors | P3 |
| USER-10 | User | Unauthenticated profile update | PATCH `/api/user/me` no token | 401 | P1 |
| USER-11 | User | Oversized image upload | Upload image > `UPLOAD_MAX_FILE_SIZE_MB` | 413; rejected | P3 |
| USER-12 | User | Profile image re-upload replaces old | Upload twice | Old file deleted; new URL set | P3 |

---

## Admin (`admin`)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| ADM-01 | Admin | Non-admin hits admin route | GET `/api/admin/stats` as tourist | 403; `Access denied. Required role(s): admin` | P1 |
| ADM-02 | Admin | View dashboard stats | GET `/api/admin/stats` (admin) | 200; counts of users/trips/etc. | P1 |
| ADM-03 | Admin | List users | GET `/api/admin/users` | 200; paginated user list | P2 |
| ADM-04 | Admin | Block / unblock user | PATCH `/users/:id/block` then `/unblock` | 200; user blocked flag toggles | P2 |
| ADM-05 | Admin | Delete user | DELETE `/api/admin/users/:id` | 200; user removed | P2 |
| ADM-06 | Admin | Approve pending guide | PATCH `/guides/:id/approve` | 200; guide status=approved; notification sent | P1 |
| ADM-07 | Admin | Reject pending guide | PATCH `/guides/:id/reject` | 200; guide rejected | P1 |
| ADM-08 | Admin | Approve / reject pending driver | PATCH `/drivers/:id/approve` / `/reject` | 200; driver status updated | P1 |
| ADM-09 | Admin | List pending guides/drivers | GET `/guides/pending`, `/drivers/pending` | 200; only pending shown | P2 |
| ADM-10 | Admin | Delete trip | DELETE `/api/admin/trips/:id` | 200; trip removed | P2 |
| ADM-11 | Admin | View reports | GET `/api/admin/reports` | 200; report data | P3 |
| ADM-12 | Admin | RBAC boundary (driver calls admin) | Any admin route as driver | 403 for every admin endpoint | P1 |

---

## Trip (`trip`)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| TRIP-01 | Trip | Create trip (tourist) | POST `/api/trip` with itinerary | 201; trip created, owner=tourist | P1 |
| TRIP-02 | Trip | Create trip as driver (forbidden) | POST `/api/trip` as driver | 403; only tourist/admin | P1 |
| TRIP-03 | Trip | Calculate price | POST `/api/trip/calculate-price` | 200; price returned from rules | P2 |
| TRIP-04 | Trip | Assign guide/driver/vehicle | PATCH `/:id/assign-guide|driver|vehicle` | 200; assignment persisted | P1 |
| TRIP-05 | Trip | Start trip (multi-role) | PATCH `/:id/start` as tourist/driver/guide/admin | 200; status=active | P1 |
| TRIP-06 | Trip | Complete trip | PATCH `/:id/complete` | 200; status=completed | P1 |
| TRIP-07 | Trip | Cancel trip | PATCH `/:id/cancel` as tourist/admin | 200; status=cancelled | P2 |
| TRIP-08 | Trip | Share / duplicate trip | PATCH `/:id/share`, POST `/:id/duplicate` | 200; shared flag / copy created | P2 |
| TRIP-09 | Trip | Get my trips / shared trips | GET `/my`, `/shared` | 200; filtered lists | P2 |
| TRIP-10 | Trip | Concurrent booking (same guide/vehicle) | Two tourists assign same vehicle to overlapping active trips | System prevents double-booking or flags conflict | P1 |
| TRIP-11 | Trip | Get trip route | GET `/:id/route` | 200; route geometry from external proxy | P2 |
| TRIP-12 | Trip | Update/delete trip by non-owner | PATCH `/:id` as other tourist | 403; only owner/admin | P2 |

---

## Place (`place`)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| PLC-01 | Place | List all places | GET `/api/place` | 200; list | P2 |
| PLC-02 | Place | Search places | GET `/api/place/search?q=` | 200; matching POIs | P2 |
| PLC-03 | Place | Filter / nearby / popular | GET `/filter`, `/nearby`, `/popular` | 200; correct subsets | P2 |
| PLC-04 | Place | Get place detail | GET `/api/place/:id` | 200; detail | P2 |
| PLC-05 | Place | Create place (admin only) | POST `/api/place` as admin | 201; created | P2 |
| PLC-06 | Place | Create place as tourist (forbidden) | POST `/api/place` as tourist | 403 | P1 |
| PLC-07 | Place | Save place to favorites | POST `/api/place/save` (authed) | 200; saved reference | P2 |
| PLC-08 | Place | Update/delete place (admin) | PATCH/DELETE `/:id` as admin | 200/204 | P2 |
| PLC-09 | Place | Update place as non-admin | PATCH `/:id` as tourist | 403 | P2 |
| PLC-10 | Place | Invalid place id | GET `/api/place/000000000000000000000000` | 404 | P3 |
| PLC-11 | Place | Empty search query | GET `/search?q=` | 200; empty or all (no 500) | P3 |
| PLC-12 | Place | External POI proxy fallback | GET `/external/pois` when upstream slow | 200 from cache or graceful error | P3 |

---

## Vote (`vote`)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| VOTE-01 | Vote | Create vote on place | POST `/api/vote` {placeId, value} | 201; vote recorded | P2 |
| VOTE-02 | Vote | Update own vote | PATCH `/api/vote/:id` | 200; value updated | P2 |
| VOTE-03 | Vote | Delete vote | DELETE `/api/vote/:id` | 200; removed | P2 |
| VOTE-04 | Vote | Get votes for a place | GET `/api/vote/place/:placeId` | 200; aggregate | P2 |
| VOTE-05 | Vote | Get my votes | GET `/api/vote/user` | 200; current user's votes | P2 |
| VOTE-06 | Vote | Vote without auth | POST `/api/vote` no token | 401 | P1 |
| VOTE-07 | Vote | Duplicate vote (same user/place) | Create twice | 200 update or 409; no double count | P2 |
| VOTE-08 | Vote | Update another user's vote | PATCH vote owned by other | 403/404 | P2 |
| VOTE-09 | Vote | Invalid place reference | POST vote with bad placeId | 422/404 | P3 |
| VOTE-10 | Vote | Vote value bounds | Send out-of-range value | 422; rejected | P3 |

---

## Review (`review`)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| REV-01 | Review | Create review (authed) | POST `/api/review` {tripId, rating, text} | 201; created | P1 |
| REV-02 | Review | Review without auth | POST `/api/review` no token | 401 | P1 |
| REV-03 | Review | List trip reviews | GET `/review/trip/:tripId` | 200; list | P2 |
| REV-04 | Review | List guide/driver/place reviews | GET `/guide/:id`, `/driver/:id`, `/place/:id` | 200; scoped lists | P2 |
| REV-05 | Review | Get my reviews | GET `/review/my` | 200 | P2 |
| REV-06 | Review | Update own review | PATCH `/:id` | 200 | P2 |
| REV-07 | Review | Delete own review | DELETE `/:id` | 200 | P2 |
| REV-08 | Review | Rating out of range | rating > 5 or < 1 | 422; rejected | P2 |
| REV-09 | Review | Update/delete others' review | PATCH/DELETE review not owned | 403/404 | P2 |
| REV-10 | Review | Empty review text | text="" | 422 or allowed per policy | P3 |
| REV-11 | Review | Review non-existent trip | tripId invalid | 422/404 | P3 |
| REV-12 | Review | Duplicate review guard | Review same completed trip twice | 200 update or 409 | P3 |

---

## Booking / Shared (`trip` shared + payment)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| BKG-01 | Booking | Initiate booking flow | Tourist creates trip + assigns guide/driver/vehicle | Status progresses; price calculated | P1 |
| BKG-02 | Booking | Vehicle capacity limit | Assign vehicle whose `capacity` < number of travellers | 422; `capacity exceeded` rejected | P1 |
| BKG-03 | Booking | Concurrent booking conflict | Two tourists book same driver/vehicle same time window | Second booking blocked or flagged | P1 |
| BKG-04 | Booking | Payment step | Complete payment component flow | Success/failure handled; trip confirmed | P2 |
| BKG-05 | Booking | Share trip with co-travellers | PATCH `/:id/share` then view `/shared` | Shared trip visible to invited users | P2 |
| BKG-06 | Booking | Duplicate trip as template | POST `/:id/duplicate` | New editable copy created | P3 |
| BKG-07 | Booking | Booking by non-tourist | Create/assign as driver/guide | 403 (rbac tourist,admin) | P1 |
| BKG-08 | Booking | Cancel after start | PATCH `/:id/cancel` on active trip | 400/403; cannot cancel active | P2 |
| BKG-09 | Booking | Calendar view consistency | Open `/trip/calendar` | Trips render on correct dates | P3 |
| BKG-10 | Booking | Orphaned assignment | Assign deleted guide | 422/404; assignment fails | P3 |

---

## Notification (`notification`)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| NOT-01 | Notification | List notifications | GET `/api/notification` (authed) | 200; user's notifications | P2 |
| NOT-02 | Notification | Unread count | GET `/api/notification/unread-count` | 200; integer count | P2 |
| NOT-03 | Notification | Mark one as read | PATCH `/:id/read` | 200; read=true; unread count decrements | P1 |
| NOT-04 | Notification | Mark all as read | PATCH `/read-all` | 200; all read; count=0 | P1 |
| NOT-05 | Notification | Read status persistence | Reload list after marking read | Stays read (persisted) | P2 |
| NOT-06 | Notification | Create notification (system) | POST `/api/notification` | 201; delivered to target user | P2 |
| NOT-07 | Notification | Delete one / delete all | DELETE `/:id`, DELETE `/` | 200; removed | P3 |
| NOT-08 | Notification | Access another user's notification | PATCH `/:id/read` for other's id | 403/404 | P2 |
| NOT-09 | Notification | Notification on approval event | Admin approves guide → guide gets notification | Guide sees new unread notification | P1 |
| NOT-10 | Notification | No auth | GET `/api/notification` no token | 401 | P1 |
| NOT-11 | Notification | Invalid id read | PATCH `/:id/read` bad id | 404 | P3 |
| NOT-12 | Notification | Realtime feel via polling | Poll unread-count on interval | Count updates without full reload | P3 |

---

## Lost & Found (`lost_item`)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| LNF-01 | Lost&Found | Report lost item | POST `/api/lost_item` {tripId, description} | 201; status=open | P1 |
| LNF-02 | Lost&Found | List my lost items | GET `/api/lost_item/my` | 200; only mine | P2 |
| LNF-03 | Lost&Found | List trip lost items | GET `/lost_item/trip/:tripId` | 200; scoped | P2 |
| LNF-04 | Lost&Found | Report item found | PATCH `/:id/report-found` | 200; status=found | P1 |
| LNF-05 | Lost&Found | Close item | PATCH `/:id/close` | 200; status=closed | P2 |
| LNF-06 | Lost&Found | Reopen item | PATCH `/:id/reopen` | 200; status=open | P3 |
| LNF-07 | Lost&Found | Lifecycle invalid transition | close → report-found on closed | 400/422; illegal transition blocked | P1 |
| LNF-08 | Lost&Found | Update item details | PATCH `/:id` | 200; fields updated | P2 |
| LNF-09 | Lost&Found | Admin sees all | GET `/api/lost_item` (admin) | 200; all items | P2 |
| LNF-10 | Lost&Found | Delete item | DELETE `/:id` | 200; removed | P3 |
| LNF-11 | Lost&Found | Create without auth | POST `/api/lost_item` no token | 401 | P1 |
| LNF-12 | Lost&Found | Report on non-existent trip | tripId invalid | 422/404 | P3 |

---

## Driver (`driver`)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| DRV-01 | Driver | List / search drivers | GET `/api/driver`, `/search` | 200; public list | P2 |
| DRV-02 | Driver | Get driver detail | GET `/api/driver/:id` | 200 | P2 |
| DRV-03 | Driver | Create driver (admin only) | POST `/api/driver` as admin | 201 | P2 |
| DRV-04 | Driver | Create driver as tourist (forbidden) | POST `/api/driver` as tourist | 403 | P1 |
| DRV-05 | Driver | Update own profile | PATCH `/:id` as that driver | 200 | P2 |
| DRV-06 | Driver | Toggle availability | PATCH `/:id/availability` as driver | 200; available flag flips | P1 |
| DRV-07 | Driver | Availability by non-driver | PATCH `/:id/availability` as admin | 403 (rbac driver) | P1 |
| DRV-08 | Driver | Delete driver (admin) | DELETE `/:id` as admin | 200 | P2 |
| DRV-09 | Driver | Driver pushes location | POST `/tracking/driver/:id/location` as driver | 200; location stored | P1 |
| DRV-10 | Driver | Non-driver pushes location | POST tracking location as tourist | 403 | P1 |
| DRV-11 | Driver | Update another driver's profile | PATCH as different driver | 403 | P2 |
| DRV-12 | Driver | Pending driver cannot operate | Pending driver toggles availability | 403 until approved | P2 |

---

## Guide (`guide`)

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| GDE-01 | Guide | List / search guides | GET `/api/guide`, `/search` | 200; public list | P2 |
| GDE-02 | Guide | Get guide detail | GET `/api/guide/:id` | 200 | P2 |
| GDE-03 | Guide | Create guide (admin only) | POST `/api/guide` as admin | 201 | P2 |
| GDE-04 | Guide | Create guide as tourist (forbidden) | POST `/api/guide` as tourist | 403 | P1 |
| GDE-05 | Guide | Update own profile | PATCH `/:id` as that guide | 200 | P2 |
| GDE-06 | Guide | Toggle availability | PATCH `/:id/availability` as guide | 200; flag flips | P1 |
| GDE-07 | Guide | Upload certificate (valid) | POST `/:id/certificate` image | 201; stored | P2 |
| GDE-08 | Guide | Upload certificate (invalid type) | POST `/:id/certificate` `.pdf`/`.txt` | 422; image-only rejected | P2 |
| GDE-09 | Guide | Delete certificate | DELETE `/:id/certificate` | 200; removed | P3 |
| GDE-10 | Guide | Availability by non-guide | PATCH `/:id/availability` as admin | 403 (rbac guide) | P1 |
| GDE-11 | Guide | Pending guide blocked | Pending guide toggles availability | 403 until approved | P2 |
| GDE-12 | Guide | Delete guide (admin) | DELETE `/:id` as admin | 200 | P2 |

---

## Cross-Cutting: i18n / RTL / Tracking / Validation

| ID | Module | Scenario | Steps | Expected | Priority |
|----|--------|----------|-------|----------|----------|
| X-01 | i18n/RTL | Switch to Arabic | In Settings select العربية | UI text switches; layout flips to RTL (`dir=rtl`) | P2 |
| X-02 | i18n/RTL | Switch back to English | Select English | Layout returns to LTR; no broken bindings | P2 |
| X-03 | i18n/RTL | RTL form alignment | Open a form in Arabic | Labels/inputs right-aligned; no overflow | P3 |
| X-04 | Tracking | Location polling latency | Driver pushes location; tourist polls `/tracking/driver/:id` | Tourist sees update within poll interval (e.g. ≤5s) | P2 |
| X-05 | Tracking | Poll all / active trips | GET `/tracking/all`, `/active-trips` | 200; current positions | P2 |
| X-06 | Tracking | Clear location | DELETE `/tracking/driver/:id` as driver/admin | 200; location removed | P3 |
| X-07 | Validation | Missing required fields | POST create with omitted required field | 422; clear field errors | P2 |
| X-08 | Validation | Malformed JSON / types | Send wrong types | 400/422; no 500 | P3 |
| X-09 | RBAC | Role boundary matrix | Exercise every protected route with wrong role | 403 consistently | P1 |
| X-10 | File Upload | Invalid MIME rejected globally | Upload non-image to any upload endpoint | 422 `Only image files are allowed` | P2 |
| X-11 | Auth | Expired token | Use expired JWT | 401; client refreshes or redirects to login | P1 |
| X-12 | Security | No token enumeration | Wrong login / unknown user same response | Identical 401 message | P2 |
