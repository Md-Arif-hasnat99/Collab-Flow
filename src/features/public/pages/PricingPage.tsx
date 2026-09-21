import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const TIERS = [
    {
      name: 'STARTER',
      tagline: 'Ideal for small squads and early prototypes.',
      price: '$0',
      period: 'forever',
      buttonText: 'START FREE',
      buttonLink: '/auth/signup',
      highlighted: false,
      features: [
        'Up to 5 team members',
        '3 active Kanban boards',
        'Unlimited tasks & checklists',
        'Real-time WebSocket board sync',
        '7 days activity audit logs',
        'Community forum support'
      ]
    },
    {
      name: 'PRO',
      tagline: 'Built for fast-moving startups and product squads.',
      price: annual ? '$10' : '$12',
      period: '/user/month',
      buttonText: 'GET STARTED WITH PRO',
      buttonLink: '/auth/signup',
      highlighted: true,
      features: [
        'Unlimited team members',
        'Unlimited projects & boards',
        'Real-time channel chat',
        'Sprint burn-down & velocity analytics',
        '90 days activity audit logs',
        'Custom invite links with expiration',
        'Priority email & chat support'
      ]
    },
    {
      name: 'ENTERPRISE',
      tagline: 'For organizations with strict governance and security.',
      price: annual ? '$24' : '$29',
      period: '/user/month',
      buttonText: 'CONTACT SALES',
      buttonLink: '/contact',
      highlighted: false,
      features: [
        'Everything in Pro, plus:',
        'Granular 5-tier RBAC permissions',
        'Unlimited tamper-proof audit history',
        'SAML Single Sign-On (SSO)',
        '99.99% uptime SLA guarantee',
        'Dedicated customer success manager',
        'Custom invoice billing'
      ]
    }
  ];

  return (
    <div className="w-full">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-[1400px] mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">TRANSPARENT PLANS</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-6" style={{ fontSize: 'clamp(36px, 6vw, 68px)' }}>
            SIMPLE PRICING.<br />
            NO HIDDEN SURPRISES.
          </h1>
          <p className="text-body-lg text-ink-secondary leading-relaxed mb-8">
            Choose the plan that matches your team’s scale. Upgrade, downgrade, or cancel anytime with zero lock-in.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-surface border-2 border-border rounded shadow-brutal-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 font-display font-bold text-meta rounded-sm transition-colors ${
                !annual ? 'bg-ink text-surface' : 'text-ink-secondary hover:text-ink'
              }`}
            >
              MONTHLY BILLING
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 font-display font-bold text-meta rounded-sm transition-colors flex items-center gap-2 ${
                annual ? 'bg-accent text-white' : 'text-ink-secondary hover:text-ink'
              }`}
            >
              <span>ANNUAL BILLING</span>
              <span className="bg-white text-accent px-1.5 py-0.5 rounded text-[10px] font-bold">SAVE 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ──────────────────────────────────────── */}
      <section className="px-6 lg:px-12 pb-20 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TIERS.map(tier => (
            <div
              key={tier.name}
              className={`relative bg-surface border-2 border-border p-8 rounded-lg flex flex-col justify-between transition-all ${
                tier.highlighted
                  ? 'shadow-[0_8px_0_#FF6B35] -translate-y-2 border-accent'
                  : 'shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-white border-2 border-border px-3 py-0.5 text-label rounded-sm font-display font-bold">
                  MOST POPULAR
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-title text-ink">{tier.name}</h3>
                </div>
                <p className="text-body text-ink-secondary mb-6 min-h-[44px]">{tier.tagline}</p>

                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b-2 border-border-light">
                  <span className="font-display font-bold text-5xl text-ink">{tier.price}</span>
                  <span className="text-meta text-ink-muted">{tier.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-body font-display text-ink">
                      <Check size={18} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={tier.buttonLink}
                className={`w-full py-3.5 text-center font-display font-bold rounded-sm border-2 border-border transition-all ${
                  tier.highlighted
                    ? 'bg-accent text-white hover:bg-accent-hover shadow-brutal'
                    : 'bg-background text-ink hover:bg-muted'
                }`}
              >
                {tier.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-20 bg-surface border-t-2 border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-label text-accent mb-2">PRICING QUESTIONS</p>
            <h2 className="font-display font-bold text-ink text-section">
              COMMON INQUIRIES
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit and debit cards (Visa, MasterCard, American Express). For Enterprise annual contracts, we also support bank wire transfers and invoicing.'
              },
              {
                q: 'Can I change my plan later?',
                a: 'Yes, you can upgrade or downgrade at any time from your Workspace Settings. Prorated credits will automatically be applied to your next billing cycle.'
              },
              {
                q: 'Do you offer non-profit or educational discounts?',
                a: 'Yes! We offer a 50% discount on Pro plans for verified non-profit organizations, students, and open-source core maintainers. Contact our support team to apply.'
              },
              {
                q: 'Is there a free trial for Pro?',
                a: 'Yes, every new workspace can activate a 14-day free trial of Pro with full feature access and no credit card required upfront.'
              }
            ].map(item => (
              <div key={item.q} className="bg-background border-2 border-border p-6 rounded shadow-brutal-sm">
                <h3 className="font-display font-bold text-ink text-title mb-2 flex items-center gap-2">
                  <HelpCircle size={18} className="text-accent flex-shrink-0" />
                  {item.q}
                </h3>
                <p className="text-body text-ink-secondary leading-relaxed pl-6">
                  {item.a}
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
            READY TO SUPERCHARGE YOUR TEAM?
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            Get started in less than a minute. No credit card required.
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