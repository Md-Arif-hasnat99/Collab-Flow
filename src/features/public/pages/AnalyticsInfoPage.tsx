import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Users, 
  ArrowRight, 
  Target, 
  PieChart, 
  LineChart,
  Zap
} from 'lucide-react';

export default function AnalyticsInfoPage() {
  return (
    <div className="w-full">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">PRODUCTIVITY INTELLIGENCE</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-6" style={{ fontSize: 'clamp(36px, 6vw, 68px)' }}>
            DATA-DRIVEN VELOCITY.<br />
            ZERO GUESSWORK.
          </h1>
          <p className="text-body-lg text-ink-secondary leading-relaxed mb-8 max-w-2xl">
            CollabFlow transforms everyday task updates into actionable delivery analytics. Identify blockers before they delay deadlines and celebrate team wins.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/auth/signup" className="btn-primary px-6 py-3.5 text-base">
              START FREE TRIAL <ArrowRight size={16} />
            </Link>
            <Link to="/features" className="btn-secondary px-6 py-3.5 text-base">
              SEE ALL FEATURES
            </Link>
          </div>
        </div>
      </section>

      {/* ── High-Level KPI Strip ───────────────────────────────── */}
      <section className="px-6 lg:px-12 py-12 bg-surface border-y-2 border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'COMPLETION VELOCITY', val: '87%', note: 'Average sprint completion rate' },
            { label: 'CYCLE TIME', val: '2.4d', note: 'Average duration in progress' },
            { label: 'RESOLVED ON TIME', val: '94%', note: 'Delivered before due dates' },
            { label: 'ACTIVE WORKLOAD', val: '4.1', note: 'Average tasks per member' }
          ].map(kpi => (
            <div key={kpi.label} className="p-6 bg-background border-2 border-border rounded shadow-brutal-sm">
              <p className="text-label text-ink-muted mb-2">{kpi.label}</p>
              <p className="font-display font-bold text-ink text-4xl lg:text-5xl mb-2">{kpi.val}</p>
              <p className="text-meta text-ink-secondary">{kpi.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mock Dashboards ────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-20 max-w-[1400px] mx-auto">
        <div className="mb-12">
          <p className="text-label text-accent mb-2">LIVE INSIGHTS</p>
          <h2 className="font-display font-bold text-ink text-section">
            BUILT-IN DASHBOARD REPORTS
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Chart */}
          <div className="lg:col-span-8 bg-surface border-2 border-border rounded-lg p-6 lg:p-8 shadow-brutal">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b-2 border-border gap-4">
              <div>
                <h3 className="font-display font-bold text-ink text-title">Sprint Burn-down & Velocity</h3>
                <p className="text-meta text-ink-muted">Historical output over the last 8 sprints</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-muted border border-border text-meta font-bold rounded-sm">Sprint 24 (Current)</span>
              </div>
            </div>

            {/* Visual Bar Graph */}
            <div className="space-y-4">
              <div className="h-48 flex items-end gap-3 pt-6">
                {[
                  { sprint: 'S17', height: '45%', tasks: '38' },
                  { sprint: 'S18', height: '60%', tasks: '48' },
                  { sprint: 'S19', height: '55%', tasks: '42' },
                  { sprint: 'S20', height: '75%', tasks: '59' },
                  { sprint: 'S21', height: '70%', tasks: '54' },
                  { sprint: 'S22', height: '85%', tasks: '68' },
                  { sprint: 'S23', height: '80%', tasks: '63' },
                  { sprint: 'S24', height: '95%', tasks: '74', current: true },
                ].map(bar => (
                  <div key={bar.sprint} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className={`w-full rounded-sm transition-all border-2 border-border ${
                        bar.current ? 'bg-accent' : 'bg-muted hover:bg-ink-muted'
                      }`}
                      style={{ height: bar.height }}
                      title={`${bar.tasks} tasks shipped`}
                    />
                    <span className={`text-[11px] font-mono ${bar.current ? 'font-bold text-accent' : 'text-ink-muted'}`}>
                      {bar.sprint}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-meta text-ink-muted pt-4 border-t border-border-light">
                <span>Total tasks shipped: 446</span>
                <span className="text-accent font-bold">▲ +18% QoQ velocity increase</span>
              </div>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface border-2 border-border rounded-lg p-6 shadow-brutal">
              <h3 className="font-display font-bold text-ink text-title mb-4">Workload Distribution</h3>
              <div className="space-y-3">
                {[
                  { name: 'Frontend Squad', pct: 40, color: 'bg-accent' },
                  { name: 'Backend & APIs', pct: 30, color: 'bg-ink' },
                  { name: 'Product & Design', pct: 20, color: 'bg-warning' },
                  { name: 'QA & Infrastructure', pct: 10, color: 'bg-success' },
                ].map(item => (
                  <div key={item.name}>
                    <div className="flex justify-between text-meta font-display font-semibold text-ink mb-1">
                      <span>{item.name}</span>
                      <span>{item.pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border-2 border-border rounded-lg p-6 shadow-brutal">
              <div className="flex items-center gap-3 mb-3 text-accent">
                <Target size={22} />
                <h4 className="font-display font-bold text-ink text-body-lg">Cycle Time Optimization</h4>
              </div>
              <p className="text-body text-ink-secondary leading-relaxed">
                Cards flagged as blocked are highlighted immediately, reducing idle wait time by up to 65%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Analytics Benefits ─────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-t-2 border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: 'Spot Delivery Bottlenecks',
              description: 'Easily see which columns cards spend the most time in. If Review is taking 4 days, reallocate reviewers before deadlines slip.'
            },
            {
              icon: Users,
              title: 'Balanced Team Allocation',
              description: 'Prevent burnout by ensuring tasks are fairly distributed across the squad. Monitor individual workloads without micromanagement.'
            },
            {
              icon: Zap,
              title: 'Stakeholder Readiness',
              description: 'Export clean velocity reports for quarterly reviews, sprint retrospectives, or client billing updates in one click.'
            }
          ].map(feature => (
            <div key={feature.title} className="p-6 bg-background border-2 border-border rounded shadow-brutal">
              <div className="w-12 h-12 bg-surface border-2 border-border rounded flex items-center justify-center text-accent mb-4">
                <feature.icon size={22} />
              </div>
              <h3 className="font-display font-bold text-title text-ink mb-2">{feature.title}</h3>
              <p className="text-body text-ink-secondary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-accent border-t-2 border-border text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-white text-section mb-4 leading-tight">
            ACCELERATE YOUR TEAM’S DELIVERY VELOCITY.
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            Get instant visibility into tasks, deadlines, and member output.
          </p>
          <Link
            to="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-accent border-2 border-white px-8 py-4 rounded-sm font-display font-bold text-base hover:bg-muted transition-colors shadow-brutal"
          >
            START FREE TRIAL <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}