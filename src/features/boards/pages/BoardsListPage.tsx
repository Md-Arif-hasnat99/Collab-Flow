import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Kanban, Plus, Loader2, MoreVertical, Layers, Users } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { stringToColor } from '../../../lib/utils';
import type { Database } from '../../../types/database.types';

type Board = Database['public']['Tables']['boards']['Row'];

function useBoards(workspaceId?: string) {
  return useQuery({
    queryKey: ['boards', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      const { data, error } = await supabase
        .from('boards' as any)
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Board[];
    },
    enabled: !!workspaceId,
  });
}

export default function BoardsListPage() {
  const { currentWorkspace, can } = useAuth();
  const { data: boards, isLoading, error } = useBoards(currentWorkspace?.id);

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
            Boards
          </h1>
          <p className="text-body text-ink-muted">
            All Kanban boards across your projects in <strong className="text-ink">{currentWorkspace?.name}</strong>.
          </p>
        </div>

        {can('boards.create') && (
          <button className="btn-primary">
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
            <button className="btn-primary">Create your first board</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {boards?.map(board => {
            const accentColor = stringToColor(board.name);
            return (
              <Link 
                key={board.id} 
                to={`/app/boards/${board.id}`}
                className="group bg-surface border-2 border-border rounded shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all duration-200 flex flex-col overflow-hidden"
              >
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-10 h-10 rounded border-2 border-border flex items-center justify-center"
                      style={{ backgroundColor: accentColor + '20', color: accentColor }}
                    >
                      <Kanban size={20} />
                    </div>
                    <button 
                      className="btn-icon text-ink-muted hover:text-ink opacity-0 group-hover:opacity-100"
                      onClick={(e) => { e.preventDefault(); /* Open options */ }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  
                  <h3 className="text-card font-display font-bold text-ink mb-2 line-clamp-1">
                    {board.name}
                  </h3>
                  
                  <p className="text-sm text-ink-secondary line-clamp-2 flex-1 mb-6">
                    {board.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border-light text-[11px] font-display tracking-widest text-ink-muted uppercase">
                    <div className="flex items-center gap-1.5">
                      <Layers size={14} />
                      Tasks
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} />
                      Team
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
