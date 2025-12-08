# System Architecture - Retail Sales Management System

## 1. Architectural Overview
The application follows a **Monolithic Repository (Monorepo)** structure containing a decoupled **Client-Server Architecture**. The system relies on a **RESTful API** communication pattern, ensuring clear separation of concerns between the presentation layer (Frontend) and the data processing layer (Backend).

**High-Level Data Flow:**
`Client (React)` $\leftrightarrow$ `HTTP/REST` $\leftrightarrow$ `Server (Node/Express)` $\leftrightarrow$ `Mongoose ODM` $\leftrightarrow$ `MongoDB Atlas`

---

## 2. Backend Architecture
The backend is engineered using the **Controller-Service-Repository** pattern. This separates the HTTP handling logic from the business domain logic, making the codebase testable and scalable.

### Key Components:
1.  **Entry Point (`index.js`):**
    * Initializes the Express app.
    * Configures Middleware (CORS, JSON parsing).
    * Establishes Database Connection via `config/db.js`.
    * Mounts routes.

2.  **Controller Layer (`/controllers`):**
    * Acts as the traffic director.
    * Parses `req.query` parameters.
    * Delegates tasks to the Service layer.
    * Handles HTTP Status Codes (`200 OK`, `500 Server Error`).
    * **Design Decision:** Controllers contain *no business logic*, only request handling.

3.  **Service Layer (`/services`):**
    * Contains the core business logic.
    * Calculates Pagination offsets (`skip/limit`).
    * Orchestrates Parallel Execution (`Promise.all`) for fetching data and counts simultaneously.
    * Applies data transformations (e.g., `.lean()` for performance).

4.  **Utility Layer (`/utils`):**
    * **`queryBuilder.js`**: A dedicated module to translate frontend-friendly query strings (e.g., `region=North,South`) into complex MongoDB operators (`$in`, `$or`, `$regex`, `$gte`).

5.  **Data Layer (`/models`):**
    * Defines strict Mongoose Schemas.
    * Implements **Compound Indexes** following the ESR (Equality, Sort, Range) rule to optimize read performance.

---

## 3. Frontend Architecture
The frontend is built as a **Single Page Application (SPA)** using React, following **Atomic Design Principles**.

### Key Components:
1.  **State Management:**
    * Centralized state in `App.jsx` serves as the "Source of Truth".
    * State includes: `filters`, `data`, `meta` (pagination), and `loading`.
    * **Unidirectional Data Flow:** Props flow down to child components (`FilterBar`, `Table`), and events bubble up via callback functions.

2.  **Component Strategy:**
    * **Presentational Components:** Pure components like `StatCard` and `NavItem` that only render data passed via props.
    * **Container Components:** `App.jsx` handles the logic, API calls, and side effects.

3.  **Performance Optimizations:**
    * **Debouncing:** The Search input implements a custom debounce hook/timer to prevent API flooding during typing.
    * **Memoization:** `useMemo` is used for client-side aggregations (Stats calculations) to prevent expensive recalculations on every render.

---

## 4. Data Flow Scenario
**Scenario:** User filters by *Region: North* and sorts by *Date*.

1.  **User Action:** User selects "North" in the `FilterBar` dropdown.
2.  **State Update:** `App.jsx` updates `filters.region` to `'North'` and resets `page` to `1`.
3.  **Effect Trigger:** `useEffect` detects the change in the `filters` dependency.
4.  **API Request:** Axios sends `GET /api/transactions?region=North&sortBy=date`.
5.  **Route Handling:** Backend directs request to `transactionController.getTransactions`.
6.  **Query Building:** `queryBuilder` translates `region=North` to `{ "customer.region": { $in: ["North"] } }`.
7.  **Database Execution:**
    * Query 1: `find({...}).sort({ "meta.date": -1 }).skip(0).limit(10)`
    * Query 2: `countDocuments({...})`
    * *Note: Both run in parallel.*
8.  **Response:** JSON data + Metadata (Total Pages) returned to Client.
9.  **UI Render:** React updates the Virtual DOM, and the user sees the filtered table.

---

## 5. Module Responsibilities

| Module | Responsibility |
| :--- | :--- |
| **`backend/src/index.js`** | Server configuration, CORS setup, Serverless export for Vercel. |
| **`backend/src/routes`** | Maps URL endpoints (`/api/transactions`) to Controller functions. |
| **`backend/src/controllers`** | Request validation, error handling, JSON response formatting. |
| **`backend/src/services`** | Business logic, pagination math, database interaction. |
| **`backend/src/utils`** | Helper functions (e.g., constructing complex MongoDB queries). |
| **`frontend/src/services`** | Axios configuration, API endpoints abstraction. |
| **`frontend/src/components`** | Reusable UI elements (Sidebar, Navbar, Table, FilterBar). |
| **`frontend/src/App.jsx`** | Main application logic, state composition, and layout assembly. |

---

## 6. Folder Structure
```text
📁 TruEstate-Assignment/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 config/          # Database connection logic
│   │   ├── 📁 controllers/     # Request handlers
│   │   ├── 📁 models/          # Mongoose schemas
│   │   ├── 📁 routes/          # API route definitions
│   │   ├── 📁 services/        # Business logic layer
│   │   ├── 📁 utils/           # Helper functions (QueryBuilder)
│   │   └── 📄 index.js         # App entry point
│   ├── 📄 package.json
│   ├── 📄 vercel.json          # Deployment config
│   └── 📄 seed.js              # Data seeding script
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/      # UI Components (Table, Sidebar, etc.)
│   │   ├── 📁 services/        # API integration
│   │   ├── 📄 App.jsx          # Main Logic Container
│   │   └── 📄 main.jsx         # React Entry Point
│   ├── 📄 package.json
│   └── 📄 tailwind.config.js
│
└── 📁 docs/
    └── 📄 architecture.md      # This document

