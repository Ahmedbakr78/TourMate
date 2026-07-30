#  TourMate — Full Features Checklist (v2)
> **النسخة الجديدة** — كل الفيتشرز المطلوبة مكتملة

---

## 1. Ahmed Abo Bakr — Guide + Driver + Vehicle

### Guide
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Create Guide | `POST /guide/create_guide` |  |
| Update Guide | `PATCH /guide/update/:id` |  |
| Delete Guide | `DELETE /guide/delete/:id` |  |
| Get Guide | `GET /guide/get/:id` |  |
| Get All Guides | `GET /guide/all` |  |
| Search Guides | `GET /guide/search` |  |
| Update Availability | `PATCH /guide/update-availability/:id` |  |
| Upload Certificate | `POST /guide/upload-certificate/:id` |  |
| Delete Certificate | `DELETE /guide/delete-certificate/:id` |  |

### Driver
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Create Driver | `POST /driver/create_driver` |  |
| Update Driver | `PATCH /driver/update/:id` |  |
| Delete Driver | `DELETE /driver/delete/:id` |  |
| Get Driver | `GET /driver/get/:id` |  |
| Get All Drivers | `GET /driver/all` |  |
| Search Drivers | `POST /driver/search` |  |
| Update Availability | `PATCH /driver/update-availability/:id` |  |

### Vehicle
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Create Vehicle | `POST /vehicle/create_vehicle` |  |
| Update Vehicle | `PATCH /vehicle/update/:id` |  |
| Delete Vehicle | `DELETE /vehicle/delete/:id` |  |
| Get Vehicle | `GET /vehicle/get/:id` |  |
| Get All Vehicles | `GET /vehicle/all` |  |
| Get Driver Vehicles | `GET /vehicle/driver/:driverId` |  |
| Search Vehicles | `GET /vehicle/search` |  |
| Upload Vehicle Images | `POST /vehicle/upload-images/:id` |  |
| Delete Vehicle Image | `DELETE /vehicle/delete-image/:id` |  |

---

## 2. Jamal — Auth + User + Admin

### Authentication
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Register | `POST /auth/signup` |  |
| Login | `POST /auth/signin` |  |
| Verify Email | `POST /auth/confirm_email` |  |
| Resend Verification Code | `POST /auth/send_otp_again` |  |
| Forgot Password | `POST /auth/forgot_password` |  |
| Verify Reset Code | `POST /auth/verify_reset_code` |  |
| Reset Password | `PATCH /auth/reset_password` |  |
| Change Password | `PATCH /auth/change_password` |  |
| Refresh Token | `POST /auth/refresh_token` |  |
| Logout | `POST /auth/logout` |  |
| Get Logged In User | `GET /auth/me` |  |

### User
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Get Profile | `GET /user/current_user_id` |  |
| Get User By Id | `GET /user/:id` |  |
| Update Profile | `PUT /user/update_user` |  |
| Upload Profile Image | `POST /user/profile_image` |  |
| Delete Profile Image | `DELETE /user/delete_image` |  |
| Delete Account | `DELETE /user/delete_account` |  |

### Admin
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Dashboard Statistics | `GET /admin/dashboard` |  |
| System Statistics | `GET /admin/system-statistics` |  |
| Get All Users | `GET /admin/users` |  |
| Block/Unblock User | `PATCH /admin/:id/status` |  |
| Get Pending Guides | `GET /admin/pending-guides` |  |
| Approve/Reject Guide | `PATCH /admin/guide/:id/verification-status` |  |
| Get Pending Drivers | `GET /admin/pending-drivers` |  |
| Approve/Reject Driver | `PATCH /admin/driver/:id/verification-status` |  |
| Delete User | `DELETE /admin/:id/delete` |  |
| Delete Trip | `DELETE /admin/trip/:id/delete` |  |
| Get Reports | `GET /admin/reports` |  |
| Change User Role | `PATCH /admin/:id/role` |  |
| Assign Trip Resources | `PATCH /admin/trip/:id/assign-resources` |  |
| Update Trip Status | `PATCH /admin/trip/:id/status` |  |
| Confirm Payment | `PATCH /admin/trip/:id/confirm-payment` |  |

---

## 3. Bavly — Trip + Vote

