# Mai — Provider Frontend, Admin Backend

## Role
Provider Frontend & Admin Backend — builds the Driver and Guide provider apps (onboarding, dashboard, lists), owns Notification & Lost Item backend modules, and implements real-time socket notifications.

---

## Backend Modules Owned

| Module | Files | Description |
|--------|-------|-------------|
| **Notification** | `backend/modules/notifications/notification.controller.ts`, `backend/modules/notifications/service/nofification.service.ts` | Create, list, read/unread, mark-all-read, delete notifications |
| **Lost Item** | `backend/modules/lost_item/lost_item.controller.ts`, `backend/modules/lost_item/service/lost_item.service.ts` | Lost item CRUD, status management, report found, close, reopen |

---

## Socket (Real-Time)

| File | Description |
|------|-------------|
| `backend/socket/socket.ts` | Socket.IO server setup, connection handling, room management |
| `backend/socket/sendNotification.ts` | Emits real-time notifications to connected clients |

---

## Backend Utils

| File | Description |
|------|-------------|
| `backend/utils/services/createnotification.service.ts` | Helper service to create and persist notifications |
| `backend/utils/services/cloudinary.service.ts` | Cloudinary image upload integration |

---

## Frontend Features Owned

### Driver App UI
| Component | Path |
|-----------|------|
| Driver Onboarding | `frontend/features/driver/driver-onboarding/driver-onboarding.component.ts` |
| Driver Dashboard | `frontend/features/driver/driver-dashboard/driver-dashboard.component.ts`, `.scss` |
| Driver List | `frontend/features/driver/driver-list/driver-list.component.ts` |
| Driver Module | `frontend/features/driver/driver.module.ts` |

### Guide App UI
| Component | Path |
|-----------|------|
| Guide Onboarding | `frontend/features/guide/guide-onboarding/guide-onboarding.component.ts` |
| Guide Dashboard | `frontend/features/guide/guide-dashboard/guide-dashboard.component.ts`, `.scss` |
| Guide List | `frontend/features/guide/guide-list/guide-list.component.ts` |
| Guide Module | `frontend/features/guide/guide.module.ts` |

### Notification
| Component | Path |
|-----------|------|
| Notifications | `frontend/features/notifications/notifications.component.ts` |
| Notifications Module | `frontend/features/notifications/notifications.module.ts` |

### Lost Item
| Component | Path |
|-----------|------|
| Lost Item List | `frontend/features/lost-item/lost-item-list/lost-item-list.component.ts` |
| Lost Item Module | `frontend/features/lost-item/lost-item.module.ts` |

### Core Services
| Service | Description |
|---------|-------------|
| `frontend/core/services/notification.service.ts` | Notification API calls |
| `frontend/core/services/lost-item.service.ts` | Lost item API calls |
| `frontend/core/services/socket.service.ts` | Socket.IO client service |

### Models
| Model | File |
|-------|------|
| Notification | `frontend/core/models/notification.model.ts` |
| Lost Item | `frontend/core/models/lost-item.model.ts` |
| Driver | `frontend/core/models/driver.model.ts` |
| Guide | `frontend/core/models/guide.model.ts` |

---

## API Endpoints Built

### Notification
| Method | Endpoint |
|--------|----------|
| GET | `/notifications/notifications` |
| GET | `/notifications/get/:id` |
| GET | `/notifications/unread-count` |
| POST | `/notifications/create` |
| PATCH | `/notifications/:id/mark-as-read` |
| PATCH | `/notifications/mark-all-as-read` |
| DELETE | `/notifications/:id/delete` |
| DELETE | `/notifications/delete-all` |

### Lost Item
| Method | Endpoint |
|--------|----------|
| POST | `/lost_item/create_lost_item` |
| GET | `/lost_item/get/:id` |
| GET | `/lost_item/:tripId/trip_lost_items` |
| GET | `/lost_item/my_lost_items` |
| PATCH | `/lost_item/:id/update` |
| PATCH | `/lost_item/:id/status` |
| DELETE | `/lost_item/:id/delete` |
| PATCH | `/lost_item/:id/report-found` |
| PATCH | `/lost_item/:id/close` |
| PATCH | `/lost_item/:id/reopen` |

---

## Other Responsibilities

- **Real-Time Communication:** Full WebSocket implementation (Socket.IO) for live notifications
- **Media Upload:** Cloudinary integration for image/file uploads across the app
- **Provider Experience:** End-to-end Driver & Guide onboarding and management flows

---

## All Files in Folder

```
Mai/
├── backend/
│   ├── modules/
│   │   ├── lost_item/
│   │   │   ├── lost_item.controller.ts
│   │   │   └── service/
│   │   │       └── lost_item.service.ts
│   │   └── notifications/
│   │       ├── notification.controller.ts
│   │       └── service/
│   │           └── nofification.service.ts
│   ├── socket/
│   │   ├── sendNotification.ts
│   │   └── socket.ts
│   └── utils/
│       └── services/
│           ├── cloudinary.service.ts
│           └── createnotification.service.ts
├── docs/
└── frontend/
    ├── core/
    │   ├── models/
    │   │   ├── driver.model.ts
    │   │   ├── guide.model.ts
    │   │   ├── lost-item.model.ts
    │   │   └── notification.model.ts
    │   └── services/
    │       ├── lost-item.service.ts
    │       ├── notification.service.ts
    │       └── socket.service.ts
    └── features/
        ├── driver/
        │   ├── driver-dashboard/
        │   │   ├── driver-dashboard.component.scss
        │   │   └── driver-dashboard.component.ts
        │   ├── driver-list/
        │   │   └── driver-list.component.ts
        │   ├── driver-onboarding/
        │   │   └── driver-onboarding.component.ts
        │   └── driver.module.ts
        ├── guide/
        │   ├── guide-dashboard/
        │   │   ├── guide-dashboard.component.scss
        │   │   └── guide-dashboard.component.ts
        │   ├── guide-list/
        │   │   └── guide-list.component.ts
        │   ├── guide-onboarding/
        │   │   └── guide-onboarding.component.ts
        │   └── guide.module.ts
        ├── lost-item/
        │   ├── lost-item-list/
        │   │   └── lost-item-list.component.ts
        │   └── lost-item.module.ts
        └── notifications/
            ├── notifications.component.ts
            └── notifications.module.ts
```
