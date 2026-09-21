import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import type { Column as ColumnType, Task } from '../../types';
import { useBoard } from '../../contexts/BoardContext';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, onTaskClick }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { deleteColumn, isAdmin } = useBoard();

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  const handleDeleteColumn = () => {
    if (window.confirm('Are you sure you want to delete this column? All tasks will be deleted.')) {
      deleteColumn(column.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="flex-shrink-0 w-80 h-full flex flex-col">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 h-full flex flex-col transition-colors duration-200">
        {/* Column Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: column.color }}
              ></div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{column.name}</h3>
              <span className="badge-primary">{tasks.length}</span>
            </div>

            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20">
                      <button
                        onClick={() => {
                          // Edit column functionality
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Column
                      </button>
                      <button
                        onClick={handleDeleteColumn}
                        className="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Column
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          )}
        </div>

        {/* Tasks List */}
        <div
          ref={setNodeRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin"
        >
          <SortableContext
            items={sortedTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
              />
            ))}
          </SortableContext>

          {tasks.length === 0 && (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              No tasks yet
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTaskModal
          columnId={column.id}
          isOpen={showAddTask}
          onClose={() => setShowAddTask(false)}
        />
      )}
    </div>
  );
};

export default Column;
