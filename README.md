# Ahmed Abo Bakr — Team Leader

## Role
Team Leader — oversees backend, frontend, DevOps, and deliverables.

---

## Backend Modules Owned

| Module | Files | Description |
|--------|-------|-------------|
| **Guide** | `backend/modules/guide/guide.controller.ts`, `backend/modules/guide/service/guide.service.ts` | Guide CRUD, certification upload, availability |
| **Driver** | `backend/modules/driver/driver.controller.ts`, `backend/modules/driver/service/driver.service.ts` | Driver CRUD, availability management |
| **Vehicle** | `backend/modules/vehicle/vehicle.controller.ts`, `backend/modules/vehicle/service/vehicle.service.ts` | Vehicle CRUD, image upload, driver association |
| **Location** | `backend/modules/location/location.controller.ts`, `backend/modules/location/location.store.ts` | Polling-based real-time location tracking |

## Backend Utils

| File | Description |
|------|-------------|
| `backend/utils/services/openroute.service.ts` | OpenRouteService API integration for route calculation |
| `backend/utils/services/osrm.service.ts` | OSRM API integration for route calculation |

---

## Frontend Features Owned

### Auth UI
| Component | Path |
|-----------|------|
| Login | `frontend/features/auth/login/login.component.ts` |
| Signup | `frontend/features/auth/signup/signup.component.ts` |
| Forgot Password | `frontend/features/auth/forgot-password/forgot-password.component.ts` |
| Reset Password | `frontend/features/auth/reset-password/reset-password.component.ts` |
| Confirm Email | `frontend/features/auth/confirm-email/confirm-email.component.ts` |
| Auth Module | `frontend/features/auth/auth.module.ts`, `auth-routing.module.ts`, `auth.shared.scss` |

### Admin Dashboard
| Component | Path |
|-----------|------|
| Dashboard | `frontend/features/admin/dashboard/admin-dashboard.component.ts` |
| User Management | `frontend/features/admin/users/admin-users.component.ts` |
| Trip Management | `frontend/features/admin/trip-management/admin-trip-management.component.ts` |
| Verifications | `frontend/features/admin/verifications/admin-verifications.component.ts` |
| Admin Module | `frontend/features/admin/admin.module.ts` |

### Home
| Component | Path |
|-----------|------|
| Home | `frontend/features/home/home.component.ts`, `.html`, `.scss`, `.spec.ts` |

### Route Guards & Interceptors
| File | Description |
|------|-------------|
| `frontend/core/guards/auth.guard.ts` | Authentication route guard |
| `frontend/core/guards/role.guard.ts` | Role-based route guard |
| `frontend/core/interceptors/auth.interceptor.ts` | HTTP auth interceptor |

### Core Services
| Service | Description |
|---------|-------------|
| `frontend/core/services/auth.service.ts` | Auth API calls |
| `frontend/core/services/admin.service.ts` | Admin API calls |
| `frontend/core/services/guide.service.ts` | Guide API calls |
| `frontend/core/services/driver.service.ts` | Driver API calls |
| `frontend/core/services/vehicle.service.ts` | Vehicle API calls |
| `frontend/core/services/token-storage.service.ts` | Token persistence |
| `frontend/core/services/language.service.ts` | i18n language switching |

---

## API Endpoints Built

### Guide
| Method | Endpoint |
|--------|----------|
| POST | `/guide/create_guide` |
| PATCH | `/guide/update/:id` |
| DELETE | `/guide/delete/:id` |
| GET | `/guide/get/:id` |
| GET | `/guide/all` |
| GET | `/guide/search` |
| PATCH | `/guide/update-availability/:id` |
| POST | `/guide/upload-certificate/:id` |
| DELETE | `/guide/delete-certificate/:id` |

### Driver
| Method | Endpoint |
|--------|----------|
| POST | `/driver/create_driver` |
| PATCH | `/driver/update/:id` |
| DELETE | `/driver/delete/:id` |
| GET | `/driver/get/:id` |
| GET | `/driver/all` |
| POST | `/driver/search` |
| PATCH | `/driver/update-availability/:id` |

