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

## Frontend Modules Owned

### Core Services
| Service | File | Description |
|---------|------|-------------|
| DriverService | `frontend/core/services/driver.service.ts` | Driver API — profile CRUD, availability, location updates, stats |
| GuideService | `frontend/core/services/guide.service.ts` | Guide API — profile CRUD, language/certificate management |
| VehicleService | `frontend/core/services/vehicle.service.ts` | Vehicle API — CRUD, driver-vehicle assignment |

### Core Models
| Model | File | Description |
|-------|------|-------------|
| `IDriver` | `frontend/core/models/driver.model.ts` | Driver profile with verification status, location, user ref |
| `IGuide`, `ICertificate` | `frontend/core/models/guide.model.ts` | Guide profile with languages, certificates, verification |
| `IVehicle`, `ICarImage` | `frontend/core/models/vehicle.model.ts` | Car details, driver association, images |

### Driver Feature
| Component | File | Description |
|-----------|------|-------------|
| Module | `frontend/features/driver/driver.module.ts` | Driver feature module |
| List | `frontend/features/driver/driver-list/driver-list.component.ts` | Browse/search drivers with vehicle info |
| Onboarding | `frontend/features/driver/driver-onboarding/driver-onboarding.component.ts` | Apply to become a driver (form with license, experience) |
| Dashboard | `frontend/features/driver/driver-dashboard/driver-dashboard.component.ts` | Active trips, accept/reject rides, availability toggle, live location |

### Guide Feature
| Component | File | Description |
|-----------|------|-------------|
| Module | `frontend/features/guide/guide.module.ts` | Guide feature module |
| List | `frontend/features/guide/guide-list/guide-list.component.ts` | Browse/search guides with language filter |
| Onboarding | `frontend/features/guide/guide-onboarding/guide-onboarding.component.ts` | Apply to become a guide (certificate upload, languages) |
| Dashboard | `frontend/features/guide/guide-dashboard/guide-dashboard.component.ts` | Active trips, accept/reject, availability toggle |

### Vehicle Feature
| Component | File | Description |
|-----------|------|-------------|
| Module | `frontend/features/vehicle/vehicle.module.ts` | Vehicle feature module (guarded by AuthGuard + RoleGuard) |
| List | `frontend/features/vehicle/vehicle-list/vehicle-list.component.ts` | List user's vehicles with delete, driver assignment |
| Form | `frontend/features/vehicle/vehicle-form/vehicle-form.component.ts` | Add/edit vehicle (make, model, year, color, plate, photos) |

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

## Dependencies

### From Shared Infrastructure
- `AuthService` — authentication context for dashboard/onboarding guards
- `AuthGuard`, `RoleGuard` — route protection (vehicle module)
- `SharedModule` — shared UI components (navbar, loading, confirm-dialog, map, language-selector, translate)
- `IUser`, `IGeoPoint`, `VerificationStatusEnum`, `TripStatusEnum`, `RoleEnum`
- `ConfirmDialogComponent` — reusable delete confirmation modal
- `environment` — API base URL configuration

### From Other Members (cross-member)
- `TripService` (Bavly) — used by guide-dashboard and driver-dashboard for active trip management
- `ITrip` (Bavly) — trip model used in dashboards

---

## Consumers (who depends on Ahmed_Abo_Bakr)

| Consumer | What they use |
|---|---|
| Jamal | `AdminService` imports `IDriver`, `IGuide`, `IVehicle`; `ProfileComponent` imports `DriverService`, `GuideService`; `AdminTripManagementComponent` imports `DriverService`, `GuideService`, `VehicleService` |
| Bavly | `trip-builder` imports `GuideService`, `DriverService`, `VehicleService` + models; `trip.model` imports `IDriver`, `IGuide`, `IVehicle`; `shared-trip` imports `IVehicle` |
| Ramadan | `review.model` imports `IDriver`, `IGuide` |

---

## Known Issues

1. `guide-dashboard.component.ts` and `driver-dashboard.component.ts` import `TripService` and `ITrip` from Bavly. These need to be resolved when integrating branches.

---

## Other Responsibilities

- **Documentation:** All README files, feature checklists, status checklists, deployment guides
- **Scripts:** `start.sh`, `start-cloudflare.sh`, Cloudflare deploy config
- **Route Guards & Interceptors:** `auth.guard.ts`, `role.guard.ts`, `auth.interceptor.ts`
- **Core Infrastructure:** `auth.service.ts`, `admin.service.ts`, `token-storage.service.ts`, `language.service.ts`

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
│   │   ├── models/
│   │   │   ├── driver.model.ts
│   │   │   ├── enums.ts
│   │   │   ├── guide.model.ts
│   │   │   ├── location.model.ts
│   │   │   ├── response.model.ts
│   │   │   ├── user.model.ts
│   │   │   └── vehicle.model.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── driver.service.ts
│   │       ├── guide.service.ts
│   │       ├── language.service.ts
│   │       ├── token-storage.service.ts
│   │       ├── user.service.ts
│   │       └── vehicle.service.ts
│   ├── environments/
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── features/
│   │   ├── driver/
│   │   │   ├── driver-dashboard/
│   │   │   │   └── driver-dashboard.component.ts
│   │   │   ├── driver-list/
│   │   │   │   └── driver-list.component.ts
│   │   │   ├── driver-onboarding/
│   │   │   │   └── driver-onboarding.component.ts
│   │   │   └── driver.module.ts
│   │   ├── guide/
│   │   │   ├── guide-dashboard/
│   │   │   │   └── guide-dashboard.component.ts
│   │   │   ├── guide-list/
│   │   │   │   └── guide-list.component.ts
│   │   │   ├── guide-onboarding/
│   │   │   │   └── guide-onboarding.component.ts
│   │   │   └── guide.module.ts
│   │   └── vehicle/
│   │       ├── vehicle-form/
│   │       │   └── vehicle-form.component.ts
│   │       ├── vehicle-list/
│   │       │   └── vehicle-list.component.ts
│   │       └── vehicle.module.ts
│   └── shared/
│       ├── components/
│       │   ├── confirm-dialog/
│       │   ├── language-selector/
│       │   ├── loading/
│       │   ├── map/
│       │   └── navbar/
│       ├── pipes/
│       │   └── translate.pipe.ts
│       └── shared.module.ts
└── README.md
```
