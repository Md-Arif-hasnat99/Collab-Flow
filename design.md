# CollabFlow — Design System & UI/UX Specification

> **Design direction:** Minimal Brutalism + Modern SaaS Usability  
> **Primary goal:** Create a distinctive, responsive collaboration platform without the typical AI/SaaS purple-blue gradient aesthetic.

---

## 1. Product Identity

**CollabFlow** is a real-time team collaboration and project management platform.

Core product areas:

- Workspaces
- Projects
- Kanban boards
- Tasks
- Team collaboration
- Chat
- Comments
- Notifications
- Activity
- Analytics
- File attachments
- Role-based access

The visual identity must communicate:

> **A serious productivity tool designed by people who care about the work.**

It must not look like a generic AI startup template.

---

# 2. Design Philosophy

## Minimal Brutalism

Use brutalism through:

- Strong visible borders
- Bold typography
- Rectangular layouts
- High contrast
- Large whitespace
- Clear structural divisions
- Strong buttons
- Intentional asymmetry
- Simple geometric elements
- Minimal shadows
- Minimal corner radius

The brutalism should be **refined and usable**, not chaotic.

### Rule

> **Brutalist structure, modern usability.**

Use brutalism for visual structure while following modern UX conventions for:

- Navigation
- Forms
- Accessibility
- Modals
- Drag-and-drop
- Responsive behavior
- Loading states
- Error handling

---

# 3. What to Avoid

Do **not** use:

- Purple gradients
- Blue-purple gradients
- Pink-purple gradients
- Neon blue
- Gradient text
- AI-style glowing backgrounds
- Excessive glassmorphism
- Excessive blur
- Generic AI illustrations
- Futuristic robot imagery
- Cyberpunk styling
- Excessive 3D graphics
- Rainbow gradients
- Excessive pill-shaped components
- Excessive rounded cards
- Floating translucent cards

Especially avoid the typical:

```text
Purple → Blue → Pink
```

AI/SaaS aesthetic.

---

# 4. Color System

The interface should primarily use neutral colors.

## Base Colors

```text
Background       #F7F7F5
Surface          #FFFFFF
Primary Text     #111111
Secondary Text   #5A5A5A
Muted Text       #777777
Border           #171717
Muted Surface    #EAEAE6
```

## Brand Accent

Use **one warm accent color** throughout the product.

Preferred direction:

- Warm orange
- Burnt orange
- Coral
- Lime
- Red
- Yellow

Recommended starting direction:

```text
Primary Accent   #FF6B35
```

The accent should be used for:

- Primary CTA
- Active navigation
- Important actions
- Progress indicators
- Selected states
- Key highlights

Do not introduce multiple competing brand colors.

## Semantic Colors

Semantic colors may be used where necessary:

```text
Success
Warning
Error
Info
```

These should remain muted and functional rather than decorative.

---

# 5. Typography

Use a modern grotesk/sans-serif typeface.

Recommended characteristics:

- Bold display headings
- Strong numerical typography
- Medium-weight body text
- Compact metadata
- Tight heading line-height
- High readability

## Scale

```text
Hero Heading       64–72px desktop
Section Heading    40–48px
Page Heading       28–36px
Card Heading       16–20px
Body               14–16px
Metadata           12–14px
```

Mobile typography should scale responsively.

Hero example:

```text
YOUR TEAM'S WORK.
ONE SHARED
WORKSPACE.
```

Typography should act as a major visual element.

---

# 6. Layout System

Use a structured grid.

## Desktop

```text
Max content width: 1400px
Page padding:      32–48px
Section spacing:   96–160px
Grid gap:          16–32px
```

## Tablet

```text
Page padding:      24–32px
Grid gap:          16–24px
Section spacing:   72–96px
```

## Mobile

```text
Page padding:      16–20px
Grid gap:          12–16px
Section spacing:   56–72px
```

Use whitespace deliberately.

---

# 7. Borders & Radius

Borders are an important part of the brutalist identity.

Default:

```text
Border: 1px solid #171717
```

Important/high-emphasis elements may use:

```text
Border: 2px solid #171717
```

Corner radius should be restrained.

Recommended:

```text
Small:     2–4px
Medium:    6px
Large:     8px
```