### Vehicle
| Method | Endpoint |
|--------|----------|
| POST | `/vehicle/create_vehicle` |
| PATCH | `/vehicle/update/:id` |
| DELETE | `/vehicle/delete/:id` |
| GET | `/vehicle/get/:id` |
| GET | `/vehicle/all` |
| GET | `/vehicle/search` |
| GET | `/vehicle/driver/:driverId` |
| POST | `/vehicle/upload-images/:id` |
| DELETE | `/vehicle/delete-image/:id` |

### Location
Polling-based location tracking (no REST endpoints).

---

## Other Responsibilities

- **Documentation:** All README files, feature checklists, status checklists, deployment guides
- **Scripts:** `start.sh`, `start-cloudflare.sh`, Cloudflare deploy config
- **Driver UI:** Driver onboarding, dashboard, list components
- **Guide UI (shared):** Guide onboarding, dashboard, list components

---

## All Files in Folder

```
Ahmed/
├── backend/
│   ├── modules/
│   │   ├── driver/
│   │   │   ├── driver.controller.ts
│   │   │   └── service/
│   │   │       └── driver.service.ts
│   │   ├── guide/
│   │   │   ├── guide.controller.ts
│   │   │   └── service/
│   │   │       └── guide.service.ts
│   │   ├── location/
│   │   │   ├── location.controller.ts
│   │   │   └── location.store.ts
│   │   └── vehicle/
│   │       ├── vehicle.controller.ts
│   │       └── service/
│   │           └── vehicle.service.ts
│   └── utils/
│       └── services/
│           ├── openroute.service.ts
│           └── osrm.service.ts
├── docs/
│   ├── CLOUDFLARE_DEPLOY.md
│   ├── COMPREHENSIVE_CHECKLIST.md
│   ├── FEATURES_CHECKLIST.md
│   ├── NN1-v2-STATUS-CHECKLIST.md
│   ├── NN1-v2-Team-Checklist.md
│   ├── README.md
│   ├── _redirects
│   ├── start-cloudflare.sh
│   └── start.sh
├── frontend/
│   ├── core/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   └── services/
│   │       ├── admin.service.ts
│   │       ├── auth.service.ts
│   │       ├── driver.service.ts
│   │       ├── guide.service.ts
│   │       ├── language.service.ts
│   │       ├── token-storage.service.ts
│   │       └── vehicle.service.ts
│   └── features/
│       ├── admin/
│       │   ├── admin.module.ts
│       │   ├── dashboard/
│       │   │   └── admin-dashboard.component.ts
│       │   ├── trip-management/
│       │   │   └── admin-trip-management.component.ts
│       │   ├── users/
│       │   │   └── admin-users.component.ts
│       │   └── verifications/
│       │       └── admin-verifications.component.ts
│       ├── auth/
│       │   ├── auth-routing.module.ts
│       │   ├── auth.module.ts
│       │   ├── auth.shared.scss
│       │   ├── confirm-email/
│       │   │   └── confirm-email.component.ts
│       │   ├── forgot-password/
│       │   │   └── forgot-password.component.ts
│       │   ├── login/
│       │   │   └── login.component.ts
│       │   ├── reset-password/
│       │   │   └── reset-password.component.ts
│       │   └── signup/
│       │       └── signup.component.ts
│       ├── driver/
│       │   ├── driver-dashboard/
│       │   │   ├── driver-dashboard.component.scss
│       │   │   └── driver-dashboard.component.ts
│       │   ├── driver-list/
│       │   │   └── driver-list.component.ts
│       │   ├── driver-onboarding/
│       │   │   └── driver-onboarding.component.ts
│       │   └── driver.module.ts
│       ├── guide/
│       │   ├── guide-dashboard/
│       │   │   ├── guide-dashboard.component.scss
│       │   │   └── guide-dashboard.component.ts
│       │   ├── guide-list/
│       │   │   └── guide-list.component.ts
│       │   ├── guide-onboarding/
│       │   │   └── guide-onboarding.component.ts
│       │   └── guide.module.ts
│       ├── home/
│       │   ├── home.component.html
│       │   ├── home.component.scss
│       │   ├── home.component.spec.ts
│       │   └── home.component.ts
│       └── vehicle/
│           ├── vehicle-form/
│           │   └── vehicle-form.component.ts
│           ├── vehicle-list/
│           │   └── vehicle-list.component.ts
│           └── vehicle.module.ts
└── README.md
```
