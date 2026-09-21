import { useMemo } from 'react';
import { useBoard } from '../contexts/BoardContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const { tasks, columns, currentBoard, isAdmin } = useBoard();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => {
      const col = columns.find(c => c.id === t.columnId);
      return t.isCompleted || col?.name.toLowerCase().includes('done') || col?.name.toLowerCase().includes('complete');
    }).length;
    
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const overdue = tasks.filter(t => {
      const col = columns.find(c => c.id === t.columnId);
      const isDone = t.isCompleted || col?.name.toLowerCase().includes('done') || col?.name.toLowerCase().includes('complete');
      return t.dueDate && new Date(t.dueDate) < new Date() && !isDone;
    }).length;

    return { total, completed, highPriority, overdue };
  }, [tasks, columns]);

  const tasksByColumn = useMemo(() => {
    return columns.map(col => ({
      name: col.name,
      count: tasks.filter(t => t.columnId === col.id).length
    }));
  }, [tasks, columns]);

  const tasksByPriority = useMemo(() => {
    return [
      { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
      { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
    ].filter(i => i.value > 0);
  }, [tasks]);

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500 dark:text-slate-400">Select a board to view analytics</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <AlertTriangle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400">Only team administrators can view analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Analytics: {currentBoard.name}</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of project progress and team velocity</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Tasks</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Circle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Completed</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completed}</h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">High Priority</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.highPriority}</h3>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Overdue</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.overdue}</h3>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Distribution */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Task Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksByColumn}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Tasks by Priority</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByPriority}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tasksByPriority.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
