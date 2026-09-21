import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Zap, 
  Users, 
  BarChart3, 
  Activity, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Sliders, 
  Clock, 
  FolderKanban,
  BellRing,
  Check
} from 'lucide-react';

const FEATURE_LIST = [
  {
    icon: FolderKanban,
    badge: 'CORE ENGINE',
    title: 'Visual Kanban Boards',
    description: 'Structure complex projects into modular boards. Effortlessly drag-and-drop tasks across custom workflows, set WIP limits, and assign tags.',
    bullets: ['Instant drag-and-drop state sync', 'Custom status columns & priority levels', 'Subtask checklists & due-date indicators']
  },
  {
    icon: Zap,
    badge: 'SUB-100MS',
    title: 'Live Real-Time Engine',
    description: 'Every interaction synchronizes immediately to all connected teammates via Supabase Realtime websockets. Zero manual refresh needed.',
    bullets: ['Live member presence & active indicators', 'Instant card movements across screens', 'Optimistic UI updates with zero latency']
  },
  {
    icon: MessageSquare,
    badge: 'IN-APP CHAT',
    title: 'Integrated Team Channels',
    description: 'Keep your team communication tied directly to the work. Dedicated channels per workspace and contextual discussions on individual tasks.',
    bullets: ['Workspace-wide public channels', 'Contextual task comment threads', 'Rich markdown formatting & code blocks']
  },
  {
    icon: Users,
    badge: 'RBAC',
    title: 'Granular Role Permissions',
    description: 'Protect sensitive deliverables and maintain governance. Assign roles with distinct operational privileges to internal members and outside guests.',
    bullets: ['5 distinct roles: Owner, Admin, PM, Member, Viewer', 'Invite tokens with expiration controls', 'Scoped board visibility controls']
  },
  {
    icon: BarChart3,
    badge: 'VELOCITY METRICS',
    title: 'Actionable Sprint Analytics',
    description: 'Understand throughput, identify bottlenecks early, and track sprint burn-down with high-contrast, distraction-free performance dashboards.',
    bullets: ['Task completion velocity over time', 'Member workload distribution charts', 'Average lead time & turnaround metrics']
  },
  {
    icon: Activity,
    badge: 'COMPLIANCE',
    title: 'Comprehensive Audit Logs',
    description: 'Maintain complete visibility over every change. Every task creation, status transition, invite acceptance, and edit is logged chronologically.',
    bullets: ['Searchable activity event stream', 'User identity and timestamp attribution', 'Full audit history per workspace']
  },
];

const COMPARISON_ITEMS = [
  { feature: 'Real-time WebSocket Board Sync', cf: true, others: 'Polling (delayed 10-30s)' },
  { feature: 'High-Contrast Neo-Brutalist UI', cf: true, others: 'Low-contrast bloated UI' },
  { feature: 'Built-in Channel Chat', cf: true, others: 'Requires external integration' },
  { feature: 'Sub-100ms Optimistic Updates', cf: true, others: 'Persistent loading spinners' },
  { feature: 'Full Activity Audit Trail', cf: true, others: 'Locked behind Enterprise tier' },
  { feature: 'Granular 5-Tier RBAC', cf: true, others: 'Basic Admin/Member only' },
];

export default function FeaturesPage() {
  return (
    <div className="w-full">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">PLATFORM CAPABILITIES</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-6" style={{ fontSize: 'clamp(36px, 6vw, 68px)' }}>
            POWERFUL TOOLS.<br />
            ZERO BLOAT.<br />
            BUILT FOR SPEED.
          </h1>
          <p className="text-body-lg text-ink-secondary leading-relaxed mb-8 max-w-2xl">
            CollabFlow is engineered specifically for fast-moving engineering, design, and product teams who demand speed, clarity, and real-time reliability.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/auth/signup" className="btn-primary px-6 py-3.5 text-base">
              GET STARTED FREE <ArrowRight size={16} />
            </Link>
            <Link to="/pricing" className="btn-secondary px-6 py-3.5 text-base">
              VIEW PRICING
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Cards Grid ─────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-y-2 border-border">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-label text-accent mb-2">COMPLETE TOOLKIT</p>
              <h2 className="font-display font-bold text-ink text-section">
                EVERY CAPABILITY YOU NEED
              </h2>
            </div>
            <p className="text-body text-ink-secondary max-w-md">
              Designed from the ground up to replace fragmented spreadsheets and lagging project management platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_LIST.map(({ icon: Icon, badge, title, description, bullets }) => (
              <div
                key={title}
                className="bg-background border-2 border-border p-6 rounded shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-surface border-2 border-border rounded flex items-center justify-center text-accent">
                      <Icon size={24} />
                    </div>
                    <span className="text-label text-ink bg-muted border border-border px-2 py-0.5 rounded-sm">
                      {badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-title text-ink mb-3">{title}</h3>
                  <p className="text-body text-ink-secondary mb-6 leading-relaxed">{description}</p>
                </div>

                <div className="border-t-2 border-border-light pt-4 space-y-2">
                  {bullets.map(b => (
                    <div key={b} className="flex items-start gap-2 text-meta text-ink">
                      <Check size={14} className="text-accent mt-0.5 flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ───────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-20 max-w-[1400px] mx-auto">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <p className="text-label text-accent mb-2">HOW WE COMPARE</p>
          <h2 className="font-display font-bold text-ink text-section mb-4">
            COLLABFLOW VS. TRADITIONAL TOOLS
          </h2>
          <p className="text-body text-ink-secondary">
            Why high-performing teams switch to our minimalist, high-velocity infrastructure.
          </p>
        </div>

        <div className="border-2 border-border rounded bg-surface shadow-brutal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-border bg-muted">
                  <th className="p-4 font-display font-bold text-ink uppercase text-meta">Feature</th>
                  <th className="p-4 font-display font-bold text-accent uppercase text-meta w-1/3 bg-accent-light border-x-2 border-border">
                    CollabFlow
                  </th>
                  <th className="p-4 font-display font-bold text-ink-secondary uppercase text-meta w-1/3">
                    Legacy Platforms
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                {COMPARISON_ITEMS.map((row) => (
                  <tr key={row.feature} className="hover:bg-background/50 transition-colors">
                    <td className="p-4 font-display font-semibold text-ink text-body">
                      {row.feature}
                    </td>
                    <td className="p-4 bg-accent-light/40 border-x-2 border-border">
                      <div className="inline-flex items-center gap-2 text-accent font-display font-bold text-body">
                        <Check size={18} className="text-accent" /> Yes, Native
                      </div>
                    </td>
                    <td className="p-4 text-ink-secondary text-body">
                      {row.others}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Final Call to Action Banner ────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-accent border-t-2 border-border text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-white text-section mb-4 leading-tight">
            EXPERIENCE THE REAL-TIME DIFFERENCE.
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            Create your team workspace in seconds. Free forever on standard starter plans.
          </p>
          <Link
            to="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-accent border-2 border-white px-8 py-4 rounded-sm font-display font-bold text-base hover:bg-muted transition-colors shadow-brutal"
          >
            START FREE NOW <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}