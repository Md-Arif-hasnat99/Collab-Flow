-- ═══════════════════════════════════════════════════════════════
-- CollabFlow V2 — Database Schema
-- Migration: 001_schema.sql
-- Run this in the Supabase SQL Editor (single execution)
-- ═══════════════════════════════════════════════════════════════

-- ── Extensions ──────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── Enums ───────────────────────────────────────────────────────
CREATE TYPE workspace_role AS ENUM ('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'MEMBER', 'VIEWER');
CREATE TYPE task_priority  AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE task_status    AS ENUM ('BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');
CREATE TYPE project_status AS ENUM ('ACTIVE', 'ARCHIVED', 'COMPLETED');
CREATE TYPE invitation_status AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');
CREATE TYPE notification_type AS ENUM (
  'TASK_ASSIGNED', 'TASK_UPDATED', 'MENTION', 'COMMENT_CREATED',
  'PROJECT_UPDATED', 'WORKSPACE_INVITED', 'DEADLINE_REMINDER'
);
CREATE TYPE activity_type AS ENUM (
  'TASK_CREATED', 'TASK_UPDATED', 'TASK_MOVED', 'TASK_DELETED',
  'COMMENT_CREATED', 'MEMBER_JOINED', 'MEMBER_REMOVED',
  'PROJECT_CREATED', 'PROJECT_UPDATED', 'BOARD_CREATED', 'FILE_UPLOADED'
);

-- ── Helper function for updated_at ──────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── profiles ────────────────────────────────────────────────────
-- Mirrors auth.users — created automatically on signup (see 005_functions.sql)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_profiles_email ON profiles(email);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── workspaces ──────────────────────────────────────────────────
CREATE TABLE workspaces (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url    TEXT,
  created_by  UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_workspaces_created_by ON workspaces(created_by);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);

CREATE TRIGGER workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── workspace_members ───────────────────────────────────────────
CREATE TABLE workspace_members (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id   UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role           workspace_role NOT NULL DEFAULT 'MEMBER',
  joined_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_active_at TIMESTAMPTZ,
  UNIQUE(workspace_id, user_id)
);
CREATE INDEX idx_wm_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_wm_user     ON workspace_members(user_id);
CREATE INDEX idx_wm_role     ON workspace_members(workspace_id, role);

-- ── workspace_invitations ────────────────────────────────────────
CREATE TABLE workspace_invitations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  invited_by   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  role         workspace_role NOT NULL DEFAULT 'MEMBER',
  token        TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status       invitation_status NOT NULL DEFAULT 'PENDING',
  expires_at   TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(workspace_id, email, status)
);
CREATE INDEX idx_invitations_token      ON workspace_invitations(token);
CREATE INDEX idx_invitations_workspace  ON workspace_invitations(workspace_id);
CREATE INDEX idx_invitations_email      ON workspace_invitations(email);

-- ── projects ────────────────────────────────────────────────────
CREATE TABLE projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  status       project_status NOT NULL DEFAULT 'ACTIVE',
  color        TEXT DEFAULT '#FF6B35',
  due_date     DATE,
  created_by   UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_projects_status    ON projects(workspace_id, status);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── project_members ─────────────────────────────────────────────
CREATE TABLE project_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role       workspace_role NOT NULL DEFAULT 'MEMBER',
  added_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(project_id, user_id)
);
CREATE INDEX idx_pm_project ON project_members(project_id);
CREATE INDEX idx_pm_user    ON project_members(user_id);

-- ── boards ──────────────────────────────────────────────────────
CREATE TABLE boards (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  created_by   UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_boards_project   ON boards(project_id);
CREATE INDEX idx_boards_workspace ON boards(workspace_id);

CREATE TRIGGER boards_updated_at
  BEFORE UPDATE ON boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── columns ─────────────────────────────────────────────────────
CREATE TABLE columns (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id   UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0,
  color      TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_columns_board    ON columns(board_id);
CREATE INDEX idx_columns_position ON columns(board_id, position);

-- ── tasks ───────────────────────────────────────────────────────
CREATE TABLE tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id    UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  board_id     UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  priority     task_priority NOT NULL DEFAULT 'MEDIUM',
  status       task_status NOT NULL DEFAULT 'TODO',
  position     INTEGER NOT NULL DEFAULT 0,
  due_date     DATE,
  created_by   UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_tasks_column    ON tasks(column_id);
CREATE INDEX idx_tasks_board     ON tasks(board_id);
CREATE INDEX idx_tasks_project   ON tasks(project_id);
CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_tasks_position  ON tasks(column_id, position);
CREATE INDEX idx_tasks_status    ON tasks(workspace_id, status);
CREATE INDEX idx_tasks_due_date  ON tasks(workspace_id, due_date) WHERE due_date IS NOT NULL;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── labels ──────────────────────────────────────────────────────
CREATE TABLE labels (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  color        TEXT NOT NULL DEFAULT '#5A5A5A',
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(workspace_id, name)
);
CREATE INDEX idx_labels_workspace ON labels(workspace_id);

-- ── task_labels ─────────────────────────────────────────────────
CREATE TABLE task_labels (
  task_id  UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);

-- ── task_assignees ───────────────────────────────────────────────
CREATE TABLE task_assignees (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);
CREATE INDEX idx_ta_user ON task_assignees(user_id);

-- ── task_checklists ──────────────────────────────────────────────
CREATE TABLE task_checklists (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id      UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  position     INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_checklists_task ON task_checklists(task_id);

-- ── task_comments ────────────────────────────────────────────────
CREATE TABLE task_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_comments_task ON task_comments(task_id);

CREATE TRIGGER task_comments_updated_at
  BEFORE UPDATE ON task_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── files ───────────────────────────────────────────────────────
CREATE TABLE files (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  uploader_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  name         TEXT NOT NULL,
  size         BIGINT NOT NULL,
  mime_type    TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_files_workspace ON files(workspace_id);
CREATE INDEX idx_files_uploader  ON files(uploader_id);

-- ── task_attachments ─────────────────────────────────────────────
CREATE TABLE task_attachments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  file_id     UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_attachments_task ON task_attachments(task_id);

-- ── chat_channels ────────────────────────────────────────────────
CREATE TABLE chat_channels (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  is_direct    BOOLEAN NOT NULL DEFAULT false,
  created_by   UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_channels_workspace ON chat_channels(workspace_id);

-- ── chat_members ─────────────────────────────────────────────────
CREATE TABLE chat_members (
  channel_id   UUID NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ,
  PRIMARY KEY (channel_id, user_id)
);
CREATE INDEX idx_chat_members_user ON chat_members(user_id);

-- ── chat_messages ────────────────────────────────────────────────
CREATE TABLE chat_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  file_id    UUID REFERENCES files(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_messages_channel ON chat_messages(channel_id, created_at DESC);

CREATE TRIGGER chat_messages_updated_at
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── notifications ────────────────────────────────────────────────
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type       notification_type NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  link       TEXT,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_notifications_user    ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_unread  ON notifications(user_id) WHERE is_read = false;

-- ── activities ───────────────────────────────────────────────────
CREATE TABLE activities (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id      UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type         activity_type NOT NULL,
  meta         JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX idx_activities_workspace ON activities(workspace_id, created_at DESC);
CREATE INDEX idx_activities_project   ON activities(project_id, created_at DESC) WHERE project_id IS NOT NULL;
CREATE INDEX idx_activities_task      ON activities(task_id, created_at DESC) WHERE task_id IS NOT NULL;
CREATE INDEX idx_activities_user      ON activities(user_id);
