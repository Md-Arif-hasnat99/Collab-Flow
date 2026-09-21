import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="w-full">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-20 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">LEGAL & COMPLIANCE</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            PRIVACY POLICY
          </h1>
          <p className="text-meta text-ink-muted font-mono">
            LAST REVISED: SEPTEMBER 2026 • VERSION 2.4
          </p>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-y-2 border-border">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Summary Box */}
          <div className="p-6 bg-background border-2 border-border rounded shadow-brutal">
            <h3 className="font-display font-bold text-ink text-title mb-2 flex items-center gap-2">
              <Shield size={20} className="text-accent" /> THE SHORT VERSION
            </h3>
            <p className="text-body text-ink-secondary leading-relaxed">
              Your team owns 100% of your workspace data, boards, tasks, and discussions. We never sell your data to advertisers, we do not train third-party public AI models on your private tasks, and you can export or delete your workspace at any time.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-ink text-section">1. Information We Collect</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              When you sign up for CollabFlow, we collect basic account identifiers such as your name, email address, password hash, and organization details. When you use the platform, we store the board content, tasks, column headers, comments, and messages you create in order to sync them in real time across your team.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-ink text-section">2. How We Use Your Information</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              We process your data exclusively to deliver the CollabFlow service:
            </p>
            <ul className="space-y-2">
              {[
                'Broadcasting real-time board updates via secure WebSockets to authorized team members',
                'Authenticating users and enforcing workspace role-based access control (RBAC)',
                'Generating sprint velocity and completion analytics within your workspace',
                'Delivering customer support responses and critical security alerts'
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-body text-ink">
                  <CheckCircle2 size={16} className="text-accent mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-ink text-section">3. Data Security & Storage</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              All communications between your browser and our servers use TLS 1.3 encryption. At rest, data is stored in audited data centers with AES-256 encryption. Our database implements strict PostgreSQL Row-Level Security (RLS), ensuring no organization can query another organization’s data.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-ink text-section">4. Data Retention & Deletion</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              You maintain total control. When a workspace Owner triggers workspace deletion, all associated projects, boards, cards, and messages are permanently purged from active databases immediately, and destroyed across automated rolling backups within 30 days.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-ink text-section">5. Your GDPR and CCPA Rights</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              Regardless of your geographic jurisdiction, CollabFlow honors the right to data portability (JSON export), the right to rectification, and the right to erasure (&quot;Right to be Forgotten&quot;).
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t-2 border-border-light">
            <h2 className="font-display font-bold text-ink text-section">6. Contact Our Privacy Office</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              If you have questions, data subject requests, or security vulnerability disclosures, reach out directly to our Data Protection Officer at:
            </p>
            <div className="p-4 bg-background border-2 border-border rounded font-mono text-meta font-bold text-accent">
              privacy@collabflow.app
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}