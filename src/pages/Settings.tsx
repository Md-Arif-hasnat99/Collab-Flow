import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { useTheme } from '../contexts/ThemeContext'; // Removed
import {
  User,
  Bell,
  Shield,
  LogOut,
  Mail,
  Smartphone,
  AtSign,
  CheckSquare,
  Loader2,
  Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { userData, updateUserProfile, logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userData?.displayName || '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setLoading(true);
    try {
      await updateUserProfile({
        displayName: formData.displayName,
      });
      // Success toast is handled in AuthContext
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotification = async (key: string) => { // key is string because we will cast it later or check key validity
    if (!userData || !userData.settings || !userData.settings.notifications) return;

    const currentSettings = userData.settings.notifications;
    // @ts-ignore - dynamic key access
    const currentValue = currentSettings[key as keyof typeof currentSettings];
    
    try {
      await updateUserProfile({
        settings: {
          ...userData.settings,
          notifications: {
            ...currentSettings,
            [key]: !currentValue,
          },
        },
      });
      toast.success('Settings updated');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and settings</p>
      </div>

      {/* Profile Section */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Information</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your account details and profile photo</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-slate-50 dark:border-slate-800 shadow-sm">
                {userData?.displayName?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Profile Photo</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Click to upload a new avatar</p>
              <button className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline">
                Remove photo
              </button>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={userData?.email || ''}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-600/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </section>



      {/* Notifications Section */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose what you want to be notified about</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Receive emails about your account activity</p>
              </div>
            </div>
            <button
              onClick={() => toggleNotification('email')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData?.settings?.notifications?.email ? 'bg-primary-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData?.settings?.notifications?.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-slate-400" />
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Push Notifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Receive push notifications on your device</p>
              </div>
            </div>
            <button
              onClick={() => toggleNotification('push')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData?.settings?.notifications?.push ? 'bg-primary-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData?.settings?.notifications?.push ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 my-2"></div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <AtSign className="w-5 h-5 text-slate-400" />
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Mentions</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Notify when someone mentions you in a comment</p>
              </div>
            </div>
            <button
              onClick={() => toggleNotification('mentions')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData?.settings?.notifications?.mentions ? 'bg-primary-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData?.settings?.notifications?.mentions ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

           <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-slate-400" />
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Task Assignments</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Notify when you are assigned to a task</p>
              </div>
            </div>
            <button
              onClick={() => toggleNotification('assignments')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                userData?.settings?.notifications?.assignments ? 'bg-primary-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  userData?.settings?.notifications?.assignments ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Account Actions */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Account Actions</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account security and sessions</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                     <h3 className="font-medium text-slate-900 dark:text-white">Sign Out</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400">Sign out of your account on this device</p>
                </div>
                 <button
                    onClick={logout}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
            
        </div>
      </section>
    </div>
  );
};

export default Settings;