Avoid excessive 16–32px rounded cards.

---

# 8. Shadows

Use shadows sparingly.

Preferred:

```text
0 2px 0 #171717
```

or subtle neutral shadows.

Avoid:

- Large soft shadows
- Glowing shadows
- Colored shadows
- Neon shadows

---

# 9. Buttons

Buttons should feel tactile and substantial.

## Primary

```text
┌─────────────────────────┐
│       GET STARTED →     │
└─────────────────────────┘
```

Characteristics:

- Solid accent background
- Strong dark border
- High contrast
- Minimal radius
- Bold label

## Secondary

```text
[ SEE HOW IT WORKS ]
```

Characteristics:

- Transparent/white background
- Strong border
- Dark text

## Interaction

Hover:

- Small upward/downward movement
- Slight shadow change
- Accent remains consistent

Avoid:

- Gradient buttons
- Glow effects
- Pill buttons

---

# 10. Navigation

## Landing Navbar

```text
COLLABFLOW

FEATURES
HOW IT WORKS
ANALYTICS
ABOUT

LOGIN
[ GET STARTED ]
```

Requirements:

- Sticky
- Strong bottom border
- Minimal layout
- Responsive mobile menu

## Application Navbar

```text
COLLABFLOW
Search                         + CREATE    🔔    AVATAR
```

---

# 11. Landing Page

Route:

```text
/
```

The landing page should be the public entry point.

## Structure

```text
Navbar
   ↓
Hero
   ↓
Trust / Product Metrics
   ↓
Features
   ↓
How It Works
   ↓
Product Showcase
   ↓
Roles
   ↓
Analytics Preview
   ↓
Final CTA
   ↓
Footer
```

---

# 12. Landing Hero

Use large editorial typography.

Example:

```text
COLLABORATION
WITHOUT THE
CHAOS.

A shared workspace for teams to plan,
organize and ship work together.

[ GET STARTED ]    [ SEE HOW IT WORKS ]
```

Below the hero, display a large realistic CollabFlow dashboard/Kanban preview.

The preview should look like the actual application.

---

# 13. Feature Section

Heading:

```text
EVERYTHING YOUR TEAM
NEEDS TO GET WORK DONE.
```

Feature cards:

### Kanban Boards

Organize projects visually using customizable workflows.

### Real-Time Collaboration

Keep every team member synchronized.

### Task Management

Tasks support:

- Assignees
- Priorities
- Due dates
- Labels
- Checklists
- Comments
- Attachments

### Team Chat

Discuss work without leaving the workspace.

### Analytics

Understand project and team performance.

### Activity Tracking

See important workspace events chronologically.

---

# 14. How It Works

Five-step process:

```text
01
CREATE
Create your workspace.

02
ORGANIZE
Create projects and boards.

03
ASSIGN
Assign tasks to teammates.

04
COLLABORATE
Chat, comment and work together.

05
TRACK
Monitor progress and analytics.
```

Use a connected timeline or structured numbered blocks.

---

# 15. Application Shell

Authenticated routes use a consistent application shell.

```text
┌───────────────┬───────────────────────────────────────┐
│ COLLABFLOW    │ SEARCH              + CREATE  AVATAR │
├───────────────┤───────────────────────────────────────┤
│ WORKSPACE     │                                       │
│               │               CONTENT                 │
│ Overview      │                                       │
│ My Tasks      │                                       │
│ Projects      │                                       │
│ Boards        │                                       │
│               │                                       │
│ COLLABORATE   │                                       │
│ Chat          │                                       │
│ Activity      │                                       │
│               │                                       │
│ ANALYTICS     │                                       │
│ Reports       │                                       │
│               │                                       │
│ Settings      │                                       │
└───────────────┴───────────────────────────────────────┘
```

Sidebar:

- Collapsible
- Workspace switcher
- Active route
- User profile
- Notifications
- Mobile drawer

---

# 16. Dashboard

Route:

```text
/app/dashboard
```

Header:

```text
GOOD MORNING, ARIF.

Here's what's happening with your workspace.
```

Metrics:

```text
ACTIVE PROJECTS
24

OPEN TASKS
128

COMPLETED
87

TEAM MEMBERS
18
```

Sections:

- Project progress
- My tasks
- Upcoming deadlines
- Team activity
- Recent projects