### Trip
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Create Trip | `POST /trip/create_trip` |  |
| Update Trip | `PATCH /trip/:id/update` |  |
| Delete Trip | `DELETE /trip/:id/delete` |  |
| Get Trip | `GET /trip/get/:id` |  |
| Get All Trips | `GET /trip/all` |  |
| Get My Trips | `GET /trip/my_trips` |  |
| Get Shared Trips | `GET /trip/shared` |  |
| Assign Guide | `PATCH /trip/:id/assign-guide` |  |
| Assign Driver | `PATCH /trip/:id/assign-driver` |  |
| Assign Vehicle | `PATCH /trip/:id/assign-vehicle` |  |
| Start Trip | `PATCH /trip/:id/start` |  |
| Complete Trip | `PATCH /trip/:id/complete` |  |
| Cancel Trip | `PATCH /trip/:id/cancel` |  |
| Share Trip | `PATCH /trip/:id/share` |  |
| Duplicate Trip | `POST /trip/:id/duplicate` |  |
| Calculate Trip Price | `POST /trip/calculate-price` |  |
| Get Trip Route | `GET /trip/:id/route` |  |
| Join Shared Trip | `PATCH /trip/:id/join` |  |

### Vote
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Create Vote | `POST /vote/create_vote` |  |
| Update Vote | `PATCH /vote/:id/update` |  |
| Delete Vote | `DELETE /vote/:id/delete` |  |
| Get Place Votes | `GET /vote/:tripId/place/:placeId` |  |
| Get User Votes | `GET /vote/user` |  |

---

## 4. Mai — Notification + Lost Item

### Notification
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Create Notification | `POST /notifications/create` |  |
| Get Notifications | `GET /notifications/notifications` |  |
| Get Notification By Id | `GET /notifications/get/:id` |  |
| Mark As Read | `PATCH /notifications/:id/mark-as-read` |  |
| Mark All As Read | `PATCH /notifications/mark-all-as-read` |  |
| Delete Notification | `DELETE /notifications/:id/delete` |  |
| Delete All Notifications | `DELETE /notifications/delete-all` |  |
| Get Unread Count | `GET /notifications/unread-count` |  |

### Lost Item
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Create Lost Item | `POST /lost_item/create_lost_item` |  |
| Update Lost Item | `PATCH /lost_item/:id/update` |  |
| Update Status | `PATCH /lost_item/:id/status` |  |
| Delete Lost Item | `DELETE /lost_item/:id/delete` |  |
| Get Lost Item | `GET /lost_item/get/:id` |  |
| Get Trip Lost Items | `GET /lost_item/:tripId/trip_lost_items` |  |
| Get My Lost Items | `GET /lost_item/my_lost_items` |  |
| Report Found Item | `PATCH /lost_item/:id/report-found` |  |
| Close Lost Item | `PATCH /lost_item/:id/close` |  |
| Reopen Lost Item | `PATCH /lost_item/:id/reopen` |  |

---

## 5. Ramadan — Place + Review

### Place
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Create Place | `POST /place/create_place` |  |
| Update Place | `PUT /place/update/:id` |  |
| Delete Place | `DELETE /place/places/:id` |  |
| Get Place | `GET /place/get/:id` |  |
| Get All Places | `GET /place/all` |  |
| Search Places | `GET /place/search` |  |
| Filter Places | `GET /place/filter` |  |
| Get Nearby Places | `GET /place/nearby` |  |
| Get Popular Places | `GET /place/popular` |  |
| Save Place | `POST /place/save/:id` |  |
| Unsave Place | `DELETE /place/save/:id` |  |

### Review
| Feature | API Endpoint | Status |
|---------|-------------|--------|
| Create Review | `POST /review/create_review` |  |
| Update Review | `PATCH /review/:id/update` |  |
| Delete Review | `DELETE /review/:id/delete` |  |
| Get Review | `GET /review/get/:id` |  |
| Get All Reviews | `GET /review/all` |  |
| Get Trip Reviews | `GET /review/:tripId/reviews` |  |
| Get Guide Reviews | `GET /review/guide/:guideId` |  |
| Get Driver Reviews | `GET /review/driver/:driverId` |  |
| Get Place Reviews | `GET /review/:placeId/place_reviews` |  |
| Get My Reviews | `GET /review/my-reviews` |  |

---

## الملخص النهائي

| الحالة | العدد |
|--------|-------|
|  **مكتمل بالكامل** | **89/89** |
|  **غير موجود** | **0** |

> كل الـ 89 feature مكتملة — كل الـ API endpoints شغالة والـ server بيشتغل من غير أخطاء
