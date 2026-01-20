import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CollabFlowLogo } from '../Common/CollabFlowLogo';
import { Mail, Lock, User, Chrome, Users, Briefcase } from 'lucide-react';

const Signup: React.FC = () => {
  const location = useLocation();
  const defaultRole = location.state?.role || 'employee'; // Default to employee if no state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup, loginWithGoogle } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, displayName, defaultRole, teamCode, workspaceName);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google signup error:', error);
      setError(error.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <CollabFlowLogo size={64} isDark={theme === 'dark'} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create {defaultRole === 'admin' ? 'Admin' : 'Member'} Account
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {defaultRole === 'admin' 
              ? 'Create a new team and start leading' 
              : 'Join your team and start collaborating'}
          </p>
        </div>

        {/* Signup Card */}
        <div className="glass rounded-2xl shadow-xl p-8 animate-slide-in">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Display Name Input */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Admin Fields: Workspace Name */}
            {defaultRole === 'admin' && (
              <div>
                <label htmlFor="workspaceName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Team Name
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="workspaceName"
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="input pl-10"
                    placeholder="My Awesome Team"
                    required
                  />
                </div>
              </div>
            )}

            {/* Team Code Field */}
            <div>
              <label htmlFor="teamCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {defaultRole === 'admin' ? 'Create Team Code (Numeric)' : 'Enter Team Code'}
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="teamCode"
                  type="text"
                  value={teamCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setTeamCode(val);
                  }}
                  className="input pl-10"
                  placeholder={defaultRole === 'admin' ? "e.g., 123456" : "Enter the code shared by admin"}
                  required
                  maxLength={6}
                  minLength={4}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {defaultRole === 'admin' 
                  ? 'This code will be used by your team members to join.' 
                  : 'Ask your admin for the team code.'}
              </p>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded transition-colors duration-200">Or continue with</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome className="w-5 h-5" />
            Sign up with Google
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
          © 2026 CollabFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Signup;
