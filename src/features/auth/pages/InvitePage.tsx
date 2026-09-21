import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { getInvitationByToken, acceptInvitation } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';
import type { WorkspaceInvitation } from '../../../types/database.types';
import { timeAgo } from '../../../lib/utils';

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, setCurrentWorkspace } = useAuth();

  const [invitation, setInvitation] = useState<WorkspaceInvitation | null>(null);
  const [status, setStatus] = useState<'loading' | 'found' | 'invalid' | 'accepting' | 'accepted'>('loading');

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }
    getInvitationByToken(token).then(inv => {
      if (inv) {
        setInvitation(inv);
        setStatus('found');
      } else {
        setStatus('invalid');
      }
    });
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    if (!user) {
      // Store token and redirect to signup
      sessionStorage.setItem('pending_invite', token);
      navigate('/auth/signup');
      return;
    }
    setStatus('accepting');
    try {
      const result = await acceptInvitation(token);
      setStatus('accepted');
      if (invitation?.workspace) {
        setCurrentWorkspace(
          invitation.workspace as never,
          invitation.role
        );
      }
      toast.success('You\'ve joined the workspace!');
      setTimeout(() => navigate('/app/dashboard'), 1500);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to accept invitation');
      setStatus('found');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-16">
        <div className="w-8 h-8 bg-accent border-2 border-border flex items-center justify-center rounded-sm">
          <span className="text-white font-display font-bold text-sm">CF</span>
        </div>
        <span className="font-display font-bold text-body-lg text-ink tracking-tight">COLLABFLOW</span>
      </div>

      <div className="w-full max-w-[440px]">
        {/* Loading */}
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 size={32} className="animate-spin text-accent" />
            <p className="text-body text-ink-muted font-display">CHECKING INVITATION…</p>
          </div>
        )}

        {/* Invalid */}
        {status === 'invalid' && (
          <div className="bg-surface border-2 border-border rounded p-8 shadow-brutal text-center">
            <div className="w-14 h-14 border-2 border-danger flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={24} className="text-danger" />
            </div>
            <h1 className="font-display font-bold text-ink mb-3" style={{ fontSize: '24px' }}>
              INVITATION NOT FOUND.
            </h1>
            <p className="text-body text-ink-secondary mb-8">
              This invitation link is invalid, has already been used, or has expired.
            </p>
            <Link to="/" className="btn-primary w-full justify-center">
              GO HOME
            </Link>
          </div>
        )}

        {/* Found */}
        {(status === 'found' || status === 'accepting') && invitation && (
          <div className="animate-scale-in">
            <p className="text-label text-ink-muted mb-6">YOU'RE INVITED.</p>

            <div className="bg-surface border-2 border-border rounded shadow-brutal mb-6 overflow-hidden">
              {/* Workspace header */}
              <div className="p-6 border-b-2 border-border bg-muted">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent border-2 border-border flex items-center justify-center rounded-sm flex-shrink-0">
                    <span className="text-white font-display font-bold">
                      {invitation.workspace?.name?.[0]?.toUpperCase() ?? 'W'}
                    </span>
                  </div>
                  <div>
                    <div className="font-display font-bold text-card text-ink">
                      {invitation.workspace?.name ?? 'Unknown Workspace'}
                    </div>
                    <div className="text-meta text-ink-muted">Team Workspace</div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted border border-border rounded-full flex items-center justify-center text-xs font-display font-bold text-ink">
                    {(invitation.inviter?.full_name ?? '?')[0].toUpperCase()}
                  </div>
                  <p className="text-body text-ink-secondary">
                    Invited by{' '}
                    <span className="font-semibold text-ink">{invitation.inviter?.full_name ?? 'a team member'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-2 border-border flex items-center justify-center flex-shrink-0">
                    <Users size={14} />
                  </div>
                  <div>
                    <p className="text-meta text-ink-muted">Your role will be</p>
                    <p className="font-display font-bold text-ink">{invitation.role}</p>
                  </div>
                </div>

                <div className="text-meta text-ink-muted">
                  Expires {timeAgo(invitation.expires_at)}
                </div>
              </div>
            </div>

            <button
              onClick={handleAccept}
              disabled={status === 'accepting'}
              className="btn-primary w-full justify-center"
            >
              {status === 'accepting' ? (
                <><Loader2 size={16} className="animate-spin" /> JOINING…</>
              ) : (
                <>{user ? 'ACCEPT INVITATION' : 'SIGN UP TO JOIN'} <ArrowRight size={16} /></>
              )}
            </button>

            {!user && (
              <p className="text-center text-meta text-ink-secondary mt-4">
                Already have an account?{' '}
                <Link to={`/auth/login?invite=${token}`} className="font-display font-semibold text-ink hover:text-accent underline underline-offset-2">
                  LOG IN
                </Link>
              </p>
            )}
          </div>
        )}

        {/* Accepted */}
        {status === 'accepted' && (
          <div className="bg-surface border-2 border-border rounded p-8 shadow-brutal text-center animate-scale-in">
            <div className="w-14 h-14 border-2 border-success flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={24} className="text-success" />
            </div>
            <h1 className="font-display font-bold text-ink mb-3" style={{ fontSize: '24px' }}>
              INVITATION ACCEPTED!
            </h1>
            <p className="text-body text-ink-secondary">
              Redirecting you to your workspace…
            </p>
            <div className="mt-4 w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
