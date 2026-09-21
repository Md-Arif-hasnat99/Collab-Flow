import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Loader2, Zap, ArrowRight, Settings, CheckCircle2, UserPlus, FolderOpen, Kanban } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { cn, getInitials, stringToColor } from '../../../lib/utils';
import type { Database } from '../../../types/database.types';

type ActivityRecord = Database['public']['Tables']['activities']['Row'] & {
  user?: Database['public']['Tables']['profiles']['Row'] | null;
};

function useActivities(workspaceId?: string) {
  return useQuery({
    queryKey: ['activities', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      const { data, error } = await supabase
        .from('activities' as any)
        .select(`
          *,
          user:profiles(*)
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ActivityRecord[];
    },
    enabled: !!workspaceId,
  });
}

function getActivityIcon(type: string) {
  switch(true) {
    case type.includes('TASK_CREATED'): return <CheckCircle2 size={16} className="text-success" />;
    case type.includes('TASK_MOVED'): return <ArrowRight size={16} className="text-accent" />;
    case type.includes('MEMBER_JOINED'): return <UserPlus size={16} className="text-info" />;
    case type.includes('PROJECT'): return <FolderOpen size={16} className="text-ink" />;
    case type.includes('BOARD'): return <Kanban size={16} className="text-ink" />;
    default: return <Zap size={16} className="text-ink-secondary" />;
  }
}

function getActivityText(activity: ActivityRecord) {
  const meta = activity.meta as any;
  const userName = activity.user?.full_name || 'Someone';
  
  switch(activity.type) {
    case 'TASK_CREATED': return <span><strong>{userName}</strong> created task <strong>{meta?.title}</strong></span>;
    case 'TASK_MOVED': return <span><strong>{userName}</strong> moved task <strong>{meta?.title}</strong></span>;
    case 'TASK_UPDATED': return <span><strong>{userName}</strong> updated task <strong>{meta?.title}</strong></span>;
    case 'MEMBER_JOINED': return <span><strong>{userName}</strong> joined the workspace</span>;
    default: return <span><strong>{userName}</strong> performed an action: {activity.type}</span>;
  }
}

export default function ActivityPage() {
  const { currentWorkspace } = useAuth();
  const queryClient = useQueryClient();
  const { data: activities, isLoading, error } = useActivities(currentWorkspace?.id);

  // Setup realtime subscription
  useEffect(() => {
    if (!currentWorkspace?.id) return;
    
    const channel = supabase.channel(`activity-${currentWorkspace.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'activities',
        filter: `workspace_id=eq.${currentWorkspace.id}`
      }, () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['activities', currentWorkspace.id] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentWorkspace?.id, queryClient]);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center mt-20">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-danger-light text-danger border-2 border-danger-border p-4 rounded text-sm font-medium">
          Failed to load activity feed.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-content mx-auto animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 flex-shrink-0">
        <div>
          <h1 className="text-section text-ink font-display font-bold tracking-tight mb-2 uppercase flex items-center gap-3">
            <Activity size={32} className="text-accent" /> Activity Feed
          </h1>
          <p className="text-body text-ink-muted">
            Real-time audit log of all actions in <strong className="text-ink">{currentWorkspace?.name}</strong>.
          </p>
        </div>

        <button className="btn-secondary text-xs gap-1.5 px-3 py-1.5">
          <Settings size={14} /> FILTER
        </button>
      </div>

      {/* Feed */}
      <div className="bg-surface border-2 border-border rounded shadow-brutal flex-1 overflow-hidden flex flex-col relative">
        <div className="absolute top-0 bottom-0 left-8 md:left-12 w-0.5 bg-border-light z-0 hidden sm:block" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 z-10 relative">
          {activities && activities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-border-light">
                <Zap size={24} className="text-ink-muted" />
              </div>
              <h3 className="text-card font-display text-ink mb-2">No activity yet</h3>
              <p className="text-sm text-ink-muted">Actions taken by members will appear here in real time.</p>
            </div>
          ) : (
            activities?.map(activity => (
              <div key={activity.id} className="flex gap-4 md:gap-6 items-start group">
                {/* Avatar / Icon */}
                <div className="relative">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 border-surface shadow-sm z-10 relative font-display font-bold text-xs md:text-sm text-white" style={{ backgroundColor: stringToColor(activity.user?.full_name || 'Unknown') }}>
                    {getInitials(activity.user?.full_name || 'Unknown')}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-surface border-2 border-border rounded-full flex items-center justify-center z-20 shadow-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-1 md:pt-1.5 bg-surface md:bg-transparent rounded p-3 md:p-0 border border-border-light md:border-transparent">
                  <div className="text-sm text-ink-secondary mb-1">
                    {getActivityText(activity)}
                  </div>
                  <div className="text-[10px] font-display font-bold tracking-widest text-ink-muted uppercase">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
