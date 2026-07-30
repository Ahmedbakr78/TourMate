# API Documentation

**Base URL**: `http://localhost:3000`

**Auth Header**: `Authorization: Bearer <accessToken>`

**Response Format**:
```json
{
  "status": "success" | "fail",
  "message": "string",
  "data": {}
}
```

---

## 1. Authentication (`/auth`)

### POST `/auth/signup` — Register a new user

**Auth**: None

**Body**:
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required)",
  "phone": "string (required, unique)",
  "gender": "male | female"
}
```

**Response** `201`:
```json
{
  "status": "success",
  "message": "OTP sent to email",
  "data": { "userId": "string" }
}
```

---

### POST `/auth/confirm_email` — Verify email with OTP

**Auth**: None

**Body**:
```json
{
  "email": "string (required)",
  "otp": "string (required, 6 digits)"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Email verified successfully",
  "data": { "token": { "accessToken": "string", "refreshToken": "string" }, "user": {} }
}
```

---

### POST `/auth/send_otp_again` — Resend verification OTP

**Auth**: None

**Body**:
```json
{
  "email": "string (required)"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "OTP sent again"
}
```

---

### POST `/auth/signin` — Login

**Auth**: None

**Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Logged in successfully",
  "data": { "token": { "accessToken": "string", "refreshToken": "string" }, "user": {} }
}
```

---

### POST `/auth/logout` — Logout

**Auth**: Required

**Headers**: `Authorization: Bearer <accessToken>`

**Response** `200`:
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### POST `/auth/refresh_token` — Refresh JWT tokens

**Auth**: None

**Body**:
```json
{
  "refreshToken": "string (required)"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "data": { "accessToken": "string", "refreshToken": "string" }
}
```

---

### POST `/auth/forgot_password` — Request password reset

**Auth**: None

**Body**:
```json
{
  "email": "string (required)"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Reset code sent to email"
}
```

---

### PATCH `/auth/reset_password` — Reset password with code

**Auth**: None

**Body**:
```json
{
  "email": "string (required)",
  "otp": "string (required)",
  "newPassword": "string (required)"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

---

### PATCH `/auth/change_password` — Change password (authenticated)

**Auth**: Required

**Body**:
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required)"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

---

## 2. User (`/user`)

### GET `/user/current_user_id` — Get current logged-in user

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "data": { "_id": "string", "name": "string", "email": "string", "phone": "string", "gender": "string", "role": "string", "profileImage": {}, "isVerified": true, "status": "active" }
}
```

---

### GET `/user/:id` — Get user by ID

**Auth**: None (public)

**Response** `200`:
```json
{
  "status": "success",
  "data": { "user": {} }
}
```

---

### GET `/user/users` — List all users (admin only)

**Auth**: Required, Admin

**Query**: `?page=1&limit=10`

**Response** `200`:
```json
{
  "status": "success",
  "data": { "users": [], "totalDocs": 0, "totalPages": 0, "page": 1 }
}
```

---

### PUT `/user/update_user` — Update profile

**Auth**: Required

**Body**:
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "gender": "male | female (optional)"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": { "user": {} }
}
```

---

### POST `/user/profile_image` — Upload profile image

**Auth**: Required

**Body**: `multipart/form-data` with field `profile_image`

**Response** `200`:
```json
{
  "status": "success",
  "message": "Image uploaded successfully",
  "data": { "secure_url": "string", "public_id": "string" }
}
```

---

### DELETE `/user/delete_image` — Delete profile image

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "message": "Image deleted successfully"
}
```

---

