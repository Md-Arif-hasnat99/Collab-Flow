import { FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="w-full">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-20 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">TERMS OF SERVICE</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
            TERMS OF SERVICE
          </h1>
          <p className="text-meta text-ink-muted font-mono">
            LAST MODIFIED: SEPTEMBER 2026 • VERSION 2.1
          </p>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-y-2 border-border">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Summary Box */}
          <div className="p-6 bg-background border-2 border-border rounded shadow-brutal">
            <h3 className="font-display font-bold text-ink text-title mb-2 flex items-center gap-2">
              <FileText size={20} className="text-accent" /> SUMMARY OF TERMS
            </h3>
            <p className="text-body text-ink-secondary leading-relaxed">
              By accessing or using CollabFlow, you agree to these Terms. You are responsible for safeguarding your login credentials and for all activities conducted within your workspace.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-ink text-section">1. Acceptance of Terms</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              These Terms of Service govern your access to and use of the CollabFlow web application, APIs, and associated services. By registering an account or accepting an invitation to a workspace, you represent that you have read, understood, and agreed to be bound by these Terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-ink text-section">2. Workspace Administration & Roles</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              The creator of a workspace is designated as the primary Owner. Owners may invite Admins, Project Managers, Members, and Viewers. The workspace Owner maintains sole authority over workspace deletion, plan tier upgrades, and billing management.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-ink text-section">3. Acceptable Use Policy</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              You agree not to misuse the CollabFlow platform. Prohibited activities include:
            </p>
            <ul className="space-y-2">
              {[
                'Attempting to probe, scan, or breach system vulnerabilities without explicit authorization',
                'Transmitting spam, malicious scripts, automated scrapers, or illegal materials',
                'Circumventing workspace billing limits or reverse engineering the real-time engine',
                'Impersonating other team members or third parties'
              ].map(rule => (
                <li key={rule} className="flex items-start gap-3 text-body text-ink">
                  <CheckCircle2 size={16} className="text-accent mt-1 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-ink text-section">4. Subscriptions, Fees & Cancellations</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              Paid plans are billed in advance on a recurring monthly or annual basis. You may cancel your subscription at any time via Workspace Settings. Upon cancellation, your workspace remains fully functional on the paid tier until the conclusion of the current prepaid billing period.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-ink text-section">5. Intellectual Property & User Content</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              You retain all right, title, and interest in and to any tasks, files, messages, or text uploaded to your workspace. CollabFlow does not claim ownership over any user-created materials.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-ink text-section">6. Disclaimer & Limitation of Liability</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              Except as explicitly stated in an active Enterprise SLA agreement, CollabFlow is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. In no event shall CollabFlow be liable for any indirect, incidental, special, or consequential damages arising out of your use of the platform.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t-2 border-border-light">
            <h2 className="font-display font-bold text-ink text-section">7. Legal Inquiries</h2>
            <p className="text-body text-ink-secondary leading-relaxed">
              For legal questions or formal notices, reach out to our legal department at:
            </p>
            <div className="p-4 bg-background border-2 border-border rounded font-mono text-meta font-bold text-accent">
              legal@collabflow.app
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}