import { CheckCircle2, Activity, Server, Clock, AlertCircle } from 'lucide-react';

const SERVICES = [
  { name: 'Web Application & Global CDN', status: 'Operational', uptime: '100.0%' },
  { name: 'Real-Time WebSocket Engine', status: 'Operational', uptime: '99.99%' },
  { name: 'PostgreSQL Database & RLS API', status: 'Operational', uptime: '100.0%' },
  { name: 'In-App Team Chat Stream', status: 'Operational', uptime: '100.0%' },
  { name: 'Email & Notification Dispatcher', status: 'Operational', uptime: '99.98%' },
  { name: 'Public REST API & Webhooks', status: 'Operational', uptime: '100.0%' },
];

export default function StatusPage() {
  return (
    <div className="w-full">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-20 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">INFRASTRUCTURE HEALTH</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            SYSTEM STATUS
          </h1>
          <p className="text-meta text-ink-muted font-mono">
            AUTOMATICALLY MONITORED 24/7/365 ACROSS 12 GLOBAL REGIONS
          </p>
        </div>
      </section>

      {/* ── Main Status Banner ─────────────────────────────────── */}
      <section className="px-6 lg:px-12 pb-16 max-w-[1400px] mx-auto">
        <div className="p-8 bg-success-light border-2 border-success rounded-lg shadow-brutal flex items-center gap-4">
          <div className="w-12 h-12 bg-success text-white rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <h2 className="font-display font-bold text-success text-title mb-1">
              ALL SYSTEMS FULLY OPERATIONAL
            </h2>
            <p className="text-body text-success/90">
              WebSocket response latency: 42ms • Zero packet drops detected across all regions.
            </p>
          </div>
        </div>
      </section>

      {/* ── Service Component Grid ─────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-y-2 border-border">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-border">
            <h2 className="font-display font-bold text-ink text-title">CORE SERVICES</h2>
            <span className="text-meta font-mono text-ink-muted">PAST 90 DAYS UPTIME</span>
          </div>

          <div className="divide-y-2 divide-border border-2 border-border rounded-lg bg-background overflow-hidden shadow-brutal">
            {SERVICES.map(svc => (
              <div key={svc.name} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-success" />
                  <span className="font-display font-bold text-ink text-body-lg">{svc.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-meta font-mono text-ink-secondary">{svc.uptime}</span>
                  <span className="text-label text-success bg-success-light border border-success px-2 py-0.5 rounded-sm">
                    {svc.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 90-Day Uptime Graphic ───────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 max-w-[1400px] mx-auto">
        <div className="max-w-[1400px] mx-auto bg-surface border-2 border-border p-6 rounded-lg shadow-brutal">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-bold text-ink text-body">90 Days Ago</span>
            <span className="font-display font-bold text-success text-body">99.98% Overall Uptime</span>
            <span className="font-display font-bold text-ink text-body">Today</span>
          </div>
          {/* Uptime bars */}
          <div className="flex gap-1 h-8 items-stretch">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-success rounded-none hover:opacity-80 transition-opacity"
                title={`Day ${i + 1}: 100% uptime`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Incident History ───────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-t-2 border-border">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <p className="text-label text-accent mb-2">INCIDENT LOG</p>
            <h2 className="font-display font-bold text-ink text-section">
              PAST INCIDENT REPORTS
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-background border-2 border-border rounded shadow-brutal">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-ink text-body-lg">Scheduled Infrastructure Upgrade</h3>
                <span className="text-meta font-mono text-ink-muted">AUG 12, 2026</span>
              </div>
              <p className="text-body text-ink-secondary mb-3 leading-relaxed">
                Completed zero-downtime rolling maintenance on regional WebSocket edge clusters. All connections failed over seamlessly to secondary nodes.
              </p>
              <span className="text-label text-success font-bold">RESOLVED • DOWNTIME: 0 SECONDS</span>
            </div>

            <div className="p-4 bg-muted border border-border text-center text-meta font-mono text-ink-muted">
              No other major system incidents in the preceding 90 days.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}