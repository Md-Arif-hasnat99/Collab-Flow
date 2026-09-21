import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background border-b-2 border-border transition-shadow duration-150 ${scrolled ? 'shadow-card' : ''}`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-accent border-2 border-border flex items-center justify-center rounded-sm">
              <span className="text-white font-display font-bold text-xs">CF</span>
            </div>
            <span className="font-display font-bold text-body-lg text-ink tracking-tight">COLLABFLOW</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Analytics', 'About'].map(item => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-meta font-display font-semibold tracking-widest uppercase text-ink-secondary hover:text-ink transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to="/app/dashboard" className="btn-primary text-sm px-4 py-2">
                Go to App <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className="btn-secondary text-sm px-4 py-2">
                  Log in
                </Link>
                <Link to="/auth/signup" className="btn-primary text-sm px-4 py-2">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden btn-icon -mr-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t-2 border-border bg-surface p-6 animate-fade-in">
          <nav className="flex flex-col gap-4 mb-6">
            {['Features', 'How It Works', 'Analytics', 'About'].map(item => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-body font-display font-bold text-ink"
                onClick={() => setOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            {user ? (
              <Link to="/app/dashboard" className="btn-primary justify-center">
                Go to App
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className="btn-secondary justify-center text-center">
                  Log in
                </Link>
                <Link to="/auth/signup" className="btn-primary justify-center text-center">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const footerLinks = [
    {
      heading: 'Product',
      links: [
        { label: 'Features', to: '/features' },
        { label: 'How it works', to: '/how-it-works' },
        { label: 'Analytics', to: '/analytics-info' },
        { label: 'Pricing', to: '/pricing' }
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Blog', to: '/blog' },
        { label: 'Careers', to: '/careers' }
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Documentation', to: '/documentation' },
        { label: 'Privacy', to: '/privacy' },
        { label: 'Terms', to: '/terms' },
        { label: 'Status', to: '/status' }
      ],
    },
  ];

  return (
    <footer className="bg-ink text-surface py-16 px-6 lg:px-12 border-t-2 border-border">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-accent border-2 border-surface/20 flex items-center justify-center rounded-sm">
                <span className="text-white font-display font-bold text-xs">CF</span>
              </div>
              <span className="font-display font-bold text-surface tracking-tight">COLLABFLOW</span>
            </div>
            <p className="text-meta text-surface/50 leading-relaxed">
              Real-time team collaboration and project management.
            </p>
          </div>

          {footerLinks.map(({ heading, links }) => (
            <div key={heading}>
              <div className="text-label text-surface/30 mb-4">{heading.toUpperCase()}</div>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-body text-surface/60 hover:text-surface transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-surface/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-meta text-surface/30">© 2026 CollabFlow. All rights reserved.</p>
          <p className="text-meta text-surface/30">Built for teams that care about the work.</p>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
