import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { BoardProvider } from './contexts/BoardContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Landing from './components/Auth/Landing';
import DashboardLayout from './components/Layout/DashboardLayout';
import Board from './components/Board/Board';
import Analytics from './pages/Analytics';
import Chat from './pages/Chat';
import './index.css';

// Placeholder pages
import { ThemeProvider } from './contexts/ThemeContext';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BoardProvider>
        <ThemeProvider>
          <BrowserRouter>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Board />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Default Redirect */}
                <Route path="/" element={<Landing />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>

              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#1e293b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </BoardProvider>
    </AuthProvider>
  );
}

export default App;
