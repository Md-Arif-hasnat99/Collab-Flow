import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FolderOpen, Plus, Loader2, ArrowLeft, MoreVertical, Kanban, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { stringToColor, cn } from '../../../lib/utils';
import type { Database } from '../../../types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type Board = Database['public']['Tables']['boards']['Row'];

function useProjectDetails(projectId?: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      const { data: project, error: pError } = await supabase
        .from('projects' as any)
        .select('*')
        .eq('id', projectId)
        .single();
      if (pError) throw pError;

      const { data: boards, error: bError } = await supabase
        .from('boards' as any)
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (bError) throw bError;

      return { project: project as Project, boards: boards as Board[] };
    },
    enabled: !!projectId,
  });
}

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const { data, isLoading, error } = useProjectDetails(projectId);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center mt-20">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="bg-danger-light text-danger border-2 border-danger-border p-4 rounded text-sm font-medium flex items-center justify-between">
          <span>Failed to load project details or project not found.</span>
          <button onClick={() => navigate('/app/projects')} className="underline font-bold">Go back</button>
        </div>
      </div>
    );
  }

  const { project, boards } = data;
  const accentColor = stringToColor(project.name);

  return (
    <div className="flex flex-col h-full bg-background animate-fade-in">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-4 h-14 border-b-2 border-border bg-surface flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/app/projects')} className="btn-icon">
            <ArrowLeft size={18} />
          </button>
          <div className="w-6 h-6 rounded-sm flex items-center justify-center border-2 border-border" style={{ backgroundColor: accentColor }}>
            <FolderOpen size={12} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-ink tracking-tight uppercase line-clamp-1">{project.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {can('boards.create') && (
            <button className="btn-primary text-xs py-1.5 px-3 gap-1">
              <Plus size={14} /> NEW BOARD
            </button>
          )}
          <button className="btn-icon">
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-content-lg mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-section text-ink font-display font-bold tracking-tight mb-2">Project Overview</h2>
          <p className="text-body text-ink-muted max-w-3xl">
            {project.description || 'No description provided for this project.'}
          </p>
          <div className="flex items-center gap-2 mt-4 text-[11px] font-display tracking-widest text-ink-secondary uppercase">
            <Calendar size={14} /> Created {format(new Date(project.created_at), 'MMMM do, yyyy')}
          </div>
        </div>

        {/* Boards Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display font-bold text-ink tracking-widest text-sm uppercase">Associated Boards</h3>
        </div>

        {boards.length === 0 ? (
          <div className="bg-surface border-2 border-border border-dashed rounded p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 border border-border-light">
              <Kanban size={24} className="text-ink-muted" />
            </div>
            <h3 className="text-card font-display text-ink mb-2">No boards created</h3>
            <p className="text-sm text-ink-muted mb-6 max-w-md">
              Create a Kanban board in this project to start tracking your tasks.
            </p>
            {can('boards.create') && (
              <button className="btn-primary">Create a Board</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {boards.map(board => {
              const bColor = stringToColor(board.name);
              return (
                <Link 
                  key={board.id} 
                  to={`/app/boards/${board.id}`}
                  className="group bg-surface border-2 border-border rounded shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all duration-200 flex flex-col overflow-hidden"
                >
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded border-2 border-border flex items-center justify-center" style={{ backgroundColor: bColor + '20', color: bColor }}>
                        <Kanban size={20} />
                      </div>
                    </div>
                    
                    <h3 className="text-card font-display font-bold text-ink mb-2 line-clamp-1">{board.name}</h3>
                    <p className="text-sm text-ink-secondary line-clamp-2 flex-1">{board.description || 'No description provided.'}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
