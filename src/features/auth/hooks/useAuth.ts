import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase/client';
import { getProfile } from '../auth/services/auth.service';
import type { Profile, Workspace, WorkspaceRole } from '../../types/database.types';
import { createPermissionChecker, type Permission } from '../../lib/permissions';
import type { WorkspaceRole as PermRole } from '../../lib/permissions';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  currentWorkspace: Workspace | null;
  currentRole: WorkspaceRole | null;
  loading: boolean;
  can: (permission: Permission) => boolean;
  setCurrentWorkspace: (workspace: Workspace, role: WorkspaceRole) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null);
  const [currentRole, setCurrentRole] = useState<WorkspaceRole | null>(null);
  const [loading, setLoading] = useState(true);

  const can = createPermissionChecker(currentRole as PermRole | null);

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const p = await getProfile(userId);
      setProfile(p);
    } catch {
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user.id);
  }, [user, loadProfile]);

  const setCurrentWorkspace = useCallback((workspace: Workspace, role: WorkspaceRole) => {
    setCurrentWorkspaceState(workspace);
    setCurrentRole(role);
    localStorage.setItem('cf_workspace_id', workspace.id);
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setCurrentWorkspaceState(null);
          setCurrentRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  return (
    <AuthContext.Provider value={{
      user, session, profile, currentWorkspace, currentRole, loading,
      can, setCurrentWorkspace, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
