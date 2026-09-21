import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Board } from '../../types';
import { useBoard } from '../../contexts/BoardContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CollabFlowLogo } from '../Common/CollabFlowLogo';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [boards, setBoards] = useState<Board[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { currentUser, userData, logout } = useAuth();
  const { setCurrentBoardId, currentBoard, isAdmin } = useBoard();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Fetch boards
  useEffect(() => {
    if (!currentUser || !userData) return;

    const q = query(
      collection(db, 'boards'),
      where('workspaceId', '==', userData.workspaces[0] || 'default')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boardsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Board[];
      
      setBoards(boardsData);
    }, (error) => {
      console.error('Error fetching boards:', error);
    });

    return () => unsubscribe();
  }, [currentUser, userData]);

  // Automatically select the first board if none is selected or the current one was deleted
  useEffect(() => {
    if (boards.length > 0 && !currentBoard) {
      setCurrentBoardId(boards[0].id);
    }
  }, [boards, currentBoard, setCurrentBoardId]);

  const handleCreateBoard = async () => {
    if (!isAdmin) {
        // Just in case the button wasn't hidden or they triggered it manually
        return; 
    }
    const boardName = prompt('Enter board name:');
    if (!boardName || !currentUser || !userData) return;

    try {
      const workspaceId = userData.workspaces[0] || 'default';
      const newBoard = {
        workspaceId,
        name: boardName,
        description: '',
        columns: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: currentUser.uid,
      };

      const docRef = await addDoc(collection(db, 'boards'), newBoard);
      setCurrentBoardId(docRef.id);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Boards', path: '/dashboard' },
    ...(isAdmin ? [{ icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' }] : []),
    { icon: MessageSquare, label: 'Chat', path: '/dashboard/chat' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col`}
      >
        {sidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="mb-6">
                <CollabFlowLogo isDark={theme === 'dark'} />
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {userData?.displayName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {userData?.displayName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userData?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary-700 dark:hover:text-primary-400 rounded-lg transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}

              {/* Boards Section */}
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2 px-3">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Boards</h3>
                  {isAdmin && (
                    <button
                      onClick={handleCreateBoard}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {boards.map((board) => (
                    <button
                      key={board.id}
                      onClick={() => setCurrentBoardId(board.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        currentBoard?.id === board.id
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span className="truncate text-sm">{board.name}</span>
                    </button>
                  ))}

                  {boards.length === 0 && (
                    <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
                      No boards yet
                    </p>
                  )}
                </div>
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowNotifications(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-20">
                      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                      </div>
                      <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                        No new notifications
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
