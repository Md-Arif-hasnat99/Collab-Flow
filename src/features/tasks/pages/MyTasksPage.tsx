import { useAuth } from '../../auth/hooks/useAuth';

export default function MyTasksPage() {
  const { currentWorkspace } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-section text-ink mb-4">My Tasks</h1>
      <p className="text-body text-ink-muted">View all your assigned tasks across {currentWorkspace?.name || 'this workspace'}.</p>
    </div>
  );
}
