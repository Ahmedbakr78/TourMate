# Chapter 3 — Database Design

## 3.1 Data Model Strategy

TourMate persists all state in **MongoDB**, a document-oriented NoSQL database accessed through **Mongoose** object-document mapping. Each domain entity is represented by a schema defined under `server/src/db/models/`. The design favours embedded geo-coordinates (`type: 'Point'`, `coordinates: [lng, lat]`) with `2dsphere` indexes where spatial queries are required, and references (`Schema.Types.ObjectId` with `ref`) for relational integrity between collections.

The schema files explicitly note alignment with a "canonical" design shared across backend implementations, while retaining Ahmed-specific extension fields (geo-routing, vehicle linking, tracking context) that do not break compatibility.

## 3.2 The Ten Collections

The system comprises ten collections. Their key fields and relationships are summarised below.

### 3.2.1 User
Central account entity. Fields: `name`, `email` (unique), `password` (hashed, `select: false`), `phone` (unique), `profileImage {secure_url, public_id}`, `gender` (MALE/FEMALE/OTHER), `role` (ADMIN/TOURIST/DRIVER/GUIDE, default TOURIST), `status` (ACTIVE/INACTIVE/NOT_VERIFIED), `otps[]`, `isVerified`, `refreshTokens[]`. A `toSafeJSON()` method strips secrets. The `User` is referenced by `Driver.userId`, `Guide.userId`, `Trip.touristId`, `Vote.userId`, `Review.touristId`, `LostItem.reportedBy/foundBy`, and `Notification.senderId/receiverId`.

### 3.2.2 Driver
Extends a user as a transport provider. Fields: `userId` (ref User, unique), `licenseNumber` (unique), `rating` (0–5), `availability` (Boolean), `currentLocation` (Point, 2dsphere indexed), `verificationStatus` (PENDING/APPROVED/REJECTED), `vehicleIds[]` (ref Vehicle), `lastSeen`, `nationalId`, `documents[]`. Referenced by `Trip.driverId` and `Vehicle.driverId`.

### 3.2.3 Guide
Extends a user as a tour professional. Fields: `userId` (ref User, unique), `languages[]`, `experience` (Number), `certificate` (String), `rating` (0–5), `availability` (Boolean), `verificationStatus`, `currentLocation` (Point), `lastSeen`. Referenced by `Trip.guideId`.

### 3.2.4 Vehicle
A car owned by a driver. Fields: `driverId` (ref Driver, required), `brand`, `vehicleModel`, `capacity` (≥1), `plateNumber` (unique), `carImages[{secure_url, public_id}]`, `isActive`. Referenced by `Trip.vehicleId`.

### 3.2.5 Place
A point of interest. Fields: `osmId` (Number, unique), `name`, `city`, `category`, `description`, `coordinates` (Point, 2dsphere indexed). Referenced by `Trip.places[]`, `Vote.placeId`, and `Review.placeId`.

### 3.2.6 Trip
The central orchestration entity. Fields: `touristId` (ref User, required), `name`, `description`, `places[]` (ref Place), `guideId` (ref Guide), `driverId` (ref Driver), `vehicleId` (ref Vehicle), `startDate`, `endDate`, `peopleCount`, `price`, `status` (DRAFT/PENDING/CONFIRMED/ONGOING/COMPLETED/CANCELLED, default DRAFT), plus extension fields `startLocation`, `endLocation`, `routeGeoJSON`, `distanceMeters`, `durationSeconds`, `fare`, `isShared`, `startTime`, `endTime`. Referenced by `Vote.tripId`, `Review.tripId`, and `LostItem.tripId`.

### 3.2.7 Vote
Collaborative preference on a place within a trip. Fields: `tripId` (ref Trip), `placeId` (ref Place), `userId` (ref User), `voteValue` (UP/DOWN). A compound unique index `{tripId, placeId, userId}` enforces one vote per user per place per trip.

### 3.2.8 Review
Post-experience feedback. Fields: `tripId` (ref Trip), `touristId` (ref User), `driverId` (ref Driver), `guideId` (ref Guide), `placeId` (ref Place), `rating` (1–5), `comment`.

### 3.2.9 LostItem
Lost-and-found record. Fields: `reportedBy` (ref User), `title`, `description`, `location` (Point), `found` (Boolean), `foundBy` (ref User), `tripId` (ref Trip).

### 3.2.10 Notification
System/event message. Fields: `senderId` (ref User), `receiverId` (ref User, required), `title`, `message`, `isRead` (Boolean), `type` (trip/system/review/lostItem/general), `data` (Mixed).

## 3.3 Relationships

The relationship graph is anchored on **User**, which participates in one-to-one relations with Driver and Guide, and one-to-many relations as trip owner, voter, reviewer, and notification correspondent. **Trip** is the hub connecting User (tourist), Guide, Driver, Vehicle, Place (many), Vote, Review, and LostItem. The entity-relationship diagram in the UML appendix (`docs/uml/erd.md`) visualises these associations.

## 3.4 Indexing and Performance

Spatial queries on `Driver.currentLocation` and `Place.coordinates` use `2dsphere` indexes to support nearby-driver and nearby-place lookups. Uniqueness constraints on `email`, `phone`, `licenseNumber`, `plateNumber`, and `osmId` preserve data integrity at the database level, complementing application-level validation.

## 3.5 Schema Evolution and Compatibility

The dual-nature schema (canonical fields + extension fields) allows the platform to interoperate with a sibling backend while still powering advanced features such as OSRM route geometry and polling-based tracking. This pragmatic approach reduces migration risk and documents intent directly in the model comments.
