import { Link, Outlet } from 'react-router-dom';
import { ArrowRight, CheckSquare, Users, BarChart3, MessageSquare, Zap, Activity, ChevronRight } from 'lucide-react';


// ── App Preview (realistic mock) ─────────────────────────────────
function AppPreview() {
  return (
    <div className="w-full bg-surface border-2 border-border rounded-lg overflow-hidden shadow-[0_8px_0_#171717]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-border bg-muted">
        <div className="w-3 h-3 rounded-full bg-danger-border border border-danger" />
        <div className="w-3 h-3 rounded-full bg-warning-border border border-warning" />
        <div className="w-3 h-3 rounded-full bg-success-border border border-success" />
        <span className="ml-2 text-meta text-ink-muted font-mono">collabflow.app/dashboard</span>
      </div>
      {/* App layout */}
      <div className="flex h-[420px] lg:h-[520px]">
        {/* Sidebar */}
        <div className="w-[180px] lg:w-[200px] border-r-2 border-border bg-surface flex-shrink-0 flex flex-col">
          <div className="p-3 border-b-2 border-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded-sm border border-border flex-shrink-0" />
              <span className="text-meta font-display font-bold text-ink truncate">ACME TEAM</span>
            </div>
          </div>
          <nav className="p-2 flex flex-col gap-0.5 text-xs">
            {[
              { label: 'Overview', active: true },
              { label: 'My Tasks' },
              { label: 'Projects' },
              { label: 'Boards' },
            ].map(({ label, active }) => (
              <div
                key={label}
                className={`px-2 py-1.5 rounded-sm font-display font-semibold text-meta tracking-wide ${
                  active ? 'bg-accent-light text-accent' : 'text-ink-secondary'
                }`}
              >
                {label}
              </div>
            ))}
            <div className="mt-3 px-2 text-[10px] text-ink-muted font-display tracking-widest uppercase">Collaborate</div>
            {['Chat', 'Activity'].map(label => (
              <div key={label} className="px-2 py-1.5 rounded-sm font-display font-semibold text-meta text-ink-secondary">
                {label}
              </div>
            ))}
          </nav>
          <div className="mt-auto p-3 border-t-2 border-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded-full border border-border flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">AH</div>
              <span className="text-[10px] font-display text-ink-secondary truncate">Arif Hasnat</span>
            </div>
          </div>
        </div>
        {/* Main content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-border bg-surface">
            <div className="text-meta font-display font-bold text-ink-muted tracking-widest uppercase">GOOD MORNING, ARIF.</div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted border border-border rounded-sm" />
              <div className="w-6 h-6 bg-muted border border-border rounded-sm" />
            </div>
          </div>
          {/* Dashboard content */}
          <div className="flex-1 overflow-auto p-4 bg-background">
            {/* Metrics row */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: 'ACTIVE PROJECTS', val: '12' },
                { label: 'OPEN TASKS', val: '47' },
                { label: 'COMPLETED', val: '83' },
                { label: 'MEMBERS', val: '18' },
              ].map(({ label, val }) => (
                <div key={label} className="bg-surface border-2 border-border rounded p-3">
                  <div className="text-[9px] font-display font-bold text-ink-muted tracking-widest uppercase mb-1">{label}</div>
                  <div className="text-xl font-display font-bold text-ink">{val}</div>
                </div>
              ))}
            </div>
            {/* Kanban preview */}
            <div className="flex gap-3 overflow-hidden">
              {[
                { col: 'BACKLOG', tasks: ['Define scope', 'Stakeholder review'], color: 'bg-muted' },
                { col: 'IN PROGRESS', tasks: ['Hero section redesign', 'API integration'], color: 'bg-warning-light' },
                { col: 'REVIEW', tasks: ['Navigation redesign'], color: 'bg-accent-light' },
                { col: 'DONE', tasks: ['Project setup', 'Database schema'], color: 'bg-success-light' },
              ].map(({ col, tasks, color }) => (
                <div key={col} className="flex-shrink-0 w-[140px]">
                  <div className="text-[9px] font-display font-bold text-ink-muted tracking-widest uppercase mb-2 px-1">{col}</div>
                  <div className="flex flex-col gap-1.5">
                    {tasks.map(task => (
                      <div key={task} className={`p-2 border-2 border-border rounded-sm ${color}`}>
                        <div className="text-[9px] font-display font-semibold text-ink leading-tight">{task}</div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <div className="w-3 h-3 bg-accent rounded-full border border-border flex-shrink-0" />
                          <div className="w-8 h-1 bg-border-light rounded-full flex-shrink-0">
                            <div className="h-full bg-accent rounded-full" style={{ width: '60%' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Features ────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: CheckSquare,
    title: 'Kanban Boards',
    desc: 'Visualize work with customizable Kanban boards. Drag tasks between columns, set priorities, and track progress in real time.',
  },
  {
    icon: Zap,
    title: 'Real-Time Collaboration',
    desc: 'Every change — moved tasks, new comments, updated statuses — syncs instantly across your team\'s screens.',
  },
  {
    icon: CheckSquare,
    title: 'Task Management',
    desc: 'Tasks with assignees, priorities, due dates, labels, checklists, comments and file attachments. Everything in one place.',
  },
  {
    icon: MessageSquare,
    title: 'Team Chat',
    desc: 'Discuss work in team channels and direct messages without leaving the workspace.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    desc: 'Understand team performance with completion rates, workload distribution, and progress trends.',
  },
  {
    icon: Activity,
    title: 'Activity Tracking',
    desc: 'A complete chronological record of every important workspace event — who did what and when.',
  },
];

// ── Roles ────────────────────────────────────────────────────────
const ROLES = [
  { role: 'OWNER', desc: 'Full workspace control. Manages billing, members, and all settings. Workspace creator.', color: 'bg-accent text-white border-accent' },
  { role: 'ADMIN', desc: 'Manages members, projects, and workspace settings. Cannot transfer ownership.', color: 'bg-ink text-surface border-ink' },
  { role: 'PROJECT MANAGER', desc: 'Creates and manages projects and boards. Assigns tasks and tracks progress.', color: 'bg-surface text-ink border-border' },
  { role: 'MEMBER', desc: 'Creates and updates tasks. Participates in chat and collaboration.', color: 'bg-muted text-ink border-border-light' },
  { role: 'VIEWER', desc: 'Read-only access to projects, boards and analytics. Cannot modify anything.', color: 'bg-surface text-ink-secondary border-border-light' },
];

// ── Main Landing Page ─────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Modal routes render here (login/signup over landing) */}
      <Outlet />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 lg:pt-28 lg:pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 border-2 border-border px-3 py-1 rounded-sm mb-8">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-label text-ink-secondary">REAL-TIME TEAM COLLABORATION</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-ink mb-6 leading-[0.95] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(44px, 7vw, 80px)' }}>
            COLLABORATION<br />
            WITHOUT THE<br />
            <span className="relative">
              CHAOS.
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-accent" />
            </span>
          </h1>

          <p className="text-body-lg text-ink-secondary max-w-xl mb-10 leading-relaxed">
            A shared workspace for teams to plan, organize and ship work together.
            One platform for projects, tasks, chat, and progress.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/auth/signup" className="btn-primary text-base px-7 py-3">
              GET STARTED <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base px-7 py-3 text-center">
              SEE HOW IT WORKS
            </a>
          </div>
        </div>

        {/* App preview */}
        <div className="mt-16 lg:mt-20">
          <AppPreview />
        </div>
      </section>

      {/* ── Product Metrics ───────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12 border-y-2 border-border bg-surface">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x-0 lg:divide-x-2 divide-border">
            {[
              { label: 'ACTIVE PROJECTS', val: '24', note: 'across all workspaces' },
              { label: 'OPEN TASKS', val: '128', note: 'tracked in real time' },
              { label: 'TEAM MEMBERS', val: '18', note: 'collaborating daily' },
              { label: 'COMPLETION RATE', val: '87%', note: 'tasks shipped on time' },
            ].map(({ label, val, note }, i) => (
              <div key={label} className={`p-8 lg:p-10 ${i < 2 ? 'border-b-2 lg:border-b-0 border-border' : ''}`}>
                <div className="text-label text-ink-muted mb-2">{label}</div>
                <div className="font-display font-bold text-ink mb-1"
                  style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1 }}>
                  {val}
                </div>
                <div className="text-meta text-ink-muted">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" className="py-24 lg:py-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="mb-16">
          <p className="text-label text-ink-muted mb-4">WHAT YOU GET</p>
          <h2 className="font-display font-bold text-ink leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            EVERYTHING YOUR TEAM<br />
            NEEDS TO GET WORK DONE.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-border">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`p-8 lg:p-10 ${i % 3 !== 2 ? 'lg:border-r-2 border-border' : ''} ${i < 3 ? 'border-b-2 border-border' : ''} ${i % 2 === 0 && i < 4 ? 'md:border-r-2' : ''} group hover:bg-muted transition-colors duration-150`}
            >
              <div className="w-10 h-10 border-2 border-border flex items-center justify-center mb-6 group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-colors">
                <Icon size={18} />
              </div>
              <h3 className="font-display font-bold text-card text-ink mb-3">{title}</h3>
              <p className="text-body text-ink-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-ink text-surface">
        <div className="px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="mb-16">
            <p className="text-label text-surface/40 mb-4">THE PROCESS</p>
            <h2 className="font-display font-bold leading-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
              FIVE STEPS TO<br />SHIP TOGETHER.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {[
              { num: '01', title: 'CREATE', desc: 'Sign up and create your workspace in under 60 seconds.' },
              { num: '02', title: 'ORGANIZE', desc: 'Create projects and Kanban boards that match your workflow.' },
              { num: '03', title: 'ASSIGN', desc: 'Break work into tasks and assign them to teammates with context.' },
              { num: '04', title: 'COLLABORATE', desc: 'Chat, comment, and work together without switching apps.' },
              { num: '05', title: 'TRACK', desc: 'Monitor progress, workload and performance with analytics.' },
            ].map(({ num, title, desc }, i) => (
              <div
                key={num}
                className={`p-8 border-2 border-surface/10 ${i < 4 ? 'md:border-r-0' : ''} hover:bg-white/5 transition-colors`}
              >
                <div className="font-display font-bold text-accent mb-2"
                  style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                  {num}
                </div>
                <div className="font-display font-bold text-surface text-card mb-3">{title}</div>
                <p className="text-meta text-surface/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles Section ─────────────────────────────────────── */}
      <section id="about" className="py-24 lg:py-32 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="mb-16">
          <p className="text-label text-ink-muted mb-4">ACCESS CONTROL</p>
          <h2 className="font-display font-bold text-ink leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            THE RIGHT ACCESS<br />FOR EVERY PERSON.
          </h2>
          <p className="text-body-lg text-ink-secondary mt-4 max-w-xl">
            CollabFlow uses a five-tier role system. Roles are assigned — never self-selected.
          </p>
        </div>

        <div className="flex flex-col gap-0 border-2 border-border">
          {ROLES.map(({ role, desc, color }) => (
            <div key={role} className="flex items-center gap-6 p-6 border-b-2 border-border last:border-b-0 hover:bg-muted transition-colors">
              <div className={`w-40 flex-shrink-0 px-3 py-1.5 border-2 text-center rounded-sm ${color}`}>
                <span className="text-label font-display">{role}</span>
              </div>
              <p className="text-body text-ink-secondary flex-1">{desc}</p>
              <ChevronRight size={16} className="text-ink-muted flex-shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Analytics Preview ─────────────────────────────────── */}
      <section id="analytics" className="py-24 lg:py-32 bg-muted border-y-2 border-border">
        <div className="px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-label text-ink-muted mb-4">ANALYTICS</p>
              <h2 className="font-display font-bold text-ink leading-tight mb-6"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
                UNDERSTAND HOW<br />YOUR TEAM WORKS.
              </h2>
              <p className="text-body-lg text-ink-secondary mb-8 leading-relaxed">
                Track completion rates, workload distribution, and project progress
                with role-scoped analytics dashboards.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  'Tasks completed over time',
                  'Workload by team member',
                  'Project progress tracking',
                  'Activity trend analysis',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-body text-ink">
                    <div className="w-2 h-2 bg-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Analytics mockup */}
            <div className="bg-surface border-2 border-border rounded p-6 shadow-brutal">
              <div className="text-label text-ink-muted mb-6">TASK COMPLETION — LAST 30 DAYS</div>
              {/* Bar chart mock */}
              <div className="flex items-end gap-2 h-32 mb-6">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all"
                    style={{
                      height: `${h}%`,
                      background: i === 11 ? '#FF6B35' : '#EAEAE6',
                      border: '1px solid #D1D1CE',
                    }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'COMPLETED', val: '128' },
                  { label: 'RATE', val: '87%' },
                  { label: 'AVG TIME', val: '2.4d' },
                ].map(({ label, val }) => (
                  <div key={label} className="border-2 border-border rounded-sm p-3">
                    <div className="text-[9px] font-display text-ink-muted tracking-widest uppercase mb-1">{label}</div>
                    <div className="font-display font-bold text-lg text-ink">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-24 lg:py-40 px-6 lg:px-12 bg-accent">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="font-display font-bold text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(32px, 6vw, 72px)' }}>
            READY TO BRING<br />YOUR TEAM TOGETHER?
          </h2>
          <p className="text-body-lg text-white/80 mb-10 max-w-lg mx-auto">
            Create your workspace in seconds. No credit card required.
          </p>
          <Link
            to="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-accent border-2 border-white px-8 py-4 rounded-sm font-display font-bold text-base hover:bg-muted transition-colors shadow-[0_4px_0_rgba(0,0,0,0.2)]"
          >
            GET STARTED — IT&apos;S FREE <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
