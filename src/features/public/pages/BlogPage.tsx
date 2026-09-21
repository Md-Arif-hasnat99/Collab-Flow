import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Calendar, Tag } from 'lucide-react';
export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  author: string;
  featured?: boolean;
}

export const POSTS: BlogPost[] = [
  {
    title: 'Why We Bet on WebSockets for Sub-100ms Project Management',
    slug: 'websockets-sub-100ms-realtime',
    excerpt: 'Polling intervals of 10 to 30 seconds kill collaborative flow. Here is how we engineered CollabFlow on persistent real-time sockets with optimistic UI reconciliation.',
    tag: 'ENGINEERING',
    date: 'Sep 18, 2026',
    readTime: '6 min read',
    author: 'Arif Hasnat',
    featured: true
  },
  {
    title: 'Death to Status Meetings: The Power of Async Kanban',
    slug: 'async-kanban-vs-status-meetings',
    excerpt: 'How leading software squads run high-velocity sprints without daily 45-minute standups draining engineering momentum.',
    tag: 'WORKFLOW',
    date: 'Sep 12, 2026',
    readTime: '4 min read',
    author: 'Sarah Chen'
  },
  {
    title: 'Architectural Brutalism in Modern Web Applications',
    slug: 'brutalist-design-principles-software',
    excerpt: 'Why bold 2px borders, stark black ink, and high-contrast layouts improve developer focus and visual legibility.',
    tag: 'DESIGN',
    date: 'Aug 29, 2026',
    readTime: '5 min read',
    author: 'Marcus Bell'
  },
  {
    title: 'Zero-Lag Drag and Drop in React with Optimistic State',
    slug: 'zero-lag-drag-and-drop-react',
    excerpt: 'A technical deep-dive into client-side state prediction, rollback strategies on network drops, and seamless multi-cursor sync.',
    tag: 'ENGINEERING',
    date: 'Aug 15, 2026',
    readTime: '8 min read',
    author: 'Priya Patel'
  },
  {
    title: 'Designing Granular RBAC Permissions That Don’t Get in the Way',
    slug: 'designing-rbac-permissions',
    excerpt: 'Balancing security governance with team freedom: how we structured our 5-tier role hierarchy.',
    tag: 'SECURITY',
    date: 'Jul 28, 2026',
    readTime: '5 min read',
    author: 'Arif Hasnat'
  }
];

export default function BlogPage() {
  const featured = POSTS.find(p => p.featured) || POSTS[0];
  const regular = POSTS.filter(p => !p.featured);

  return (
    <div className="w-full">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-label font-display font-bold tracking-wider text-ink uppercase">ENGINEERING & PRODUCT JOURNAL</span>
          </div>
          <h1 className="font-display font-bold text-ink leading-[0.95] tracking-tight mb-6" style={{ fontSize: 'clamp(36px, 6vw, 68px)' }}>
            THE COLLABFLOW<br />
            JOURNAL.
          </h1>
          <p className="text-body-lg text-ink-secondary leading-relaxed mb-8 max-w-2xl">
            Technical breakdowns, product philosophies, and real-time collaboration strategies written by the engineers and designers building CollabFlow.
          </p>
        </div>
      </section>

      {/* ── Featured Post ──────────────────────────────────────── */}
      <section className="px-6 lg:px-12 pb-16 max-w-[1400px] mx-auto">
        <div className="bg-surface border-2 border-border rounded-lg p-8 lg:p-12 shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-accent text-white border border-border px-2.5 py-0.5 text-label font-bold rounded-sm">
              FEATURED STORY
            </span>
            <span className="text-meta text-ink-muted font-mono">{featured.date} • {featured.readTime}</span>
          </div>

          <h2 className="font-display font-bold text-ink text-section mb-4 leading-tight">
            {featured.title}
          </h2>

          <p className="text-body-lg text-ink-secondary mb-6 leading-relaxed max-w-3xl">
            {featured.excerpt}
          </p>

          <div className="flex items-center justify-between pt-6 border-t-2 border-border-light">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent border-2 border-border flex items-center justify-center text-white text-xs font-bold">
                {featured.author[0]}
              </div>
              <span className="font-display font-bold text-ink text-body">{featured.author}</span>
            </div>
            <Link
              to={`/blog/${featured.slug}`}
              className="inline-flex items-center gap-1 font-display font-bold text-accent text-body hover:underline"
            >
              Read Article <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Articles Grid ──────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-y-2 border-border">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <p className="text-label text-accent mb-2">ARCHIVE</p>
            <h2 className="font-display font-bold text-ink text-section">
              ALL DISPATCHES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regular.map(post => (
              <div
                key={post.slug}
                className="bg-background border-2 border-border p-6 rounded-lg shadow-brutal flex flex-col justify-between hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-label text-ink bg-surface border border-border px-2 py-0.5 rounded-sm">
                      {post.tag}
                    </span>
                    <span className="text-meta text-ink-muted font-mono">{post.readTime}</span>
                  </div>
                  <h3 className="font-display font-bold text-ink text-title mb-3 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-body text-ink-secondary mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-border-light">
                  <span className="text-meta text-ink-muted font-mono">{post.date}</span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-accent font-display font-bold text-meta inline-flex items-center gap-1 hover:underline"
                  >
                    Read story <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter Subscribe ───────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-accent text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display font-bold text-white text-section mb-4 leading-tight">
            STAY IN THE REAL-TIME LOOP.
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            Get our monthly engineering and product dispatches right to your inbox. No spam.
          </p>
          <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="engineer@company.com"
              className="flex-1 px-4 py-3.5 bg-white text-ink border-2 border-white rounded-sm font-sans text-body focus:outline-none placeholder:text-ink-muted"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-ink text-surface border-2 border-ink rounded-sm font-display font-bold text-base hover:bg-black transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}