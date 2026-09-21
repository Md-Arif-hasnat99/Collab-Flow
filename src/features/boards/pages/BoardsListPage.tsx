import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Kanban, Plus, Loader2, MoreVertical, LayoutGrid, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { cn, stringToColor } from '../../../lib/utils';
import type { Database } from '../../../types/database.types';
import { CreateBoardModal } from '../components/CreateBoardModal';

type Board = Database['public']['Tables']['boards']['Row'] & {
  project?: { name: string } | null;
};

function useBoards(workspaceId?: string) {
  return useQuery({
    queryKey: ['boards', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      const { data, error } = await supabase
        .from('boards')
        .select(`*, project:projects(name)`)
        .eq('workspace_id', workspaceId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Board[];
    },
    enabled: !!workspaceId,
  });
}

function useProjects(workspaceId?: string) {
  return useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const { data } = await supabase.from('projects').select('id, name').eq('workspace_id', workspaceId);
      return data || [];
    },
    enabled: !!workspaceId,
  });
}

export default function BoardsListPage() {
  const { currentWorkspace, can } = useAuth();
  const queryClient = useQueryClient();
  const { data: boards, isLoading, error, refetch } = useBoards(currentWorkspace?.id);
  const { data: projects } = useProjects(currentWorkspace?.id);
  
  const [isCreating, setIsCreating] = useState(false);
  // Default to first project if available
  const defaultProjectId = projects && projects.length > 0 ? projects[0].id : '';

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
          Failed to load boards.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-content-lg mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-section text-ink font-display font-bold tracking-tight mb-2 uppercase">
            All Boards
          </h1>
          <p className="text-body text-ink-muted">
            Kanban boards across all projects in <strong className="text-ink">{currentWorkspace?.name}</strong>.
          </p>
        </div>

        {can('boards.create') && (
          <button className="btn-primary" onClick={() => {
            if (!defaultProjectId) {
              alert('You need to create a project first before creating a board.');
              return;
            }
            setIsCreating(true);
          }}>
            <Plus size={18} />
            <span>NEW BOARD</span>
          </button>
        )}
      </div>

      {/* Grid */}
      {boards && boards.length === 0 ? (
        <div className="bg-surface border-2 border-border border-dashed rounded p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 border border-border-light">
            <Kanban size={24} className="text-ink-muted" />
          </div>
          <h3 className="text-card font-display text-ink mb-2">No boards yet</h3>
          <p className="text-sm text-ink-muted mb-6 max-w-md">
            Create a Kanban board to track tasks, organize workflows, and collaborate with your team.
          </p>
          {can('boards.create') && (
            <button className="btn-primary" onClick={() => {
              if (!defaultProjectId) {
                alert('You need to create a project first before creating a board.');
                return;
              }
              setIsCreating(true);
            }}>Create your first board</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {boards?.map(board => {
            const accentColor = stringToColor(board.name);
            return (
              <Link 
                key={board.id} 
                to={`/app/boards/${board.id}`}
                className="group bg-surface border-2 border-border rounded shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Top color bar */}
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
                      <LayoutGrid size={12} />
                      <span className="truncate">{board.project?.name || 'Unknown Project'}</span>
                    </div>
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

      {isCreating && defaultProjectId && (
        <CreateBoardModal
          projectId={defaultProjectId}
          onClose={() => setIsCreating(false)}
          onCreated={() => {
            setIsCreating(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
