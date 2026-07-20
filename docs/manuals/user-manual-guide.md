# TourMate — Guide User Manual

This guide explains how to use the **Guide** app of TourMate. Log in with a guide account
(approved by admin) at the login screen.

## 1. Login
1. Open the app → **Login** with your guide email/password.
2. If your account is *pending*, the admin must **approve** you before you can operate
   (availability and assignment acceptance are blocked with 403 until approved).

## 2. Dashboard
- The **Dashboard** is your home screen after login.
- Shows pending trip requests, your availability, and upcoming schedule.

## 3. Accept / Reject Trip Requests
1. On the Dashboard, view trip requests assigned or offered to you.
2. **Accept** a request to confirm your participation, or **Reject** to decline.
3. Accepting updates the trip's guide assignment and notifies the tourist.

## 4. Schedule
- The **Schedule** view lists your accepted/upcoming trips with dates, tourists, and routes.
- Use it to prepare for each engagement.

## 5. History
- **History** shows completed and cancelled trips you guided.
- Review routes, feedback, and reviews left by tourists.

## 6. Profile & Certificate
1. Open **Profile** to edit your guide info and upload a **profile image**.
2. Upload your **Certificate** (`POST /guide/:id/certificate`) — image files only; invalid types
   are rejected with 422.
3. You may **delete** your certificate if needed.
4. Toggle **Availability** (rbac `guide`) to control whether you appear for assignments.

## Troubleshooting
- Can't accept trips / toggle availability: ensure admin approved your account.
- Certificate upload failed: only image files are accepted; check size limit.
- Not receiving requests: verify availability is On and profile is complete.
