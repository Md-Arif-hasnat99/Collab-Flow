import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../auth/hooks/useAuth';
import { timeAgo } from '../../../lib/utils';
import type { Notification } from '../../../types/database.types';
import { Link } from 'react-router-dom';

export default function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, actor:profiles!actor_id(full_name, avatar_url)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user!.id)
        .eq('is_read', false);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const sub = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [user, queryClient]);

  const unread = notifications?.filter(n => !n.is_read) ?? [];

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-[360px] bg-surface border-2 border-border rounded shadow-[0_8px_0_#171717] z-50 animate-slide-in-top"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-border">
        <div className="flex items-center gap-2">
          <Bell size={16} />
          <span className="font-display font-bold text-sm text-ink">NOTIFICATIONS</span>
          {unread.length > 0 && (
            <span className="badge-accent text-[10px] px-1.5 py-0">{unread.length}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread.length > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              className="btn-ghost text-[11px] px-2 py-1 gap-1"
              title="Mark all read"
            >
              <CheckCheck size={12} /> All read
            </button>
          )}
          <button onClick={onClose} className="btn-icon w-7 h-7">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
        {isLoading && (
          <div className="p-4 flex flex-col gap-2">
            {[0,1,2].map(i => <div key={i} className="cf-skeleton h-14 rounded" />)}
          </div>
        )}
        {!isLoading && (!notifications || notifications.length === 0) && (
          <div className="py-12 text-center">
            <Bell size={24} className="mx-auto text-ink-muted mb-3" />
            <p className="text-meta text-ink-muted font-display">No notifications</p>
          </div>
        )}
        {notifications?.map(n => {
          const actor = n.actor as { full_name: string } | null;
          return (
            <div
              key={n.id}
              className={`flex gap-3 p-4 border-b border-border-muted hover:bg-muted transition-colors cursor-pointer ${!n.is_read ? 'bg-accent-light/30' : ''}`}
              onClick={() => { markRead(n.id); onClose(); }}
            >
              {/* Unread dot */}
              <div className="flex-shrink-0 mt-1.5">
                {!n.is_read ? (
                  <div className="w-2 h-2 bg-accent rounded-full" />
                ) : (
                  <div className="w-2 h-2 rounded-full border border-border-light" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-meta text-ink leading-snug">{n.title}</p>
                {n.body && <p className="text-[11px] text-ink-muted mt-0.5 truncate">{n.body}</p>}
                <p className="text-[11px] text-ink-muted mt-1">{timeAgo(n.created_at)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t-2 border-border">
        <Link
          to="/app/activity"
          onClick={onClose}
          className="text-center block text-meta text-ink-muted hover:text-accent transition-colors font-display font-semibold"
        >
          VIEW ALL ACTIVITY
        </Link>
      </div>
    </div>
  );
}
