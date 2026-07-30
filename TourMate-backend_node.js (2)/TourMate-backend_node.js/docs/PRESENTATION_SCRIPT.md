# TourMate — Demo Script & Presentation Guide

**Duration**: ~15-20 minutes

**Setup Prerequisites**:
- Browser open at `http://localhost:3000`
- Backend server running (`bash start.sh`)
- Admin account credentials ready
- Test tourist account (or register live)
- Sample places loaded in database (use `--seed` flag)
- At least one driver and one guide registered with pending verification

---

## Slide 1: Title Slide

**On Screen**: Project name "TourMate — Smart Tourism Trip Planner", team member names, university logo, supervisor name

**What to Say**:
"Good morning/afternoon everyone. Today we are presenting TourMate, a Smart Tourism Trip Planner developed by our team. Our team consists of five members: Ahmed Abo Bakr, Jamal Hassan, Bavly, Mai, and Ramadan. This project was developed under the supervision of Dr. [Supervisor Name] as part of our graduation requirements for the Faculty of Computer and Information Sciences."

**Click/Transition**: Click to next slide.

---

## Slide 2: Problem Statement and Solution

**On Screen**: Two columns — "Problem" and "Solution"

**What to Say**:
"Planning a trip involves multiple scattered tasks: researching places, finding reliable local transportation, hiring guides, coordinating with travel companions, and keeping track of everything. Tourists often struggle with fragmented tools — they use Google Maps for places, WhatsApp for coordination, and random searches for drivers and guides. There is no single platform that brings all of this together.

TourMate solves this by providing a unified platform where tourists can discover places, build and share trip itineraries, book verified drivers and guides, manage lost items, and leave reviews — all in one place. The platform serves four types of users: tourists who plan trips, drivers who provide transportation, guides who offer local expertise, and administrators who oversee the system."

**Click/Transition**: Click to next slide.

---

## Slide 3: System Architecture Overview

**On Screen**: Architecture diagram showing Browser → Angular SPA ↔ Express API ↔ MongoDB, with Cloudinary, Overpass API, and OSRM as external services

**What to Say**:
"Our system follows a three-tier architecture. The frontend is an Angular 16 single-page application that communicates with an Express 5 backend through REST APIs and Socket.IO for real-time features. The backend follows a controller-service-repository pattern for clean separation of concerns. Data is stored in MongoDB with 11 collections designed for the tourism domain.

We integrate with three external services: Cloudinary for image and file upload with CDN delivery, the Overpass API from OpenStreetMap for place data, and OSRM for route calculation between trip waypoints. The entire application can be launched with a single command using our `start.sh` script, which installs dependencies, builds the frontend, starts the database, and runs health checks automatically."

**Click/Transition**: Click to next slide.

---

## Slide 4: Demo — Register as Tourist

**On Screen**: Browser at login page

**What to Say**: 
"Let me walk you through the application from a tourist's perspective. First, I will register a new account."

**Actions**:
1. Navigate to `http://localhost:3000`
2. Click "Login" in the navbar
3. Click "Sign up" link
4. Fill in: Name = "Demo Tourist", Email = "demo@test.com", Password = "Test@123", Phone = "01000000000", Gender = Male
5. Click "Sign up"

**What to Say (continued)**:
"The system sends a 6-digit OTP to the registered email for verification. Let me check the server logs or email to get the code."

**Actions**:
6. Check server console/email for OTP
7. Enter the OTP code
8. Click "Confirm"

**What to Say (continued)**:
"Now we are logged in and can see the full navigation bar with Places, Trips, and other features."

**Click/Transition**: Click to next slide.

---

## Slide 5: Demo — Browse Places

**On Screen**: Places list page

**What to Say**: 
"Let us explore available places. I will navigate to the Places section."

**Actions**:
1. Click "Places" in the navbar
2. Browse the list of places showing name, city, category, rating
3. Click on a place to view details
4. Show the map with the place marker

