import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Search, Filter, AlertCircle, RefreshCw, Loader2, X, Calendar, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../auth/hooks/useAuth';
import { cn, timeAgo } from '../../../lib/utils';
import type { Board, Column, Task } from '../../../types/database.types';

// ── Priority config ───────────────────────────────────────────────
const PRIORITY_CONFIG = {
  LOW:    { label: 'LOW',    class: 'priority-low' },
  MEDIUM: { label: 'MED',   class: 'priority-medium' },
  HIGH:   { label: 'HIGH',  class: 'priority-high' },
  URGENT: { label: 'URGENT', class: 'priority-urgent' },
};

// ── Task Card ─────────────────────────────────────────────────────
function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const pri = PRIORITY_CONFIG[task.priority];
  const checklist = task.checklist ?? [];
  const done = checklist.filter(c => c.is_completed).length;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'bg-surface border-2 border-border rounded p-3 cursor-pointer hover:shadow-brutal transition-all duration-100 group',
        isDragging ? 'opacity-40 shadow-brutal-lg rotate-1' : ''
      )}
      onClick={onClick}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="float-right ml-2 -mt-1 -mr-1 p-1 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        onClick={e => e.stopPropagation()}
      >
        <GripVertical size={14} />
      </div>

      {/* Priority + Labels */}
      <div className="flex flex-wrap gap-1 mb-2">
        <span className={pri.class}>{pri.label}</span>
        {task.labels?.slice(0, 2).map(l => (
          <span key={l.id} className="cf-badge text-[9px] px-1.5 py-0" style={{ borderColor: l.color, color: l.color }}>
            #{l.name}
          </span>
        ))}
      </div>

      {/* Title */}
      <p className="text-meta font-semibold text-ink leading-snug mb-3">{task.title}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Assignees */}
          <div className="flex -space-x-1">
            {task.assignees?.slice(0, 3).map(a => (
              <div
                key={a.id}
                className="w-5 h-5 rounded-full border border-white bg-accent flex items-center justify-center text-[8px] font-bold text-white"
                title={a.full_name ?? ''}
              >
                {(a.full_name ?? '?')[0].toUpperCase()}
              </div>
            ))}
          </div>
          {/* Checklist */}
          {checklist.length > 0 && (
            <span className="text-[10px] text-ink-muted font-display">✓ {done}/{checklist.length}</span>
          )}
          {/* Comments */}
          {(task.comments?.length ?? 0) > 0 && (
            <span className="text-[10px] text-ink-muted">💬 {task.comments?.length}</span>
          )}
        </div>
        {/* Due date */}
        {task.due_date && (
          <span className={cn(
            'text-[10px] font-display font-semibold',
            new Date(task.due_date) < new Date() ? 'text-danger' : 'text-ink-muted'
          )}>
            <Calendar size={10} className="inline mr-0.5" />
            {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Column ────────────────────────────────────────────────────────
function KanbanColumn({
  column, tasks, onAddTask, onTaskClick
}: {
  column: Column; tasks: Task[]; onAddTask: () => void; onTaskClick: (t: Task) => void;
}) {
  const { setNodeRef, isOver } = useSortable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col w-[280px] flex-shrink-0 bg-muted border-2 border-border rounded',
        isOver ? 'ring-2 ring-accent ring-offset-1' : ''
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b-2 border-border bg-surface rounded-t">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-meta text-ink tracking-widest uppercase">
            {column.name}
          </span>
          <span className="w-5 h-5 bg-muted border border-border rounded-sm flex items-center justify-center text-[10px] font-display text-ink-muted">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="btn-icon w-6 h-6 text-ink-muted hover:text-accent"
          title={`Add task to ${column.name}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 flex flex-col gap-2 min-h-[200px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border-light rounded p-4 m-1">
            <p className="text-[10px] font-display text-ink-muted text-center">DROP TASKS HERE</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Create Task Modal ─────────────────────────────────────────────
function CreateTaskModal({
  boardId, columnId, workspaceId, projectId, onClose, onCreated
}: {
  boardId: string; columnId: string; workspaceId: string; projectId: string;
  onClose: () => void; onCreated: () => void;
}) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('tasks').insert({
        title: title.trim(),
        column_id: columnId,
        board_id: boardId,
        workspace_id: workspaceId,
        project_id: projectId,
        priority,
        status: 'TODO',
        position: 0,
        due_date: dueDate || null,
        created_by: user.id,
      });
      if (error) throw error;
      toast.success('Task created');
      onCreated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create task');
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
            <h2 className="font-display font-bold text-ink text-lg">ADD TASK</h2>
            <button onClick={onClose} className="btn-icon"><X size={16} /></button>
          </div>
          <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
            <div>
              <label className="cf-label">Title</label>
              <input
                type="text"
                autoFocus
                className="cf-input"
                placeholder="Task title…"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="cf-label">Priority</label>
                <select className="cf-select" value={priority} onChange={e => setPriority(e.target.value as Task['priority'])}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div>
                <label className="cf-label">Due Date</label>
                <input type="date" className="cf-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">CANCEL</button>
              <button type="submit" disabled={loading || !title.trim()} className="btn-primary flex-1">
                {loading ? <Loader2 size={14} className="animate-spin" /> : 'CREATE TASK'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ── Board Page ────────────────────────────────────────────────────
export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const { user, currentWorkspace, can } = useAuth();
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // ── Fetch board ───────────────────────────────────────────────
  const { data: board, isLoading: boardLoading, error: boardError } = useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('boards').select('*').eq('id', boardId!).single();
      if (error) throw error;
      return data as Board;
    },
    enabled: !!boardId,
  });

  // ── Fetch columns + tasks ─────────────────────────────────────
  const { data: columns, isLoading: columnsLoading, refetch } = useQuery({
    queryKey: ['board-columns', boardId],
    queryFn: async () => {
      const { data: cols, error: colErr } = await supabase
        .from('columns').select('*').eq('board_id', boardId!).order('position');
      if (colErr) throw colErr;

      const { data: tasks, error: taskErr } = await supabase
        .from('tasks')
        .select('*, assignees:task_assignees(user_id, profile:profiles(id, full_name, avatar_url)), labels:task_labels(label:labels(id, name, color)), checklist:task_checklists(*), comments:task_comments(id)')
        .eq('board_id', boardId!)
        .order('position');
      if (taskErr) throw taskErr;

      return (cols ?? []).map(col => ({
        ...col,
        tasks: (tasks ?? []).filter(t => t.column_id === col.id),
      })) as (Column & { tasks: Task[] })[];
    },
    enabled: !!boardId,
  });

  // ── Realtime sync ─────────────────────────────────────────────
  useEffect(() => {
    if (!boardId) return;
    const sub = supabase
      .channel(`board-${boardId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `board_id=eq.${boardId}` },
        () => queryClient.invalidateQueries({ queryKey: ['board-columns', boardId] })
      )
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [boardId, queryClient]);

  // ── Optimistic drag ───────────────────────────────────────────
  const moveTask = useMutation({
    mutationFn: async ({ taskId, toColumnId, position }: { taskId: string; toColumnId: string; position: number }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ column_id: toColumnId, position })
        .eq('id', taskId);
      if (error) throw error;
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['board-columns', boardId] });
      toast.error('Failed to move task');
    },
  });

  const handleDragStart = ({ active }: DragStartEvent) => {
    const task = columns?.flatMap(c => c.tasks).find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over || !columns) return;

    const fromCol = columns.find(c => c.tasks.some(t => t.id === active.id));
    const toCol = columns.find(c => c.id === over.id || c.tasks.some(t => t.id === over.id));
    if (!fromCol || !toCol) return;

    const taskId = active.id as string;
    const newPosition = toCol.tasks.findIndex(t => t.id === over.id);

    // Optimistic update
    queryClient.setQueryData(['board-columns', boardId], (old: typeof columns) =>
      old?.map(col => {
        if (col.id === fromCol.id && col.id !== toCol.id) {
          return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        }
        if (col.id === toCol.id) {
          const task = fromCol.tasks.find(t => t.id === taskId)!;
          const filtered = col.tasks.filter(t => t.id !== taskId);
          const idx = newPosition >= 0 ? newPosition : filtered.length;
          return { ...col, tasks: [...filtered.slice(0, idx), task, ...filtered.slice(idx)] };
        }
        return col;
      })
    );

    moveTask.mutate({ taskId, toColumnId: toCol.id, position: Math.max(0, newPosition) });
  };

  // ── Create default columns ────────────────────────────────────
  const createDefaultColumns = async () => {
    if (!boardId || !user) return;
    const defaults = ['BACKLOG', 'TODO', 'IN PROGRESS', 'REVIEW', 'DONE'];
    for (let i = 0; i < defaults.length; i++) {
      await supabase.from('columns').insert({ board_id: boardId, name: defaults[i], position: i });
    }
    refetch();
  };

  const filteredColumns = search
    ? columns?.map(col => ({
        ...col,
        tasks: col.tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase())),
      }))
    : columns;

  if (boardLoading || columnsLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  if (boardError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle size={32} className="text-danger" />
        <p className="font-display font-bold text-ink">COULDN'T LOAD THIS BOARD.</p>
        <button onClick={() => refetch()} className="btn-secondary gap-2">
          <RefreshCw size={14} /> RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-border bg-surface flex-shrink-0 flex-wrap">
        <h1 className="font-display font-bold text-ink" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>
          {board?.name ?? 'BOARD'}
        </h1>
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Search tasks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cf-input pl-8 py-1.5 w-[180px] text-sm"
            />
          </div>
          {can('tasks.create') && (
            <button
              onClick={() => columns?.[0] && setAddingToColumn(columns[0].id)}
              className="btn-primary text-sm px-3 py-1.5 gap-1.5"
            >
              <Plus size={14} /> ADD TASK
            </button>
          )}
        </div>
      </div>

      {/* Empty — no columns */}
      {(!columns || columns.length === 0) && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
          <div className="w-14 h-14 border-2 border-border flex items-center justify-center">
            <Flag size={24} className="text-ink-muted" />
          </div>
          <div>
            <p className="font-display font-bold text-ink mb-1">NO COLUMNS YET.</p>
            <p className="text-meta text-ink-muted">Add columns to start organizing your board.</p>
          </div>
          {can('boards.update') && (
            <button onClick={createDefaultColumns} className="btn-primary gap-2">
              <Plus size={14} /> ADD DEFAULT COLUMNS
            </button>
          )}
        </div>
      )}

      {/* Kanban */}
      {columns && columns.length > 0 && (
        <div className="flex-1 overflow-auto kanban-scroll p-6 pt-4">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full items-start">
              {filteredColumns?.map(col => (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={col.tasks}
                  onAddTask={() => setAddingToColumn(col.id)}
                  onTaskClick={setSelectedTask}
                />
              ))}
              {/* Add column button */}
              {can('boards.update') && (
                <button
                  onClick={() => toast.info('Add column coming soon')}
                  className="flex-shrink-0 w-[280px] h-12 border-2 border-dashed border-border rounded flex items-center justify-center gap-2 text-meta text-ink-muted hover:border-accent hover:text-accent transition-colors font-display font-semibold"
                >
                  <Plus size={14} /> ADD COLUMN
                </button>
              )}
            </div>

            <DragOverlay>
              {activeTask && (
                <div className="bg-surface border-2 border-border rounded p-3 shadow-modal opacity-90 rotate-2 w-[280px]">
                  <p className="text-meta font-semibold text-ink">{activeTask.title}</p>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* Create task modal */}
      {addingToColumn && board && currentWorkspace && (
        <CreateTaskModal
          boardId={board.id}
          columnId={addingToColumn}
          workspaceId={currentWorkspace.id}
          projectId={board.project_id}
          onClose={() => setAddingToColumn(null)}
          onCreated={() => {
            setAddingToColumn(null);
            queryClient.invalidateQueries({ queryKey: ['board-columns', boardId] });
          }}
        />
      )}
    </div>
  );
}
