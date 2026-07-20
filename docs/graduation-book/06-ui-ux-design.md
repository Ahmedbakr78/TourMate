# Chapter 6 — UI/UX Design

## 6.1 Design Philosophy

TourMate's user interface pursues a calm, modern "glassmorphism-adjacent" aesthetic centred on a dark, high-contrast theme with an ink/accent palette (CSS custom properties such as `--tm-surface`, `--tm-ink`, `--tm-primary`, `--tm-muted`, `--glass-border`). The experience prioritises role-contextual navigation, responsive layout, and bilingual accessibility (English/Arabic), ensuring that tourists, drivers, guides, and administrators each encounter only the tools relevant to them.

## 6.2 Layout Shell and Navigation

The `LayoutComponent` (`client/src/app/layout/layout.component.ts`) is the persistent frame for all authenticated screens. It comprises:

- A **mobile header** with a hamburger toggle, brand wordmark, and language switch, shown only on narrow viewports.
- A **topbar** with a global fuzzy search box (trips, places, tools) and a language toggle.
- A **collapsible sidebar** with role-scoped navigation sections. The `@if (auth.user?.role === 'admin')` / `'tourist'` / `'driver'` / `'guide'` blocks conditionally render admin, trips/explore, driver, and guide sections, enforcing least-privilege visibility at the UI level.
- A **user section** with an avatar (initials), role label, notification bell (with unread badge and dropdown), settings, and logout.

The sidebar uses `routerLinkActive` for active-state highlighting and a mobile overlay for small screens, delivering a coherent experience from desktop to phone.

## 6.3 Visual Language and Components

Styling is component-scoped (Angular `styles: [...]`) and token-driven. Reusable primitives include:

- **Stat cards** (`shared/stat-card.component.ts`) — used on home and admin dashboards to surface metrics with coloured icon chips.
- **Breadcrumbs** (`shared/breadcrumb.component.ts`) — contextual pathing beneath the topbar.
- **Modals** (`shared/modal.component.ts`), **pagination** (`shared/pagination.component.ts`), **empty states** (`shared/empty-state.component.ts`), and an **icon component** (`shared/icon.component.ts`) providing a consistent SVG icon set via an `IconName` union.
- A **toast system** (`core/components/toast-container.component.ts` + `ToastService`) for transient feedback.

## 6.4 Forms and Interaction Patterns

The trip-creation form (`trip-new.component.ts`) exemplifies the interaction model: inline validation, a live "Calculate" button invoking price estimation, debounced recalculation (`recalcTimer`), search-as-you-type place discovery, draggable reordering of selected places, and a payment modal triggered conditionally. Buttons expose loading spinners and disabled states to communicate in-flight operations.

## 6.5 Maps and Real-Time Tracking View

Although the map rendering component (`shared/map/map.component.ts`) and `TrackingService` are consumed by trip-detail and monitoring screens, the UX principle is explicit: the driver's position is refreshed via **periodic polling** rather than live sockets. The UI therefore shows the last-known location with a subtle "updating…" affordance, and the architecture chapter notes this is intentional for deployment simplicity.

## 6.6 Accessibility and Internationalization

- **Bilingual UI** — `TranslationService` drives `t(key)` lookups and a runtime EN/AR switch; the language toggle appears in both the sidebar and topbar/mobile header.
- **Semantics** — buttons carry `aria-label` attributes (e.g., move up/down, remove place); icons are decorative complements to text labels.
- **Responsive** — breakpoints at 768px and 480px reflow the sidebar into an off-canvas drawer and compress content padding.

## 6.7 Consistency and Theming

A single source of design tokens (CSS variables) guarantees consistent spacing, radii, and colour usage across components. Active navigation items invert to the ink colour; hover states use translucent `--glass-hover` overlays; focus states are visible. This systematic approach reduces cognitive load and accelerates user orientation.

## 6.8 UX Evaluation Summary

Informally, the interface satisfies the core tasks — registering, planning a trip, assigning staff, tracking a driver, voting, reviewing, and reporting lost items — within a minimal number of clicks from the relevant dashboard. Role-scoped navigation prevents feature overload, and the bilingual support broadens the platform's reach. Future work could formalise usability testing with representative tourists to quantify task-completion times and satisfaction.
