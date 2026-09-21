import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { subDays, format, eachDayOfInterval } from 'date-fns';

type Range = '7' | '30' | '90';

const ACCENT = '#FF6B35';
const MUTED  = '#EAEAE6';
const STATUS_COLORS = ['#EAEAE6', '#93C5FD', '#F4C471', '#FF6B35', '#A8D5C2'];

export default function AnalyticsPage() {
  const { currentWorkspace, can } = useAuth();
  const [range, setRange] = useState<Range>('30');
  const workspaceId = currentWorkspace?.id;
  const days = parseInt(range);

  if (!can('analytics.view')) {
    return (
      <div className="p-8 text-center">
        <p className="font-display font-bold text-ink">ACCESS RESTRICTED.</p>
        <p className="text-meta text-ink-muted mt-2">You don't have permission to view analytics.</p>
      </div>
    );
  }

  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics', workspaceId, range],
    queryFn: async () => {
      const since = subDays(new Date(), days).toISOString();

      const [tasks, doneTasks] = await Promise.all([
        supabase.from('tasks').select('id, status, priority, created_at').eq('workspace_id', workspaceId!),
        supabase.from('tasks').select('id, updated_at').eq('workspace_id', workspaceId!).eq('status', 'DONE').gte('updated_at', since),
      ]);

      const allTasks = tasks.data ?? [];
      const done = doneTasks.data ?? [];
      const total = allTasks.length;
      const completionRate = total > 0 ? Math.round((allTasks.filter(t => t.status === 'DONE').length / total) * 100) : 0;

      // Tasks by status
      const byStatus = ['BACKLOG','TODO','IN_PROGRESS','REVIEW','DONE'].map(s => ({
        name: s.replace(/_/g, ' '),
        count: allTasks.filter(t => t.status === s).length,
      }));

      // Tasks by priority
      const byPriority = ['LOW','MEDIUM','HIGH','URGENT'].map(p => ({
        name: p,
        count: allTasks.filter(t => t.priority === p).length,
      }));

      // Daily completions (past N days)
      const interval = eachDayOfInterval({ start: subDays(new Date(), days - 1), end: new Date() });
      const daily = interval.map(date => {
        const dayStr = format(date, 'yyyy-MM-dd');
        return {
          date: format(date, days <= 7 ? 'EEE' : 'MMM d'),
          completed: done.filter(t => t.updated_at?.startsWith(dayStr)).length,
        };
      });

      return { total, completionRate, done: done.length, byStatus, byPriority, daily };
    },
    enabled: !!workspaceId,
  });

  const MetricCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
    <div className="cf-card">
      <div className="text-label text-ink-muted mb-2">{label}</div>
      <div className="font-display font-bold text-ink mb-1" style={{ fontSize: '36px', lineHeight: 1 }}>{value}</div>
      {sub && <div className="text-meta text-ink-muted">{sub}</div>}
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-label text-ink-muted mb-1">INSIGHTS</p>
          <h1 className="font-display font-bold text-ink" style={{ fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.02em' }}>ANALYTICS</h1>
        </div>
        {/* Time range filter */}
        <div className="flex border-2 border-border rounded overflow-hidden">
          {(['7', '30', '90'] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 text-meta font-display font-bold border-r-2 border-border last:border-r-0 transition-colors ${
                range === r ? 'bg-accent text-white' : 'bg-surface text-ink-secondary hover:bg-muted'
              }`}
            >
              {r} DAYS
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[0,1,2,3].map(i => <div key={i} className="cf-skeleton h-28 rounded" />)}
        </div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard label="TASKS COMPLETED" value={stats?.done ?? 0} sub={`last ${range} days`} />
            <MetricCard label="COMPLETION RATE" value={`${stats?.completionRate ?? 0}%`} sub="overall" />
            <MetricCard label="TOTAL TASKS" value={stats?.total ?? 0} sub="in workspace" />
            <MetricCard label="ACTIVE MEMBERS" value="—" sub="tracked" />
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line: daily completions */}
            <div className="cf-card-flat p-6">
              <h3 className="section-label">TASKS COMPLETED OVER TIME</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats?.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEAE6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'Space Grotesk' }} />
                  <YAxis tick={{ fontSize: 11, fontFamily: 'Space Grotesk' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="completed" stroke={ACCENT} fill={`${ACCENT}20`} strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bar: by status */}
            <div className="cf-card-flat p-6">
              <h3 className="section-label">TASKS BY STATUS</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats?.byStatus} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEAE6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'Space Grotesk' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fontFamily: 'Space Grotesk' }} width={90} />
                  <Tooltip />
                  <Bar dataKey="count" fill={ACCENT} radius={[0, 2, 2, 0]}>
                    {stats?.byStatus.map((_, i) => (
                      <Cell key={i} fill={STATUS_COLORS[i] ?? MUTED} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie: by priority */}
            <div className="cf-card-flat p-6">
              <h3 className="section-label">TASKS BY PRIORITY</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={stats?.byPriority} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {stats?.byPriority.map((_, i) => (
                      <Cell key={i} fill={[MUTED, '#F4C471', '#FCA5A5', '#9B1C1C'][i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar: by priority (vertical) */}
            <div className="cf-card-flat p-6">
              <h3 className="section-label">PRIORITY BREAKDOWN</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats?.byPriority}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAEAE6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Space Grotesk' }} />
                  <YAxis tick={{ fontSize: 11, fontFamily: 'Space Grotesk' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={ACCENT} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
