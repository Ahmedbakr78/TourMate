# Jamal — Authentication, Admin Panel & Profile

## Overview

Jamal owns the user-facing authentication flow, the admin operations dashboard, and the user profile page. This includes login, registration, email verification, password reset, admin CRUD for users/trips/verifications, and profile editing with driver/guide self-service.

## Files (15 total)

### `src/app/core/services/`
| File | Type | Description |
|---|---|---|
| `admin.service.ts` | Service | Admin API — dashboard stats, user management, trip verification, driver/guide verification |

### `src/app/features/auth/`
| File | Type | Description |
|---|---|---|
| `auth.module.ts` | Module | Auth feature module |
| `auth-routing.module.ts` | Module | Auth routes (login, signup, confirm-email, forgot-password, reset-password) |
| `login/login.component.ts` | Component | Email/password login form |
| `signup/signup.component.ts` | Component | Registration form (name, email, password, gender, phone) |
| `confirm-email/confirm-email.component.ts` | Component | OTP email verification |
| `forgot-password/forgot-password.component.ts` | Component | Request password reset email |
| `reset-password/reset-password.component.ts` | Component | Set new password with token |

### `src/app/features/admin/`
| File | Type | Description |
|---|---|---|
| `admin.module.ts` | Module | Admin feature module (guarded by RoleGuard) |
| `dashboard/admin-dashboard.component.ts` | Component | Stats cards, system statistics, user/trip/driver/guide counts |
| `users/admin-users.component.ts` | Component | User list with role/status filtering, delete confirmation |
| `verifications/admin-verifications.component.ts` | Component | Driver & guide document verification approval/rejection |
| `trip-management/admin-trip-management.component.ts` | Component | Trip CRUD, status updates, driver/guide assignment |

### `src/app/features/profile/`
| File | Type | Description |
|---|---|---|
| `profile.module.ts` | Module | Profile feature module |
| `profile.component.ts` | Component | View/edit profile, switch to driver/guide mode |

## Dependencies

### From `shared/`
- `AuthService` — signup, login, token refresh, logout
- `UserService` — profile CRUD
- `AuthGuard`, `RoleGuard` — route protection
- `SharedModule` — shared UI components (navbar, loading, confirm-dialog)
- `IUser`, `GenderEnum`, `RoleEnum`, `StatusUserEnum`, `TripStatusEnum`, `VerificationStatusEnum`
- `ConfirmDialogComponent` — reusable delete/confirm modal
- `environment` — API base URL

### From `Ahmed_Abo_Bakr/` (cross-member)
- `DriverService`, `GuideService`, `VehicleService`
- `IDriver`, `IGuide`, `IVehicle`

### From `Bavly/` (cross-member)
- `TripService`
- `ITrip`

## Consumers (who depends on Jamal)

| Consumer | What they use |
|---|---|
| `shared/` (app-routing.module.ts) | Lazy-loads `AuthModule`, `ProfileModule`, `AdminModule` |

## Known Issues

1. `admin-trip-management.component.ts` imports `TripService`, `DriverService`, `GuideService`, `VehicleService`, `ITrip`, `IDriver`, `IGuide`, `IVehicle` from `../../../core/` paths that resolve within Jamal's folder. These services/models belong to other members (Bavly, Ahmed_Abo_Bakr). The imports need to point to the correct member folders or the shared/models barrel.
2. `admin-verifications.component.ts` imports `DriverService`, `GuideService`, `IDriver`, `IGuide` from Ahmed_Abo_Bakr — same issue.
3. `profile.component.ts` imports `DriverService`, `GuideService`, `IDriver`, `IGuide` from Ahmed_Abo_Bakr — same issue.