**What to Say (continued)**:
"The places are populated from OpenStreetMap data. Each place shows its location on an interactive Leaflet map, along with its category, description, average rating, and price information. We can also search for places by name or category, and find nearby places using the geolocation feature."

**Actions**:
5. Type "museum" in the search box
6. Show filtered results
7. Click "Nearby" to demonstrate geospatial search

**Click/Transition**: Click to next slide.

---

## Slide 6: Demo — Create a Trip

**On Screen**: Trip builder page

**What to Say**: 
"Now I will create a trip using the places we just discovered."

**Actions**:
1. Click "Trips" in the navbar
2. Click "Create Trip"
3. Select 2-3 places from the list (check boxes or add buttons)
4. Set start date and end date
5. Enter number of people: 2
6. Click "Create"

**What to Say (continued)**:
"The system calculates the trip price automatically based on the selected places, duration, and number of people. The trip is created with a status of 'active'. Let me show you the trip details."

**Actions**:
7. Click on the created trip
8. Show trip details: places list, dates, price, status
9. Scroll to show the map with the route (polyline connecting places)

**What to Say (continued)**:
"The route between places is calculated using OSRM and displayed as a polyline on the map. This gives the tourist a visual overview of their planned journey."

**Click/Transition**: Click to next slide.

---

## Slide 7: Demo — Share Trip and Join

**On Screen**: Trip detail page

**What to Say**: 
"One of our key features is trip sharing. A tourist can share their trip with friends who can join it. I will show you how this works by opening a second browser tab or incognito window to simulate another user."

**Actions**:
1. On the trip detail page, show the trip ID or share URL
2. Open a new incognito/private browser window
3. Navigate to `http://localhost:3000`
4. Register a second tourist account (or use an existing one)
5. Log in with the second account

**What to Say (continued)**:
"Now, as the second user, I can join the shared trip."

**Actions**:
6. Navigate to Trips → "Join Trip" or enter the trip ID
7. Click "Join"
8. Show that the people count updates on the original trip

**What to Say (continued)**:
"The trip now reflects the additional participant. This enables group travel planning where one person creates the itinerary and others join."

**Click/Transition**: Close the second window. Click to next slide.

---

## Slide 8: Demo — Driver/Guide Dashboards

**On Screen**: Driver registration page

**What to Say**: 
"Now let me show you the service provider side. A tourist can also register as a driver or guide. First, I will register as a driver."

**Actions**:
1. Log in with the original demo account
2. Navigate to Drivers section
3. Click "Register as Driver"
4. Fill in license number
5. Submit

**What to Say (continued)**:
"The driver registration is submitted for admin verification. While waiting for approval, let me also register as a guide."

**Actions**:
6. Navigate to Guides section
7. Click "Register as Guide"
8. Enter languages (e.g., English, Arabic), experience years
9. Upload a certificate file
10. Submit

**What to Say (continued)**:
"Both driver and guide registrations require admin approval before they become active. This ensures quality and trust on the platform. Let me show you what happens on the admin side."

**Click/Transition**: Click to next slide.

---

## Slide 9: Demo — Admin Dashboard

**On Screen**: Admin login (need to log out first and log in as admin)

**What to Say**: 
"I will now log out and log in as an administrator to show the admin dashboard."

**Actions**:
1. Click Logout
2. Navigate to Login
3. Enter admin credentials (pre-configured admin account)
4. Click "Login"

**What to Say (continued)**:
"The admin dashboard shows system-wide statistics: total users, trips, places, drivers, guides, and vehicles. It also shows pending verifications that need attention."

**Actions**:
5. Show dashboard — highlight the statistics cards
6. Navigate to "Verifications" or "Driver Verifications"
7. Show the pending driver registration
8. Click "Approve" on the driver
9. Navigate to Guide verifications
10. Approve the guide registration

