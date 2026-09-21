import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CollabFlowLogo } from '../Common/CollabFlowLogo';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 transition-colors duration-200">
      <div className="max-w-4xl w-full animate-fade-in">
        <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <CollabFlowLogo size={80} isDark={theme === 'dark'} />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Welcome to CollabFlow</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">Select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Admin Card */}
            <div
                onClick={() => navigate('/signup', { state: { role: 'admin' } })}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer transition-all hover:scale-105 group"
            >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
                    <ShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Admin</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Create a new team, generate access codes, and manage your workspace.
                </p>
            </div>

            {/* Employee Card */}
            <div
                onClick={() => navigate('/signup', { state: { role: 'employee' } })}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all hover:scale-105 group"
            >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Team Member</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Join an existing team using a team code and start collaborating.
                </p>
            </div>
        </div>

        <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <button
                    onClick={() => navigate('/login')}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold hover:underline"
                >
                    Login
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
