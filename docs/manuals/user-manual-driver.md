# TourMate — Driver User Manual

This guide explains how to use the **Driver** app of TourMate. Log in with a driver account
(approved by admin) at the login screen.

## 1. Login
1. Open the app → **Login** with your driver email/password.
2. If your account is still *pending*, the admin must **approve** you before you can operate
   (availability toggle and location sharing will be blocked with 403 until approved).

## 2. Dashboard
- The **Dashboard** is your home screen after login.
- Shows your current status, active trip assignments, and quick stats.

## 3. Availability Toggle
1. On the Dashboard (or profile), use the **Availability** toggle.
2. Turning it **On** marks you available for trip assignments; **Off** hides you from assignment.
3. Only the driver themselves can change availability (rbac `driver`).

## 4. Send Location (Live Tracking)
1. When assigned to an **active** trip, open the location-sharing control.
2. The app **pushes your location** to the server (`POST /tracking/driver/:id/location`) on a
   polling interval.
3. The tourist tracks you live on their map. Keep the app open / foregrounded for continuous
   updates. Expected update latency ≈ one poll interval.

## 5. History
- **History** lists your past trips and assignments (completed/cancelled).
- Review details, routes, and any reviews left by tourists.

## 6. Profile & Vehicles
1. Open **Profile** to edit your driver info and upload a **profile image**.
2. Manage **Vehicles**:
   - Add a vehicle (admin or driver): type, plate, **capacity**, image upload.
   - Edit / delete vehicles you own.
   - Upload a **vehicle image** (image files only).
3. Vehicle **capacity** is enforced when a tourist assigns your vehicle to a trip — if capacity
   is less than the number of travellers, the assignment is rejected.

## Troubleshooting
- Availability/location blocked: ensure admin approved your account.
- Location not showing for tourist: verify you are assigned to an active trip and the app is
  sending location; check network/poll interval.
- Upload failed: only image files accepted; respect file size limit.
