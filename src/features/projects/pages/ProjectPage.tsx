import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Kanban, Plus, MoreVertical, Loader2, Calendar, LayoutGrid, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { cn, stringToColor } from '../../../lib/utils';
import type { Database } from '../../../types/database.types';
import { CreateBoardModal } from '../../boards/components/CreateBoardModal';

type Project = Database['public']['Tables']['projects']['Row'];
type Board = Database['public']['Tables']['boards']['Row'];

function useProjectDetails(projectId?: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data: project, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId!)
        .single();
      if (projErr) throw projErr;

      const { data: boards, error: boardsErr } = await supabase
        .from('boards')
        .select('*')
        .eq('project_id', projectId!)
        .order('updated_at', { ascending: false });
      if (boardsErr) throw boardsErr;

      return { project: project as Project, boards: boards as Board[] };
    },
    enabled: !!projectId,
  });
}

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useProjectDetails(projectId);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-danger-light text-danger border-2 border-danger-border p-4 rounded text-sm font-medium">
          Failed to load project details.
        </div>
      </div>
    );
  }

  const { project, boards } = data;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background animate-fade-in">
      {/* Header */}
      <header className="h-16 border-b-2 border-border bg-surface flex items-center justify-between px-4 md:px-8 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded border-2 border-border flex items-center justify-center bg-muted">
            <LayoutGrid size={16} className="text-ink" />
          </div>
          <h1 className="font-display font-bold text-ink text-lg uppercase tracking-tight line-clamp-1">
            {project.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {can('boards.create') && (
            <button className="btn-primary text-xs py-1.5 px-3 gap-1" onClick={() => setIsCreatingBoard(true)}>
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
              <button className="btn-primary" onClick={() => setIsCreatingBoard(true)}>Create a Board</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {boards.map(board => {
              const accentColor = stringToColor(board.name);
              return (
                <Link 
                  key={board.id} 
                  to={`/app/boards/${board.id}`}
                  className="group bg-surface border-2 border-border rounded shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all duration-200 flex flex-col overflow-hidden"
                >
                  <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display font-bold text-ink text-lg line-clamp-1">{board.name}</h3>
                      <button className="btn-icon -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.preventDefault(); /* TODO: board menu */ }}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    
                    <p className="text-sm text-ink-secondary line-clamp-2 flex-1 mb-4">
                      {board.description || 'No description provided.'}
                    </p>
                    
                    <div className="flex flex-col gap-2 border-t border-border-light pt-4 mt-auto">
                      <div className="flex items-center gap-1.5 text-[11px] font-display tracking-widest text-ink-muted uppercase">
                        <Clock size={12} />
                        Updated {formatDistanceToNow(new Date(board.updated_at), { addSuffix: true })}
                      </div>
                    </div>
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
