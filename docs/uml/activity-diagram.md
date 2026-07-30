# TourMate — Activity Diagrams

---

## 1. User Registration & Email Verification

```
    ┌──────────────┐
    │   Start      │
    │  (Open App)  │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ Fill Signup  │
    │ Form         │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ Validate     │◄─── Invalid ───┐
    │ Input        │                │
    └──────┬───────┘                │
           │ Valid                  │
           ▼                        │
    ┌──────────────┐                │
    │ Check Email  │                │
    │ Uniqueness   │                │
    └──────┬───────┘                │
           │                        │
     ┌─────┴──────┐                │
     │            │                │
     ▼            ▼                │
  ┌────────┐ ┌──────────┐          │
  │ Email  │ │ Create   │          │
  │ Exists │ │ User +   │          │
  │        │ │ Send OTP │          │
  └───┬────┘ └────┬─────┘          │
      │           │                │
      │           ▼                │
      │    ┌──────────────┐        │
      │    │ Wait for OTP │        │
      │    │  (10 min)    │        │
      │    └──────┬───────┘        │
      │           │                │
      │     ┌─────┴──────┐        │
      │     │            │        │
      │     ▼            ▼        │
      │  ┌────────┐ ┌──────────┐  │
      │  │ Valid  │ │ Expired  │──┼──┐
      │  │ OTP    │ │ /Invalid │  │  │
      │  └───┬────┘ └──────────┘  │  │
      │      │                    │  │
      │      ▼                    │  │
      │  ┌──────────────┐         │  │
      │  │ Mark Email   │         │  │
      │  │ Verified     │         │  │
      │  └──────┬───────┘         │  │
      │         │                 │  │
      │         ▼                 │  │
      │  ┌──────────────┐         │  │
      │  │ Redirect to  │         │  │
      │  │ Login Page   │         │  │
      │  └──────┬───────┘         │  │
      │         │                 │  │
      │         ▼                 │  │
      │  ┌──────────────┐         │  │
      │  │  End (Success)│        │  │
      │  └──────────────┘         │  │
      │                           │  │
      └─── Show error ────────────┘  │
                ▲                    │
                └────────────────────┘
```

---

## 2. Trip Lifecycle (Create → Start → Complete)

```
    ┌─────────────────────┐
    │        Start        │
    │  (Tourist logged in)│
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Select Places +     │
    │ Date + People Count │
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │   Optional: Choose  │
    │ Guide / Driver /    │
    │ Vehicle             │
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │  Calculate Price    │
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │  Confirm & Create   │──→ Status: "draft"
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │  Voting Phase       │
    │  (like/dislike each │
    │   place)            │
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │  Admin Assigns      │
    │  Guide, Driver,     │
    │  Vehicle            │
    └─────────┬───────────┘
              │
              ▼
       ┌──────┴──────┐
       │             │
       ▼             ▼
    ┌────────┐ ┌──────────────┐
    │ Start  │ │ Hold as      │
    │ Trip   │ │ "pending"    │
    └───┬────┘ └──────────────┘
        │
        ▼
    ┌─────────────────────┐
    │ Status: "ongoing"   │
    │ Driver sends GPS    │
    │ Tourist can track   │
    └─────────┬───────────┘
              │
              ▼
       ┌──────┴──────┐
       │             │
       ▼             ▼
    ┌────────┐ ┌──────────────┐
    │Complete│ │ Cancel Trip  │
    │ Trip   │ │              │
    └───┬────┘ └──────┬───────┘
        │             │
        ▼             ▼
    ┌────────┐ ┌──────────────┐
    │ Submit │ │ Resources    │
    │ Reviews│ │ Freed        │
    └───┬────┘ └──────┬───────┘
        │             │
        ▼             ▼
    ┌────────┐ ┌──────────────┐
    │  End   │ │    End       │
    └────────┘ └──────────────┘
```

---

## 3. Real-Time Location Sharing (Parallel Flows)

### Driver Flow (every 10s)
```
    ┌────────────────┐
    │   Trip Active  │
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐
    │ Get GPS Coords │
    │ (Phone GPS)    │
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐
    │ POST /api/     │
    │ locations      │
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐
    │ Server stores  │
    │ in Memory Map  │
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐
    │ Wait 10 seconds│────→ (loop back)
    └────────────────┘
```

