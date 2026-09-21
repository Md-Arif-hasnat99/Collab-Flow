import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Plus, Trash2 } from 'lucide-react';
import { useBoard } from '../../contexts/BoardContext';
import Column from './Column';
import TaskCard from './TaskCard';
import AddColumnModal from './AddColumnModal';
import TaskDetailsModal from './TaskDetailsModal';
import type { Task } from '../../types';

const Board: React.FC = () => {
  const { currentBoard, columns, tasks, moveTask, deleteBoard, isAdmin } = useBoard();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Check if dropped over a column
    const column = columns.find((c) => c.id === over.id);
    if (column && task.columnId !== column.id) {
      const tasksInNewColumn = tasks.filter((t) => t.columnId === column.id);
      moveTask(taskId, column.id, tasksInNewColumn.length);
      return;
    }

    // Check if dropped over another task
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && overTask.columnId) {
      const tasksInColumn = tasks
        .filter((t) => t.columnId === overTask.columnId)
        .sort((a, b) => a.order - b.order);

      const overIndex = tasksInColumn.findIndex((t) => t.id === over.id);
      moveTask(taskId, overTask.columnId, overIndex);
    }
  };

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Board Selected</h2>
          <p className="text-slate-500 dark:text-slate-400">Please select a board from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Board Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{currentBoard.name}</h1>
            {currentBoard.description && (
              <p className="text-slate-600 dark:text-slate-400 mt-1">{currentBoard.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
                    deleteBoard(currentBoard.id);
                  }
                }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Board"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setShowAddColumn(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Column
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.columnId === column.id)}
                onTaskClick={setSelectedTask}
              />
            ))}

            {columns.length === 0 && (
              <div className="flex items-center justify-center w-full">
                <div className="text-center">
                  <p className="text-slate-500 dark:text-slate-400 mb-4">No columns yet. Add your first column to get started!</p>
                  {isAdmin && (
                    <button
                      onClick={() => setShowAddColumn(true)}
                      className="btn-primary flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-5 h-5" />
                      Add Column
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask ? (
              <div className="opacity-50">
                <TaskCard task={activeTask} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modals */}
      {showAddColumn && (
        <AddColumnModal
          isOpen={showAddColumn}
          onClose={() => setShowAddColumn(false)}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default Board;
