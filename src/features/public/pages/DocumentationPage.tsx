import { Link } from 'react-router-dom';
import { 
  Book, 
  Terminal, 
  Key, 
  Code2, 
  ArrowRight, 
  Search, 
  Layers, 
  Users, 
  ShieldCheck, 
  Cpu 
} from 'lucide-react';

const GUIDES = [
  {
    icon: Book,
    badge: 'GETTING STARTED',
    title: 'Workspace Onboarding',
    desc: 'Learn how to set up your primary workspace, configure team domains, and invite collaborators with fine-grained roles.'
  },
  {
    icon: Layers,
    badge: 'CORE CONCEPT',
    title: 'Boards, Columns & Tasks',
    desc: 'Master Kanban boards, custom column definitions, task checklists, attachments, and subtask dependencies.'
  },
  {
    icon: Users,
    badge: 'SECURITY',
    title: 'Role-Based Permissions (RBAC)',
    desc: 'Detailed breakdown of Owner, Admin, Project Manager, Member, and Viewer permissions across boards and chats.'
  },
  {
    icon: Terminal,
    badge: 'KEYBOARD',
    title: 'Shortcuts & Power Tools',
    desc: 'Navigate workspaces without touching your mouse. Quick-switcher, card creation, and status movement hotkeys.'
  },
  {
    icon: Cpu,
    badge: 'ARCHITECTURE',
    title: 'Real-Time Sync Protocol',
    desc: 'How CollabFlow uses persistent WebSockets and optimistic updates to achieve sub-100ms state convergence.'
  },
  {
    icon: Code2,
    badge: 'INTEGRATIONS',
    title: 'Webhooks & REST APIs',
    desc: 'Connect GitHub, GitLab, Slack, and internal CI/CD pipelines directly to board task events.'
  }
];

export default function DocumentationPage() {
  return (
    <div className="w-full">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">DOCUMENTATION</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-6" style={{ fontSize: 'clamp(36px, 6vw, 68px)' }}>
            GUIDES, APIS &<br />
            ARCHITECTURE.
          </h1>
          <p className="text-body-lg text-ink-secondary leading-relaxed mb-8 max-w-2xl">
            Everything you need to master CollabFlow — from beginner workspace setup to automated webhook pipelines and keyboard mastery.
          </p>

          {/* Search Mockup */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
            <input
              type="text"
              placeholder="Search documentation (e.g., 'Webhooks', 'RBAC', 'Shortcuts')..."
              className="w-full bg-surface border-2 border-border pl-12 pr-4 py-3.5 rounded-sm font-sans text-body text-ink focus:outline-none focus:border-accent shadow-brutal-sm placeholder:text-ink-muted"
            />
          </div>
        </div>
      </section>

      {/* ── Guides Grid ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-y-2 border-border">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <p className="text-label text-accent mb-2">ESSENTIAL GUIDES</p>
            <h2 className="font-display font-bold text-ink text-section">
              POPULAR DOCUMENTATION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDES.map(guide => (
              <div
                key={guide.title}
                className="p-6 bg-background border-2 border-border rounded-lg shadow-brutal flex flex-col justify-between hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-surface border-2 border-border rounded flex items-center justify-center text-accent">
                      <guide.icon size={20} />
                    </div>
                    <span className="text-label text-ink-muted bg-surface border border-border px-2 py-0.5 rounded-sm">
                      {guide.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-title text-ink mb-2">{guide.title}</h3>
                  <p className="text-body text-ink-secondary leading-relaxed">{guide.desc}</p>
                </div>

                <div className="pt-6 border-t-2 border-border-light flex items-center gap-1 font-display font-bold text-meta text-accent group-hover:underline">
                  <span>Read full guide</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── API Preview Section ────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-20 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <p className="text-label text-accent mb-2">DEVELOPER FIRST</p>
            <h2 className="font-display font-bold text-ink text-section mb-4 leading-tight">
              PROGRAMMATIC TASK AUTOMATION
            </h2>
            <p className="text-body-lg text-ink-secondary mb-6 leading-relaxed">
              Every action in CollabFlow can be triggered via our authenticated REST API or real-time WebSockets. Subscribe to task status changes or automatically create tickets from your error trackers.
            </p>
            <Link to="/contact" className="btn-secondary">
              REQUEST API KEYS
            </Link>
          </div>

          <div className="lg:col-span-7 bg-ink text-surface border-2 border-border rounded-lg p-6 font-mono text-xs overflow-x-auto shadow-brutal">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface/20">
              <span className="text-surface/50">POST /api/v1/workspaces/{'{id}'}/tasks</span>
              <span className="text-success font-bold">201 CREATED</span>
            </div>
            <pre className="text-surface/90 leading-relaxed">
{`curl -X POST https://api.collabflow.app/v1/tasks \\
  -H "Authorization: Bearer cf_live_99d1fa98c..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "board_id": "b_01HX9881K7A",
    "title": "Fix Auth Token Refresh Loop",
    "priority": "HIGH",
    "column": "IN_PROGRESS",
    "assignee_id": "usr_9921a8"
  }'`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}