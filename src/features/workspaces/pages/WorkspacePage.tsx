import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, Users, FolderOpen, Kanban, CheckSquare, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { cn } from '../../../lib/utils';

function useWorkspaceStats(workspaceId?: string) {
  return useQuery({
    queryKey: ['workspace-stats', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      
      const [membersReq, projectsReq, boardsReq, tasksReq] = await Promise.all([
        supabase.from('workspace_members' as any).select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
        supabase.from('projects' as any).select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
        supabase.from('boards' as any).select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
        supabase.from('tasks' as any).select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
      ]);

      return {
        members: membersReq.count || 0,
        projects: projectsReq.count || 0,
        boards: boardsReq.count || 0,
        tasks: tasksReq.count || 0,
      };
    },
    enabled: !!workspaceId,
  });
}

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const { currentWorkspace, can } = useAuth();
  
  // Make sure we only show stats for the currently selected workspace, 
  // or handle switching if they navigated directly to an ID (omitted for brevity here).
  const activeId = workspaceId || currentWorkspace?.id;
  const { data: stats, isLoading } = useWorkspaceStats(activeId);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center mt-20">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-content-lg mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-hero text-ink font-display font-bold tracking-tight uppercase line-clamp-1 mb-2">
          {currentWorkspace?.name || 'Workspace'}
        </h1>
        <p className="text-body text-ink-muted max-w-2xl">
          Welcome to your workspace overview. Here's a quick look at everything happening across your teams and projects.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Stat Cards */}
        {[
          { label: 'Total Projects', value: stats?.projects, icon: FolderOpen, color: 'text-ink', bg: 'bg-muted' },
          { label: 'Kanban Boards', value: stats?.boards, icon: Kanban, color: 'text-ink', bg: 'bg-muted' },
          { label: 'Active Tasks', value: stats?.tasks, icon: CheckSquare, color: 'text-accent', bg: 'bg-accent-light' },
          { label: 'Team Members', value: stats?.members, icon: Users, color: 'text-info', bg: 'bg-info-light' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface border-2 border-border p-6 rounded shadow-brutal flex flex-col">
            <div className={cn('w-12 h-12 rounded flex items-center justify-center mb-4 border-2 border-border', stat.bg)}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div className="text-[10px] font-display font-bold tracking-widest text-ink-muted uppercase mb-1">
              {stat.label}
            </div>
            <div className="text-3xl font-display font-bold text-ink tracking-tight">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-section text-ink font-display font-bold tracking-tight mb-6 uppercase">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {can('projects.create') && (
          <Link to="/app/projects" className="group bg-surface border-2 border-border p-6 rounded hover:shadow-brutal hover:-translate-y-1 transition-all">
            <h3 className="font-display font-bold text-ink mb-2 flex items-center gap-2">
              Create Project <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
            </h3>
            <p className="text-sm text-ink-secondary">Group your boards and tasks into a new project.</p>
          </Link>
        )}
        
        {can('members.invite') && (
          <Link to="/app/settings/members" className="group bg-surface border-2 border-border p-6 rounded hover:shadow-brutal hover:-translate-y-1 transition-all">
            <h3 className="font-display font-bold text-ink mb-2 flex items-center gap-2">
              Invite Members <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
            </h3>
            <p className="text-sm text-ink-secondary">Add new teammates to collaborate in this workspace.</p>
          </Link>
        )}

        <Link to="/app/analytics" className="group bg-surface border-2 border-border p-6 rounded hover:shadow-brutal hover:-translate-y-1 transition-all">
          <h3 className="font-display font-bold text-ink mb-2 flex items-center gap-2">
            View Analytics <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
          </h3>
          <p className="text-sm text-ink-secondary">Check the progress and burndown of all tasks.</p>
        </Link>
      </div>
    </div>
  );
}