### DELETE `/user/delete_account` — Delete account

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "message": "Account deleted successfully"
}
```

---

## 3. Admin (`/admin`)

### GET `/admin/dashboard` — Dashboard statistics

**Auth**: Required, Admin

**Response** `200`:
```json
{
  "status": "success",
  "data": {
    "totalUsers": 0, "totalTrips": 0, "totalPlaces": 0,
    "totalDrivers": 0, "totalGuides": 0, "totalVehicles": 0,
    "pendingDrivers": 0, "pendingGuides": 0
  }
}
```

---

### GET `/admin/system-statistics` — System statistics

**Auth**: Required, Admin

**Response** `200`:
```json
{
  "status": "success",
  "data": {
    "usersByRole": {}, "tripsByStatus": {}, "monthlyRegistrations": []
  }
}
```

---

### PATCH `/admin/:id/role` — Change user role

**Auth**: Required, Admin

**Body**:
```json
{
  "role": "tourist | driver | guide | admin"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Role updated successfully"
}
```

---

### PATCH `/admin/:id/status` — Block/unblock user

**Auth**: Required, Admin

**Body**:
```json
{
  "status": "active | blocked"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Status updated successfully"
}
```

---

### DELETE `/admin/:id/delete` — Delete user

**Auth**: Required, Admin

**Response** `200`:
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

---

### PATCH `/admin/driver/:id/verification-status` — Verify/reject driver

**Auth**: Required, Admin

**Body**:
```json
{
  "verificationStatus": "approved | rejected"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Driver verification status updated successfully"
}
```

---

### PATCH `/admin/guide/:id/verification-status` — Verify/reject guide

**Auth**: Required, Admin

**Body**:
```json
{
  "verificationStatus": "approved | rejected"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Guide verification status updated successfully"
}
```

---

### PATCH `/admin/trip/:id/assign-resources` — Assign driver/guide/vehicle to trip

**Auth**: Required, Admin

**Body**:
```json
{
  "driverId": "string (optional)",
  "guideId": "string (optional)",
  "vehicleId": "string (optional)"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Resources assigned successfully"
}
```

---

### PATCH `/admin/trip/:id/status` — Update trip status

**Auth**: Required, Admin

**Body**:
```json
{
  "status": "active | pending | confirmed | ongoing | completed | cancelled"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Trip status updated successfully"
}
```

---

### PATCH `/admin/trip/:id/confirm-payment` — Confirm trip payment

**Auth**: Required, Admin

**Response** `200`:
```json
{
  "status": "success",
  "message": "Payment confirmed successfully"
}
```

---

## 4. Driver (`/driver`)

### POST `/driver/create_driver` — Register as driver

**Auth**: Required

**Body**:
```json
{
  "licenseNumber": "string (required, unique)"
}
```

**Response** `201`:
```json
{
  "status": "success",
  "message": "Driver created successfully",
  "data": {}
}
```

---

### PATCH `/driver/update/:id` — Update driver

**Auth**: Required, Admin or Driver

**Body**:
```json
{
  "licenseNumber": "string (optional)",
  "availability": true | false (optional),
  "currentLocation": { "type": "Point", "coordinates": [lng, lat] }
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Driver updated successfully",
  "data": {}
}
```

---

### DELETE `/driver/delete/:id` — Delete driver

**Auth**: Required, Admin or Driver

**Response** `200`:
```json
{
  "status": "success",
  "message": "Driver deleted successfully"
}
```

---

### GET `/driver/get/:id` — Get driver by ID

**Auth**: None (public)

**Response** `200`:
```json
{
  "status": "success",
  "data": {}
}
```

---

### GET `/driver/all` — Get all drivers

**Auth**: None (public)

**Query**: `?page=1&limit=10`

**Response** `200`:
```json
{
  "status": "success",
  "data": { "drivers": [], "totalDocs": 0, "totalPages": 0, "page": 1 }
}
```

---

### POST `/driver/search` — Search drivers

**Auth**: None (public)

**Body**:
```json
{
  "availability": true | false (optional),
  "minRating": 0 (optional),
  "licenseNumber": "string (optional)"
}
```

**Response** `200`: Paginated list of drivers

---

## 5. Guide (`/guide`)

### POST `/guide/create_guide` — Register as guide

**Auth**: Required, Tourist

**Body**: `multipart/form-data` with fields:

| Field | Type |
|-------|------|
| `languages` | string[] (required) |
| `experience` | number |
| `certificate` | file (image/pdf) |

**Response** `201`:
```json
{
  "status": "success",
  "message": "Guide created successfully",
  "data": {}
}
```

---

### PATCH `/guide/update/:id` — Update guide

**Auth**: Required, Admin or Guide

**Body**: `multipart/form-data`

**Response** `200`:
```json
{
  "status": "success",
  "message": "Guide updated successfully",
  "data": {}
}
```

---

### DELETE `/guide/delete/:id` — Delete guide

**Auth**: Required, Admin or Guide

**Response** `200`:
```json
{
  "status": "success",
  "message": "Guide deleted successfully"
}
```

---

### GET `/guide/get/:id` — Get guide by ID

**Auth**: None (public)

**Response** `200`:
```json
{
  "status": "success",
  "data": {}
}
```

---

### GET `/guide/all` — Get all guides

**Auth**: None (public)

**Query**: `?page=1&limit=10`

**Response** `200`: Paginated list of guides

---

### GET `/guide/search` — Search guides

**Auth**: None (public)

**Query**: `?availability=true&minRating=3&language=Arabic`

**Response** `200`: Paginated list of guides

---

## 6. Vehicle (`/vehicle`)

### POST `/vehicle/create_vehicle` — Add vehicle

**Auth**: Required, Driver or Admin

**Body**: `multipart/form-data` with fields:

| Field | Type |
|-------|------|
| `brand` | string (required) |
| `vehicleModel` | string (required) |
| `capacity` | number (required, min 1) |
| `plateNumber` | string (required, unique) |
| `image` | file[] (max 5 images) |

**Response** `201`:
```json
{
  "status": "success",
  "message": "Vehicle created successfully",
  "data": {}
}
```

---

### PATCH `/vehicle/update/:id` — Update vehicle

**Auth**: Required, Driver or Admin

**Body**: `multipart/form-data`

**Response** `200`:
```json
{
  "status": "success",
  "message": "Vehicle updated successfully",
  "data": {}
}
```

---

### DELETE `/vehicle/delete/:id` — Delete vehicle

**Auth**: Required, Driver or Admin

**Response** `200`:
```json
{
  "status": "success",
  "message": "Vehicle deleted successfully"
}
```

---

### GET `/vehicle/get/:id` — Get vehicle by ID

**Auth**: None (public)

**Response** `200`:
```json
{
  "status": "success",
  "data": {}
}
```

---

### GET `/vehicle/all` — Get all vehicles

**Auth**: None (public)

**Query**: `?page=1&limit=10`

**Response** `200`: Paginated list of vehicles

---

### GET `/vehicle/search` — Search vehicles

**Auth**: None (public)

**Query**: `?brand=Toyota&capacityMin=4&capacityMax=7`

**Response** `200`: Paginated list of vehicles

---

### GET `/vehicle/driver/:driverId` — Get vehicles by driver

**Auth**: None (public)

**Response** `200`:
```json
{
  "status": "success",
  "data": { "vehicles": [] }
}
```

---

## 7. Trip (`/trip`)

### POST `/trip/create_trip` — Create a trip

**Auth**: Required, Admin or Tourist

**Body**:
```json
{
  "places": ["placeId1", "placeId2"],
  "startDate": "ISO date string (required)",
  "endDate": "ISO date string (required)",
  "peopleCount": 2 (required)
}
```

**Response** `201`:
```json
{
  "status": "success",
  "message": "Trip created successfully",
  "data": {}
}
```

---

### GET `/trip/get/:id` — Get trip by ID

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "data": {}
}
```

