import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, Share2, CheckCircle2 } from 'lucide-react';
import { POSTS } from './BlogPage';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="px-6 lg:px-12 py-24 max-w-[1400px] mx-auto text-center">
        <div className="max-w-md mx-auto p-8 bg-surface border-2 border-border rounded-lg shadow-brutal">
          <p className="text-label text-accent mb-2">404 — NOT FOUND</p>
          <h1 className="font-display font-bold text-ink text-section mb-4">ARTICLE NOT FOUND</h1>
          <p className="text-body text-ink-secondary mb-6">
            The article you are looking for does not exist or may have been moved.
          </p>
          <Link to="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} /> RETURN TO BLOG
          </Link>
        </div>
      </div>
    );
  }

  // Related posts (other than current)
  const related = POSTS.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <div className="w-full">
      {/* ── Article Header ──────────────────────────────────────── */}
      <section className="px-6 lg:px-12 pt-12 pb-16 max-w-[1000px] mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-meta font-display font-bold text-ink-secondary hover:text-ink mb-8 group transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO ALL ARTICLES
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="bg-accent text-white border border-border px-2.5 py-0.5 text-label font-bold rounded-sm">
            {post.tag}
          </span>
          <span className="text-meta text-ink-muted font-mono flex items-center gap-1.5">
            <Calendar size={13} /> {post.date}
          </span>
          <span className="text-meta text-ink-muted font-mono flex items-center gap-1.5">
            <Clock size={13} /> {post.readTime}
          </span>
        </div>

        <h1
          className="font-display font-bold text-ink leading-[1.0] tracking-tight mb-8"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          {post.title}
        </h1>

        {/* Author bar */}
        <div className="flex items-center justify-between pb-8 border-b-2 border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent border-2 border-border flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {post.author[0]}
            </div>
            <div>
              <div className="font-display font-bold text-ink text-body">{post.author}</div>
              <div className="text-meta text-ink-muted">Core Team @ CollabFlow</div>
            </div>
          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            className="btn-secondary py-2 px-3 text-meta flex items-center gap-1.5"
            title="Share article"
          >
            <Share2 size={14} /> SHARE
          </button>
        </div>
      </section>

      {/* ── Article Content Body ───────────────────────────────── */}
      <section className="px-6 lg:px-12 pb-20 max-w-[1000px] mx-auto">
        <div className="prose prose-neutral max-w-none text-body-lg text-ink-secondary leading-relaxed space-y-6">
          <p className="text-xl font-display font-semibold text-ink leading-relaxed border-l-4 border-accent pl-4 py-1">
            {post.excerpt}
          </p>

          <p>
            When we set out to build CollabFlow, our primary conviction was that modern productivity tools have sacrificed raw performance for unnecessary visual ornamentation. In a distributed engineering organization, waiting multiple seconds for a board column to refresh or an assignee to update fragments attention and builds quiet resentment.
          </p>

          <h2 className="font-display font-bold text-ink text-section pt-6 pb-2">
            The Latency Paradox in Team Coordination
          </h2>

          <p>
            Traditional SaaS architectures lean heavily on periodic polling or heavy HTTP GraphQL mutations. While functionally adequate for sporadic updates, this paradigm fails completely when four engineers and two designers are actively organizing a sprint backlog simultaneously.
          </p>

          <div className="bg-surface border-2 border-border p-6 rounded-lg shadow-brutal my-8">
            <h3 className="font-display font-bold text-ink text-title mb-3">KEY PRINCIPLES OF REAL-TIME VELOCITY</h3>
            <ul className="space-y-3">
              {[
                'Persistent WebSockets ensure delta messages arrive within 40-80ms globally.',
                'Optimistic UI state renders immediately locally before server acknowledgement.',
                'PostgreSQL Row-Level Security validates permissions directly in the database layer.',
                'Conflict resolution resolves to the latest timestamp with non-destructive merge.'
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-body font-display text-ink">
                  <CheckCircle2 size={18} className="text-accent flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <h2 className="font-display font-bold text-ink text-section pt-6 pb-2">
            Why High-Contrast Brutalism Enhances Cognitive Focus
          </h2>

          <p>
            Visual noise directly impairs information processing. By using strict 2px high-contrast borders, bold monospace metadata, and intentional color coding for urgency levels, CollabFlow makes status transitions unmistakable. You can glance at a screen from across the room and immediately identify what is blocked and what is shipped.
          </p>

          <p>
            As teams grow, clarity becomes your greatest competitive advantage. We will continue refining every millisecond of this experience.
          </p>
        </div>

        {/* Author Bio Box */}
        <div className="mt-16 p-6 bg-surface border-2 border-border rounded-lg shadow-brutal flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent border-2 border-border flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {post.author[0]}
          </div>
          <div>
            <div className="font-display font-bold text-ink text-body-lg mb-1">{post.author}</div>
            <p className="text-meta text-ink-secondary">
              Building next-generation real-time collaboration architecture at CollabFlow. Writing about distributed systems, UI ergonomics, and async delivery.
            </p>
          </div>
        </div>
      </section>

      {/* ── Related Dispatches ─────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 bg-surface border-t-2 border-border">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display font-bold text-ink text-title">MORE DISPATCHES</h2>
            <Link to="/blog" className="text-meta font-display font-bold text-accent hover:underline">
              VIEW ALL ARTICLES →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map(r => (
              <div key={r.slug} className="p-6 bg-background border-2 border-border rounded-lg shadow-brutal flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-label text-ink bg-surface border border-border px-2 py-0.5 rounded-sm">
                      {r.tag}
                    </span>
                    <span className="text-meta text-ink-muted font-mono">{r.readTime}</span>
                  </div>
                  <h3 className="font-display font-bold text-ink text-title mb-2">{r.title}</h3>
                  <p className="text-body text-ink-secondary mb-4 leading-relaxed">{r.excerpt}</p>
                </div>
                <Link
                  to={`/blog/${r.slug}`}
                  className="text-accent font-display font-bold text-meta inline-flex items-center gap-1 hover:underline pt-4 border-t-2 border-border-light"
                >
                  Read story <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
