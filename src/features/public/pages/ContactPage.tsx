import { useState } from 'react';
import { Mail, MessageSquare, Building, Send, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'Sales',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">CONTACT US</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-6" style={{ fontSize: 'clamp(36px, 6vw, 68px)' }}>
            WE’D LOVE TO<br />
            HEAR FROM YOU.
          </h1>
          <p className="text-body-lg text-ink-secondary leading-relaxed max-w-2xl">
            Have questions about enterprise deployments, pricing tiers, feature requests, or technical support? Drop us a note and a human will respond within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Contact Details & Form Grid ─────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-y-2 border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Cards */}
          <div className="lg:col-span-5 space-y-6">
            {[
              {
                icon: MessageSquare,
                title: 'Customer Support',
                desc: 'Facing a bug or need setup assistance? Our engineering team answers directly.',
                contact: 'support@collabflow.app'
              },
              {
                icon: Building,
                title: 'Sales & Enterprise',
                desc: 'Custom invoicing, SAML SSO integration, and bespoke SLAs for larger organizations.',
                contact: 'sales@collabflow.app'
              },
              {
                icon: Mail,
                title: 'General & Media',
                desc: 'Partnerships, press inquiries, and community sponsorships.',
                contact: 'hello@collabflow.app'
              }
            ].map(ch => (
              <div key={ch.title} className="p-6 bg-background border-2 border-border rounded shadow-brutal flex items-start gap-4">
                <div className="w-10 h-10 bg-surface border-2 border-border rounded flex items-center justify-center text-accent flex-shrink-0">
                  <ch.icon size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-ink text-body-lg mb-1">{ch.title}</h3>
                  <p className="text-body text-ink-secondary mb-2">{ch.desc}</p>
                  <a href={`mailto:${ch.contact}`} className="font-mono text-meta font-bold text-accent hover:underline">
                    {ch.contact}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-background border-2 border-border rounded-lg p-8 shadow-brutal">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-success-light border-2 border-border text-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display font-bold text-ink text-section">MESSAGE RECEIVED</h3>
                <p className="text-body-lg text-ink-secondary max-w-md mx-auto">
                  Thank you for contacting CollabFlow, {form.name}! One of our squad members will reply to <span className="font-mono font-bold text-ink">{form.email}</span> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', category: 'Sales', message: '' });
                  }}
                  className="btn-secondary mt-6"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-ink text-title mb-1">SEND US A MESSAGE</h3>
                  <p className="text-meta text-ink-muted">Fill in your details below and our team will get back to you.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label text-ink-secondary mb-2">YOUR NAME *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alex Rivera"
                      className="w-full bg-surface border-2 border-border p-3 rounded-sm font-sans text-body text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-label text-ink-secondary mb-2">WORK EMAIL *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full bg-surface border-2 border-border p-3 rounded-sm font-sans text-body text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-label text-ink-secondary mb-2">TOPIC</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-surface border-2 border-border p-3 rounded-sm font-sans text-body text-ink focus:outline-none focus:border-accent"
                  >
                    <option value="Sales">Sales & Enterprise Pricing</option>
                    <option value="Support">Technical Support</option>
                    <option value="Billing">Billing & Account Questions</option>
                    <option value="Partnership">Partnerships & Integrations</option>
                    <option value="Other">Other Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-label text-ink-secondary mb-2">MESSAGE *</label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your team and how we can help..."
                    className="w-full bg-surface border-2 border-border p-3 rounded-sm font-sans text-body text-ink focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-base font-display font-bold shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                >
                  <Send size={16} /> SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-accent text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-white text-section mb-4 leading-tight">
            LOOKING TO EXPLORE THE APP FIRST?
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            You can create a free workspace immediately with zero obligations.
          </p>
          <a
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-accent border-2 border-white px-8 py-4 rounded-sm font-display font-bold text-base hover:bg-muted transition-colors shadow-brutal"
          >
            GET STARTED FREE <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}