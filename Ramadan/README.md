# Ramadan — DevOps, Shared UI, QA Lead

## Role
DevOps, Shared UI & QA Lead — manages deployment, infrastructure, seed data, shared frontend components (Places, Reviews, Notifications, Lost & Found), and quality assurance.

---

## Backend Modules Owned

| Module | Files | Description |
|--------|-------|-------------|
| **Place** | `backend/modules/place/place.controller.ts`, `backend/modules/place/service/place.service.ts`, `backend/modules/place/service/overpass.service.ts`, `backend/modules/place/service/place.service.test.ts` | Place CRUD, search, filter, nearby, popular, save/unsave; Overpass API integration for OSM data; unit tests |
| **Review** | `backend/modules/review/review.controller.ts`, `backend/modules/review/service/review.service.ts` | Review CRUD, trip/place/guide/driver reviews |

---

## DevOps & Infrastructure

| File | Description |
|------|-------------|
| `devops/package.json` | Project dependencies & scripts |
| `devops/tsconfig.json` | TypeScript configuration |
| `devops/.env` | Environment variables |
| `devops/start.sh` | Production start script |
| `devops/start-cloudflare.sh` | Cloudflare deployment start script |

## Seed Data

| File | Description |
|------|-------------|
| `seed/seed.ts` | Database seeder with initial data for development/testing |

---

## Frontend Features Owned

### Places
| Component | Path |
|-----------|------|
| Place List | `frontend/features/places/place-list/place-list.component.ts`, `.html`, `.scss` |
| Place Form | `frontend/features/places/place-form/place-form.component.ts`, `.html`, `.scss` |
| Place Detail | `frontend/features/places/place-detail/place-detail.component.ts`, `.html`, `.scss` |
| Places Module | `frontend/features/places/places.module.ts`, `places-routing.module.ts` |

### Reviews
| Component | Path |
|-----------|------|
| Review List | `frontend/features/reviews/review-list/review-list.component.ts`, `.html`, `.scss` |
| Review Form | `frontend/features/reviews/review-form/review-form.component.ts`, `.html`, `.scss` |
| Reviews Module | `frontend/features/reviews/reviews.module.ts` |

### Notifications
| Component | Path |
|-----------|------|
| Notifications | `frontend/features/notifications/notifications.component.ts` |
| Notifications Module | `frontend/features/notifications/notifications.module.ts` |

### Lost & Found
| Component | Path |
|-----------|------|
| Lost Item List | `frontend/features/lost-item/lost-item-list/lost-item-list.component.ts` |
| Lost Item Module | `frontend/features/lost-item/lost-item.module.ts` |

### Core Services
| Service | Description |
|---------|-------------|
| `frontend/core/services/place.service.ts` | Place API calls |
| `frontend/core/services/review.service.ts` | Review API calls |

### Models
| Model | File |
|-------|------|
| Place | `frontend/core/models/place.model.ts` |
| Review | `frontend/core/models/review.model.ts` |
| Driver | `frontend/core/models/driver.model.ts` |
| Guide | `frontend/core/models/guide.model.ts` |
| Vehicle | `frontend/core/models/vehicle.model.ts` |

---

## API Endpoints Built

### Place
| Method | Endpoint |
|--------|----------|
| POST | `/place/create_place` |
| GET | `/place/all` |
| GET | `/place/get/:id` |
| PUT | `/place/update/:id` |
| DELETE | `/place/places/:id` |
| GET | `/place/search` |
| GET | `/place/filter` |
| GET | `/place/nearby` |
| GET | `/place/popular` |
| POST | `/place/save/:id` |
| DELETE | `/place/save/:id` |

### Review
| Method | Endpoint |
|--------|----------|
| POST | `/review/create_review` |
| GET | `/review/all` |
| GET | `/review/get/:id` |
| PATCH | `/review/:id/update` |
| DELETE | `/review/:id/delete` |
| GET | `/review/:tripId/reviews` |
| GET | `/review/:placeId/place_reviews` |
| GET | `/review/guide/:guideId` |
| GET | `/review/driver/:driverId` |
| GET | `/review/my-reviews` |

---

## Other Responsibilities

- **DevOps:** Deployment scripts, environment configuration, Cloudflare setup
- **QA:** Place service unit tests (`place.service.test.ts`), overall quality oversight
- **Database Seeding:** Initial data population for development environments
- **Shared Components:** Maintains reusable UI across Places, Reviews, Notifications, Lost & Found
- **Overpass Integration:** OpenStreetMap data fetching via Overpass API

---

## All Files in Folder

```
Ramadan/
├── backend/
│   └── modules/
│       ├── place/
│       │   ├── place.controller.ts
│       │   └── service/
│       │       ├── overpass.service.ts
│       │       ├── place.service.test.ts
│       │       └── place.service.ts
│       └── review/
│           ├── review.controller.ts
│           └── service/
│               └── review.service.ts
├── devops/
│   ├── .env
│   ├── package.json
│   ├── start-cloudflare.sh
│   ├── start.sh
│   └── tsconfig.json
├── docs/
├── seed/
│   └── seed.ts
└── frontend/
    ├── core/
    │   ├── models/
    │   │   ├── driver.model.ts
    │   │   ├── guide.model.ts
    │   │   ├── place.model.ts
    │   │   ├── review.model.ts
    │   │   └── vehicle.model.ts
    │   └── services/
    │       ├── place.service.ts
    │       └── review.service.ts
    └── features/
        ├── lost-item/
        │   ├── lost-item-list/
        │   │   └── lost-item-list.component.ts
        │   └── lost-item.module.ts
        ├── notifications/
        │   ├── notifications.component.ts
        │   └── notifications.module.ts
        ├── places/
        │   ├── place-detail/
        │   │   ├── place-detail.component.html
        │   │   ├── place-detail.component.scss
        │   │   └── place-detail.component.ts
        │   ├── place-form/
        │   │   ├── place-form.component.html
        │   │   ├── place-form.component.scss
        │   │   └── place-form.component.ts
        │   ├── place-list/
        │   │   ├── place-list.component.html
        │   │   ├── place-list.component.scss
        │   │   └── place-list.component.ts
        │   ├── places-routing.module.ts
        │   └── places.module.ts
        └── reviews/
            ├── review-form/
            │   ├── review-form.component.html
            │   ├── review-form.component.scss
            │   └── review-form.component.ts
            ├── review-list/
            │   ├── review-list.component.html
            │   ├── review-list.component.scss
            │   └── review-list.component.ts
            └── reviews.module.ts
```
