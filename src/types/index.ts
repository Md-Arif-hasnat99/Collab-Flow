export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string | null;
  workspaces: string[];
  settings: UserSettings;
  lastActive: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    mentions: boolean;
    assignments: boolean;
  };
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: WorkspaceMember[];
  teamCode: string;
  createdAt: Date;
  settings: WorkspaceSettings;
}

export interface WorkspaceMember {
  userId: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: Date;
}

export interface WorkspaceSettings {
  allowGuestAccess: boolean;
  taskPrefix: string;
}

export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  columns: string[]; // Array of column IDs
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Column {
  id: string;
  boardId: string;
  name: string;
  order: number;
  color: string;
  taskLimit?: number;
}

export interface Task {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  assignedTo: string[]; // Array of user IDs
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  comments: number;
  attachments: Attachment[];
  order: number;
  checklist?: ChecklistItem[];
  isCompleted?: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
  mentions: string[]; // Array of user IDs mentioned
}

export interface Activity {
  id: string;
  boardId: string;
  userId: string;
  action: ActivityAction;
  entityType: 'task' | 'column' | 'board' | 'comment';
  entityId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export type ActivityAction = 
  | 'created'
  | 'updated'
  | 'deleted'
  | 'moved'
  | 'assigned'
  | 'unassigned'
  | 'commented'
  | 'completed';

export interface Chat {
  id: string;
  boardId?: string;
  participants: string[]; // Array of user IDs
  lastMessage?: Message;
  lastMessageAt?: Date;
  unreadCount?: Record<string, number>; // userId -> count
}

export interface Message {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  timestamp: Date;
  readBy: string[]; // Array of user IDs
  attachments?: Attachment[];
  reactions?: Record<string, string[]>; // emoji -> [userId]
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export type NotificationType =
  | 'task_assigned'
  | 'task_completed'
  | 'mention'
  | 'comment'
  | 'due_date'
  | 'board_update';

export interface UserPresence {
  userId: string;
  state: 'online' | 'offline' | 'away';
  lastChanged: Date;
  currentBoard?: string;
}

// Analytics types
export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  byPriority: Record<string, number>;
  byAssignee: Record<string, number>;
}

export interface BoardAnalytics {
  boardId: string;
  period: 'day' | 'week' | 'month';
  tasksCreated: number;
  tasksCompleted: number;
  averageCompletionTime: number; // in hours
  teamProductivity: Record<string, number>; // userId -> tasks completed
  velocityTrend: Array<{ date: string; count: number }>;
}
