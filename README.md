# MaintainPro — Enterprise Facility & Maintenance Management System

MaintainPro is a modern, enterprise-grade Facility and Maintenance Management System designed to streamline maintenance operations, automate preventive maintenance scheduling, manage vendor contracts, trace invoices, and track costs. 

The project is structured as a monorepo utilizing **npm workspaces**, dividing core operations between a rich, highly reactive React 19 Frontend and an Express-based Backend.

---

## 🛠️ Project Architecture & Structure

```
MaintainPro/
├── frontend/             # React 19 + TypeScript + Vite 6 (100% Implemented)
├── backend/              # Express + Node.js API (Planned/Under Development)
├── package.json          # Workspace configuration and unified scripts
└── README.md             # Project documentation
```

Unified monorepo scripts are available from the root folder:
* `npm run install:all` — Installs dependencies across both frontend and backend workspaces.
* `npm run dev` — Launches both the frontend dev server and the backend API concurrently.
* `npm run dev:frontend` — Boots only the frontend application.
* `npm run dev:backend` — Boots only the backend API.
* `npm run build` — Bundles the frontend production assets.

---

## 💻 Frontend Application (100% Production-Ready)

The frontend is an exceptionally modular, type-safe React 19 SPA optimized for high performance, visual brilliance, and granular role-based security.

### 🚀 Key Features

* **Multi-Portal Experience**: Separate Organization (`/org/:roleSegment`) and Vendor (`/vendor/:roleSegment`) portals.
* **Granular Role Scoping**: 100% compliant with standard enterprise workflows:
  * **Facility Managers**: PM scheduling, full dashboard monitors, vendor contracts tracking.
  * **Technicians**: Read/update scoped tasks (Start ➔ In Progress ➔ Complete), upload completion logs, and report on-site issues.
  * **Vendors**: Accept/reject dispatched jobs, propose schedule dates, and submit digital invoices.
  * **Staff Requesters**: Triage intake forms with confirmation IDs, track status in real-time, and rate resolved services (1-5 stars).
  * **Finance**: Cost analysis reports, invoice life-cycle audits, and approval-gate alerts for high-value orders.
  * **Administrators**: Set up multi-level building zones and configure multi-tiered time-based escalation rules.
* **Aesthetic Dashboard & UI**: Features dynamic interactive trends, spend trackers, category breakdowns, and a custom circular SVG compliance donut gauge.
* **Persisted Demo Engine**: The app can run **entirely offline / backend-free** utilizing a reactive mock store that persists state updates directly to local storage.

### 📐 Folder Architecture

```
frontend/src/
├── app/                  # Application bootstrap, portal configurations, global router, and stores
│   ├── router/           # Protected guards and portal route scoping
│   ├── store.ts          # Zustand authentication store
│   └── theme.store.ts    # Zustand dark/light mode toggle store
├── components/           # Radix UI wrapper primitives & global layout wrappers
│   ├── layout/           # MainLayout & AuthLayout structures
│   ├── navigation/       # Sidebar and Navbar implementations
│   └── ui/               # Tailored UI component system (Tables, Modals, Forms, etc.)
├── features/             # Domain-driven feature folder isolation
│   ├── auth/             # Login, multi-role registrations, and invite flows
│   ├── dashboard/        # Custom dashboard layouts scoped by role
│   ├── service-requests/ # Requester intake forms, star ratings, and view detail modals
│   ├── work-orders/      # Responsive grids, kanban boards, and task-completion logs
│   └── ...               # Additional feature directories
├── hooks/                # Global utilities and the core role access permissions hook
├── services/             # HTTP client and local storage persisted mock data engines
├── styles/               # Tailwind CSS variables and global OKLCH dark theme custom variants
└── types/                # Unified TypeScript type declarations (common.types.ts)
```

### 🧪 Technology Stack & Tooling

* **Core Framework**: React 19 & TypeScript 5.7.
* **Bundler & Compiler**: Vite 6, using `vite-tsconfig-paths` for clean `@/*` import shortcuts, and Rollup chunk splitting to optimize caching.
* **Styling**: Tailwind CSS v4, utilizing the `@tailwindcss/vite` compiler plugin for lightning-fast build passes, custom CSS custom properties, and OKLCH wide-gamut colors.
* **State Management**: **Zustand 5**, offering high-speed hook-based subscription flows with `persist` local storage middleware.
* **Routing**: **React Router DOM 7**, featuring dynamic named export lazy loading for optimal load times.
* **Forms & Validation**: `react-hook-form` paired with schema-driven `zod` validations.

---

### 📦 Quick Start — Frontend

#### 1. Setup Environment
Navigate to `frontend/` and copy the environment variables:
```bash
cd frontend
cp .env.example .env
```
Inside your `.env` file, you can configure your backend bridge or keep the persisted mock server active:
```ini
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_MOCK_AUTH=true  # Set to true for a fully functional, offline database experience
```

#### 2. Install & Run
Run from the root directory to leverage workspaces:
```bash
npm run install:all
npm run dev:frontend
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🗄️ Backend API (Planned)

The backend directory (`/backend`) is designed to house the RESTful Web API and database engines to support long-term persistent storage, multi-user concurrency, and secure integrations.

### 🗺️ Planned Technical Stack
* **Runtime & Framework**: Node.js & Express.
* **Language**: TypeScript / JavaScript.
* **Database**: PostgreSQL (Prisma or TypeORM) / MongoDB.
* **Authentication**: JWT-based stateless tokens.

### ⚙️ Backend Setup & Configuration
*(Once the backend workspace development is initiated, detailed configuration procedures, migration commands, and API routing structures will be detailed in this section.)*
