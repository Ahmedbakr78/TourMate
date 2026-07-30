# TourMate - Angular 16 Frontend

Full Angular 16 + Angular Material frontend for the TourMate backend
(`Ahmedbakr78/TourMate`, `backend_node.js` branch). Built against the actual
implemented API routes, and updated in lockstep with a round of backend bug
fixes (see "Backend fixes this frontend now relies on" below).

## Getting started

```bash
npm install
npm start          # ng serve, runs on http://localhost:4200
```

Make sure the backend is running (default expected at `http://localhost:3000`,
see `src/environments/environment.ts`). Update `apiUrl` there if your backend
runs elsewhere.

```bash
npm run build       # production build -> dist/tourmate-frontend
```

> Production builds disable Angular's automatic Google Fonts inlining
> (`optimization.fonts: false` in `angular.json`) because that step needs
> internet access to `fonts.googleapis.com` at build time in some sandboxed
> environments. The `<link>` tags in `index.html` still load the fonts
> normally in the browser at runtime.

## Project structure

```
src/app/
  core/
    models/        # TypeScript interfaces mirrored 1:1 from the backend's Mongoose schemas/enums
    services/      # One service per backend module (12 total) + auth/token/socket
    guards/        # AuthGuard (logged in), RoleGuard (role-based)
    interceptors/  # Attaches JWT, auto-refreshes on 401
  shared/          # Navbar (with live notification toasts), loading spinner, confirm dialog
  features/
    auth/          # login, signup, confirm-email, forgot/reset password
    home/           # landing page
    places/         # list with real server-side search, detail, create/edit
    trips/          # builder, my-trips, detail (vote/review/lost-item w/ photo/cancel/join)
    profile/        # view/edit user, photo upload, password, delete account,
                     # + self-service driver/guide profile (availability toggle,
                     # certificate re-upload for guides)
    driver/         # become-a-driver + public driver list
    guide/          # become-a-guide + public guide list with working language search
    vehicle/        # add vehicle + "my vehicles" (correctly scoped to the current driver)
    lost-item/      # my lost item reports
    notifications/  # notification inbox + live Socket.IO push
    admin/          # dashboard, user management, verifications, trip management
```

Every feature module is lazy-loaded (see `app-routing.module.ts`), and role-sensitive
routes (`/admin/*`, place/vehicle creation, etc.) are protected with `RoleGuard`.

## Design system (this pass)

Replaced the default Material indigo-pink theme with a custom look grounded in the
product itself:

- **Palette:** "Nile Teal" (primary, `#17716c`/`#044944`) + "Desert Gold" (accent,
  `#dc8b00`) - defined in `src/styles.scss` via `mat.define-palette`.
- **Type:** Fraunces (headings) + Inter (body/UI), loaded in `index.html`.
- **Signature element:** the Home hero's dashed "route line" connecting four
  waypoints (Places -> Guide -> Driver -> Trip) - a literal depiction of what
  the Trip Builder actually does, not decoration.
- Cards, buttons, and form fields got a consistent radius/shadow treatment via
  global rules in `src/styles.scss`, so this cascades to every screen automatically.

## Maps: Leaflet + OpenStreetMap (free, no API key)

Added `src/app/shared/components/map/map.component.ts` - a reusable Leaflet
component matching the SRS's own "Leaflet.js (OpenStreetMap map rendering)"
requirement. It's completely free (OSM's public tile server, no signup/API key).

- **`mode="picker"`**: tap the map to drop a pin, drag to fine-tune, or tap
  "Use my current location" (plain browser Geolocation API - also free, no key).
  Emits `(locationSelected)="{lat, lng}"`.
- **`mode="view"`**: read-only, shows one point or several (`[markers]`), auto-fits
  bounds for multiple.
- Wired into: **Become a driver** (current location), **Add/Edit place** (replaces
  the old raw lat/lng number inputs), **Place detail** (shows the place on a map),
  and **Trip Builder** (live map of the places you've selected so far).
- Marker icons are copied from `node_modules/leaflet/dist/images` into
  `assets/leaflet/` via `angular.json`'s `assets` config (Leaflet's default icon
  URLs break under Angular's bundler otherwise - this is the standard fix).

## Backend fixes this frontend now relies on

A previous round of backend bug fixes unlocked several things that were previously
worked around client-side. This build takes advantage of all of them:

| Fix | What changed here |
|---|---|
| `guide`/`vehicle`/`place` search now read `req.query` instead of `req.body` | Places list, and Guides list now do **real server-side search** with debounced input, instead of only filtering the current page client-side. |
| `initSocket(server)` is now actually called in the backend's `src/index.ts` | `AuthService` connects the socket right after login (and at app bootstrap if a valid token exists) and disconnects on logout. The navbar shows a live badge count + toast when a `new-notification` event arrives, instead of only fetching once on page load. |
| `lost_item` create route now has upload middleware attached | The "Report a lost item" form (Trip detail &rarr; Lost & Found tab) now has a photo field, and reported items show their image. |
| `guide` update route now has upload middleware attached | Added a "My guide profile" section to the Profile page where a guide can re-upload their certificate and toggle availability. |
| `forgot_password` / `reset_password` no longer require being logged in | Removed the warning banner from the Forgot Password page - it's a normal logged-out flow now. |

## Other frontend-only fixes in this pass

- **"My Vehicles" was showing every vehicle in the system.** It now looks up the
  current user's driver profile and calls `GET /vehicle/driver/:driverId`, so it
  correctly shows only the logged-in driver's own vehicles.
- **Added a "My driver profile" section** to the Profile page (license, rating,
  verification status, availability toggle, link to manage vehicles).
- Since the backend has no "get my driver/guide profile" endpoint, both are found
  by fetching a page of drivers/guides and matching the populated `userId` against
  the current user - see `findMyDriverProfile()` / `findMyGuideProfile()` in the
  respective services. Fine at this app's current scale; would want a dedicated
  `GET /driver/me` / `GET /guide/me` backend endpoint if the driver/guide list
  grows large.

## Still-open design questions (intentionally not auto-changed)

- **Voting only works once a trip's status is `completed`** (see `vote.service.ts`
  on the backend), which behaves more like a post-trip place rating than the SRS's
  "vote during group planning" description. This is a product/business-logic
  decision, not a clear bug, so it was left as-is - the Vote tab on a trip still
  shows a note explaining this.
- **Overpass API / OSRM routing / a real payment gateway** are described in the
  SRS but not implemented in the current backend, and are sizeable features
  rather than something to "fix" - not present in this frontend either. Place
  creation is manual, trip `routePath` is unused, and payment is a manual admin
  toggle (`isPaid`), matching what the backend actually does today.

## Environments

- `src/environments/environment.ts` - development (`apiUrl: http://localhost:3000`)
- `src/environments/environment.prod.ts` - production (edit `apiUrl` before deploying)

## Build verification

This project was rebuilt successfully end-to-end with `ng build --configuration production`
after every round of changes - zero TypeScript/template compile errors.
