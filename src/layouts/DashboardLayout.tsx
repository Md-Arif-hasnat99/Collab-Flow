import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Kanban, MessageSquare,
  Activity, BarChart3, Settings, Bell, Plus, Search,
  Menu, X, ChevronDown, LogOut, User, Building2, Home, CheckSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../features/auth/hooks/useAuth';
import { signOut } from '../features/auth/services/auth.service';
import { getInitials, stringToColor, cn } from '../lib/utils';
import NotificationDropdown from '../features/notifications/components/NotificationDropdown';

// ── Navigation items ─────────────────────────────────────────────
const NAV = [
  {
    section: 'WORKSPACE',
    items: [
      { label: 'Overview', href: '/app/dashboard', icon: LayoutDashboard },
      { label: 'My Tasks',  href: '/app/tasks',    icon: CheckSquare },
      { label: 'Projects',  href: '/app/projects',  icon: FolderOpen },
      { label: 'Boards',    href: '/app/boards',    icon: Kanban },
    ],
  },
  {
    section: 'COLLABORATE',
    items: [
      { label: 'Chat',     href: '/app/chat',     icon: MessageSquare },
      { label: 'Activity', href: '/app/activity', icon: Activity },
    ],
  },
  {
    section: 'INSIGHTS',
    items: [
      { label: 'Analytics', href: '/app/analytics', icon: BarChart3 },
    ],
  },
];