Use bordered blocks rather than soft floating cards.

---

# 17. Workspace

Route:

```text
/app/workspaces/:workspaceId
```

Header:

```text
WORKSPACE NAME

Workspace description

18 MEMBERS     12 PROJECTS

[ INVITE ] [ SETTINGS ]
```

Tabs:

```text
OVERVIEW
PROJECTS
BOARDS
MEMBERS
ACTIVITY
ANALYTICS
```

---

# 18. Projects

Project cards should display:

- Project name
- Description
- Progress
- Task count
- Members
- Due date
- Status

Example:

```text
┌──────────────────────────────────┐
│ WEBSITE REDESIGN                 │
│                                  │
│ Redesign the company website     │
│                                  │
│ ███████████████░░░ 76%           │
│                                  │
│ 👤 👤 👤 +3        42 TASKS       │
│ DUE OCT 12                       │
└──────────────────────────────────┘
```

---

# 19. Kanban Board

Route:

```text
/app/boards/:boardId
```

Toolbar:

```text
WEBSITE REDESIGN

SEARCH   FILTER   SORT   MEMBERS

                         + ADD TASK
```

Columns:

```text
BACKLOG
TODO
IN PROGRESS
REVIEW
DONE
```

Task cards:

```text
┌──────────────────────────┐
│ REDESIGN HERO SECTION    │
│                          │
│ HIGH                     │
│ #design #frontend        │
│                          │
│ 👤 ARIF       OCT 12     │
│                          │
│ ✓ 3/5       💬 4         │
└──────────────────────────┘
```

Features:

- Drag-and-drop
- Reordering
- Column movement
- Search
- Filtering
- Sorting
- Task creation
- Task editing

Use `dnd-kit`.

---

# 20. Task Detail

Open task details using a large modal or right-side sheet.

Sections:

```text
TASK TITLE

DESCRIPTION

CHECKLIST
☑ Research
☑ Design
☐ Implementation

COMMENTS

ATTACHMENTS
```

Metadata:

```text
STATUS
IN PROGRESS

PRIORITY
HIGH

ASSIGNEE
ARIF

DUE DATE
OCT 12

LABELS
DESIGN / FRONTEND
```

---

# 21. Chat

Route:

```text
/app/chat
```

Desktop:

```text
┌──────────────┬────────────────────────┬──────────────┐
│ CHANNELS     │ CHAT                   │ DETAILS      │
│              │                        │              │
│ Team         │ Sarah                  │ MEMBERS      │
│ Development  │ ----------------       │ FILES        │
│ Design       │ Message                │ TASKS        │
│              │                        │              │
│              │ Message                │              │
│              │------------------------│              │
│              │ Write message...   ➤   │              │
└──────────────┴────────────────────────┴──────────────┘
```

Features:

- Channels
- Direct messages
- Real-time messages
- Presence
- Files
- Unread indicators

---

# 22. Notifications

Notification dropdown:

```text
NOTIFICATIONS

● Sarah assigned you a task
  5 MINUTES AGO

● You were mentioned in Website Redesign
  24 MINUTES AGO

○ Project deadline is tomorrow
  2 HOURS AGO

[ MARK ALL AS READ ]
```

Use strong typography and compact rows.

---

# 23. Activity

Timeline:

```text
TODAY

10:42 AM
Arif moved "API Integration"
TODO → IN PROGRESS

10:12 AM
Sarah commented on "Dashboard"

09:45 AM
Rahul created "Mobile Navigation"

YESTERDAY

05:31 PM
Admin invited Priya
```

---

# 24. Analytics

Route:

```text
/app/analytics
```

Metrics:

```text
TASKS COMPLETED
COMPLETION RATE
AVG. COMPLETION TIME
ACTIVE MEMBERS
```

Charts:

- Tasks completed over time
- Tasks by status
- Tasks by priority
- Workload by member
- Project progress
- Activity trends

Filters:

```text
7 DAYS
30 DAYS
90 DAYS
CUSTOM
```

Charts should remain visually restrained and use the product accent sparingly.

---

# 25. Settings

Settings navigation:

```text
PROFILE
WORKSPACE
MEMBERS
ROLES & PERMISSIONS
NOTIFICATIONS
APPEARANCE
SECURITY
INTEGRATIONS
```

