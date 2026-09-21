import { Link } from 'react-router-dom';
import { 
  Building2, 
  Layers, 
  Send, 
  BarChart, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: Building2,
    tag: 'SETUP IN 30 SECONDS',
    title: 'Initialize Your Team Workspace',
    description: 'Create your organization or team hub instantly. Choose your workspace slug, set default member permissions, and generate instant invitation links for your team.',
    details: [
      'Zero credit card or corporate paperwork required',
      'Generate secure, time-limited member invite tokens',
      'Auto-assign initial member roles (Owner, Admin, Member)'
    ],
    mockPreview: {
      type: 'setup',
      title: 'Workspace: Acme Engineering',
      meta: 'Slug: acme-team • 14 Members Invited'
    }
  },
  {
    step: '02',
    icon: Layers,
    tag: 'STRUCTURE',
    title: 'Spin Up Projects & Kanban Boards',
    description: 'Every project can contain dedicated boards for specific squads, milestones, or continuous Kanban. Configure workflow columns to map your exact delivery cycle.',
    details: [
      'Default columns: Backlog, To Do, In Progress, Review, Done',
      'Categorize tasks with custom tags and urgency levels',
      'Define checklists and assign multiple contributors'
    ],
    mockPreview: {
      type: 'board',
      title: 'Sprint 24 — Mobile App Redesign',
      meta: '4 Columns • 26 Active Tasks'
    }
  },
  {
    step: '03',
    icon: Send,
    tag: 'REAL-TIME COLLABORATION',
    title: 'Collaborate Live Without Context Switching',
    description: 'Drag cards, leave inline comments, and coordinate in built-in workspace channels. As soon as a card is moved or edited, everyone on the board sees it instantly.',
    details: [
      'Websocket synchronization with sub-100ms updates',
      'Live presence indicators showing who is viewing the board',
      'Dedicated channel chat for ad-hoc team discussions'
    ],
    mockPreview: {
      type: 'chat',
      title: '#sprint-24-standup',
      meta: 'Active chat stream • Instant notifications'
    }
  },
  {
    step: '04',
    icon: BarChart,
    tag: 'OPTIMIZATION',
    title: 'Analyze Velocity & Ship Consistently',
    description: 'Review actionable sprint metrics and activity logs. Track turnaround time, identify blocked cards, and keep leadership aligned with transparent dashboards.',
    details: [
      'Comprehensive 30-day task completion trends',
      'Workload balance metrics across team members',
      'Tamper-resistant audit trails of every status change'
    ],
    mockPreview: {
      type: 'analytics',
      title: 'Team Velocity: 87% Completion Rate',
      meta: '2.4 days average task turnaround'
    }
  }
];

const FAQS = [
  {
    q: 'How does CollabFlow handle real-time sync?',
    a: 'CollabFlow connects to Supabase Realtime via persistent WebSockets. Whenever a task is updated or a card is moved, changes are broadcast to all active subscribers within milliseconds.'
  },
  {
    q: 'Can I invite external clients or contractors?',
    a: 'Yes. You can assign them the "Viewer" or "Member" role, ensuring they only have access to specific boards without viewing sensitive workspace administration settings.'
  },
  {
    q: 'Is there a limit on how many boards I can create?',
    a: 'Our Starter plan includes up to 3 active boards. The Pro and Enterprise plans offer unlimited projects, boards, and tasks.'
  },
  {
    q: 'How do notifications work in CollabFlow?',
    a: 'You receive instant in-app alerts whenever you are assigned a task, mentioned in a comment, or when a status changes on a card you follow.'
  }
];

export default function HowItWorksPage() {
  return (
    <div className="w-full">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">HOW IT WORKS</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-6" style={{ fontSize: 'clamp(36px, 6vw, 68px)' }}>
            FROM INCEPTION<br />
            TO SHIPMENT IN<br />
            RECORD TIME.
          </h1>
          <p className="text-body-lg text-ink-secondary leading-relaxed mb-8 max-w-2xl">
            See how CollabFlow simplifies complex teamwork into a streamlined four-step workflow designed for maximum velocity and clarity.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/auth/signup" className="btn-primary px-6 py-3.5 text-base">
              CREATE YOUR WORKSPACE <ArrowRight size={16} />
            </Link>
            <Link to="/features" className="btn-secondary px-6 py-3.5 text-base">
              EXPLORE ALL FEATURES
            </Link>
          </div>
        </div>
      </section>

      {/* ── Steps Section ──────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-y-2 border-border">
        <div className="max-w-[1400px] mx-auto space-y-16">
          {WORKFLOW_STEPS.map((item, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={item.step}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-display font-bold text-accent text-4xl lg:text-5xl">
                      {item.step}
                    </span>
                    <span className="text-label text-ink bg-muted border border-border px-2.5 py-1 rounded-sm">
                      {item.tag}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-ink text-section mb-4">
                    {item.title}
                  </h2>
                  <p className="text-body-lg text-ink-secondary leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <ul className="space-y-3">
                    {item.details.map(d => (
                      <li key={d} className="flex items-center gap-3 text-body font-display font-semibold text-ink">
                        <CheckCircle2 size={18} className="text-accent flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : ''}`}>
                  <div className="bg-background border-2 border-border rounded-lg p-6 shadow-brutal">
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b-2 border-border">
                      <div className="w-10 h-10 bg-surface border-2 border-border rounded flex items-center justify-center text-accent">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <div className="text-meta font-display font-bold text-ink uppercase">{item.mockPreview.title}</div>
                        <div className="text-[11px] text-ink-muted">{item.mockPreview.meta}</div>
                      </div>
                    </div>
                    <div className="p-4 bg-surface border-2 border-border rounded text-meta font-mono text-ink-secondary">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-accent font-bold">STATUS: OK</span>
                        <span className="text-ink-muted">STEP {item.step}/04</span>
                      </div>
                      <p className="text-xs text-ink-secondary leading-normal">
                        Ready for instant interaction. Synchronized with the global CollabFlow cloud cluster.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Frequently Asked Questions ─────────────────────────── */}
      <section className="px-6 lg:px-12 py-20 max-w-[1400px] mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-label text-accent mb-2">QUESTIONS & ANSWERS</p>
            <h2 className="font-display font-bold text-ink text-section">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map(faq => (
              <div key={faq.q} className="bg-surface border-2 border-border p-6 rounded shadow-brutal">
                <h3 className="font-display font-bold text-ink text-title mb-2 flex items-center gap-2">
                  <HelpCircle size={18} className="text-accent flex-shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-body text-ink-secondary leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-accent border-t-2 border-border text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-white text-section mb-4 leading-tight">
            START STREAMLINING YOUR PROJECTS TODAY.
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            Experience the clarity and focus of brutalist project tracking.
          </p>
          <Link
            to="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-accent border-2 border-white px-8 py-4 rounded-sm font-display font-bold text-base hover:bg-muted transition-colors shadow-brutal"
          >
            CREATE FREE WORKSPACE <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}