// ── Avatar ────────────────────────────────────────────────────────
function Avatar({ name, url, size = 8 }: { name: string; url?: string | null; size?: number }) {
  const initials = getInitials(name);
  const color = stringToColor(name);
  const sizeClass = `w-${size} h-${size}`;

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizeClass} rounded-full border-2 border-border object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded-full border-2 border-border flex items-center justify-center flex-shrink-0 text-white font-display font-bold`}
      style={{ background: color, fontSize: `${size * 1.5}px` }}
    >
      {initials}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────
function Sidebar({ collapsed, onClose }: { collapsed?: boolean; onClose?: () => void }) {
  const location = useLocation();
  const { profile, currentWorkspace, currentRole } = useAuth();
  const navigate = useNavigate();

  const isActive = (href: string) => location.pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  return (
    <aside className={`flex flex-col bg-surface border-r-2 border-border h-full transition-all duration-200 ${collapsed ? 'w-[60px]' : 'w-[220px]'}`}>
      {/* Workspace selector */}
      <div className={`flex items-center gap-3 p-4 border-b-2 border-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-7 h-7 bg-accent border-2 border-border rounded-sm flex items-center justify-center flex-shrink-0">
          <span className="text-white font-display font-bold text-xs">
            {currentWorkspace?.name?.[0]?.toUpperCase() ?? 'W'}
          </span>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-meta text-ink truncate">
              {currentWorkspace?.name ?? 'No Workspace'}
            </div>
            <div className="text-[10px] text-ink-muted font-display tracking-widest uppercase">
              {currentRole}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {NAV.map(({ section, items }) => (
          <div key={section} className="mb-4">
            {!collapsed && (
              <div className="px-2 mb-1 text-[10px] font-display font-bold text-ink-muted tracking-widest">
                {section}
              </div>
            )}
            {items.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={onClose}
                title={collapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-3 px-2 py-2 rounded text-body font-sans font-medium transition-colors duration-100',
                  collapsed ? 'justify-center' : '',
                  isActive(href)
                    ? 'bg-accent-light text-accent'
                    : 'text-ink-secondary hover:bg-muted hover:text-ink'
                )}
              >
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom: Settings + User */}
      <div className="p-2 border-t-2 border-border">
        <Link
          to="/app/settings"
          onClick={onClose}
          title={collapsed ? 'Settings' : undefined}
          className={cn(
            'flex items-center gap-3 px-2 py-2 rounded text-body font-sans font-medium transition-colors text-ink-secondary hover:bg-muted hover:text-ink mb-2',
            collapsed ? 'justify-center' : ''
          )}
        >
          <Settings size={16} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* User */}
        <div className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-muted cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''}`}
          onClick={handleLogout}
          title="Sign out"
        >
          <Avatar name={profile?.full_name ?? 'User'} url={profile?.avatar_url} size={6} />
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-meta font-display font-semibold text-ink truncate">
                  {profile?.full_name ?? 'User'}
                </div>
                <div className="text-[10px] text-ink-muted truncate">{profile?.email}</div>
              </div>
              <LogOut size={14} className="text-ink-muted flex-shrink-0" />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

// ── Topbar ────────────────────────────────────────────────────────
function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b-2 border-border bg-surface flex items-center gap-3 px-4 flex-shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden btn-icon"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Logo (mobile) */}
      <Link to="/app/dashboard" className="lg:hidden flex items-center gap-2">
        <div className="w-6 h-6 bg-accent border-2 border-border flex items-center justify-center rounded-sm">
          <span className="text-white font-display font-bold text-[10px]">CF</span>
        </div>
        <span className="font-display font-bold text-sm text-ink tracking-tight">COLLABFLOW</span>
      </Link>

      {/* Search (desktop) */}
      <button className="hidden md:flex items-center gap-2 flex-1 max-w-sm px-3 py-2 border-2 border-border-light rounded text-body text-ink-muted hover:border-border transition-colors">
        <Search size={14} />
        <span className="text-meta">Search…</span>
        <kbd className="ml-auto text-[10px] border border-border-light px-1.5 py-0.5 rounded-sm font-mono">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        {/* Create button */}
        <button
          onClick={() => navigate('/app/boards')}
          className="btn-primary px-3 py-1.5 text-sm gap-1.5"
        >
          <Plus size={14} />
          <span className="hidden sm:block">CREATE</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {/* Unread badge */}
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-accent border border-white rounded-full" />
          </button>
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>
      </div>
    </header>
  );
}

// ── Mobile bottom navigation ─────────────────────────────────────
function BottomNav() {
  const location = useLocation();
  const items = [
    { label: 'Home',  href: '/app/dashboard', icon: Home },
    { label: 'Tasks', href: '/app/tasks',     icon: CheckSquare },
    { label: 'Chat',  href: '/app/chat',      icon: MessageSquare },
    { label: 'More',  href: '/app/settings',  icon: Menu },
  ];
  const isActive = (href: string) => location.pathname.startsWith(href);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t-2 border-border flex safe-area-bottom">
      {items.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          to={href}
          className={cn(
            'flex-1 flex flex-col items-center gap-1 py-3 transition-colors',
            isActive(href) ? 'text-accent' : 'text-ink-muted'
          )}
        >
          <Icon size={20} />
          <span className="text-[10px] font-display font-semibold tracking-wide">{label.toUpperCase()}</span>
        </Link>
      ))}
    </nav>
  );
}

// ── DashboardLayout ───────────────────────────────────────────────
export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, currentWorkspace, loading } = useAuth();
  const navigate = useNavigate();

  // If no workspace, redirect to setup
  useEffect(() => {
    if (!loading && !currentWorkspace) {
      navigate('/setup', { replace: true });
    }
  }, [loading, currentWorkspace, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
          <p className="text-label text-ink-muted">LOADING YOUR WORKSPACE…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Topbar onMenuClick={() => setMobileOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-shrink-0">
          <Sidebar collapsed={sidebarCollapsed} />
          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute left-[208px] top-1/2 -translate-y-1/2 w-5 h-8 bg-surface border-2 border-border rounded-sm z-10 hidden lg:flex items-center justify-center hover:bg-muted transition-colors"
            style={{ left: sidebarCollapsed ? '54px' : '214px' }}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${sidebarCollapsed ? '-rotate-90' : 'rotate-90'}`}
            />
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden animate-slide-in-left">
              <Sidebar onClose={() => setMobileOpen(false)} />
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
