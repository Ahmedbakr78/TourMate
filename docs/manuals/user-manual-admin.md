# TourMate — Admin User Manual

This guide explains how to use the **Admin** app of TourMate. Log in with an admin account.
All admin routes are protected by `rbac('admin')` — non-admins receive 403.

## 1. Login
1. Open the app → **Login** with your admin email/password.
2. You are routed to the **Admin Dashboard**.

## 2. Dashboard (Stats)
- The **Dashboard** shows platform statistics: counts of users, trips, guides, drivers,
  vehicles, lost items, and recent activity.
- Use it for an at-a-glance health check.

## 3. User Management
1. Open **User Management** → list all users (`GET /admin/users`).
2. View a user (`GET /admin/users/:id`).
3. **Block** / **Unblock** a user (`PATCH /users/:id/block|unblock`).
4. **Delete** a user (`DELETE /admin/users/:id`) when necessary.

## 4. Guide Management + Pending Approvals
1. Open **Guide Management**.
2. Review **Pending Guides** (`GET /admin/guides/pending`).
3. **Approve** (`PATCH /guides/:id/approve`) or **Reject**
   (`PATCH /guides/:id/reject`) each applicant.
4. Approved guides can toggle availability and accept trips; rejected ones cannot operate.

## 5. Driver Management + Pending Approvals
1. Open **Driver Management**.
2. Review **Pending Drivers** (`GET /admin/drivers/pending`).
3. **Approve** (`PATCH /drivers/:id/approve`) or **Reject**
   (`PATCH /drivers/:id/reject`).
4. Manage existing drivers (view, delete).

## 6. Vehicle Management
1. Open **Vehicle Management** to view all vehicles.
2. Vehicles are created by admins or drivers; admins can edit/delete any vehicle.
3. Verify **capacity** values — capacity is enforced during trip assignment.

## 7. Trip Monitoring
1. Open **Trip Monitoring** to supervise live and historical trips.
2. Admins can **delete** a trip (`DELETE /admin/trips/:id`) if policy requires.
3. Monitor active trips and assigned guide/driver/vehicle.

## 8. Reports
- Use **Reports** (`GET /admin/reports`) for aggregated operational data.

## Troubleshooting
- 403 on any admin screen: confirm your account role is `admin`.
- Approval not reflected: guide/driver must log in again; notification is sent on approval.
- Deleting a user with active trips: review trip monitoring first to avoid orphaned data.
