import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';

// ── Lazy-loaded pages ─────────────────────────────────────────────
const PublicLayout      = lazy(() => import('../layouts/PublicLayout'));
const LandingPage       = lazy(() => import('../features/landing/LandingPage'));
const FeaturesPage      = lazy(() => import('../features/public/pages/FeaturesPage'));
const HowItWorksPage    = lazy(() => import('../features/public/pages/HowItWorksPage'));
const AnalyticsInfoPage = lazy(() => import('../features/public/pages/AnalyticsInfoPage'));
const PricingPage       = lazy(() => import('../features/public/pages/PricingPage'));
const AboutPage         = lazy(() => import('../features/public/pages/AboutPage'));
const ContactPage       = lazy(() => import('../features/public/pages/ContactPage'));
const BlogPage          = lazy(() => import('../features/public/pages/BlogPage'));
const BlogPostPage      = lazy(() => import('../features/public/pages/BlogPostPage'));
const CareersPage       = lazy(() => import('../features/public/pages/CareersPage'));
const DocumentationPage = lazy(() => import('../features/public/pages/DocumentationPage'));
const PrivacyPage       = lazy(() => import('../features/public/pages/PrivacyPage'));
const TermsPage         = lazy(() => import('../features/public/pages/TermsPage'));
const StatusPage        = lazy(() => import('../features/public/pages/StatusPage'));

const LoginModal        = lazy(() => import('../features/auth/components/LoginModal'));
const SignupModal       = lazy(() => import('../features/auth/components/SignupModal'));
const InvitePage        = lazy(() => import('../features/auth/pages/InvitePage'));
const WorkspaceSetup    = lazy(() => import('../features/auth/pages/WorkspaceSetup'));
const DashboardLayout   = lazy(() => import('../layouts/DashboardLayout'));
const DashboardRouter   = lazy(() => import('../features/dashboard/DashboardRouter'));
const WorkspacePage     = lazy(() => import('../features/workspaces/pages/WorkspacePage'));
const ProjectPage       = lazy(() => import('../features/projects/pages/ProjectPage'));
const BoardPage         = lazy(() => import('../features/boards/pages/BoardPage'));
const TaskDetailPage    = lazy(() => import('../features/tasks/pages/TaskDetailPage'));
const MyTasksPage       = lazy(() => import('../features/tasks/pages/MyTasksPage'));
const ProjectsListPage  = lazy(() => import('../features/projects/pages/ProjectsListPage'));
const BoardsListPage    = lazy(() => import('../features/boards/pages/BoardsListPage'));
const ChatPage          = lazy(() => import('../features/chat/pages/ChatPage'));
const ActivityPage      = lazy(() => import('../features/activity/pages/ActivityPage'));
const AnalyticsPage     = lazy(() => import('../features/analytics/pages/AnalyticsPage'));
const SettingsPage      = lazy(() => import('../features/settings/pages/SettingsPage'));

// ── Loading fallback ─────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
        <p className="text-meta text-ink-muted font-display tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}

// ── Guards ───────────────────────────────────────────────────────
function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/" replace />;
  return <Outlet />;
}

function RequireGuest() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/app/dashboard" replace />;
  return <Outlet />;
}

// ── Router ───────────────────────────────────────────────────────
export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Layout Routes ────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />}>
              {/* Modal routes rendered over landing */}
              <Route path="auth/login"  element={<LoginModal />} />
              <Route path="auth/signup" element={<SignupModal />} />
            </Route>
            <Route path="features"        element={<FeaturesPage />} />
            <Route path="how-it-works"    element={<HowItWorksPage />} />
            <Route path="analytics-info"  element={<AnalyticsInfoPage />} />
            <Route path="pricing"         element={<PricingPage />} />
            <Route path="about"           element={<AboutPage />} />
            <Route path="contact"         element={<ContactPage />} />
            <Route path="blog"            element={<BlogPage />} />
            <Route path="blog/:slug"      element={<BlogPostPage />} />
            <Route path="careers"         element={<CareersPage />} />
            <Route path="documentation"   element={<DocumentationPage />} />
            <Route path="privacy"         element={<PrivacyPage />} />
            <Route path="terms"           element={<TermsPage />} />
            <Route path="status"          element={<StatusPage />} />
          </Route>

          {/* ── Invitation (public, but needs auth to accept) */}
          <Route path="/invite/:token" element={<InvitePage />} />

          {/* ── Guest-only routes ──────────────────────────── */}
          <Route element={<RequireGuest />}>
            <Route path="/auth/callback" element={<Navigate to="/app/dashboard" replace />} />
          </Route>

          {/* ── Protected: Workspace setup ─────────────────── */}
          <Route element={<RequireAuth />}>
            <Route path="/setup" element={<WorkspaceSetup />} />
          </Route>

          {/* ── Protected: Main App ────────────────────────── */}
          <Route element={<RequireAuth />}>
            <Route path="/app" element={<DashboardLayout />}>
              <Route index element={<Navigate to="tasks" replace />} />
              <Route path="dashboard"                      element={<DashboardRouter />} />
              <Route path="workspaces/:workspaceId"        element={<WorkspacePage />} />
              <Route path="tasks"                          element={<MyTasksPage />} />
              <Route path="tasks/:taskId"                  element={<TaskDetailPage />} />
              <Route path="projects"                       element={<ProjectsListPage />} />
              <Route path="projects/:projectId"            element={<ProjectPage />} />
              <Route path="boards"                         element={<BoardsListPage />} />
              <Route path="boards/:boardId"                element={<BoardPage />} />
              <Route path="chat"                           element={<ChatPage />} />
              <Route path="activity"                       element={<ActivityPage />} />
              <Route path="analytics"                      element={<AnalyticsPage />} />
              <Route path="settings/*"                     element={<SettingsPage />} />
            </Route>
          </Route>

          {/* ── Catch-all ──────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