---

### GET `/trip/all` — Get all trips

**Auth**: Required

**Query**: `?page=1&limit=10&status=active`

**Response** `200`: Paginated list of trips

---

### GET `/trip/my_trips` — Get current user's trips

**Auth**: Required

**Query**: `?page=1&limit=10`

**Response** `200`: Paginated list of user's trips

---

### PATCH `/trip/:id/update` — Update trip

**Auth**: Required, Admin or Tourist (owner)

**Body**:
```json
{
  "places": ["placeId1", "placeId2"],
  "startDate": "ISO date string",
  "endDate": "ISO date string",
  "peopleCount": 3
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Trip updated successfully",
  "data": {}
}
```

---

### PATCH `/trip/:id/cancel` — Cancel trip

**Auth**: Required, Admin or Tourist (owner)

**Response** `200`:
```json
{
  "status": "success",
  "message": "Trip cancelled successfully"
}
```

---

### PATCH `/trip/:id/join` — Join a shared trip

**Auth**: Required, Admin or Tourist

**Body**:
```json
{
  "peopleCount": 1 (optional, default 1)
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Joined trip successfully",
  "data": {}
}
```

---

## 8. Vote (`/vote`)

### POST `/vote/create_vote` — Vote on a place in a trip

**Auth**: Required

**Body**:
```json
{
  "tripId": "string (required)",
  "placeId": "string (required)",
  "voteValue": "like | dislike (required)"
}
```

