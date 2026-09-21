import { useAuth } from '../auth/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase/client';
import { format } from 'date-fns';
import { ArrowRight, Plus, Users, FolderOpen, CheckSquare, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { timeAgo, cn } from '../../lib/utils';
import type { Activity, Task } from '../../types/database.types';

// ── Metric Card ───────────────────────────────────────────────────
function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="cf-card p-6">
      <div className="text-label text-ink-muted mb-2">{label}</div>
      <div className="font-display font-bold text-ink mb-1" style={{ fontSize: '40px', lineHeight: 1 }}>{value}</div>
      {sub && <div className="text-meta text-ink-muted">{sub}</div>}
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────
function SectionHeader({ title, action }: { title: string; action?: { label: string; href: string } }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display font-bold text-ink tracking-tight" style={{ fontSize: '18px' }}>{title}</h2>
      {action && (
        <Link to={action.href} className="flex items-center gap-1 text-meta text-ink-muted hover:text-accent transition-colors font-display font-semibold">
          {action.label} <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, desc, action }: {
  icon: React.ElementType; title: string; desc: string;
  action?: { label: string; href?: string; onClick?: () => void };
}) {
  return (
    <div className="cf-empty">
      <div className="w-12 h-12 border-2 border-border flex items-center justify-center text-ink-muted">
        <Icon size={20} />
      </div>
      <div>
        <p className="font-display font-bold text-ink mb-1">{title}</p>
        <p className="text-meta text-ink-muted">{desc}</p>
      </div>
      {action && (
        action.href ? (
          <Link to={action.href} className="btn-primary text-sm px-4 py-2">
            <Plus size={14} /> {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} className="btn-primary text-sm px-4 py-2">
            <Plus size={14} /> {action.label}
          </button>
        )
      )}
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────────
export function ErrorState({ title, desc, onRetry }: { title: string; desc: string; onRetry?: () => void }) {
  return (
    <div className="cf-empty">
      <div className="w-12 h-12 border-2 border-danger flex items-center justify-center text-danger">
        <AlertCircle size={20} />
      </div>
      <div>
        <p className="font-display font-bold text-ink mb-1">{title}</p>
        <p className="text-meta text-ink-muted">{desc}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-sm px-4 py-2 gap-2">
          <RefreshCw size={14} /> RETRY
        </button>
      )}
    </div>
  );
}

export default function OwnerDashboard() {
  const { profile, currentWorkspace, can } = useAuth();
  const workspaceId = currentWorkspace?.id;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  // ── Fetch workspace stats ─────────────────────────────────────
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['workspace-stats', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      const [projects, tasks, members] = await Promise.all([
        supabase.from('projects').select('id, status', { count: 'exact' }).eq('workspace_id', workspaceId).eq('status', 'ACTIVE'),
        supabase.from('tasks').select('id, status', { count: 'exact' }).eq('workspace_id', workspaceId),
        supabase.from('workspace_members').select('id', { count: 'exact' }).eq('workspace_id', workspaceId),
      ]);
      const doneTasks = await supabase.from('tasks').select('id', { count: 'exact' }).eq('workspace_id', workspaceId).eq('status', 'DONE');
      const total = tasks.count ?? 0;
      const done = doneTasks.count ?? 0;
      return {
        activeProjects: projects.count ?? 0,
        openTasks: total - done,
        completedTasks: done,
        members: members.count ?? 0,
        completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    },
    enabled: !!workspaceId,
  });

  // ── Fetch recent activities ───────────────────────────────────
  const { data: activities, isLoading: activitiesLoading, refetch } = useQuery({
    queryKey: ['activities', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*, actor:profiles!user_id(full_name, avatar_url)')
        .eq('workspace_id', workspaceId!)
        .order('created_at', { ascending: false })
        .limit(8);
      if (error) throw error;
      return data as Activity[];
    },
    enabled: !!workspaceId,
  });

  // ── Fetch due-soon tasks ──────────────────────────────────────
  const { data: dueSoon } = useQuery({
    queryKey: ['due-soon', workspaceId],
    queryFn: async () => {
      const in7days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, due_date, priority, status')
        .eq('workspace_id', workspaceId!)
        .lte('due_date', in7days)
        .neq('status', 'DONE')
        .order('due_date', { ascending: true })
        .limit(5);
      if (error) throw error;
      return data as Task[];
    },
    enabled: !!workspaceId,
  });

  const activityLabel = (a: Activity) => {
    const meta = a.meta as Record<string, string>;
    switch (a.type) {
      case 'TASK_CREATED': return `created task "${meta.title}"`;
      case 'TASK_MOVED':   return `moved "${meta.title}" → new column`;
      case 'TASK_UPDATED': return `updated "${meta.title}"`;
      case 'COMMENT_CREATED': return 'added a comment';
      case 'MEMBER_JOINED': return 'joined the workspace';
      case 'PROJECT_CREATED': return `created project "${meta.title ?? ''}"`;
      default: return a.type.toLowerCase().replace(/_/g, ' ');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-label text-ink-muted mb-1">{greeting()}, {profile?.full_name?.split(' ')[0] ?? 'OWNER'}.</p>
        <h1 className="font-display font-bold text-ink" style={{ fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.02em' }}>
          Here's what's happening in your workspace.
        </h1>
      </div>

      {/* Metrics */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[0,1,2,3].map(i => <div key={i} className="cf-skeleton h-28 rounded" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard label="ACTIVE PROJECTS" value={stats?.activeProjects ?? 0} sub="currently running" />
          <MetricCard label="OPEN TASKS" value={stats?.openTasks ?? 0} sub="need attention" />
          <MetricCard label="COMPLETED" value={stats?.completedTasks ?? 0} sub="tasks done" />
          <MetricCard label="COMPLETION RATE" value={`${stats?.completionRate ?? 0}%`} sub={`${stats?.members ?? 0} team members`} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2">
          <SectionHeader title="RECENT ACTIVITY" action={{ label: 'View all', href: '/app/activity' }} />
          <div className="cf-card-flat divide-y-2 divide-border-muted">
            {activitiesLoading && (
              <div className="flex flex-col gap-3 p-4">
                {[0,1,2,3].map(i => <div key={i} className="cf-skeleton h-10 rounded" />)}
              </div>
            )}
            {!activitiesLoading && (!activities || activities.length === 0) && (
              <EmptyState icon={Activity} title="NO ACTIVITY YET." desc="Actions in your workspace will appear here." />
            )}
            {activities?.map(a => {
              const actor = a.actor as { full_name: string; avatar_url: string | null } | null;
              return (
                <div key={a.id} className="flex items-start gap-3 p-4 hover:bg-muted transition-colors">
                  <div className="w-7 h-7 bg-muted border-2 border-border rounded-full flex items-center justify-center text-[10px] font-display font-bold text-ink flex-shrink-0 mt-0.5">
                    {(actor?.full_name ?? '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-meta text-ink">
                      <span className="font-semibold">{actor?.full_name ?? 'Someone'}</span>{' '}
                      {activityLabel(a)}
                    </p>
                    <p className="text-[11px] text-ink-muted mt-0.5">{timeAgo(a.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div>
          <SectionHeader title="DUE SOON" action={{ label: 'All tasks', href: '/app/tasks' }} />
          <div className="cf-card-flat divide-y-2 divide-border-muted">
            {!dueSoon || dueSoon.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-meta text-ink-muted font-display">No deadlines in the next 7 days.</p>
              </div>
            ) : dueSoon.map(task => {
              const isOverdue = task.due_date && new Date(task.due_date) < new Date();
              return (
                <div key={task.id} className="flex items-start gap-3 p-4 hover:bg-muted transition-colors">
                  <div className={cn('w-1.5 flex-shrink-0 mt-2 rounded-full h-1.5', {
                    'bg-danger': task.priority === 'URGENT' || task.priority === 'HIGH',
                    'bg-warning': task.priority === 'MEDIUM',
                    'bg-border-light': task.priority === 'LOW',
                  })} />
                  <div className="flex-1 min-w-0">
                    <p className="text-meta font-semibold text-ink truncate">{task.title}</p>
                    <p className={cn('text-[11px] mt-0.5', isOverdue ? 'text-danger font-semibold' : 'text-ink-muted')}>
                      {isOverdue ? 'OVERDUE — ' : ''}
                      {task.due_date ? format(new Date(task.due_date), 'MMM d') : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick actions (owner-only) */}
          {can('members.invite') && (
            <div className="mt-6">
              <SectionHeader title="QUICK ACTIONS" />
              <div className="flex flex-col gap-2">
                <Link to="/app/settings/members" className="btn-secondary w-full justify-start gap-3 py-3">
                  <Users size={16} /> Invite team members
                </Link>
                <Link to="/app/workspaces" className="btn-secondary w-full justify-start gap-3 py-3">
                  <FolderOpen size={16} /> Create project
                </Link>
                <Link to="/app/analytics" className="btn-secondary w-full justify-start gap-3 py-3">
                  <TrendingUp size={16} /> View analytics
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