Use simple bordered sections and clear labels.

---

# 26. Authentication

Authentication should appear as a modal over the landing page.

## Login

```text
WELCOME BACK.

EMAIL
[________________________]

PASSWORD
[________________________]

[ LOGIN → ]

──────── OR ────────

[ CONTINUE WITH GOOGLE ]

New here?
CREATE ACCOUNT
```

## Signup

```text
CREATE YOUR ACCOUNT.

NAME
EMAIL
PASSWORD
CONFIRM PASSWORD

[ CREATE ACCOUNT ]

──────── OR ────────

[ CONTINUE WITH GOOGLE ]

Already have an account?
LOGIN
```

Do not allow users to select "Admin" directly during signup.

---

# 27. Workspace Onboarding

After signup:

```text
CREATE YOUR WORKSPACE

Workspace name
[________________________]

Description
[________________________]

[ CREATE WORKSPACE ]
```

The creator becomes the workspace owner.

Alternative:

```text
JOIN AN EXISTING WORKSPACE
```

using an invitation.

---

# 28. Invitation

Route:

```text
/invite/:token
```

Display:

```text
YOU'RE INVITED.

Join
ACME DESIGN TEAM

Invited by Sarah Johnson.

[ ACCEPT INVITATION ]

Already have an account?
LOGIN
```

---

# 29. Responsive Design

Responsiveness is a first-class requirement.

## Desktop

- Persistent sidebar
- Multi-column dashboards
- Full Kanban
- Three-panel chat
- Large analytics layouts

## Tablet

- Collapsible sidebar
- Adaptive grids
- Horizontally scrollable Kanban
- Reduced spacing

## Mobile

Do not simply scale desktop down.

Use a purpose-built mobile layout:

```text
┌─────────────────────────┐
│ ☰  COLLABFLOW      🔔   │
├─────────────────────────┤
│                         │
│ GOOD MORNING, ARIF      │
│                         │
│ ┌─────────────────────┐ │
│ │ ACTIVE TASKS     24 │ │
│ └─────────────────────┘ │
│                         │
│ RECENT TASKS            │
│                         │
│ ┌─────────────────────┐ │
│ │ WEBSITE REDESIGN    │ │
│ │ HIGH       OCT 12   │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ HOME TASKS CHAT MORE    │
└─────────────────────────┘
```

Mobile Kanban should horizontally scroll.

Task details should use a full-screen sheet.

Chat should become a single-panel experience.

---

# 30. Motion

Use subtle functional motion.

Good:

- Modal entrance
- Page transitions
- Sidebar transitions
- Drag animations
- Button feedback
- Hover transitions
- Notification appearance
- Landing section reveal

Avoid:

- Animated gradients
- Glowing backgrounds
- Constant floating elements
- Excessive parallax
- Decorative 3D animations

Respect `prefers-reduced-motion`.

---

# 31. Accessibility

Support:

- Keyboard navigation
- Visible focus states
- ARIA labels
- Sufficient contrast
- Accessible dialogs
- Screen readers
- Reduced motion
- Logical heading hierarchy

---

# 32. Component System

Use:

```text
shadcn/ui
Tailwind CSS
Lucide React
Motion
```

Core components:

```text
Button
Input
Textarea
Select
Dialog
Sheet
Dropdown
Popover
Tooltip
Tabs
Badge
Avatar
Card
Table
Calendar
Command
Toast
Progress
Skeleton
Breadcrumb
```

Product components:

```text
WorkspaceSwitcher
UserAvatar
MemberPicker
TaskCard
TaskModal
ProjectCard
BoardColumn
ActivityItem
NotificationItem
ChatMessage
SearchCommand
EmptyState
LoadingState
ErrorState
```

---

# 33. Recommended Frontend Stack

```text
React
TypeScript
Vite
React Router

Tailwind CSS
shadcn/ui
Lucide React
Motion

TanStack Query
React Hook Form
Zod

dnd-kit
Recharts
TanStack Table
Tiptap
cmdk
Sonner
date-fns
```

---

# 34. Backend Direction

CollabFlow should migrate from Firebase to Supabase.

Use:

