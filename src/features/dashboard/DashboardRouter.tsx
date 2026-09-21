import { useAuth } from '../auth/hooks/useAuth';
import OwnerDashboard from './OwnerDashboard';
import AdminDashboard from './AdminDashboard';
import ProjectManagerDashboard from './ProjectManagerDashboard';
import MemberDashboard from './MemberDashboard';
import ViewerDashboard from './ViewerDashboard';

export default function DashboardRouter() {
  const { currentRole } = useAuth();

  switch (currentRole) {
    case 'OWNER':   return <OwnerDashboard />;
    case 'ADMIN':   return <AdminDashboard />;
    case 'PROJECT_MANAGER': return <ProjectManagerDashboard />;
    case 'MEMBER':  return <MemberDashboard />;
    case 'VIEWER':  return <ViewerDashboard />;
    default:
      return (
        <div className="p-8 text-center">
          <p className="text-body text-ink-muted">No workspace selected. <a href="/setup" className="text-accent underline">Set up a workspace</a></p>
        </div>
      );
  }
}
