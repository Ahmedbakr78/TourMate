# Jamal — Database Architect, Backend Core

## Role
Database Architect & Backend Core — designs all MongoDB schemas, repositories, middlewares, auth/user/admin modules.

---

## Backend Modules Owned

| Module | Files | Description |
|--------|-------|-------------|
| **Auth** | `backend/modules/auth/auth.controller.ts`, `backend/modules/auth/service/auth.service.ts` | Signup, signin, email confirmation, password reset, token refresh, logout |
| **User** | `backend/modules/user/user.controller.ts`, `backend/modules/user/service/user.service.ts` | User CRUD, profile image, account management |
| **Admin** | `backend/modules/admin/admin.controller.ts`, `backend/modules/admin/service/admin.service.ts` | Dashboard, statistics, user/role/status management, trip admin actions |

---

## Database — All MongoDB Schemas (10+)

| Model | File |
|-------|------|
| User | `backend/db/models/user.model.ts` |
| Driver | `backend/db/models/driver.model.ts` |
| Guide | `backend/db/models/guide.model.ts` |
| Vehicle | `backend/db/models/vehicle.model.ts` |
| Place | `backend/db/models/place.model.ts` |
| Trip | `backend/db/models/trip.model.ts` |
| Vote | `backend/db/models/vote.model.ts` |
| Review | `backend/db/models/review.model.ts` |
| Notification | `backend/db/models/notification.model.ts` |
| LostItem | `backend/db/models/lostIem.model.ts` |
| BlackListedToken | `backend/db/models/black-listed-token.model.ts` |

## Database — All Repositories

| Repository | File |
|------------|------|
| Base | `backend/db/repo/base.repo.ts` |
| User | `backend/db/repo/user.repo.ts` |
| Driver | `backend/db/repo/driver.repo.ts` |
| Guide | `backend/db/repo/guide.repo.ts` |
| Vehicle | `backend/db/repo/vehicle.repo.ts` |
| Place | `backend/db/repo/place.repo.ts` |
| Trip | `backend/db/repo/trip.repo.ts` |
| Vote | `backend/db/repo/vote.repo.ts` |
| Review | `backend/db/repo/review.repo.ts` |
| Notification | `backend/db/repo/notification.repo.ts` |
| LostItem | `backend/db/repo/lostItem.repo.ts` |
| Blacklisted | `backend/db/repo/black-listed.repository.ts` |

## Database Connection
| File | Description |
|------|-------------|
| `backend/db/db.connection.ts` | MongoDB connection setup |

---

## Middlewares

| Middleware | File | Description |
|-----------|------|-------------|
| Authentication | `backend/middlewares/authentication.middleware.ts` | JWT token verification |
| Authorization | `backend/middlewares/authorization.middleware.ts` | Role-based access control |
| Validation | `backend/middlewares/validation.middleware.ts` | Request payload validation |

---

## Utilities

### Encryption
| File | Description |
|------|-------------|
| `backend/utils/encryption/token.utils.ts` | JWT generation & verification |
| `backend/utils/encryption/crypro.utils.ts` | Encryption/decryption helpers |
| `backend/utils/encryption/hash.utils.ts` | Password hashing (bcrypt) |

### Errors
| File | Description |
|------|-------------|
| `backend/utils/errors/exception.utils.ts` | Custom exception classes |
| `backend/utils/errors/http-exception.utils.ts` | HTTP exception handler |

### Response
| File | Description |
|------|-------------|
| `backend/utils/response/respone-helper.utils.ts` | Standardized API response helper |

### Interfaces & Enums
| File | Description |
|------|-------------|
| `backend/common/interfaces/user.interface.ts` | User interface definitions |
| `backend/common/interfaces/respone.interface.ts` | Response interface definitions |
| `backend/common/enums/user.enum.ts` | User role/status enums |

---

## Frontend Features Owned

### Trips
| Component | Path |
|-----------|------|
| Trip Builder | `frontend/features/trips/trip-builder/trip-builder.component.ts`, `.html`, `.scss` |
| Trip Detail | `frontend/features/trips/trip-detail/trip-detail.component.ts`, `.html`, `.scss` |
| My Trips | `frontend/features/trips/my-trips/my-trips.component.ts`, `.html`, `.scss` |
| Shared Trip | `frontend/features/trips/shared-trip/shared-trip.component.ts`, `.html`, `.scss` |
| Payment | `frontend/features/trips/payment/payment.component.ts`, `.html`, `.scss` |
| Trips Module | `frontend/features/trips/trips.module.ts`, `trips-routing.module.ts` |

### Profile
| Component | Path |
|-----------|------|
| Profile | `frontend/features/profile/profile.component.ts`, `.html`, `.scss` |
| Profile Module | `frontend/features/profile/profile.module.ts` |

### Core Services
| Service | Description |
|---------|-------------|
| `frontend/core/services/trip.service.ts` | Trip API calls |
| `frontend/core/services/user.service.ts` | User API calls |

### Models
| Model | File |
|-------|------|
| User | `frontend/core/models/user.model.ts` |
| Trip | `frontend/core/models/trip.model.ts` |
| Response | `frontend/core/models/response.model.ts` |
| Enums | `frontend/core/models/enums.ts` |
| Index | `frontend/core/models/index.ts` |

---

## API Endpoints Built

