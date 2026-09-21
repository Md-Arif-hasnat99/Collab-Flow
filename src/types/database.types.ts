// ── CollabFlow Database Types ─────────────────────────────────────
// Auto-generated types matching the Supabase PostgreSQL schema.
// Run `npx supabase gen types typescript` to regenerate after schema changes.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ── Enums ────────────────────────────────────────────────────────
export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'PROJECT_MANAGER' | 'MEMBER' | 'VIEWER';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_UPDATED'
  | 'MENTION'
  | 'COMMENT_CREATED'
  | 'PROJECT_UPDATED'
  | 'WORKSPACE_INVITED'
  | 'DEADLINE_REMINDER';
export type ActivityType =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_MOVED'
  | 'TASK_DELETED'
  | 'COMMENT_CREATED'
  | 'MEMBER_JOINED'
  | 'MEMBER_REMOVED'
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'BOARD_CREATED'
  | 'FILE_UPLOADED';

// ── Table Row Types ───────────────────────────────────────────────
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  joined_at: string;
  last_active_at: string | null;
  // Joined
  profile?: Profile;
  workspace?: Workspace;
}

export interface WorkspaceInvitation {
  id: string;
  workspace_id: string;
  invited_by: string;
  email: string;
  role: WorkspaceRole;
  token: string;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
  // Joined
  workspace?: Workspace;
  inviter?: Profile;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  color: string | null;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Computed
  task_count?: number;
  completed_task_count?: number;
  member_count?: number;
  members?: Profile[];
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: WorkspaceRole;
  added_at: string;
  profile?: Profile;
}

export interface Board {
  id: string;
  project_id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: string;
  board_id: string;
  name: string;
  position: number;
  color: string | null;
  created_at: string;
  // Computed
  tasks?: Task[];
}

export interface Task {
  id: string;
  column_id: string;
  board_id: string;
  project_id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  position: number;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined
  assignees?: Profile[];
  labels?: Label[];
  checklist?: TaskChecklist[];
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  creator?: Profile;
}

export interface Label {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface TaskLabel {
  task_id: string;
  label_id: string;
  label?: Label;
}

export interface TaskAssignee {
  task_id: string;
  user_id: string;
  profile?: Profile;
}

export interface TaskChecklist {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  position: number;
  created_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_id: string;
  uploaded_by: string;
  created_at: string;
  file?: File;
  uploader?: Profile;
}

export interface ChatChannel {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  is_direct: boolean;
  created_by: string;
  created_at: string;
  // Computed
  unread_count?: number;
  last_message?: ChatMessage;
  members?: Profile[];
}

export interface ChatMember {
  channel_id: string;
  user_id: string;
  last_read_at: string | null;
  profile?: Profile;
}

export interface ChatMessage {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  file_id: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
  file?: StorageFile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
}

export interface Activity {
  id: string;
  workspace_id: string;
  project_id: string | null;
  task_id: string | null;
  user_id: string;
  type: ActivityType;
  meta: Json;
  created_at: string;
  actor?: Profile;
}

export interface StorageFile {
  id: string;
  workspace_id: string;
  uploader_id: string;
  name: string;
  size: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
}

// ── Supabase Database schema type ────────────────────────────────
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      workspaces: {
        Row: Workspace;
        Insert: Omit<Workspace, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Workspace, 'id' | 'created_at'>>;
      };
      workspace_members: {
        Row: WorkspaceMember;
        Insert: Omit<WorkspaceMember, 'id' | 'joined_at'>;
        Update: Partial<Pick<WorkspaceMember, 'role' | 'last_active_at'>>;
      };
      workspace_invitations: {
        Row: WorkspaceInvitation;
        Insert: Omit<WorkspaceInvitation, 'id' | 'created_at'>;
        Update: Partial<Pick<WorkspaceInvitation, 'status'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'workspace_id'>>;
      };
      project_members: {
        Row: ProjectMember;
        Insert: Omit<ProjectMember, 'id' | 'added_at'>;
        Update: Partial<Pick<ProjectMember, 'role'>>;
      };
      boards: {
        Row: Board;
        Insert: Omit<Board, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Board, 'id' | 'created_at'>>;
      };
      columns: {
        Row: Column;
        Insert: Omit<Column, 'id' | 'created_at'>;
        Update: Partial<Omit<Column, 'id' | 'created_at'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Task, 'id' | 'created_at'>>;
      };
      labels: {
        Row: Label;
        Insert: Omit<Label, 'id' | 'created_at'>;
        Update: Partial<Omit<Label, 'id' | 'created_at'>>;
      };
      task_labels: { Row: TaskLabel; Insert: TaskLabel; Update: never };
      task_assignees: { Row: TaskAssignee; Insert: TaskAssignee; Update: never };
      task_checklists: {
        Row: TaskChecklist;
        Insert: Omit<TaskChecklist, 'id' | 'created_at'>;
        Update: Partial<Omit<TaskChecklist, 'id' | 'task_id' | 'created_at'>>;
      };
      task_comments: {
        Row: TaskComment;
        Insert: Omit<TaskComment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Pick<TaskComment, 'content'>>;
      };
      task_attachments: {
        Row: TaskAttachment;
        Insert: Omit<TaskAttachment, 'id' | 'created_at'>;
        Update: never;
      };
      chat_channels: {
        Row: ChatChannel;
        Insert: Omit<ChatChannel, 'id' | 'created_at'>;
        Update: Partial<Omit<ChatChannel, 'id' | 'created_at' | 'workspace_id'>>;
      };
      chat_members: { Row: ChatMember; Insert: ChatMember; Update: Partial<Pick<ChatMember, 'last_read_at'>> };
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Pick<ChatMessage, 'content'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at' | 'is_read'>;
        Update: Partial<Pick<Notification, 'is_read'>>;
      };
      activities: {
        Row: Activity;
        Insert: Omit<Activity, 'id' | 'created_at'>;
        Update: never;
      };
      files: {
        Row: StorageFile;
        Insert: Omit<StorageFile, 'id' | 'created_at'>;
        Update: never;
      };
    };
    Enums: {
      workspace_role: WorkspaceRole;
      task_priority: TaskPriority;
      task_status: TaskStatus;
      project_status: ProjectStatus;
      invitation_status: InvitationStatus;
      notification_type: NotificationType;
      activity_type: ActivityType;
    };
  };
}
