// ── Permission System (design.md — Role-Based Access) ────────────
// Implements the permission model from the master build spec.
// Usage: can("tasks.update") instead of role === 'admin'

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'PROJECT_MANAGER' | 'MEMBER' | 'VIEWER';

export type Permission =
  // Workspace
  | 'workspace.view'
  | 'workspace.manage'
  // Members
  | 'members.view'
  | 'members.invite'
  | 'members.manage'
  | 'roles.manage'
  // Projects
  | 'projects.view'
  | 'projects.create'
  | 'projects.update'
  | 'projects.delete'
  // Boards
  | 'boards.view'
  | 'boards.create'
  | 'boards.update'
  | 'boards.delete'
  // Tasks
  | 'tasks.view'
  | 'tasks.create'
  | 'tasks.update'
  | 'tasks.delete'
  | 'tasks.assign'
  // Comments
  | 'comments.create'
  | 'comments.delete'
  // Chat
  | 'chat.use'
  // Analytics
  | 'analytics.view'
  // Files
  | 'files.upload'
  | 'files.delete';

// Role → Permission mapping
const ROLE_PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
  OWNER: [
    'workspace.view', 'workspace.manage',
    'members.view', 'members.invite', 'members.manage', 'roles.manage',
    'projects.view', 'projects.create', 'projects.update', 'projects.delete',
    'boards.view', 'boards.create', 'boards.update', 'boards.delete',
    'tasks.view', 'tasks.create', 'tasks.update', 'tasks.delete', 'tasks.assign',
    'comments.create', 'comments.delete',
    'chat.use',
    'analytics.view',
    'files.upload', 'files.delete',
  ],
  ADMIN: [
    'workspace.view', 'workspace.manage',
    'members.view', 'members.invite', 'members.manage',
    'projects.view', 'projects.create', 'projects.update', 'projects.delete',
    'boards.view', 'boards.create', 'boards.update', 'boards.delete',
    'tasks.view', 'tasks.create', 'tasks.update', 'tasks.delete', 'tasks.assign',
    'comments.create', 'comments.delete',
    'chat.use',
    'analytics.view',
    'files.upload', 'files.delete',
  ],
  PROJECT_MANAGER: [
    'workspace.view',
    'members.view',
    'projects.view', 'projects.create', 'projects.update',
    'boards.view', 'boards.create', 'boards.update',
    'tasks.view', 'tasks.create', 'tasks.update', 'tasks.delete', 'tasks.assign',
    'comments.create', 'comments.delete',
    'chat.use',
    'analytics.view',
    'files.upload',
  ],
  MEMBER: [
    'workspace.view',
    'members.view',
    'projects.view',
    'boards.view',
    'tasks.view', 'tasks.create', 'tasks.update',
    'comments.create',
    'chat.use',
    'files.upload',
  ],
  VIEWER: [
    'workspace.view',
    'members.view',
    'projects.view',
    'boards.view',
    'tasks.view',
    'analytics.view',
  ],
};

// Returns a checker function scoped to a role
export function createPermissionChecker(role: WorkspaceRole | null) {
  return function can(permission: Permission): boolean {
    if (!role) return false;
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  };
}

// Returns all permissions for a role
export function getPermissions(role: WorkspaceRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

// Check if a role outranks another
const ROLE_HIERARCHY: WorkspaceRole[] = ['VIEWER', 'MEMBER', 'PROJECT_MANAGER', 'ADMIN', 'OWNER'];
export function roleOutranks(a: WorkspaceRole, b: WorkspaceRole): boolean {
  return ROLE_HIERARCHY.indexOf(a) > ROLE_HIERARCHY.indexOf(b);
}

export { ROLE_PERMISSIONS };
