import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../auth/hooks/useAuth';

interface CreateBoardModalProps {
  projectId: string;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateBoardModal({ projectId, onClose, onCreated }: CreateBoardModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, currentWorkspace } = useAuth();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user || !currentWorkspace) return;
    setLoading(true);
    try {
      const { data: board, error } = await supabase.from('boards').insert({
        name: name.trim(),
        description: description.trim() || null,
        workspace_id: currentWorkspace.id,
        project_id: projectId,
        created_by: user.id,
      }).select().single();
      
      if (error) throw error;
      
      // Auto-create default columns for the new board
      const defaultColumns = [
        { name: 'TODO', position: 0 },
        { name: 'IN PROGRESS', position: 1 },
        { name: 'REVIEW', position: 2 },
        { name: 'DONE', position: 3 },
      ];
      
      const { error: colsError } = await supabase.from('columns').insert(
        defaultColumns.map(col => ({
          ...col,
          board_id: board.id,
        }))
      );
      
      if (colsError) console.error('Failed to create default columns:', colsError);
      
      toast.success('Board created successfully!');
      onCreated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create board');
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
            <h2 className="font-display font-bold text-ink text-lg uppercase">New Board</h2>
            <button onClick={onClose} className="btn-icon"><X size={16} /></button>
          </div>
          <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
            <div>
              <label className="cf-label">Board Name</label>
              <input
                type="text"
                autoFocus
                className="cf-input"
                placeholder="e.g. Sprint 1"
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
                placeholder="What is this board for?"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">CANCEL</button>
              <button type="submit" disabled={loading || !name.trim()} className="btn-primary flex-1">
                {loading ? <Loader2 size={14} className="animate-spin" /> : 'CREATE BOARD'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
