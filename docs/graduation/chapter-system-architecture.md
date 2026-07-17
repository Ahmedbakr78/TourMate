# Graduation Book — Chapter 2: System Architecture

## 2.1 Architectural Style
TourMate follows a **layered, service-oriented** architecture on the MEAN stack
(MongoDB, Express, Angular, Node.js). The backend is a stateless RESTful API; the frontend is
a component-based single-page application communicating exclusively over HTTPS with JWT bearer
auth.

## 2.2 Technology Stack
| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| Data | MongoDB + Mongoose | Document persistence (10 schemas) |
| API | Node.js + Express | Routing, business logic, middleware |
| Client | Angular 17+ (standalone) | UI, routing guards, HTTP |
| Security | JSON Web Token + bcrypt | AuthN/AuthZ, password hashing |
| Geo | Overpass API | POI discovery |
| Routing | OSRM / OpenRouteService | Route + ETA |

## 2.3 Backend Layers
1. **Middleware** — authentication (JWT verification), role-based access control, file upload
   (multer), and a centralized error handler.
2. **Services** — decoupled logic: TTL cache, Overpass proxy, OSRM routing, and the in-memory
   location store for polling.
3. **Controllers / Routes** — HTTP binding and validation per domain module.

## 2.4 Data Model
Ten collections capture the domain: `User`, `Driver`, `Guide`, `Vehicle`, `Place`, `Trip`,
`Vote`, `Review`, `LostItem`, `Notification`. References (ObjectId) link entities; geospatial
fields use GeoJSON `Point` with `2dsphere` indexes for proximity queries.

## 2.5 External Integration
### Overpass Proxy + Cache
Clients never call Overpass directly. The API builds Overpass QL from the request, enforces a
2-second `AbortController` timeout, serves cached results for one hour, and falls back to a
deterministic mock when offline. This protects the upstream, removes browser CORS concerns,
and guarantees responsiveness.

### OSRM / OpenRouteService
Route geometry and ETA are computed server-side, preferring OpenRouteService when an API key is
configured, otherwise the public OSRM instance, otherwise a haversine mock.

## 2.6 Real-Time via Polling (No WebSockets)
Live tracking is implemented with **polling**:
- Drivers `POST` their position to `/api/tracking/driver/:id/location`.
- Clients `GET /api/tracking/active-trips` (or a single driver) on a fixed interval
  (e.g., 5 s) and re-render map markers.

This intentional choice reduces infrastructure complexity and broadens network compatibility
while meeting the application's latency requirements.

## 2.7 Security Model
- Passwords hashed with bcrypt (cost 10).
- Stateless JWTs carry `{ id, role }`; the `authInterceptor` attaches them; the
  `authenticate` middleware validates; `authorize(role)` enforces RBAC.
- Uploads are restricted to images with a size cap; secrets live only in `.env`.

## 2.8 Deployment
Containers or PM2 can host the Node API; the Angular build is static and served by any CDN or
reverse proxy. CI (GitHub Actions) installs, lints, and builds both packages on every push.

## 2.9 Design Rationale
The separation of services from controllers, the proxy/cache pattern for external calls, and
polling over sockets collectively prioritize maintainability, offline resilience, and simple
operations — appropriate for a graduation-scale, horizontally-scalable tourism system.
