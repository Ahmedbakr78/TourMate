# Jamal — Full Checklist
**Role:** Database Architect, Backend Core & API Docs
**Modules:** Authentication + User + Admin

## Database — All MongoDB Schemas
- [ ] User schema
- [ ] Driver schema
- [ ] Guide schema
- [ ] Vehicle schema
- [ ] Place schema
- [ ] Trip schema
- [ ] Vote schema
- [ ] Review schema
- [ ] Notification schema
- [ ] Lost Item schema
- [ ] Black-listed Token schema

## Database — Repositories
- [ ] Base repo
- [ ] User repo
- [ ] Driver repo
- [ ] Guide repo
- [ ] Vehicle repo
- [ ] Place repo
- [ ] Trip repo
- [ ] Vote repo
- [ ] Review repo
- [ ] Notification repo
- [ ] Lost Item repo
- [ ] Black-listed Token repo
- [ ] Database indexing
- [ ] Database seeders

## Backend — Authentication Module
- [ ] POST `/auth/signup`
- [ ] POST `/auth/signin`
- [ ] POST `/auth/confirm_email`
- [ ] POST `/auth/send_otp_again`
- [ ] POST `/auth/forgot_password`
- [ ] POST `/auth/verify_reset_code`
- [ ] PATCH `/auth/reset_password`
- [ ] POST `/auth/refresh_token`
- [ ] PATCH `/auth/change_password`
- [ ] POST `/auth/logout`
- [ ] GET `/auth/me`

## Backend — User Module
- [ ] GET `/user/current_user_id`
- [ ] GET `/user/:id`
- [ ] PUT `/user/update_user`
- [ ] POST `/user/profile_image`
- [ ] DELETE `/user/delete_image`
- [ ] DELETE `/user/delete_account`

## Backend — Admin Module
- [ ] GET `/admin/dashboard`
- [ ] GET `/admin/system-statistics`
- [ ] GET `/admin/users`
- [ ] GET `/admin/pending-guides`
- [ ] GET `/admin/pending-drivers`
- [ ] GET `/admin/reports`
- [ ] PATCH `/admin/:id/role`
- [ ] PATCH `/admin/:id/status`
- [ ] DELETE `/admin/:id/delete`
- [ ] DELETE `/admin/trip/:id/delete`
- [ ] PATCH `/admin/driver/:id/verification-status`
- [ ] PATCH `/admin/guide/:id/verification-status`
- [ ] PATCH `/admin/trip/:id/assign-resources`
- [ ] PATCH `/admin/trip/:id/status`
- [ ] PATCH `/admin/trip/:id/confirm-payment`

## Middlewares
- [ ] `authentication.middleware.ts`
- [ ] `authorization.middleware.ts`
- [ ] `validation.middleware.ts`

## Utils
- [ ] Encryption (AES-256-CBC for phone)
- [ ] bcrypt hashing
- [ ] JWT tokens
- [ ] Exception classes
- [ ] HTTP exception handler
- [ ] Standardized response helper

## Frontend Tasks
- [ ] Booking Flow UI (Draft → Pending → Confirmed → Ongoing → Completed)
- [ ] Shared Trip UI (join, capacity, cost-splitting)
- [ ] Mock Payment UI (success/failure)
- [ ] Profile UI

## Documentation
- [ ] API Documentation (Swagger/Postman)
- [ ] Graduation Book: "Database Design" chapter
- [ ] Graduation Book: "Backend Implementation" chapter
