import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, CheckSquare, Clock, Calendar, MessageSquare, 
  Paperclip, MoreVertical, Loader2, Send
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { cn, getInitials, stringToColor } from '../../../lib/utils';
import type { Database } from '../../../types/database.types';

type TaskDetail = Database['public']['Tables']['tasks']['Row'] & {
  project?: { name: string } | null;
  column?: { name: string } | null;
  assignees?: { user: Database['public']['Tables']['profiles']['Row'] }[];
  checklists?: Database['public']['Tables']['task_checklists']['Row'][];
  comments?: (Database['public']['Tables']['task_comments']['Row'] & { user: Database['public']['Tables']['profiles']['Row'] })[];
};

function useTaskDetails(taskId?: string) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      if (!taskId) return null;
      const { data, error } = await supabase
        .from('tasks' as any)
        .select(`
          *,
          project:projects(name),
          column:columns(name),
          assignees:task_assignees(user:profiles(*)),
          checklists:task_checklists(*),
          comments:task_comments(*, user:profiles(*))
        `)
        .eq('id', taskId)
        .single();
      
      if (error) throw error;
      
      // Sort comments and checklists
      if (data.comments) data.comments.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      if (data.checklists) data.checklists.sort((a: any, b: any) => a.position - b.position);
      
      return data as unknown as TaskDetail;
    },
    enabled: !!taskId,
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

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: task, isLoading, error } = useTaskDetails(taskId);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center mt-20">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-8 flex flex-col items-center gap-4">
        <div className="bg-danger-light text-danger border-2 border-danger-border p-4 rounded text-sm font-medium">
          Task not found or you don't have permission.
        </div>
        <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
      </div>
    );
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user || !taskId) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('task_comments' as any).insert({
        task_id: taskId,
        user_id: user.id,
        content: commentText.trim()
      });
      if (error) throw error;
      setCommentText('');
      // In a real app, we would invalidate the query or use realtime here
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background animate-fade-in">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-4 h-14 border-b-2 border-border bg-surface flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-icon">
            <ArrowLeft size={18} />
          </button>
          <div className="flex flex-col">
            <div className="text-[10px] font-display tracking-widest text-ink-muted uppercase line-clamp-1">
              {task.project?.name || 'Project'} / {task.column?.name || 'Board'}
            </div>
            <h1 className="font-display font-bold text-ink tracking-tight line-clamp-1 text-sm">
              {task.title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="btn-icon">
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-content mx-auto w-full">
        
        {/* Title & Metadata */}
        <div className="bg-surface border-2 border-border p-6 rounded shadow-brutal mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={cn('text-[10px] font-display font-bold px-2 py-0.5 rounded border uppercase tracking-widest', getPriorityColor(task.priority))}>
              {task.priority}
            </span>
            <span className="text-[10px] text-ink-muted font-display tracking-wider uppercase border border-border-light px-2 py-0.5 rounded bg-muted">
              {task.status.replace('_', ' ')}
            </span>
          </div>

          <h2 className="text-section text-ink font-display font-bold tracking-tight mb-4">{task.title}</h2>
          
          <div className="prose prose-sm max-w-none text-ink-secondary mb-6">
            {task.description ? (
              <p className="whitespace-pre-wrap">{task.description}</p>
            ) : (
              <p className="italic">No description provided.</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border-light">
            {/* Assignees */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-display font-bold text-ink-muted tracking-widest uppercase">Assignees</span>
              <div className="flex items-center">
                {task.assignees?.length === 0 ? (
                  <span className="text-sm text-ink-secondary">Unassigned</span>
                ) : (
                  <div className="flex -space-x-2">
                    {(task.assignees as any[])?.map(({ user: u }) => (
                      <div key={u.id} className="w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center text-white text-xs font-bold font-display" style={{ backgroundColor: stringToColor(u.full_name) }} title={u.full_name}>
                        {getInitials(u.full_name)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-display font-bold text-ink-muted tracking-widest uppercase">Due Date</span>
              <div className="flex items-center gap-1.5 text-sm text-ink-secondary">
                <Calendar size={16} />
                {task.due_date ? format(new Date(task.due_date), 'MMM do, yyyy') : 'None'}
              </div>
            </div>
          </div>
        </div>

        {/* Checklists (if any) */}
        {task.checklists && task.checklists.length > 0 && (
          <div className="bg-surface border-2 border-border p-6 rounded shadow-brutal mb-6">
            <h3 className="text-card font-display font-bold text-ink mb-4 flex items-center gap-2 uppercase tracking-tight">
              <CheckSquare size={18} /> Checklist
            </h3>
            <div className="space-y-3">
              {task.checklists.map(item => (
                <div key={item.id} className="flex items-start gap-3">
                  <input type="checkbox" checked={item.is_completed} readOnly className="mt-1 w-4 h-4 border-2 border-border rounded-sm accent-accent" />
                  <span className={cn('text-body', item.is_completed ? 'line-through text-ink-muted' : 'text-ink')}>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-surface border-2 border-border rounded shadow-brutal mb-8 overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="text-card font-display font-bold text-ink flex items-center gap-2 uppercase tracking-tight">
              <MessageSquare size={18} /> Comments ({task.comments?.length || 0})
            </h3>
          </div>
          
          <div className="p-4 md:p-6 space-y-6">
            {task.comments?.length === 0 ? (
              <p className="text-sm text-ink-muted text-center italic">No comments yet.</p>
            ) : (
              (task.comments as any[])?.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold font-display text-sm border-2 border-border" style={{ backgroundColor: stringToColor(comment.user.full_name) }}>
                    {getInitials(comment.user.full_name)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-sm text-ink">{comment.user.full_name}</span>
                      <span className="text-[11px] text-ink-muted">{format(new Date(comment.created_at), 'MMM d, h:mm a')}</span>
                    </div>
                    <div className="bg-muted p-3 rounded rounded-tl-none text-sm text-ink-secondary whitespace-pre-wrap border border-border-light">
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* New Comment Input */}
          <div className="p-4 border-t border-border bg-muted/30">
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="cf-input flex-1"
                disabled={isSubmitting}
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !commentText.trim()} 
                className="btn-primary px-4"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