**Response** `201`:
```json
{
  "status": "success",
  "message": "Vote created successfully",
  "data": {}
}
```

---

### PATCH `/vote/:id/update` — Update vote

**Auth**: Required

**Body**:
```json
{
  "voteValue": "like | dislike (required)"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Vote updated successfully",
  "data": {}
}
```

---

### DELETE `/vote/:id/delete` — Delete vote

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "message": "Vote deleted successfully"
}
```

---

### GET `/vote/:tripId/place/:placeId` — Get votes for a place in a trip

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "data": { "likes": 0, "dislikes": 0, "votes": [] }
}
```

---

### GET `/vote/user` — Get current user's votes

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "data": { "votes": [] }
}
```

---

## 9. Place (`/place`)

### POST `/place/create_place` — Create a place

**Auth**: Required, Admin or Tourist

**Body**:
```json
{
  "osmId": 12345,
  "name": "string (required)",
  "city": "string (required)",
  "category": "string (required)",
  "description": "string",
  "coordinates": { "type": "Point", "coordinates": [lng, lat] },
  "price": 0
}
```

**Response** `201`:
```json
{
  "status": "success",
  "message": "Place created successfully",
  "data": {}
}
```

---

### GET `/place/get/:id` — Get place by ID

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "data": {}
}
```

---

### GET `/place/all` — Get all places

**Auth**: Required

**Query**: `?page=1&limit=10&category=museum&city=Cairo`

**Response** `200`: Paginated list of places

---

### PUT `/place/update/:id` — Update place

**Auth**: Required, Admin or Tourist

**Body**: Place fields to update

**Response** `200`:
```json
{
  "status": "success",
  "message": "Place updated successfully",
  "data": {}
}
```

---

### DELETE `/place/places/:id` — Delete place

**Auth**: Required, Admin or Tourist

**Response** `200`:
```json
{
  "status": "success",
  "message": "Place deleted successfully"
}
```

---

### GET `/place/search` — Search places

**Auth**: Required

**Query**: `?q=museum&city=Cairo&category=historical&page=1&limit=10`

**Response** `200`: Paginated list of matching places

---

### GET `/place/nearby` — Get nearby places

**Auth**: Required

**Query**: `?lng=31.2357&lat=30.0444&maxDistance=5000&page=1&limit=10`

**Response** `200`: Paginated list of places sorted by distance

---

## 10. Review (`/review`)

### POST `/review/create_review` — Create a review

**Auth**: Required, Admin or Tourist

**Body**:
```json
{
  "tripId": "string (required)",
  "placeId": "string (optional)",
  "driverId": "string (optional)",
  "guideId": "string (optional)",
  "rating": 5 (required, 1-5),
  "comment": "string"
}
```

**Response** `201`:
```json
{
  "status": "success",
  "message": "Review created successfully",
  "data": {}
}
```

---

### GET `/review/all` — Get all reviews

**Auth**: Required, Admin or Tourist

**Query**: `?page=1&limit=10`

**Response** `200`: Paginated list of reviews

---

### GET `/review/get/:id` — Get review by ID

**Auth**: Required, Admin or Tourist

**Response** `200`:
```json
{
  "status": "success",
  "data": {}
}
```

---

### PATCH `/review/:id/update` — Update review

**Auth**: Required, Admin or Tourist (owner)

**Body**:
```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Review updated successfully",
  "data": {}
}
```

---

### DELETE `/review/:id/delete` — Delete review

**Auth**: Required, Admin or Tourist (owner)

**Response** `200`:
```json
{
  "status": "success",
  "message": "Review deleted successfully"
}
```

---

### GET `/review/:tripId/reviews` — Get trip reviews

**Auth**: Required, Admin or Tourist

**Response** `200`:
```json
{
  "status": "success",
  "data": { "reviews": [] }
}
```

---

### GET `/review/:placeId/place_reviews` — Get place reviews

