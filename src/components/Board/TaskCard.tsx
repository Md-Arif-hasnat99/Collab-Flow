import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, MessageCircle, Paperclip, User } from 'lucide-react';
import type { Task } from '../../types';
import { format, isBefore, addDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;

    const now = new Date();
    const dueDate = task.dueDate;

    if (isBefore(dueDate, now)) {
      return { text: 'Overdue', className: 'text-danger-600 bg-danger-50' };
    } else if (isBefore(dueDate, addDays(now, 2))) {
      return { text: 'Due Soon', className: 'text-warning-600 bg-warning-50' };
    }
    return { text: format(dueDate, 'MMM d'), className: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50' };
  };

  const dueDateStatus = getDueDateStatus();

  const priorityStyles = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`card-hover cursor-pointer group ${task.isCompleted ? 'opacity-75' : ''}`}
    >
      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <span className={priorityStyles[task.priority]}>
            {task.priority}
          </span>
          {task.isCompleted && (
             <span className="flex items-center justify-center w-5 h-5 bg-success-100 dark:bg-success-900/30 rounded-full text-success-600 dark:text-success-400">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                 <polyline points="20 6 9 17 4 12" />
               </svg>
             </span>
          )}
        </div>
        {dueDateStatus && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${dueDateStatus.className}`}>
            <Clock className="w-3 h-3" />
            {dueDateStatus.text}
          </div>
        )}
      </div>

      {/* Task Title */}
      <h4 className={`font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 ${task.isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Checklist Progress */}
      {task.checklist && task.checklist.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <div
                className="bg-success-500 h-1.5 rounded-full transition-all"
                style={{
                  width: `${(task.checklist.filter((item) => item.completed).length / task.checklist.length) * 100}%`,
                }}
              ></div>
            </div>
            <span>
              {task.checklist.filter((item) => item.completed).length}/{task.checklist.length}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-500">
        <div className="flex items-center gap-3">
          {task.comments > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{task.comments}</span>
            </div>
          )}
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="w-4 h-4" />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>

        {/* Assigned Users */}
        {task.assignedTo && task.assignedTo.length > 0 && (
          <div className="flex -space-x-2">
            {task.assignedTo.slice(0, 3).map((userId, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-2 border-white flex items-center justify-center text-xs text-white font-medium"
                title={userId}
              >
                <User className="w-3 h-3" />
              </div>
            ))}
            {task.assignedTo.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 font-medium">
                +{task.assignedTo.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
