# CollabFlow

CollabFlow is a high-performance, real-time collaborative workspace and project management platform engineered for distributed engineering and product teams. Built on React 19, TypeScript, and Supabase, CollabFlow delivers sub-100ms real-time synchronization, fluid drag-and-drop Kanban workflows, in-app channel communication, granular role-based access control, and actionable velocity analytics wrapped in an architectural Neo-Brutalist design language.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Design Philosophy](#design-philosophy)
- [Tech Stack](#tech-stack)
- [Architecture & Directory Structure](#architecture--directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Setup (Supabase)](#database-setup-supabase)
  - [Running the Development Server](#running-the-development-server)
- [Available Scripts](#available-scripts)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Traditional project management tools are often plagued by sluggish response times, cluttered pastel interfaces, and fragmented communication channels. CollabFlow solves this by prioritizing:

- **Speed & Optimistic State**: Sub-100ms UI updates with local optimistic reconciliation and persistent WebSocket broadcasting.
- **High-Contrast Clarity**: A Neo-Brutalist aesthetic featuring strict 2px high-contrast borders, bold typography, and clear visual hierarchies that keep attention focused on execution.
- **Unified Context**: Tasks, checklists, real-time discussions, activity history, and velocity metrics live together within dedicated workspace boards.

---

## Key Features

### 1. Interactive Kanban Engine
- **Fluid Drag-and-Drop**: Built with `@dnd-kit` for accessible, zero-lag task movement across columns and boards.
- **Customizable Columns**: Configure workflows (e.g., Backlog, In Progress, Review, Done) to match squad-specific delivery processes.
- **Priority & Due Dates**: Visual urgency markers (Urgent, High, Medium, Low) and deadline warnings.
- **Subtask Checklists**: Break down complex deliverables into trackable checklist items with live progress calculation.
- **Contextual Comments**: Task-level discussion threads supporting rich formatting and timestamp attribution.

### 2. Real-Time Synchronization & Presence
- **WebSocket Broadcasts**: State synchronization powered by Supabase Realtime across all active team screens without manual page refreshes.
- **Optimistic UI Updates**: Changes apply instantly in the browser while persisting asynchronously to the database.
- **Live Team Presence**: Visual indicators showing connected teammates and active board collaborators.

### 3. Hierarchical Organization
- **Multi-Workspace Isolation**: Create independent organizations or squads with isolated members, settings, and billing.
- **Projects & Board Nesting**: Organize high-level initiatives into projects containing multiple focused Kanban boards.
- **Workspace Switcher**: Fast navigation between personal and organizational workspaces.

### 4. Integrated Channel & Board Chat
- **Dedicated Channels**: Workspace-wide channels (e.g., `#general`, `#engineering`, `#design`) and board-level chat streams.
- **Real-Time Messages**: Instant message delivery with sender avatar, role indicator, and time tracking.

### 5. Sprint Velocity & Analytics
- **Burn-Down & Velocity Metrics**: Historical throughput tracking and sprint completion velocity visualized using Recharts.
- **Workload Distribution**: Measure task allocation across squads and contributors to balance workloads and prevent burnout.
- **Cycle Time Monitoring**: Identify blocked cards and column turnaround times early in the sprint cycle.

### 6. Activity Logs & Audit Trail
- **Chronological Event Stream**: Every task creation, status transition, assignment, board edit, and invite acceptance is logged.
- **Accountability & Compliance**: Full transparency into who made changes, what changed, and when.

### 7. Public Marketing & Resource Portal
- **Shared Public Layout**: Reusable responsive header and footer with mobile navigation drawer.
- **Dedicated Public Pages**:
  - **Product**: Features, How It Works, Analytics Intelligence, Transparent Pricing (Monthly/Annual toggle).
  - **Company**: About Us (Design Philosophy), Contact Form with interactive state, Engineering Journal & Blog, Careers.
  - **Resources & Compliance**: Documentation & API Reference, Privacy Policy, Terms of Service, 24/7 System Status Monitor.
  - **Dynamic Article Reader**: Dedicated blog article viewer (`/blog/:slug`) with author attribution and related posts.

---

## Design Philosophy

CollabFlow draws inspiration from Architectural Brutalism:

- **Raw Borders & Structure**: Bold `2px` black borders (`#171717`) define every card, input, and container.
- **High Contrast Palette**: Clean surfaces (`#FFFFFF`), muted backgrounds (`#F7F7F5`), stark ink text (`#111111`), and an energetic warm orange brand accent (`#FF6B35`).
- **Typography Scale**: Space Grotesk for display headers, Inter for readable UI content, and JetBrains Mono for code blocks and metadata.
- **Brutalist Shadows**: Hard offset drop shadows (`0 2px 0 #171717`) instead of blurry elevation glows.

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 (`react`, `react-dom`) | Modern component architecture and concurrent rendering |
| **Language** | TypeScript (~5.9) | Strict static type checking and domain schemas |
| **Tooling & Bundler** | Vite 7 (`@vitejs/plugin-react-swc`) | Fast development server and optimized production build |
| **Backend & DB** | Supabase (`@supabase/supabase-js`) | PostgreSQL database, Row-Level Security, Auth, and WebSockets |
| **Styling** | Tailwind CSS 3.4 | Utility-first styling with custom Neo-Brutalist design tokens |
| **Data Fetching** | TanStack React Query 5 | Client-side server cache, query invalidation, and optimistic mutations |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable` | Accessible, touch-compatible drag-and-drop mechanics |
| **Data Visualization** | Recharts 3 | Responsive velocity charts, burn-down graphs, and workload bars |
| **Routing** | React Router 7 (`react-router-dom`) | Declarative client-side routing with code-split lazy loading |
| **Forms & Validation** | React Hook Form & Zod | Type-safe form schemas and validated inputs |
| **Icons** | Lucide React | Lightweight, consistent iconography |
| **Notifications** | Sonner | Minimalist toast notifications |

---

## Architecture & Directory Structure

```
CollabFlow/
├── public/                     # Static assets and favicons
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql      # Core PostgreSQL tables and schemas
│       ├── 002_rls.sql         # Row-Level Security policies per role
│       └── 003_realtime.sql    # Realtime publication and storage functions
├── src/
│   ├── app/
│   │   └── router.tsx          # Application routing and authentication guards
│   ├── features/
│   │   ├── activity/           # Chronological audit trail and event feeds
│   │   ├── analytics/          # Sprint velocity charts and team workload reports
│   │   ├── auth/               # Supabase authentication, login/signup modals, setup
│   │   ├── boards/             # Kanban board engine, column workflows, dnd-kit logic
│   │   ├── chat/               # Channel chat streams and real-time messaging
│   │   ├── dashboard/          # Aggregated dashboard metrics and recent shortcuts
│   │   ├── landing/            # Landing page hero, preview mock, and feature callouts
│   │   ├── notifications/      # In-app notification feed and alerts
│   │   ├── projects/           # Project management, creation modals, and lists
│   │   ├── public/             # 13 marketing, pricing, documentation, and blog pages
│   │   ├── settings/           # Workspace settings, member management, and RBAC
│   │   ├── tasks/              # Task modals, checklists, labels, and comments
│   │   └── workspaces/         # Workspace switcher, isolation, and invitation flows
│   ├── layouts/
│   │   ├── DashboardLayout.tsx # Main authenticated sidebar and top navigation layout
│   │   └── PublicLayout.tsx    # Shared marketing header and footer layout
│   ├── lib/
│   │   └── supabase.ts         # Supabase client instantiation
│   ├── types/                  # Global database and domain TypeScript interfaces
│   ├── index.css               # Design tokens, Brutalist utilities, and root CSS
│   └── main.tsx                # React root bootstrap
├── .env.example                # Sample environment configuration
├── package.json                # Project dependencies and npm scripts
├── tailwind.config.cjs         # Tailwind colors, shadows, fonts, and typography
├── tsconfig.json               # TypeScript compiler options
└── vite.config.ts              # Vite configuration
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your workstation:

- **Node.js**: Version 18.0.0 or higher (Node 20+ recommended)
- **npm**: Version 9.0.0 or higher (or pnpm / yarn)
- **Git**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Md-Arif-hasnat99/Collab-Flow.git
   cd Collab-Flow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the project root based on the provided example:

```bash
cp .env.example .env
```

Populate the `.env` file with your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### Database Setup (Supabase)

1. Create a new project on [Supabase](https://supabase.com/).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Apply the migrations in sequential order from `supabase/migrations/`:
   - `001_schema.sql` (Tables: workspaces, members, projects, boards, columns, tasks, comments, chat_messages, activity_logs)
   - `002_rls.sql` (PostgreSQL Row-Level Security policies guaranteeing cross-workspace isolation)
   - `003_realtime_storage_functions.sql` (Realtime publication setup for instant WebSocket replication)
4. Under **Authentication > URL Configuration**, add your local development URL (`http://localhost:5173`) to the list of allowed Redirect URLs.

### Running the Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## Available Scripts

In the project root, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles TypeScript via `tsc -b` and bundles for production via `vite build` |
| `npm run preview` | Locally serves the production bundle from the `dist/` directory |
| `npm run lint` | Runs ESLint to identify code quality and styling issues |

---

## Role-Based Access Control (RBAC)

CollabFlow enforces strict role-based access control across all operations:

| Role | Workspace Settings | Member Management | Projects & Boards | Tasks & Checklists | Channel Chat |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Owner** | Full Control | Full Control | Create, Edit, Delete | Full Control | Full Access |
| **Admin** | View & Edit | Invite & Remove | Create, Edit, Delete | Full Control | Full Access |
| **Project Manager** | Read Only | View Members | Create & Edit | Full Control | Full Access |
| **Member** | Read Only | View Members | View Only | Create, Move, Edit | Full Access |
| **Viewer** | Read Only | View Members | View Only | Read Only | Read Only |

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository on GitHub.
2. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Commit your changes following conventional commits:
   ```bash
   git commit -m "feat: add keyboard shortcut for task creation"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```
5. Open a Pull Request detailing the changes made and testing performed.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
