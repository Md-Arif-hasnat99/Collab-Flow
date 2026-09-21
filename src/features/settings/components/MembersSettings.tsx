import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Mail, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../auth/hooks/useAuth';
import { inviteSchema, type InviteForm } from '../../auth/schemas/auth.schemas';
import { sendInvitation } from '../../auth/services/auth.service';
import { timeAgo } from '../../../lib/utils';
import type { WorkspaceMember, Profile } from '../../../types/database.types';

export default function MembersSettings() {
  const { currentWorkspace, can, user } = useAuth();
  const queryClient = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [inviting, setInviting] = useState(false);
  const workspaceId = currentWorkspace?.id;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'MEMBER' },
  });

  const { data: members, isLoading } = useQuery({
    queryKey: ['members', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('*, profile:profiles(*)')
        .eq('workspace_id', workspaceId!)
        .order('joined_at');
      if (error) throw error;
      return data as (WorkspaceMember & { profile: Profile })[];
    },
    enabled: !!workspaceId,
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId!)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member removed');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onInvite = async (data: InviteForm) => {
    if (!workspaceId) return;
    setInviting(true);
    try {
      await sendInvitation(workspaceId, data.email, data.role);
      toast.success(`Invitation sent to ${data.email}`);
      reset();
      setShowInvite(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally { setInviting(false); }
  };

  return (
    <div className="max-w-[700px]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-bold text-2xl text-ink">MEMBERS</h2>
        {can('members.invite') && (
          <button onClick={() => setShowInvite(!showInvite)} className="btn-primary gap-2 text-sm">
            <Plus size={14} /> INVITE MEMBER
          </button>
        )}
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="cf-card mb-6 animate-slide-in-top">
          <h3 className="font-display font-bold text-ink mb-4">INVITE TEAM MEMBER</h3>
          <form onSubmit={handleSubmit(onInvite)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="cf-label">Email</label>
                <input type="email" placeholder="teammate@company.com" className={`cf-input ${errors.email ? 'border-danger' : ''}`} {...register('email')} />
                {errors.email && <p className="text-meta text-danger mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="cf-label">Role</label>
                <select className="cf-select" {...register('role')}>
                  <option value="VIEWER">Viewer</option>
                  <option value="MEMBER">Member</option>
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  {can('roles.manage') && <option value="ADMIN">Admin</option>}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowInvite(false)} className="btn-secondary">CANCEL</button>
              <button type="submit" disabled={inviting} className="btn-primary gap-2">
                {inviting ? <><Loader2 size={14} className="animate-spin" /> SENDING…</> : <><Mail size={14} /> SEND INVITATION</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members table */}
      <div className="cf-card-flat overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_120px_120px_60px] gap-4 px-4 py-3 border-b-2 border-border bg-muted">
          <div className="text-label text-ink-muted">MEMBER</div>
          <div className="text-label text-ink-muted">ROLE</div>
          <div className="text-label text-ink-muted">LAST ACTIVE</div>
          <div />
        </div>

        {isLoading && (
          <div className="flex flex-col gap-2 p-4">
            {[0,1,2].map(i => <div key={i} className="cf-skeleton h-14 rounded" />)}
          </div>
        )}

        {members?.map(m => (
          <div key={m.id} className="grid grid-cols-[1fr_120px_120px_60px] gap-4 items-center px-4 py-3 border-b border-border-muted hover:bg-muted transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-accent border-2 border-border flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(m.profile?.full_name ?? '?')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-meta font-semibold text-ink truncate">{m.profile?.full_name ?? '—'}</p>
                <p className="text-[11px] text-ink-muted truncate">{m.profile?.email}</p>
              </div>
            </div>
            <div>
              <span className={`cf-badge text-[10px] ${m.role === 'OWNER' ? 'badge-accent' : 'badge-default'}`}>
                {m.role}
              </span>
            </div>
            <div className="text-meta text-ink-muted">{m.last_active_at ? timeAgo(m.last_active_at) : 'Never'}</div>
            <div>
              {can('members.manage') && m.role !== 'OWNER' && m.user_id !== user?.id && (
                <button
                  onClick={() => removeMember.mutate(m.user_id)}
                  className="btn-icon w-7 h-7 text-danger hover:bg-danger-light"
                  title="Remove member"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