**Auth**: Required, Admin or Tourist

**Response** `200`:
```json
{
  "status": "success",
  "data": { "reviews": [] }
}
```

---

## 11. Lost Item (`/lost_item`)

### POST `/lost_item/create_lost_item` — Report a lost item

**Auth**: Required

**Body**: `multipart/form-data` with fields:

| Field | Type |
|-------|------|
| `tripId` | string (required) |
| `title` | string (required) |
| `description` | string (required) |
| `image` | file (optional) |

**Response** `201`:
```json
{
  "status": "success",
  "message": "Lost item created successfully",
  "data": {}
}
```

---

### GET `/lost_item/get/:id` — Get lost item by ID

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "data": {}
}
```

---

### GET `/lost_item/:tripId/trip_lost_items` — Get trip's lost items

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "data": { "lostItems": [] }
}
```

---

### GET `/lost_item/my_lost_items` — Get current user's lost items

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "data": { "lostItems": [] }
}
```

---

### PATCH `/lost_item/:id/update` — Update lost item

**Auth**: Required

**Body**:
```json
{
  "title": "string",
  "description": "string"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Lost item updated successfully",
  "data": {}
}
```

---

### PATCH `/lost_item/:id/status` — Update lost item status

**Auth**: Required

**Body**:
```json
{
  "status": "found | closed"
}
```

**Response** `200`:
```json
{
  "status": "success",
  "message": "Lost item status updated successfully"
}
```

---

### DELETE `/lost_item/:id/delete` — Delete lost item

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "message": "Lost item deleted successfully"
}
```

---

## 12. Notification (`/notifications`)

### GET `/notifications/notifications` — Get all notifications

**Auth**: Required

**Query**: `?page=1&limit=10`

**Response** `200`:
```json
{
  "status": "success",
  "data": { "notifications": [], "unreadCount": 0, "totalDocs": 0, "totalPages": 0, "page": 1 }
}
```

---

### GET `/notifications/get/:id` — Get notification by ID

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "data": {}
}
```

---

### PATCH `/notifications/:id/mark-as-read` — Mark notification as read

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "message": "Notification marked as read"
}
```

---

### PATCH `/notifications/mark-all-as-read` — Mark all notifications as read

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "message": "All notifications marked as read"
}
```

---

### DELETE `/notifications/:id/delete` — Delete notification

**Auth**: Required

**Response** `200`:
```json
{
  "status": "success",
  "message": "Notification deleted successfully"
}
```

---

## 13. Location (Frontend-side)

The following location features are implemented on the frontend using Leaflet and OpenStreetMap APIs:

| Feature | Implementation |
|---------|---------------|
| **Show place on map** | Leaflet marker at place coordinates |
| **Trip route visualization** | Polyline connecting trip places in order; OSRM-based route |
| **Nearby places** | Geospatial query via `/place/nearby` with Leaflet radius visualization |
| **Driver location** | Marker showing driver's `currentLocation` |

---

## Endpoint Summary

| Module | Count | Endpoints |
|--------|-------|-----------|
| Auth | 9 | signup, confirm_email, send_otp_again, signin, logout, refresh_token, forgot_password, reset_password, change_password |
| User | 6 | current_user_id, getById, list, update, uploadImage, deleteImage, deleteAccount |
| Admin | 11 | dashboard, system-statistics, changeRole, changeStatus, deleteUser, verifyDriver, verifyGuide, assignResources, updateTripStatus, confirmPayment |
| Driver | 6 | create, update, delete, getById, getAll, search |
| Guide | 7 | create, update, delete, getById, getAll, search |
| Vehicle | 7 | create, update, delete, getById, getAll, search, getByDriver |
| Trip | 7 | create, getById, getAll, myTrips, update, cancel, join |
| Vote | 5 | create, update, delete, getPlaceVotes, getUserVotes |
| Place | 7 | create, getById, getAll, update, delete, search, nearby |
| Review | 7 | create, getAll, getById, update, delete, getTripReviews, getPlaceReviews |
| Lost Item | 7 | create, getById, getTripItems, getMyItems, update, updateStatus, delete |
| Notification | 5 | getAll, getById, markRead, markAllRead, delete |

**Total: ~84 endpoints**
