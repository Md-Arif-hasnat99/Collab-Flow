import { supabase } from '../../lib/supabase/client';
import type { Profile, Workspace, WorkspaceInvitation } from '../../types/database.types';

// ── Authentication ───────────────────────────────────────────────

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

// ── Profile ──────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

// ── Workspace Creation ───────────────────────────────────────────

export async function createWorkspace(name: string, description?: string): Promise<Workspace> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Generate slug server-side via function
  const { data: slugData } = await supabase.rpc('generate_workspace_slug', { name });
  const slug = slugData as string;

  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .insert({ name, slug, description: description || null, created_by: user.id })
    .select()
    .single();
  if (wsError) throw wsError;

  // Creator becomes OWNER
  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({ workspace_id: workspace.id, user_id: user.id, role: 'OWNER' });
  if (memberError) throw memberError;

  // Create default chat channel
  const { data: channel, error: channelError } = await supabase
    .from('chat_channels')
    .insert({
      workspace_id: workspace.id,
      name: 'general',
      description: 'General discussion',
      is_direct: false,
      created_by: user.id,
    })
    .select()
    .single();
  if (!channelError && channel) {
    await supabase.from('chat_members').insert({
      channel_id: channel.id,
      user_id: user.id,
    });
  }

  return workspace;
}

// ── Invitations ──────────────────────────────────────────────────

export async function getInvitationByToken(token: string): Promise<WorkspaceInvitation | null> {
  const { data, error } = await supabase
    .from('workspace_invitations')
    .select('*, workspace:workspaces(name, logo_url), inviter:profiles!invited_by(full_name, avatar_url)')
    .eq('token', token)
    .eq('status', 'PENDING')
    .single();
  if (error) return null;
  return data as WorkspaceInvitation;
}

export async function acceptInvitation(token: string) {
  const { data, error } = await supabase.rpc('accept_invitation', { p_token: token });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function sendInvitation(
  workspaceId: string,
  email: string,
  role: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('workspace_invitations')
    .insert({
      workspace_id: workspaceId,
      invited_by: user.id,
      email,
      role: role as never,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Get user's workspaces ────────────────────────────────────────
export async function getUserWorkspaces() {
  const { data, error } = await supabase
    .from('workspace_members')
    .select('role, workspace:workspaces(*)')
    .order('joined_at', { ascending: true });
  if (error) throw error;
  return data;
}
