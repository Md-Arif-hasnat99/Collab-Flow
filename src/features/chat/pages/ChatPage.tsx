import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, Hash, MessageSquare, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../auth/hooks/useAuth';
import { timeAgo, cn } from '../../../lib/utils';
import type { ChatChannel, ChatMessage } from '../../../types/database.types';

export default function ChatPage() {
  const { user, profile, currentWorkspace } = useAuth();
  const queryClient = useQueryClient();
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<'channels' | 'chat'>('channels');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const workspaceId = currentWorkspace?.id;

  // ── Fetch channels ────────────────────────────────────────────
  const { data: channels, isLoading: channelsLoading } = useQuery({
    queryKey: ['channels', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_channels')
        .select('*')
        .eq('workspace_id', workspaceId!)
        .order('created_at');
      if (error) throw error;
      return data as ChatChannel[];
    },
    enabled: !!workspaceId,
  });

  // ── Select first channel ──────────────────────────────────────
  useEffect(() => {
    if (channels?.length && !selectedChannel) {
      setSelectedChannel(channels[0]);
    }
  }, [channels, selectedChannel]);

  // ── Fetch messages ────────────────────────────────────────────
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedChannel?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*, author:profiles!user_id(id, full_name, avatar_url)')
        .eq('channel_id', selectedChannel!.id)
        .order('created_at', { ascending: true })
        .limit(50);
      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!selectedChannel,
  });

  // ── Scroll to bottom ──────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Realtime ──────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedChannel) return;
    const sub = supabase
      .channel(`chat-${selectedChannel.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: `channel_id=eq.${selectedChannel.id}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['messages', selectedChannel.id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [selectedChannel, queryClient]);

  // ── Send message ──────────────────────────────────────────────
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !selectedChannel || sending) return;
    const text = message.trim();
    setMessage('');
    setSending(true);
    try {
      const { error } = await supabase.from('chat_messages').insert({
        channel_id: selectedChannel.id,
        user_id: user.id,
        content: text,
      });
      if (error) throw error;
    } catch {
      setMessage(text);
    } finally {
      setSending(false);
    }
  };

  // ── Channel list ──────────────────────────────────────────────
  const ChannelsList = () => (
    <div className={cn(
      'flex-shrink-0 border-r-2 border-border bg-surface flex flex-col',
      'w-full lg:w-[220px]',
      mobileView === 'channels' ? 'flex' : 'hidden lg:flex'
    )}>
      <div className="p-4 border-b-2 border-border">
        <h2 className="font-display font-bold text-sm text-ink tracking-widest uppercase">CHANNELS</h2>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {channelsLoading && <div className="cf-skeleton h-32 rounded m-2" />}
        {channels?.map(ch => (
          <button
            key={ch.id}
            onClick={() => { setSelectedChannel(ch); setMobileView('chat'); }}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded text-sm font-sans text-left transition-colors',
              selectedChannel?.id === ch.id
                ? 'bg-accent-light text-accent font-semibold'
                : 'text-ink-secondary hover:bg-muted hover:text-ink'
            )}
          >
            <Hash size={14} className="flex-shrink-0" />
            <span className="truncate">{ch.name}</span>
          </button>
        ))}
        {!channelsLoading && (!channels || channels.length === 0) && (
          <p className="text-meta text-ink-muted text-center py-6">No channels yet</p>
        )}
      </div>
    </div>
  );

  // ── Message area ──────────────────────────────────────────────
  const MessageArea = () => (
    <div className={cn(
      'flex-1 flex flex-col',
      mobileView === 'chat' ? 'flex' : 'hidden lg:flex'
    )}>
      {/* Channel header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-border bg-surface flex-shrink-0">
        {/* Mobile back */}
        <button onClick={() => setMobileView('channels')} className="lg:hidden btn-icon">
          ←
        </button>
        <Hash size={16} className="text-ink-muted" />
        <span className="font-display font-bold text-sm text-ink">{selectedChannel?.name ?? 'Select a channel'}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 flex flex-col gap-4">
        {messagesLoading && <div className="flex justify-center py-8"><Loader2 className="animate-spin text-accent" /></div>}
        {!selectedChannel && (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <MessageSquare size={32} className="mx-auto text-ink-muted mb-3" />
              <p className="font-display font-bold text-ink mb-1">SELECT A CHANNEL</p>
              <p className="text-meta text-ink-muted">Choose a channel from the left to start chatting.</p>
            </div>
          </div>
        )}
        {messages?.map((msg, i) => {
          const author = msg.author as { id: string; full_name: string | null } | null;
          const prev = messages[i - 1];
          const prevAuthor = (prev?.author as { id: string } | null);
          const isSame = prevAuthor?.id === author?.id;
          const isOwn = author?.id === user?.id;

          return (
            <div key={msg.id} className={cn('flex gap-3', isOwn ? 'flex-row-reverse' : '', isSame ? 'mt-0' : 'mt-2')}>
              {!isSame && !isOwn && (
                <div className="w-8 h-8 bg-accent rounded-full border-2 border-border flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  {(author?.full_name ?? '?')[0].toUpperCase()}
                </div>
              )}
              {isSame && !isOwn && <div className="w-8 flex-shrink-0" />}
              <div className={cn('max-w-[70%]', isOwn ? 'items-end' : 'items-start', 'flex flex-col gap-1')}>
                {!isSame && (
                  <div className={cn('flex items-baseline gap-2', isOwn ? 'flex-row-reverse' : '')}>
                    <span className="text-meta font-display font-bold text-ink">
                      {isOwn ? 'You' : (author?.full_name ?? 'Unknown')}
                    </span>
                    <span className="text-[10px] text-ink-muted">{timeAgo(msg.created_at)}</span>
                  </div>
                )}
                <div className={cn(
                  'px-3 py-2 rounded text-meta leading-relaxed',
                  isOwn
                    ? 'bg-accent text-white border-2 border-accent'
                    : 'bg-surface border-2 border-border text-ink'
                )}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {selectedChannel && (
        <form onSubmit={sendMessage} className="flex items-center gap-3 p-4 border-t-2 border-border bg-surface flex-shrink-0">
          <input
            type="text"
            placeholder={`Message #${selectedChannel.name}…`}
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="cf-input flex-1"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="btn-primary px-3 py-2 gap-0"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden border-t border-border-muted">
      <ChannelsList />
      <MessageArea />
    </div>
  );
}
