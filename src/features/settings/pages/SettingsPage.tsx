import { useState } from 'react';
import { NavLink, Outlet, Routes, Route, useNavigate } from 'react-router-dom';
import { User, Building2, Users, Shield, Bell, Palette, Lock, Puzzle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { cn } from '../../../lib/utils';
import ProfileSettings from '../components/ProfileSettings';
import MembersSettings from '../components/MembersSettings';
import AppearanceSettings from '../components/AppearanceSettings';
import WorkspaceSettings from '../components/WorkspaceSettings';

const SECTIONS = [
  { label: 'Profile',            href: '',          icon: User,      always: true },
  { label: 'Workspace',          href: 'workspace', icon: Building2, perm: 'workspace.manage' as const },
  { label: 'Members',            href: 'members',   icon: Users,     perm: 'members.view' as const },
  { label: 'Roles & Permissions',href: 'roles',     icon: Shield,    perm: 'roles.manage' as const },
  { label: 'Notifications',      href: 'notifications', icon: Bell, always: true },
  { label: 'Appearance',         href: 'appearance',icon: Palette,   always: true },
  { label: 'Security',           href: 'security',  icon: Lock,      always: true },
  { label: 'Integrations',       href: 'integrations', icon: Puzzle, perm: 'workspace.manage' as const },
];

export default function SettingsPage() {
  const { can } = useAuth();
  const navigate = useNavigate();

  const visibleSections = SECTIONS.filter(s => s.always || (s.perm && can(s.perm)));

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 border-r-2 border-border bg-surface hidden md:flex flex-col">
        <div className="p-4 border-b-2 border-border">
          <h1 className="font-display font-bold text-sm text-ink tracking-widest uppercase">SETTINGS</h1>
        </div>
        <nav className="p-2 flex flex-col gap-0.5">
          {visibleSections.map(({ label, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={`/app/settings${href ? `/${href}` : ''}`}
              end={!href}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2 rounded text-sm font-sans font-medium transition-colors',
                isActive ? 'bg-accent-light text-accent' : 'text-ink-secondary hover:bg-muted hover:text-ink'
              )}
            >
              <Icon size={15} className="flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin p-6 lg:p-8 pb-24 lg:pb-8">
        <Routes>
          <Route index element={<ProfileSettings />} />
          <Route path="workspace" element={<WorkspaceSettings />} />
          <Route path="members" element={<MembersSettings />} />
          <Route path="appearance" element={<AppearanceSettings />} />
          <Route path="*" element={<ProfileSettings />} />
        </Routes>
      </main>
    </div>
  );
}
