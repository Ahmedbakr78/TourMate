# TourMate Team Roles and Task Distribution

### **1. Ahmed Abo Bakr (Team Manager, Leader, Fullstack & ALL UML/Architecture Docs)**
*Role: Project Lead, Core Fullstack Development, and System Architecture & UML Documentation.*
 (Guide + Driver + Vehicle)
Guide
Create Guide
Update Guide
Delete Guide
Get Guide
Get All Guides
Search Guides
Update Availability
Upload Certificate
Delete Certificate
Driver
Create Driver
Update Driver
Delete Driver
Get Driver
Get All Drivers
Search Drivers
Update Availability
Vehicle
Create Vehicle
Update Vehicle
Delete Vehicle
Get Vehicle
Get All Vehicles
Get Driver Vehicles
Upload Vehicle Images
Delete Vehicle Image
**Frontend Tasks:**
*   Develop the Global Application Layout, Navigation, and Theme setup.
*   Build the **Authentication UI** (Login, Register, Forgot Password) and implement Route Guards.
*   Build the **Admin Dashboard UI** (User management, system statistics, active trip monitoring).

**Backend & Technical Tasks:**
*   Initialize the MEAN stack repository, set up CI/CD pipelines, and define system architecture.
*   Implement **Backend Authentication** (JWT, bcrypt, role-based access control).
*   Manage **External Integrations**: Build backend proxy and caching logic for **Overpass API** and integrate **OSRM/OpenRouteService** for route calculation.
*   Implement the **Polling-Based Location Tracking** backend logic (explicitly NO WebSockets).

**Documentation & UML Tasks (ALL UMLs assigned here):**
*   **Create ALL UML Diagrams:** Use Case Diagram, Sequence Diagrams, Class Diagram, Activity Diagram, and the ERD (Entity Relationship Diagram).
*   Write the core **`README.md`**, Setup Guide, and System Architecture Document.
*   Draft the "Introduction" and "System Architecture" chapters for the Graduation Book.
*   Conduct final code reviews, manage the project timeline, and lead the final presentation delivery.

---

### **2. Jamal (Database, Backend Core & API Docs)**
(Authentication + User + Admin)
Authentication
Register
Login
Verify Email
Resend Verification Code
Forgot Password
Verify Reset Code
Reset Password
Change Password
Refresh Token
Logout
Get Logged In User
User
Get Profile
Get User By Id
Update Profile
Upload Profile Image
Delete Profile Image
Delete Account
Admin
Dashboard Statistics
Get All Users
Get User By Id
Block User
Unblock User
Get Pending Guides
Approve Guide
Reject Guide
Get Pending Drivers
Approve Driver
Reject Driver
Delete User
Delete Trip
Get Reports
*Role: Database Architect, Core Backend APIs, Booking Frontend, and API Documentation.*

**Frontend Tasks:**
*   Develop the **Booking Flow UI** (Draft -> Pending -> Confirmed -> Ongoing -> Completed states).
*   Build the **Shared Trip UI** (Join trip, vehicle capacity checks, cost-splitting display).
*   Create the **Mock Payment UI** (Displaying transaction success/failure states without actual gateway integration).

