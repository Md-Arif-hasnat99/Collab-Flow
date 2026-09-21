import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, X, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { signupSchema, type SignupForm } from '../schemas/auth.schemas';
import { signUp, signInWithGoogle } from '../services/auth.service';

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ chars', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['bg-border-light', 'bg-danger', 'bg-warning', 'bg-success'];

  return (
    <div className="mt-2">
      <div className="flex gap-1.5 mb-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-sm transition-all duration-200 ${i < score ? colors[score] : 'bg-border-light'}`} />
        ))}
      </div>
      <div className="flex gap-3">
        {checks.map(({ label, ok }) => (
          <span key={label} className={`text-meta transition-colors ${ok ? 'text-success' : 'text-ink-muted'}`}>
            {ok ? '✓' : '·'} {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SignupModal() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const password = watch('password', '');

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, data.fullName);
      toast.success('Account created! Please check your email to verify.');
      navigate('/setup');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Signup failed';
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        setError('email', { message: 'An account with this email already exists' });
      } else if (msg.toLowerCase().includes('password')) {
        setError('password', { message: 'Password does not meet requirements' });
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-[2px] animate-fade-in"
        onClick={() => navigate('/')}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Create account"
      >
        <div className="w-full max-w-[420px] bg-surface border-2 border-border rounded shadow-[0_8px_0_#171717] animate-scale-in my-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0">
            <div>
              <h1 className="font-display font-bold text-ink" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
                CREATE YOUR<br />ACCOUNT.
              </h1>
              <p className="text-meta text-ink-muted mt-1">Start collaborating in minutes</p>
            </div>
            <button onClick={() => navigate('/')} className="btn-icon flex-shrink-0" aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="cf-label">Full Name</label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                autoFocus
                className={`cf-input ${errors.fullName ? 'border-danger' : ''}`}
                placeholder="Arif Hasnat"
                {...register('fullName')}
              />
              {errors.fullName && <p className="text-meta text-danger mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="cf-label">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`cf-input ${errors.email ? 'border-danger' : ''}`}
                placeholder="you@company.com"
                {...register('email')}
              />
              {errors.email && <p className="text-meta text-danger mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="cf-label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`cf-input pr-10 ${errors.password ? 'border-danger' : ''}`}
                  placeholder="Min. 8 characters"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  aria-label={showPassword ? 'Hide' : 'Show'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-meta text-danger mt-1">{errors.password.message}</p>
              ) : (
                password && <PasswordStrength password={password} />
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="cf-label">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`cf-input pr-10 ${errors.confirmPassword ? 'border-danger' : ''}`}
                  placeholder="Repeat password"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  aria-label={showConfirm ? 'Hide' : 'Show'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-meta text-danger mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* NOTE: No role selection — roles are assigned by workspace owner */}

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center mt-1">
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> CREATING…</>
              ) : (
                <>CREATE ACCOUNT <ArrowRight size={16} /></>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border-muted" />
              <span className="text-meta text-ink-muted">OR</span>
              <div className="flex-1 h-px bg-border-muted" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="btn-secondary w-full justify-center"
            >
              {googleLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              CONTINUE WITH GOOGLE
            </button>

            <p className="text-center text-meta text-ink-secondary">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-display font-semibold text-ink hover:text-accent transition-colors underline underline-offset-2">
                LOGIN
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
