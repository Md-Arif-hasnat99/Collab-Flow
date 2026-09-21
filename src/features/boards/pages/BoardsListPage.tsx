import { useAuth } from '../../auth/hooks/useAuth';

export default function BoardsListPage() {
  const { currentWorkspace } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-section text-ink mb-4">Boards</h1>
      <p className="text-body text-ink-muted">View all Kanban boards in {currentWorkspace?.name || 'this workspace'}.</p>
    </div>
  );
}