### Auth
| Method | Endpoint |
|--------|----------|
| POST | `/auth/signup` |
| POST | `/auth/signin` |
| POST | `/auth/confirm_email` |
| POST | `/auth/send_otp_again` |
| POST | `/auth/forgot_password` |
| POST | `/auth/verify_reset_code` |
| PATCH | `/auth/reset_password` |
| POST | `/auth/refresh_token` |
| PATCH | `/auth/change_password` |
| POST | `/auth/logout` |
| GET | `/auth/me` |

### User
| Method | Endpoint |
|--------|----------|
| GET | `/user/current_user_id` |
| GET | `/user/:id` |
| PUT | `/user/update_user` |
| POST | `/user/profile_image` |
| DELETE | `/user/delete_image` |
| DELETE | `/user/delete_account` |

### Admin
| Method | Endpoint |
|--------|----------|
| GET | `/admin/dashboard` |
| GET | `/admin/system-statistics` |
| GET | `/admin/users` |
| GET | `/admin/pending-guides` |
| GET | `/admin/pending-drivers` |
| GET | `/admin/reports` |
| PATCH | `/admin/:id/role` |
| PATCH | `/admin/:id/status` |
| DELETE | `/admin/:id/delete` |
| DELETE | `/admin/trip/:id/delete` |
| PATCH | `/admin/driver/:id/verification-status` |
| PATCH | `/admin/guide/:id/verification-status` |
| PATCH | `/admin/trip/:id/assign-resources` |
| PATCH | `/admin/trip/:id/status` |
| PATCH | `/admin/trip/:id/confirm-payment` |

---

## Other Responsibilities

- **Config:** `package.json`, `tsconfig.json`, `.env` (project-level configuration)
- **Database:** Full schema design, indexing strategy, data layer (all models + repos)
- **Security:** Authentication & authorization middleware, token management, password hashing
- **Error Handling:** Centralized exception classes and response formatting

---

## All Files in Folder

```
Jamal/
├── backend/
│   ├── common/
│   │   ├── enums/
│   │   │   └── user.enum.ts
│   │   └── interfaces/
│   │       ├── respone.interface.ts
│   │       └── user.interface.ts
│   ├── db/
│   │   ├── db.connection.ts
│   │   ├── models/
│   │   │   ├── black-listed-token.model.ts
│   │   │   ├── driver.model.ts
│   │   │   ├── guide.model.ts
│   │   │   ├── lostIem.model.ts
│   │   │   ├── notification.model.ts
│   │   │   ├── place.model.ts
│   │   │   ├── review.model.ts
│   │   │   ├── trip.model.ts
│   │   │   ├── user.model.ts
│   │   │   ├── vehicle.model.ts
│   │   │   └── vote.model.ts
│   │   └── repo/
│   │       ├── base.repo.ts
│   │       ├── black-listed.repository.ts
│   │       ├── driver.repo.ts
│   │       ├── guide.repo.ts
│   │       ├── lostItem.repo.ts
│   │       ├── notification.repo.ts
│   │       ├── place.repo.ts
│   │       ├── review.repo.ts
│   │       ├── trip.repo.ts
│   │       ├── user.repo.ts
│   │       ├── vehicle.repo.ts
│   │       └── vote.repo.ts
│   ├── middlewares/
│   │   ├── authentication.middleware.ts
│   │   ├── authorization.middleware.ts
│   │   └── validation.middleware.ts
│   ├── modules/
│   │   ├── admin/
│   │   │   ├── admin.controller.ts
│   │   │   └── service/
│   │   │       └── admin.service.ts
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   └── service/
│   │   │       └── auth.service.ts
│   │   └── user/
│   │       ├── user.controller.ts
│   │       └── service/
│   │           └── user.service.ts
│   └── utils/
│       ├── encryption/
│       │   ├── crypro.utils.ts
│       │   ├── hash.utils.ts
│       │   └── token.utils.ts
│       ├── errors/
│       │   ├── exception.utils.ts
│       │   └── http-exception.utils.ts
│       └── response/
│           └── respone-helper.utils.ts
├── docs/
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── core/
    │   ├── models/
    │   │   ├── enums.ts
    │   │   ├── index.ts
    │   │   ├── response.model.ts
    │   │   ├── trip.model.ts
    │   │   └── user.model.ts
    │   └── services/
    │       ├── trip.service.ts
    │       └── user.service.ts
    └── features/
        ├── profile/
        │   ├── profile.component.html
        │   ├── profile.component.scss
        │   ├── profile.component.ts
        │   └── profile.module.ts
        └── trips/
            ├── my-trips/
            │   ├── my-trips.component.html
            │   ├── my-trips.component.scss
            │   └── my-trips.component.ts
            ├── payment/
            │   ├── payment.component.html
            │   ├── payment.component.scss
            │   └── payment.component.ts
            ├── shared-trip/
            │   ├── shared-trip.component.html
            │   ├── shared-trip.component.scss
            │   └── shared-trip.component.ts
            ├── trip-builder/
            │   ├── trip-builder.component.html
            │   ├── trip-builder.component.scss
            │   └── trip-builder.component.ts
            ├── trip-detail/
            │   ├── trip-detail.component.html
            │   ├── trip-detail.component.scss
            │   └── trip-detail.component.ts
            ├── trips-routing.module.ts
            └── trips.module.ts
```
