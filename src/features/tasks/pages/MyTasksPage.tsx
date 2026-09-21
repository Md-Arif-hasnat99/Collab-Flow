import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Circle, Clock, LayoutDashboard, Loader2, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { cn } from '../../../lib/utils';
import type { Database } from '../../../types/database.types';

type Task = Database['public']['Tables']['tasks']['Row'] & {
  project?: { name: string } | null;
};

// Hook to fetch user's tasks
function useUserTasks(workspaceId?: string, userId?: string) {
  return useQuery({
    queryKey: ['my-tasks', workspaceId, userId],
    queryFn: async () => {
      if (!workspaceId || !userId) return [];
      
      const { data, error } = await supabase
        .from('tasks' as any)
        .select(`
          *,
          project:projects(name),
          assignees:task_assignees!inner(user_id)
        `)
        .eq('workspace_id', workspaceId)
        .eq('assignees.user_id', userId)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!workspaceId && !!userId,
  });
}

// Priority color mapper
function getPriorityColor(priority: string) {
  switch (priority) {
    case 'HIGH': return 'bg-danger-light text-danger border-danger-border';
    case 'MEDIUM': return 'bg-warning-light text-warning border-warning-border';
    case 'LOW': return 'bg-info-light text-info border-info-border';
    default: return 'bg-muted text-ink-secondary border-border-light';
  }
}

export default function MyTasksPage() {
  const { currentWorkspace, user } = useAuth();
  const { data: tasks, isLoading, error } = useUserTasks(currentWorkspace?.id, user?.id);
  const [filter, setFilter] = useState<'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE'>('ALL');

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
          Failed to load tasks.
        </div>
      </div>
    );
  }

  const filteredTasks = tasks?.filter(t => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  }) || [];

  return (
    <div className="p-4 md:p-8 max-w-content mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-section text-ink font-display font-bold tracking-tight mb-2 uppercase">
            My Tasks
          </h1>
          <p className="text-body text-ink-muted">
            All tasks assigned to you in <strong className="text-ink">{currentWorkspace?.name}</strong>.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 text-[11px] font-display font-bold tracking-wider rounded border-2 transition-all',
                filter === f 
                  ? 'bg-ink text-white border-ink shadow-brutal-sm' 
                  : 'bg-surface text-ink-secondary border-border hover:bg-muted'
              )}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="bg-surface border-2 border-border rounded shadow-brutal flex flex-col overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 border-2 border-border-light">
              <CheckCircle2 size={24} className="text-ink-muted" />
            </div>
            <h3 className="text-card font-display text-ink mb-2">No tasks found</h3>
            <p className="text-sm text-ink-muted">You have no tasks matching this filter.</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-border">
            {filteredTasks.map(task => (
              <div key={task.id} className="group p-4 hover:bg-muted/50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center">
                
                {/* Status Icon */}
                <div className="pt-1 md:pt-0">
                  {task.status === 'DONE' ? (
                    <CheckCircle2 className="text-success" size={20} />
                  ) : task.status === 'IN_PROGRESS' ? (
                    <Clock className="text-accent" size={20} />
                  ) : (
                    <Circle className="text-ink-muted" size={20} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('text-[10px] font-display font-bold px-2 py-0.5 rounded border uppercase tracking-widest', getPriorityColor(task.priority))}>
                      {task.priority}
                    </span>
                    {task.project && (
                      <span className="text-[10px] text-ink-muted font-display tracking-wider uppercase border border-border-light px-2 py-0.5 rounded bg-surface">
                        {task.project.name}
                      </span>
                    )}
                  </div>
                  <Link to={`/app/tasks/${task.id}`} className="text-base font-bold text-ink hover:text-accent transition-colors block truncate">
                    {task.title}
                  </Link>
                </div>

                {/* Due Date & Action */}
                <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-end">
                  {task.due_date ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-ink-secondary">
                      <Calendar size={14} />
                      {format(new Date(task.due_date), 'MMM d, yyyy')}
                    </div>
                  ) : (
                    <div className="text-xs text-ink-muted italic">No due date</div>
                  )}

                  <Link to={`/app/tasks/${task.id}`} className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={16} />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
