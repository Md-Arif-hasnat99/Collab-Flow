import { useAuth } from '../../auth/hooks/useAuth';

export default function ProjectsListPage() {
  const { currentWorkspace } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-section text-ink mb-4">Projects</h1>
      <p className="text-body text-ink-muted">View all projects in {currentWorkspace?.name || 'this workspace'}.</p>
    </div>
  );
}
