# Chapter 5 — Frontend Implementation

## 5.1 Angular Application Structure

The client (`client/src`) is an **Angular** single-page application built with the modern **standalone-component** paradigm (no `NgModule` bootstrapping). Routing is defined in `app/app.routes.ts` using `loadComponent` lazy-loading, and application providers are configured in `app/app.config.ts`. Reactive state is managed through Angular **Signals** within a central `AppStore` (`app/core/store/app.store.ts`).

## 5.2 Application Configuration and Interception

`app.config.ts` registers `provideRouter` (with in-memory scroll restoration), `provideHttpClient(withInterceptors([authInterceptor]))`, `provideAnimations()`, and an `APP_INITIALIZER` that invokes `TranslationService.init()` for bilingual support. The `authInterceptor` (`core/interceptors/auth.interceptor.ts`) automatically attaches the stored JWT to outgoing requests and handles token refresh/expiry, providing a seamless authenticated session.

## 5.3 Routing and Role Guards

The route tree uses a `LayoutComponent` shell with child routes. Public routes are `/login`, `/register`, `/forgot`, `/verify-email`. Authenticated routes live under `/app` and are guarded by `roleGuard(allowedRoles)` (`core/guards/role.guard.ts`), which redirects unauthenticated or unauthorized users to `/login`. Examples of role scoping observed in `app.routes.ts`:

- `admin/*` (dashboard, users, guides, drivers, trips, vehicles) → `roleGuard(['admin'])`.
- `trip/*` (list, new, calendar, shared, detail) → `roleGuard(['tourist','admin'])`.
- `driver` and `driver/profile` → `roleGuard(['driver'])`.
- `guide` and `guide/profile` → `roleGuard(['guide'])`.
- `notifications` and `change-password` → all authenticated roles.

A wildcard `**` redirects to `/login`, ensuring a single entry point.

## 5.4 Service Layer

Domain logic is encapsulated in injectable services under `core/services/`: `auth`, `user`, `trip`, `guide`, `driver`, `vehicle`, `place`, `vote`, `review`, `lost-item`, `notification`, `tracking`, `payment`, `admin`, `translation`, and a generic `api`. Each service wraps the relevant `/api/*` endpoints and returns typed Observables. Notably, `tracking.service.ts` exposes `pushLocation()`, `pollDriver()`, and `pollActiveTrips()` — directly mirroring the polling (non-WebSocket) backend contract and documenting it with an explicit comment.

## 5.5 Representative Components

### 5.5.1 Layout (`layout/layout.component.ts`)
The persistent shell renders a responsive sidebar whose navigation sections are conditionally shown by `auth.user?.role` (admin, tourist, driver, guide). It hosts a global search box, a language toggle (EN/AR), a notification bell with unread badge, and a user card. It uses Signals (`bellOpen = signal(false)`) and injects `NotificationService` to maintain the unread count, demonstrating the Signal-based reactive pattern.

### 5.5.2 Home (`home/home.component.ts`)
Role-aware dashboard for tourists showing stat cards (total trips, upcoming, completed, places visited) and quick-action links. It relies on `TripService` and `AuthService` and uses Angular control-flow syntax (`@if`, `@for`) for rendering.

### 5.5.3 Trip New (`trip/trip-new/trip-new.component.ts`)
The trip-creation wizard: tourists enter dates, people count, and price; search and select places; assign guide/driver/vehicle from dropdowns populated via `GuideService`/`DriverService`/`VehicleService`; and trigger `calculate-price`. On submit it calls `TripService.create`, then optionally opens a `PaymentComponent` modal when `price > 0`. This component directly exercises the trip lifecycle and external price-estimation endpoints.

### 5.5.4 Admin Dashboard (`admin/dashboard/dashboard.component.ts`)
Renders platform statistics (users, active trips, drivers, guides, pending approvals) retrieved from `AdminService.getStats()`, illustrating the admin analytics surface.

## 5.6 State Management with Signals

Rather than a third-party store, TourMate uses Angular Signals (`signal`, `computed`, `effect`) inside `AppStore` for cross-component state such as sidebar visibility and the authenticated user. Component-local state (e.g., `bellOpen` in the layout) also uses Signals, which yield fine-grained, glitch-free reactivity and simplify change detection.

## 5.7 Internationalization

`TranslationService` provides an `APP_INITIALIZER`-driven init and a `currentLang()` Signal plus a `t(key)` translation function used throughout templates (e.g., `translation.t('nav.home')`). The language toggle flips between `en` and `ar`, supporting right-to-left Arabic rendering.

## 5.8 Implementation Summary

The frontend is a clean, modular Angular application that mirrors the backend contract closely. Lazy-loaded routes, Signal-based state, role guards, an auth interceptor, and a thin service layer collectively yield a maintainable, testable, and secure client suitable for the platform's multi-role workflows.
