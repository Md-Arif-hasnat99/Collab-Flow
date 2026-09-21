import { Link } from 'react-router-dom';
import { 
  Zap, 
  Eye, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  Globe2, 
  Award, 
  HeartHandshake 
} from 'lucide-react';

const VALUES = [
  {
    icon: Zap,
    title: 'SPEED IS A FEATURE',
    description: 'We measure performance in milliseconds, not seconds. If an interface needs a loading spinner for a local action, we rewrite it.'
  },
  {
    icon: Eye,
    title: 'HIGH-CONTRAST FOCUS',
    description: 'Modern software is drowning in subtle pastels and low contrast. Our brutalist aesthetic provides unambiguous borders and stark readability.'
  },
  {
    icon: Flame,
    title: 'REAL-TIME BY DEFAULT',
    description: 'Work happens simultaneously across distributed teams. Every board, chat, and task change syncs across the globe via persistent WebSockets.'
  },
  {
    icon: ShieldCheck,
    title: 'COMPLETE TRANSPARENCY',
    description: 'Clear ownership, tamper-resistant audit logs, and granular access controls ensure everyone knows who is building what.'
  }
];

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">ABOUT COLLABFLOW</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-6" style={{ fontSize: 'clamp(36px, 6vw, 68px)' }}>
            WE BUILD FOR<br />
            TEAMS TIRED OF<br />
            CLUNKY SOFTWARE.
          </h1>
          <p className="text-body-lg text-ink-secondary leading-relaxed mb-8 max-w-2xl">
            CollabFlow was born out of frustration with bloated, sluggish enterprise tools that turn everyday task updates into a bureaucratic chore. We stripped away the bloat and kept what truly matters: velocity, clarity, and real-time collaboration.
          </p>
        </div>
      </section>

      {/* ── Numbers Strip ──────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-12 bg-surface border-y-2 border-border">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'ACTIVE WORKSPACES', val: '500+' },
            { label: 'TASKS COMPLETED', val: '120K+' },
            { label: 'GLOBAL UPTIME', val: '99.98%' },
            { label: 'SYNC LATENCY', val: '<100ms' }
          ].map(stat => (
            <div key={stat.label} className="p-6 bg-background border-2 border-border rounded shadow-brutal-sm text-center">
              <p className="font-display font-bold text-ink text-4xl lg:text-5xl mb-2">{stat.val}</p>
              <p className="text-label text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Philosophy ─────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-20 max-w-[1400px] mx-auto">
        <div className="mb-12">
          <p className="text-label text-accent mb-2">OUR PRINCIPLES</p>
          <h2 className="font-display font-bold text-ink text-section">
            WHAT WE BELIEVE IN
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VALUES.map(val => (
            <div key={val.title} className="p-8 bg-surface border-2 border-border rounded-lg shadow-brutal flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-background border-2 border-border rounded flex items-center justify-center text-accent mb-6">
                  <val.icon size={24} />
                </div>
                <h3 className="font-display font-bold text-title text-ink mb-3">{val.title}</h3>
                <p className="text-body text-ink-secondary leading-relaxed">{val.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story Narrative ────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-20 bg-surface border-y-2 border-border">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-label text-accent">THE ORIGIN STORY</p>
          <h2 className="font-display font-bold text-ink text-section leading-tight">
            WHY BRUTALISM?
          </h2>
          <div className="space-y-4 text-body-lg text-ink-secondary leading-relaxed">
            <p>
              In recent years, productivity software went in a strange direction. Interfaces filled with pastel gradients, tiny text, and hidden menu drawers. Moving a card took four clicks and a 2-second spinner.
            </p>
            <p>
              We took inspiration from classical Architectural Brutalism — raw materials, honest construction, and radical functionality. In software, this means 2px high-contrast borders, bold typography, instant keyboard shortcuts, and zero latency.
            </p>
            <p>
              Today, thousands of developers, designers, and project managers rely on CollabFlow every morning to ship work with precision and joy.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-accent text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-white text-section mb-4 leading-tight">
            JOIN TEAMS BUILDING THE FUTURE.
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            Start collaborating with speed, clarity, and purpose.
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