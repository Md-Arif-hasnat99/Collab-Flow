import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../auth/hooks/useAuth';

interface CreateProjectModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateProjectModal({ onClose, onCreated }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, currentWorkspace } = useAuth();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user || !currentWorkspace) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('projects').insert({
        name: name.trim(),
        description: description.trim() || null,
        workspace_id: currentWorkspace.id,
        created_by: user.id,
      });
      if (error) throw error;
      toast.success('Project created successfully!');
      onCreated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
        <div className="w-full max-w-[400px] bg-surface border-2 border-border rounded shadow-brutal animate-scale-in">
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="font-display font-bold text-ink text-lg uppercase">New Project</h2>
            <button onClick={onClose} className="btn-icon"><X size={16} /></button>
          </div>
          <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
            <div>
              <label className="cf-label">Project Name</label>
              <input
                type="text"
                autoFocus
                className="cf-input"
                placeholder="e.g. Website Redesign"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="cf-label">Description <span className="text-ink-muted normal-case font-normal">(optional)</span></label>
              <textarea
                className="cf-textarea"
                rows={3}
                placeholder="What is this project about?"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">CANCEL</button>
              <button type="submit" disabled={loading || !name.trim()} className="btn-primary flex-1">
                {loading ? <Loader2 size={14} className="animate-spin" /> : 'CREATE PROJECT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
