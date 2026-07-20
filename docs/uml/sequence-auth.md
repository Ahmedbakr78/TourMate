# Sequence Diagram — Authentication

Shows registration/login, JWT issuance, and accessing a guarded route. Mirrors `auth.routes.js`, `auth.middleware.js`, and `role.guard.ts`.

```mermaid
sequenceDiagram
    actor U as User (Browser)
    participant C as Angular Client
    participant I as authInterceptor
    participant A as POST /api/auth/login
    participant M as authenticate middleware
    participant R as Protected Route (e.g. GET /api/trips/my)

    U->>C: Enter credentials
    C->>A: POST /api/auth/login {email, password}
    A->>A: Verify password hash
    A-->>C: 200 {accessToken, refreshToken}
    C->>C: Store tokens (AuthService)
    U->>C: Navigate to guarded route
    C->>R: GET /api/trips/my
    I->>I: Attach "Authorization: Bearer <accessToken>"
    I->>R: Forward request with header
    R->>M: authenticate(req)
    M->>M: verifyToken(accessToken)
    alt valid token
        M->>R: req.user = decoded; next()
        R-->>C: 200 {data: [...]}
        C-->>U: Render data
    else expired token
        I->>A: POST /api/auth/refresh-token {refreshToken}
        A-->>C: 200 {new accessToken}
        C->>R: Retry GET with new token
        R-->>C: 200 {data: [...]}
    else invalid token
        M-->>C: 401 Unauthorized
        C-->>U: Redirect to /login
    end
```