```text
Supabase Auth
Supabase PostgreSQL
Supabase Realtime
Supabase Storage
Supabase RLS
```

PostgreSQL is the source of truth.

TanStack Query manages server state.

Supabase Realtime synchronizes collaborative changes.

---

# 35. Data Model

Core entities:

```text
users
profiles

workspaces
workspace_members
workspace_invitations

projects
project_members

boards
board_members

columns
tasks

task_assignees
task_labels
labels

task_checklists
task_comments
task_attachments

chat_channels
chat_members
chat_messages

notifications
activities

files
```

---

# 36. Application Architecture

Use feature/domain-based architecture:

```text
src/
│
├── app/
│   ├── router.tsx
│   ├── providers.tsx
│   └── routes/
│
├── features/
│   ├── auth/
│   ├── workspaces/
│   ├── projects/
│   ├── boards/
│   ├── tasks/
│   ├── chat/
│   ├── notifications/
│   ├── activity/
│   ├── analytics/
│   └── settings/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── layouts/
│   ├── AuthLayout.tsx
│   ├── LandingLayout.tsx
│   ├── DashboardLayout.tsx
│   └── WorkspaceLayout.tsx
│
├── lib/
│   ├── supabase/
│   ├── query-client.ts
│   └── utils.ts
│
└── types/
    └── database.types.ts
```

Data flow:

```text
Component
    ↓
Feature Hook
    ↓
Service
    ↓
Supabase
    ↓
PostgreSQL
    ↓
RLS
    ↓
Realtime
```

---

# 37. Routing

```text
/
├── Landing Page
│
├── /auth
│   ├── login
│   └── signup
│
├── /app
│   ├── dashboard
│   ├── workspaces
│   ├── projects
│   ├── boards
│   ├── tasks
│   ├── chat
│   ├── activity
│   ├── analytics
│   └── settings
│
└── /invite/:token
```

Login and signup may be implemented as modal routes so the landing page remains visible behind them.

---

# 38. Design Quality Checklist

Before considering any screen complete, verify:

- [ ] No purple-blue gradients
- [ ] No generic AI visual language
- [ ] No unnecessary glassmorphism
- [ ] Borders are intentional
- [ ] Typography has clear hierarchy
- [ ] Accent color is used sparingly
- [ ] Layout has sufficient whitespace
- [ ] Cards are not excessively rounded
- [ ] Buttons are tactile and readable
- [ ] Mobile layout is intentionally designed
- [ ] Desktop layout uses available space effectively
- [ ] Accessibility is considered
- [ ] Loading/empty/error states exist
- [ ] Motion is subtle
- [ ] Visual language is consistent across landing page and application

---

# 39. Stitch Prompt

Generate a complete high-fidelity responsive web application design for **CollabFlow**.

The design direction is:

**Minimal Brutalism + Modern SaaS Usability.**

Use:

- Off-white/light neutral background
- Black/near-black typography
- Strong visible borders
- Bold grotesk typography
- Structured rectangular layouts
- Generous whitespace
- Minimal corner radius
- Subtle shadows
- One warm distinctive accent color
- Responsive layouts

The product should feel bold, editorial, functional and professionally designed.

The landing page should be visually distinctive and communicate the product clearly.

The authenticated application should feel dense, practical and highly usable.

Design:

1. Landing Page
2. Login Modal
3. Signup Modal
4. Workspace Creation
5. Workspace Invitation
6. Dashboard
7. Workspace Overview
8. Projects
9. Kanban Board
10. Task Detail
11. Team Chat
12. Notifications
13. Activity Timeline
14. Analytics
15. Settings
16. Mobile Dashboard
17. Mobile Kanban
18. Mobile Task Detail

Use realistic CollabFlow content and realistic project/task data.

The landing page and application must share the same design system.

**Strictly avoid:**

- Purple gradients
- Blue-purple gradients
- Pink gradients
- AI glowing effects
- Gradient text
- Generic AI illustrations
- Excessive glassmorphism
- Excessive rounded cards
- Excessive pills
- Cyberpunk styling
- Futuristic 3D graphics
- Rainbow gradients

Use **refined brutalism, strong typography, visible structure, excellent spacing and modern usability**.

The final result should look like a real production collaboration platform, not an AI-generated SaaS template.