**What to Say (continued)**:
"Admins can also manage users: change roles, block accounts, or delete them. For trips, the admin can assign drivers and guides to trips, update trip status, and confirm payments. Let me assign our newly approved driver and guide to a trip."

**Actions**:
11. Navigate to "Trip Management"
12. Click on the trip we created earlier
13. Click "Assign Resources"
14. Select the approved driver, guide, and a vehicle
15. Submit
16. Update trip status to "confirmed"

**What to Say (continued)**:
"The assigned driver and guide receive real-time notifications through Socket.IO about their assignment."

**Click/Transition**: Click to next slide.

---

## Slide 10: Q&A Preparation

**On Screen**: Common Questions and Answers

**What to Say**:
"Thank you for watching our demonstration. We are now happy to answer any questions you may have. Here are some questions we anticipate."

---

### Common Questions and Answers

**Q1: What makes TourMate different from Google Trips or other trip planners?**

A: TourMate integrates trip planning with local service providers (drivers and guides) who are verified by administrators. It also provides real-time notifications, trip sharing for group travel, a voting system for itinerary decisions, and a lost and found module — features not typically found in standard trip planners.

**Q2: How do you ensure the quality of drivers and guides?**

A: All drivers and guides must submit their details and documents for verification. Drivers provide license numbers, and guides upload certificates. Administrators review these documents and approve or reject the registration. Only verified providers appear in search results.

**Q3: How does the geospatial search work?**

A: We use MongoDB's `2dsphere` geospatial index on the Place collection's coordinates field. The `/place/nearby` endpoint accepts latitude, longitude, and max distance parameters and returns places sorted by distance using `$geoNear` aggregation. The results are displayed on a Leaflet map.

**Q4: What is the tech stack and why did you choose it?**

A: We used the MEAN stack — MongoDB for flexible document storage with geospatial support, Express for HTTP routing, Angular 16 for a modern component-based frontend, and Node.js for the runtime. We added Socket.IO for real-time features, Leaflet for maps, and Cloudinary for image management. MEAN allows us to use JavaScript/TypeScript across the entire stack, reducing context switching.

**Q5: How is security handled?**

A: Passwords are hashed with bcrypt. JWT tokens with short expiry (1 day for access, 30 days for refresh) are used for session management. Tokens are blacklisted on logout. All protected routes verify authentication and check user status. Role-based authorization restricts admin endpoints. Helmet provides HTTP security headers, and input validation is handled by Zod schemas.

**Q6: How did you handle the real-time notifications?**

A: We used Socket.IO initialized on the same HTTP server as Express. On connection, clients send their JWT which is verified by a middleware. The server maintains a Map of userId → socketId[]. When a notification event occurs, the server emits to all socket IDs for the target user. On the Angular side, a SocketService wraps the client connection and exposes an Observable for new notifications.

**Q7: Was this a team project? How did you divide the work?**

A: Yes, five team members. Ahmed handled Guide, Driver, and Vehicle modules. Jamal worked on Auth, User, and Admin modules. Bavly implemented Trip and Vote modules. Mai built Notification and Lost Item modules. Ramadan developed Place and Review modules. Each person handled both backend and frontend for their modules.

**Q8: What are your future plans for the project?**

A: We plan to add a mobile app with push notifications and offline support, integrate payment processing (Stripe/PayPal), implement machine learning for place recommendations, add a real-time chat system, and build a comprehensive automated test suite.

---

### Closing Statement

"Thank you for your time and attention. We hope you enjoyed our presentation of TourMate — where technology meets travel. We are happy to take any questions."

---

## Appendix: Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tourmate.com | Admin@123 |
| Tourist | demo@test.com | Test@123 |
| Driver | (Register during demo) | — |
| Guide | (Register during demo) | — |

## Appendix: Keyboard Shortcuts Used

| Key | Action |
|-----|--------|
| F12 | Open DevTools (check console for OTP) |
| Ctrl+Shift+N | Open incognito window |
| F5 | Refresh page |
