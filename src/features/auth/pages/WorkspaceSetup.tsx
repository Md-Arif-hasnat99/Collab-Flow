import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2, Building2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { workspaceCreateSchema, type WorkspaceCreateForm } from '../schemas/auth.schemas';
import { createWorkspace, getUserWorkspaces } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';

type Step = 'choice' | 'create' | 'join';

export default function WorkspaceSetup() {
  const [step, setStep] = useState<Step>('choice');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentWorkspace } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkspaceCreateForm>({
    resolver: zodResolver(workspaceCreateSchema),
  });

  const onCreateWorkspace = async (data: WorkspaceCreateForm) => {
    setIsLoading(true);
    try {
      const workspace = await createWorkspace(data.name, data.description);
      setCurrentWorkspace(workspace, 'OWNER');
      toast.success(`Workspace "${workspace.name}" created!`);
      navigate('/app/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create workspace');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 bg-accent border-2 border-border flex items-center justify-center rounded-sm">
          <span className="text-white font-display font-bold text-sm">CF</span>
        </div>
        <span className="font-display font-bold text-body-lg text-ink tracking-tight">COLLABFLOW</span>
      </div>

      <div className="w-full max-w-[480px]">
        {/* Choice Step */}
        {step === 'choice' && (
          <div className="animate-scale-in">
            <h1 className="font-display font-bold text-ink mb-2" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>
              ONE LAST STEP.
            </h1>
            <p className="text-body text-ink-secondary mb-10">
              Create a new workspace or join an existing one.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setStep('create')}
                className="group flex items-start gap-5 p-6 bg-surface border-2 border-border rounded shadow-brutal hover:-translate-y-0.5 hover:shadow-brutal-lg transition-all duration-150 text-left"
              >
                <div className="w-12 h-12 border-2 border-border flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-colors">
                  <Building2 size={20} />
                </div>
                <div>
                  <div className="font-display font-bold text-ink mb-1">Create a new workspace</div>
                  <p className="text-meta text-ink-secondary">
                    Start fresh. You'll become the workspace owner with full control.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setStep('join')}
                className="group flex items-start gap-5 p-6 bg-surface border-2 border-border rounded shadow-brutal hover:-translate-y-0.5 hover:shadow-brutal-lg transition-all duration-150 text-left"
              >
                <div className="w-12 h-12 border-2 border-border flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-colors">
                  <Users size={20} />
                </div>
                <div>
                  <div className="font-display font-bold text-ink mb-1">Join an existing workspace</div>
                  <p className="text-meta text-ink-secondary">
                    Enter your invitation code to join a team.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Create Workspace Step */}
        {step === 'create' && (
          <div className="animate-scale-in">
            <button onClick={() => setStep('choice')} className="text-meta text-ink-muted mb-6 hover:text-ink transition-colors">
              ← Back
            </button>
            <h1 className="font-display font-bold text-ink mb-2" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>
              CREATE YOUR<br />WORKSPACE.
            </h1>
            <p className="text-body text-ink-secondary mb-8">
              Your workspace is where your team will collaborate.
            </p>

            <form onSubmit={handleSubmit(onCreateWorkspace)} className="flex flex-col gap-5 bg-surface border-2 border-border rounded p-6 shadow-brutal">
              <div>
                <label htmlFor="name" className="cf-label">Workspace Name</label>
                <input
                  id="name"
                  type="text"
                  autoFocus
                  className={`cf-input ${errors.name ? 'border-danger' : ''}`}
                  placeholder="e.g. Acme Design Team"
                  {...register('name')}
                />
                {errors.name && <p className="text-meta text-danger mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="description" className="cf-label">Description <span className="text-ink-muted normal-case font-sans font-normal tracking-normal">(optional)</span></label>
                <textarea
                  id="description"
                  className="cf-textarea"
                  rows={3}
                  placeholder="What does your team work on?"
                  {...register('description')}
                />
                {errors.description && <p className="text-meta text-danger mt-1">{errors.description.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center mt-2">
                {isLoading ? (
                  <><Loader2 size={16} className="animate-spin" /> CREATING…</>
                ) : (
                  <>CREATE WORKSPACE <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Join Workspace Step */}
        {step === 'join' && (
          <div className="animate-scale-in">
            <button onClick={() => setStep('choice')} className="text-meta text-ink-muted mb-6 hover:text-ink transition-colors">
              ← Back
            </button>
            <h1 className="font-display font-bold text-ink mb-2" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>
              JOIN A<br />WORKSPACE.
            </h1>
            <p className="text-body text-ink-secondary mb-8">
              Ask your workspace owner to send you an invitation link.
            </p>

            <div className="bg-surface border-2 border-border rounded p-6 shadow-brutal">
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="w-14 h-14 border-2 border-border flex items-center justify-center">
                  <Users size={24} className="text-ink-muted" />
                </div>
                <div>
                  <p className="font-display font-semibold text-ink mb-1">Waiting for an invitation?</p>
                  <p className="text-meta text-ink-secondary">
                    Your team admin will send you an invitation link to <span className="font-medium">join directly</span>.
                  </p>
                </div>
              </div>

              <p className="text-center text-meta text-ink-secondary mt-2">
                Already have a link?{' '}
                <span className="font-display font-semibold text-ink">Open it in your browser.</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
