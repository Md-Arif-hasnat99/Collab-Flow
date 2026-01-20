import React, { useState } from 'react';
import {
  X,
  Calendar,
  Tag,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  MessageCircle,
  User,
} from 'lucide-react';
import type { Task, ChecklistItem } from '../../types';
import { useBoard } from '../../contexts/BoardContext';
import { format } from 'date-fns';

interface TaskDetailsModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, isOpen, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const { updateTask, deleteTask } = useBoard();

  const handleToggleComplete = async () => {
    await updateTask(task.id, { isCompleted: !task.isCompleted });
    if (!task.isCompleted) {
      onClose();
    }
  };

  const handleSave = async () => {
    await updateTask(task.id, { title, description, priority });
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
      onClose();
    }
  };

  const handleToggleChecklistItem = async (itemId: string) => {
    const updatedChecklist = task.checklist?.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    await updateTask(task.id, { checklist: updatedChecklist });
  };

  const handleAddChecklistItem = async () => {
    if (!newChecklistItem.trim()) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistItem,
      completed: false,
      order: task.checklist?.length || 0,
    };

    await updateTask(task.id, {
      checklist: [...(task.checklist || []), newItem],
    });
    setNewChecklistItem('');
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    const updatedChecklist = task.checklist?.filter((item) => item.id !== itemId);
    await updateTask(task.id, { checklist: updatedChecklist });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl my-8 animate-fade-in transition-colors duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <span className={`badge ${
              priority === 'high' ? 'badge-danger' :
              priority === 'medium' ? 'badge-warning' :
              'badge-success'
            }`}>
              {priority}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Task Details</h2>
            {task.isCompleted && (
              <span className="bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                Completed
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input text-lg font-semibold bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[120px] resize-none bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
              placeholder="Add a detailed description..."
            />
          </div>

          {/* Meta Information Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="input bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </label>
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                {task.dueDate ? format(task.dueDate, 'PPP') : 'No due date'}
              </div>
            </div>

            {/* Created */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Created
              </label>
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                {format(task.createdAt, 'PPP')}
              </div>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span key={index} className="badge-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Checklist */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Checklist
              {task.checklist && task.checklist.length > 0 && (
                <span className="badge-primary">
                  {task.checklist.filter((item) => item.completed).length}/{task.checklist.length}
                </span>
              )}
            </label>

            {/* Checklist Items */}
            <div className="space-y-2 mb-3">
              {task.checklist?.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg group">
                  <button
                    onClick={() => handleToggleChecklistItem(item.id)}
                    className="flex-shrink-0"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-success-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                  <span className={`flex-1 ${item.completed ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-slate-200'}`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => handleDeleteChecklistItem(item.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-danger-600" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Checklist Item */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                className="input flex-1 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                placeholder="Add checklist item..."
              />
              <button
                onClick={handleAddChecklistItem}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Assigned Users */}
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Assigned To
              </label>
              <div className="flex gap-2">
                {task.assignedTo.map((userId, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-medium">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{userId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Comments
              {task.comments > 0 && (
                <span className="badge-primary">{task.comments}</span>
              )}
            </label>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm">Comments feature coming soon...</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleDelete}
            className="btn-danger"
          >
            Delete Task
          </button>
          <div className="flex gap-3">
             <button
              onClick={handleToggleComplete}
              className={`btn ${task.isCompleted ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600' : 'bg-success-600 text-white hover:bg-success-700'}`}
            >
              {task.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
            <button onClick={handleSave} className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