### Tourist Flow (every 5s)
```
    ┌────────────────┐
    │   Trip Active  │
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐
    │ GET /api/      │
    │ locations/     │
    │ :driverId      │
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐
    │ Update Map     │
    │ Marker         │
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐
    │ Wait 5 seconds │────→ (loop back)
    └────────────────┘
```

---

## 4. Report & Resolve Lost Item

```
    ┌──────────────────┐
    │   Trip Active    │
    └───────┬──────────┘
            │
            ▼
    ┌──────────────────┐
    │ Tourist Reports  │
    │ Lost Item        │
    └───────┬──────────┘
            │
            ▼
    ┌──────────────────┐
    │ Fill Description │
    │ + Upload Image   │
    └───────┬──────────┘
            │
            ▼
    ┌──────────────────┐
    │ Status: "pending"│
    │ Notify Admin     │
    └───────┬──────────┘
            │
            ▼
       ┌────┴────┐
       │         │
       ▼         ▼
    ┌────────┐ ┌──────────────────┐
    │ Item   │ │ Admin updates    │
    │ Found! │ │ description/     │
    └───┬────┘ │ status           │
        │      └──────────────────┘
        ▼
    ┌──────────────────┐
    │ Mark as "found"  │
    │ Notify Tourist   │
    └───────┬──────────┘
            │
            ▼
       ┌────┴────┐
       │         │
       ▼         ▼
    ┌────────┐ ┌──────────────┐
    │ Close  │ │ Tourist      │
    │ Case   │ │ Reopens      │
    └───┬────┘ └──────┬───────┘
        │             │
        ▼             ▼
    ┌────────┐ ┌──────────────┐
    │Status: │ │Status:       │
    │"closed"│ │back to       │
    └────────┘ │"pending"     │
               └──────────────┘
```

---

## 5. Admin Resource Assignment

```
    ┌──────────────────┐
    │   Admin Logged   │
    │   In             │
    └───────┬──────────┘
            │
            ▼
    ┌──────────────────┐
    │ Navigate to      │
    │ Pending Trips    │
    └───────┬──────────┘
            │
            ▼
    ┌──────────────────┐
    │ Select Trip      │
    └───────┬──────────┘
            │
            ▼
    ┌──────────────────┐
    │ View Trip Detail │
    │ Check Required   │
    │ Resources        │
    └───────┬──────────┘
            │
            ▼
    ┌──────────────────┐────┐
    │ Assign Guide     │    │
    │ (from pending/   │    │
    │  approved list)  │    │
    └───────┬──────────┘    │
            │               │
            ▼               │
    ┌──────────────────┐    │
    │ Assign Driver    │    │
    │ (from pending/   │    │
    │  approved list)  │    │
    └───────┬──────────┘    │
            │               │
            ▼               │
    ┌──────────────────┐    │
    │ Assign Vehicle   │    │
    │ (from driver's   │    │
    │  vehicles)       │    │
    └───────┬──────────┘    │
            │               │
            ▼               │
    ┌──────────────────┐    │
    │ Validate Date    │    │
    │ Availability     │    │
    └───────┬──────────┘    │
            │               │
       ┌────┴────┐          │
       │         │          │
       ▼         ▼          │
    ┌────────┐ ┌──────────┐ │
    │ All    │ │ Some     │ │
    │ Free   │ │ Booked   │ │
    └───┬────┘ └────┬─────┘ │
        │           │       │
        ▼           ▼       │
    ┌────────┐ ┌──────────┐ │
    │Confirm │ │ Show     ├─┘
    │Assign  │ │Alternate │
    └───┬────┘ │Resources │
        │      └──────────┘
        ▼
    ┌──────────────────┐
    │ Update Trip      │
    │ Set guideId,     │
    │ driverId,        │
    │ vehicleId        │
    └───────┬──────────┘
            │
            ▼
    ┌──────────────────┐
    │ Notify All       │
    │ Parties          │
    └───────┬──────────┘
            │
            ▼
    ┌──────────────────┐
    │  End             │
    └──────────────────┘
```