**Backend & Technical Tasks:**
*   Implement all **10 MongoDB Schemas** (based on Ahmed's ERD): User, Driver, Guide, Vehicle, Place, Trip, Vote, Review, Lost Item, Notification.
*   Develop RESTful APIs for **Trip Builder, Voting, Shared Trip, and Booking** modules.
*   Develop RESTful APIs for **Driver, Guide, Review, Lost & Found, and Notification** modules.
*   Implement database indexing, write database seeders, and ensure MongoDB scalability.

**Documentation Tasks:**
*   Write comprehensive **API Documentation** (using Swagger or Postman collections) for all backend endpoints.
*   Draft the "Database Design" (documenting the schema implementation) and "Backend Implementation" chapters for the Graduation Book.

---

### **3. Bavly (Frontend Lead, Tourist App & UI/UX Docs)**
 (Trip + Vote)
Trip
Create Trip
Update Trip
Delete Trip
Get Trip
Get All Trips
Get My Trips
Get Shared Trips
Assign Guide
Assign Driver
Assign Vehicle
Start Trip
Complete Trip
Cancel Trip
Share Trip
Duplicate Trip
Calculate Trip Price
Get Trip Route
Vote
Create Vote
Update Vote
Delete Vote
Get Place Votes
Get User Votes

*Role: Tourist Frontend Lead, Map Integration, Tourist Backend APIs, and UI Documentation.*

**Frontend Tasks:**
*   Set up **Angular 17+ architecture**, routing, and global state management (NgRx/Signals).
*   Develop the **Tourist Application UI**: Trip Builder (arrange places, estimate cost), Place Selection, and Group Voting.
*   Integrate **Leaflet.js** for OpenStreetMap display, POI markers, and interactive route visualization.
*   Implement the **Polling-Based Tracking UI** (Displaying driver location, route path, and ETA on the map).

**Backend & Technical Tasks:**
*   Develop specific backend APIs for the **Places Module** (Search by city, filter by category, save to DB).
*   Implement backend caching mechanisms (e.g., Redis or in-memory) to reduce Overpass API load and ensure **API response time < 2 seconds**.
*   Handle frontend-backend data synchronization and error handling for map services.

**Documentation Tasks:**
*   Write the "Frontend Implementation" and "UI/UX Design" chapters for the Graduation Book.
*   Document the multi-language (i18n) implementation, component structure, and responsive design guidelines.

---

### **4. Mai (Frontend Providers, Admin Backend & QA Docs)**
 (Notification + Lost Item)
Notification
Create Notification
Get Notifications
Get Notification By Id
Mark Notification As Read
Mark All Notifications As Read
Delete Notification
Delete All Notifications
Get Unread Count
Lost Item
Create Lost Item
Update Lost Item
Update Lost Item Status
Delete Lost Item
Get Lost Item
Get Trip Lost Items
Get My Lost Items
Report Found Item
Close Lost Item
Reopen Lost Item
*Role: Provider/Admin Frontend, Admin Backend APIs, Testing, and QA Documentation.*

**Frontend Tasks:**
*   Develop the **Driver Application UI** (Accept/reject trips, update availability, send location polls).
*   Develop the **Guide Application UI** (View schedule, accept/reject trips, view history).
*   Ensure **Responsive UI design** across all 4 apps and implement **Multi-language support (i18n)**.

**Backend & Technical Tasks:**
*   Develop **Admin Dashboard Backend APIs** (Verify drivers/guides, manage reported issues, view system stats).
*   Implement the **Notification Module Backend** (Create notifications, mark as read, trigger on booking/lost item updates).
*   Implement the **Review Module Backend** (Calculate average ratings, store comments).

**Documentation Tasks:**
*   Create a comprehensive **Test Plan and Test Case Matrix** covering all 14 functional modules.
*   Write the "System Testing" and "Quality Assurance" chapters for the Graduation Book.
*   Draft the **User Manual** (How to use the Tourist, Driver, Guide, and Admin apps).

---

### **5. Ramadan (DevOps, Shared Frontend, QA & Documentation Lead)**
 (Place + Review)
Place
Create Place
Update Place
Delete Place
Get Place
Get All Places
Search Places
Filter Places
Get Nearby Places
Get Popular Places
Save Place
Review
Create Review
Update Review
Delete Review
Get Review
Get All Reviews
Get Trip Reviews
Get Guide Reviews
Get Driver Reviews
Get Place Reviews
Get My Reviews

*Role: Cloud Deployment, Shared UI Components, Manual Testing, and Graduation Book Compilation.*

**Frontend Tasks:**
*   Develop **Shared/Reusable UI Components** using Angular Material (Custom cards, modals, data tables, form inputs) used across all 4 apps.
*   Build the **Lost & Found UI** (Report lost item, update status) and **Review Submission UI**.
*   Build the **Notification Center UI** (Bell icon, dropdown, unread counts).

**Backend & Technical Tasks (DevOps & QA):**
*   **Cloud Deployment:** Fulfill the "Cloud deployment ready" SRS requirement. Deploy the Node.js backend and Angular frontends to cloud providers (e.g., Render, Vercel, or AWS).
*   Set up **Docker containers** for local development environment consistency.
*   Generate and manage **Mock Data/Seeders** for the final presentation (creating fake tourists, drivers, trips, and places).
*   Execute rigorous **Manual Testing** (Cross-browser, mobile responsiveness, edge cases like vehicle capacity limits).

**Documentation & Presentation Tasks:**
*   **Compile and format the entire Graduation Book**, ensuring all chapters and **Ahmed's UML diagrams** are perfectly formatted to university standards.
*   Design, animate, and format the final **Presentation Slides**.
*   Write the **Demo Script** (step-by-step guide on what to click and say during the defense).
*   Record a **backup video walkthrough** of the system to prevent live demo failures.
*   Track team progress, document weekly meeting minutes, and write the "Conclusion" chapter.
