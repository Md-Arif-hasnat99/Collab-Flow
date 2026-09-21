import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, Loader2, MoreVertical, LayoutGrid, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { cn, stringToColor } from '../../../lib/utils';
import type { Database } from '../../../types/database.types';
import { CreateProjectModal } from '../components/CreateProjectModal';

type Project = Database['public']['Tables']['projects']['Row'];

function useProjects(workspaceId?: string) {
  return useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      const { data, error } = await supabase
        .from('projects' as any)
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
    enabled: !!workspaceId,
  });
}

export default function ProjectsListPage() {
  const { currentWorkspace, can } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: projects, isLoading, error, refetch } = useProjects(currentWorkspace?.id);
  const [isCreating, setIsCreating] = useState(false);

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
          Failed to load projects.
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
            Projects
          </h1>
          <p className="text-body text-ink-muted">
            Manage your project folders in <strong className="text-ink">{currentWorkspace?.name}</strong>.
          </p>
        </div>

        {can('projects.create') && (
          <button className="btn-primary" onClick={() => setIsCreating(true)}>
            <Plus size={18} />
            <span>NEW PROJECT</span>
          </button>
        )}
      </div>

      {/* Grid */}
      {projects && projects.length === 0 ? (
        <div className="bg-surface border-2 border-border border-dashed rounded p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 border border-border-light">
            <FolderOpen size={24} className="text-ink-muted" />
          </div>
          <h3 className="text-card font-display text-ink mb-2">No projects yet</h3>
          <p className="text-sm text-ink-muted mb-6 max-w-md">
            Projects help you organize related Kanban boards, tasks, and files into a single workspace.
          </p>
          {can('projects.create') && (
            <button className="btn-primary" onClick={() => setIsCreating(true)}>Create your first project</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects?.map(project => {
            const accentColor = stringToColor(project.name);
            return (
              <Link 
                key={project.id} 
                to={`/app/projects/${project.id}`}
                className="group bg-surface border-2 border-border rounded shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Top color bar */}
                <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-ink text-lg line-clamp-1">{project.name}</h3>
                    <button className="btn-icon -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.preventDefault(); /* TODO: project menu */ }}>
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  
                  <p className="text-sm text-ink-secondary line-clamp-2 flex-1 mb-4">
                    {project.description || 'No description provided.'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs font-display tracking-widest text-ink-muted uppercase border-t border-border-light pt-4 mt-auto">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(project.created_at), 'MMM d')}</span>
                    <span className="flex items-center gap-1 group-hover:text-accent transition-colors">
                      <LayoutGrid size={12} /> View Boards
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {isCreating && (
        <CreateProjectModal
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
