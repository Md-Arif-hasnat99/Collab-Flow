import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Laptop, 
  DollarSign, 
  Plane, 
  Coffee 
} from 'lucide-react';

const PERKS = [
  {
    icon: Laptop,
    title: 'WORK FROM ANYWHERE',
    desc: 'We are 100% remote and async-first. We judge output, focus, and collaboration, not hours seated in an office chair.'
  },
  {
    icon: DollarSign,
    title: 'COMPETITIVE EQUITY & PAY',
    desc: 'Top 10% market compensation benchmarks, early employee equity packages, and annual cost-of-living adjustments.'
  },
  {
    icon: Coffee,
    title: '$3,000 GEAR STIPEND',
    desc: 'Receive a dedicated hardware and home workspace setup budget upon joining, refreshed every two years.'
  },
  {
    icon: Plane,
    title: 'ANNUAL GLOBAL RETREATS',
    desc: 'Twice a year we bring the entire company together to strategize, hack on wild ideas, and enjoy great food.'
  }
];

const ROLES = [
  {
    title: 'Senior Frontend Engineer (React & Real-Time)',
    department: 'Engineering',
    location: 'Remote (Worldwide)',
    type: 'Full-time',
    description: 'Lead client performance optimization, drag-and-drop mechanics, and WebSocket state management in React 18 & TypeScript.'
  },
  {
    title: 'Backend Systems & Database Engineer',
    department: 'Infrastructure',
    location: 'Remote (Worldwide)',
    type: 'Full-time',
    description: 'Scale our PostgreSQL database, optimize row-level security (RLS) policies, and tune WebSocket connection brokers for millions of events.'
  },
  {
    title: 'Senior Product Designer (Brutalist UI)',
    department: 'Design',
    location: 'Remote (US / Europe / UTC±5)',
    type: 'Full-time',
    description: 'Shape the next generation of our design system. Champion high-contrast brutalist aesthetics, keyboard interactions, and information hierarchy.'
  },
  {
    title: 'Developer Advocate & Technical Writer',
    department: 'Growth',
    location: 'Remote (Worldwide)',
    type: 'Full-time',
    description: 'Craft in-depth engineering breakdowns, tutorials, demo repositories, and represent CollabFlow in technical developer communities.'
  }
];

export default function CareersPage() {
  return (
    <div className="w-full">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">WE’RE HIRING</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-6" style={{ fontSize: 'clamp(36px, 6vw, 68px)' }}>
            BUILD TOOLS THAT<br />
            ELEVATE HUMAN<br />
            COLLABORATION.
          </h1>
          <p className="text-body-lg text-ink-secondary leading-relaxed mb-8 max-w-2xl">
            Join a small, passionate team of craftspeople building high-performance project management tools for the world’s most ambitious teams.
          </p>
        </div>
      </section>

      {/* ── Perks Strip ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-y-2 border-border">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <p className="text-label text-accent mb-2">HOW WE WORK</p>
            <h2 className="font-display font-bold text-ink text-section">
              CULTURE & BENEFITS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERKS.map(p => (
              <div key={p.title} className="p-6 bg-background border-2 border-border rounded shadow-brutal flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-surface border-2 border-border rounded flex items-center justify-center text-accent mb-4">
                    <p.icon size={22} />
                  </div>
                  <h3 className="font-display font-bold text-title text-ink mb-2">{p.title}</h3>
                  <p className="text-body text-ink-secondary leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Positions ─────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-20 max-w-[1400px] mx-auto">
        <div className="mb-12">
          <p className="text-label text-accent mb-2">OPPORTUNITIES</p>
          <h2 className="font-display font-bold text-ink text-section">
            OPEN ROLES ({ROLES.length})
          </h2>
        </div>

        <div className="space-y-6">
          {ROLES.map(role => (
            <div
              key={role.title}
              className="p-6 lg:p-8 bg-surface border-2 border-border rounded-lg shadow-brutal flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-accent text-white border border-border px-2.5 py-0.5 text-label font-bold rounded-sm">
                    {role.department}
                  </span>
                  <span className="text-meta text-ink-secondary font-mono flex items-center gap-1">
                    <MapPin size={12} /> {role.location}
                  </span>
                  <span className="text-meta text-ink-muted font-mono">• {role.type}</span>
                </div>
                <h3 className="font-display font-bold text-title text-ink mb-2">{role.title}</h3>
                <p className="text-body text-ink-secondary leading-relaxed">{role.description}</p>
              </div>

              <a
                href="mailto:careers@collabflow.app?subject=Application for Senior Role"
                className="btn-primary py-3 px-6 text-center font-display font-bold text-meta flex items-center justify-center gap-2 flex-shrink-0"
              >
                APPLY NOW <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Application Process ────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-t-2 border-border">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-label text-accent">OUR HIRING STANDARD</p>
          <h2 className="font-display font-bold text-ink text-section">
            RESPECTFUL & TRANSPARENT INTERVIEWS
          </h2>
          <p className="text-body-lg text-ink-secondary leading-relaxed">
            We don’t do 8-round marathons or whiteboard Leetcode trick questions. Our process is simple: an initial intro chat, a paid real-world project, and an architectural deep-dive with your future teammates.
          </p>
        </div>
      </section>
    </div>
  );
}