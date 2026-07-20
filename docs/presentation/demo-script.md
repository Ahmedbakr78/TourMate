# TourMate — Demo Script (Click-by-Click + Narration)

A concrete, rehearsable demo following the cross-role happy path. Times are approximate.

**Preconditions:** Staging environment running (Docker Compose). Four seeded accounts logged in
on separate browser profiles / devices: Tourist (T), Admin (A), Driver (D), Guide (G).

---

## Scene 1 — Tourist books a trip (≈2 min)
**Narration:** "A tourist plans a trip to several points of interest. TourMate lets them build the
trip, see the price, and assign a trusted guide, driver, and vehicle."

1. T: Open app → **Login** (tourist credentials).
2. T: Navigate **New Trip**.
3. T: Add places (use **Places → Search/Popular**), set dates and **number of travellers = 4**.
4. T: System **calculates price** → show the returned amount.
5. T: **Assign Guide** (pick approved guide G), **Assign Driver** (pick D), **Assign Vehicle**
   (capacity ≥ 4). *Note:* if capacity < 4, assignment is rejected — demonstrates validation.
6. T: **Save** → trip appears in **My Trips** with status *planned*.

## Scene 2 — Admin approves guide & driver (≈1.5 min)
**Narration:** "New guides and drivers must be vetted. The admin reviews pending applications and
approves them, which also notifies the applicant."

1. A: **Login** (admin) → **Dashboard** shows stats.
2. A: Open **Guide Management → Pending Guides** → **Approve** guide G.
3. A: Open **Driver Management → Pending Drivers** → **Approve** driver D.
4. A: Confirm a **Notification** is generated for each approval.

## Scene 3 — Driver shares location (≈1.5 min)
**Narration:** "Once assigned, the driver goes online and shares live location using polling —
no WebSockets, so it works behind strict firewalls."

1. D: **Login** (driver) → **Dashboard**.
2. D: Toggle **Availability = On**.
3. D: Open the assigned trip; the app **pushes location** (`POST /tracking/driver/:id/location`)
   on its poll interval.

## Scene 4 — Tourist tracks on map (≈1.5 min)
**Narration:** "The tourist opens the active trip and watches the driver move on the map in
near-real-time, thanks to client-side polling of the tracking endpoint."

1. T: Open **My Trips → Trip Detail** for the active trip.
2. T: View the **map**; confirm driver marker reflects the pushed location (within poll latency).
3. T: **Start Trip** (multi-role allowed) → status becomes *active*.

## Scene 5 — Lost item reported (≈1.5 min)
**Narration:** "During the trip a tourist realizes they lost an item. They report it through
Lost & Found and track its lifecycle."

1. T: Open **Lost & Found → Report**.
2. T: Fill description + link to the trip → status *open*.
3. T (or finder): **Report Found** → status *found*; then **Close** → *closed*.
   (Mention illegal transitions, e.g., close→found, are blocked.)

## Scene 6 — Review submitted (≈1 min)
**Narration:** "After the trip completes, the tourist rates the experience, feeding the
reputation system for guides and drivers."

1. T: **Complete Trip** (status *completed*).
2. T: Open **Review** form → rating + text for trip/guide/driver → **Submit**.
3. T: Confirm review appears under **My Reviews** and on the guide/driver profile.

## Scene 7 — Wrap-up (≈0.5 min)
**Narration:** "That's the full loop: booking, admin governance, live tracking, safety reporting,
and feedback — all on one MEAN-stack platform with RBAC and i18n/RTL support."

**Total runtime:** ~10 minutes. Keep a backup: if live tracking lags, explain polling interval
and show the `sequence-polling.md` diagram.
