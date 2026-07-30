# Mai — Notifications, Lost Items & Socket

## Overview

Mai owns the real-time notification system (via WebSocket), the lost-and-found item reporting feature, and the core socket infrastructure used by the auth service and navbar for live updates. The notification list supports mark-read, mark-all-read, and delete actions. Lost items are reported against trips.

## Files (9 total)

### `src/app/core/models/`
| File | Type | Description |
|---|---|---|
| `notification.model.ts` | Model | `INotification` — notification with type, message, read status, user ref |
| `lost-item.model.ts` | Model | `ILostItem`, `ILostItemImage` — lost item report with trip association, status, images |

### `src/app/core/services/`
| File | Type | Description |
|---|---|---|
| `notification.service.ts` | Service | Notification API — list, mark-read, mark-all-read, delete |
| `lost-item.service.ts` | Service | Lost Item API — CRUD, status transitions |
| `socket.service.ts` | Service | WebSocket client — connects to backend Socket.IO, provides real-time event stream |

### `src/app/features/notifications/`
| File | Type | Description |
|---|---|---|
| `notifications.module.ts` | Module | Notifications feature module (guarded by AuthGuard) |
| `notifications/notifications.component.ts` | Component | Notification list with mark-read/mark-all/delete actions |

### `src/app/features/lost-item/`
| File | Type | Description |
|---|---|---|
| `lost-item.module.ts` | Module | Lost Item feature module (guarded by AuthGuard) |
| `lost-item-list/lost-item-list.component.ts` | Component | List user's lost & found reports |

## Dependencies

### From `shared/`
- `AuthGuard` — route protection
- `SharedModule` — shared UI components
- `TokenStorageService` — used by SocketService to attach JWT to WebSocket connection
- `IUser`, `LostItemStatusEnum`
- `environment` — API base URL and WebSocket URL
- `ISuccessResponse` — response wrapping

### From `Bavly/` (cross-member)
- `ITrip` — used in `lost-item.model` for trip association

## Consumers (who depends on Mai)

| Consumer | What they use |
|---|---|
| `shared/` (navbar) | `NotificationService` — navbar badge shows unread count; `SocketService` — real-time notifications |
| `shared/` (auth.service) | `SocketService` — connects/disconnects socket on login/logout |
| `Bavly/` | `trip-detail` imports `LostItemService`, `ILostItem` |

## Known Issues

1. `lost-item.model.ts` imports `ITrip` from `../../../core/` paths resolving within Mai. This belongs to Bavly. Path needs updating.
2. `SocketService` is consumed by the `AuthService` and `NavbarComponent` in `shared/`. This creates a dependency from shared → Mai. Consider whether SocketService should be in shared/.
