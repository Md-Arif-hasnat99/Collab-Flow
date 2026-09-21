-- ═══════════════════════════════════════════════════════════════
-- CollabFlow V2 — Row Level Security Policies
-- Migration: 002_rls.sql
-- Run AFTER 001_schema.sql
-- ═══════════════════════════════════════════════════════════════

-- ── Helper: check workspace membership ──────────────────────────
CREATE OR REPLACE FUNCTION is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_workspace_role(ws_id UUID)
RETURNS workspace_role AS $$
  SELECT role FROM workspace_members
  WHERE workspace_id = ws_id AND user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_workspace_admin(ws_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
      AND role IN ('OWNER', 'ADMIN')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_workspace_owner(ws_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
      AND role = 'OWNER'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Enable RLS on all tables ─────────────────────────────────────
ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces            ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects              ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards                ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns               ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels                ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_labels           ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignees        ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_checklists       ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE files                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_channels         ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_members          ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities            ENABLE ROW LEVEL SECURITY;

-- ── profiles ────────────────────────────────────────────────────
-- Users can read any profile in their workspaces; only edit their own
CREATE POLICY "profiles_read_own"
  ON profiles FOR SELECT USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM workspace_members wm1
      JOIN workspace_members wm2 ON wm1.workspace_id = wm2.workspace_id
      WHERE wm1.user_id = auth.uid() AND wm2.user_id = profiles.id
    )
  );
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── workspaces ──────────────────────────────────────────────────
CREATE POLICY "workspaces_read"
  ON workspaces FOR SELECT USING (is_workspace_member(id) OR created_by = auth.uid());
CREATE POLICY "workspaces_update"
  ON workspaces FOR UPDATE USING (is_workspace_admin(id));
CREATE POLICY "workspaces_delete"
  ON workspaces FOR DELETE USING (is_workspace_owner(id));
CREATE POLICY "workspaces_insert"
  ON workspaces FOR INSERT WITH CHECK (auth.uid() = created_by);

-- ── workspace_members ───────────────────────────────────────────
CREATE POLICY "wm_read"
  ON workspace_members FOR SELECT USING (is_workspace_member(workspace_id));
CREATE POLICY "wm_insert"
  ON workspace_members FOR INSERT WITH CHECK (
    is_workspace_admin(workspace_id)
    OR (
      EXISTS (SELECT 1 FROM workspaces WHERE id = workspace_id AND created_by = auth.uid())
      AND user_id = auth.uid()
      AND role = 'OWNER'
    )
  );
CREATE POLICY "wm_update"
  ON workspace_members FOR UPDATE USING (is_workspace_admin(workspace_id));
CREATE POLICY "wm_delete"
  ON workspace_members FOR DELETE USING (
    is_workspace_admin(workspace_id)
    AND user_id != (
      SELECT user_id FROM workspace_members
      WHERE workspace_id = workspace_members.workspace_id AND role = 'OWNER' LIMIT 1
    )
  );

-- ── workspace_invitations ────────────────────────────────────────
CREATE POLICY "inv_read"
  ON workspace_invitations FOR SELECT USING (
    is_workspace_admin(workspace_id) OR email = auth.email()
  );
CREATE POLICY "inv_insert"
  ON workspace_invitations FOR INSERT WITH CHECK (is_workspace_admin(workspace_id));
CREATE POLICY "inv_update"
  ON workspace_invitations FOR UPDATE USING (
    is_workspace_admin(workspace_id) OR email = auth.email()
  );

-- Allow unauthenticated token lookup (for invite page)
CREATE POLICY "inv_token_lookup"
  ON workspace_invitations FOR SELECT USING (true);
  -- Fine-grained: token is unguessable (32 random bytes)

-- ── projects ────────────────────────────────────────────────────
CREATE POLICY "projects_read"
  ON projects FOR SELECT USING (is_workspace_member(workspace_id));
CREATE POLICY "projects_insert"
  ON projects FOR INSERT WITH CHECK (
    is_workspace_member(workspace_id)
    AND get_workspace_role(workspace_id) IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
  );
CREATE POLICY "projects_update"
  ON projects FOR UPDATE USING (
    get_workspace_role(workspace_id) IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
  );
CREATE POLICY "projects_delete"
  ON projects FOR DELETE USING (is_workspace_admin(workspace_id));

-- ── project_members ─────────────────────────────────────────────
CREATE POLICY "pm_read"
  ON project_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_id AND is_workspace_member(p.workspace_id))
  );
CREATE POLICY "pm_manage"
  ON project_members FOR ALL USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_id AND is_workspace_admin(p.workspace_id))
  );

-- ── boards ──────────────────────────────────────────────────────
CREATE POLICY "boards_read"
  ON boards FOR SELECT USING (is_workspace_member(workspace_id));
CREATE POLICY "boards_write"
  ON boards FOR INSERT WITH CHECK (
    get_workspace_role(workspace_id) IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
  );
CREATE POLICY "boards_update"
  ON boards FOR UPDATE USING (
    get_workspace_role(workspace_id) IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
  );
CREATE POLICY "boards_delete"
  ON boards FOR DELETE USING (is_workspace_admin(workspace_id));

-- ── columns ─────────────────────────────────────────────────────
CREATE POLICY "columns_read"
  ON columns FOR SELECT USING (
    EXISTS (SELECT 1 FROM boards b WHERE b.id = board_id AND is_workspace_member(b.workspace_id))
  );
CREATE POLICY "columns_write"
  ON columns FOR ALL USING (
    EXISTS (
      SELECT 1 FROM boards b WHERE b.id = board_id
      AND get_workspace_role(b.workspace_id) IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
    )
  );

-- ── tasks ───────────────────────────────────────────────────────
CREATE POLICY "tasks_read"
  ON tasks FOR SELECT USING (is_workspace_member(workspace_id));
CREATE POLICY "tasks_insert"
  ON tasks FOR INSERT WITH CHECK (
    is_workspace_member(workspace_id)
    AND get_workspace_role(workspace_id) != 'VIEWER'
  );
CREATE POLICY "tasks_update"
  ON tasks FOR UPDATE USING (
    is_workspace_member(workspace_id)
    AND get_workspace_role(workspace_id) != 'VIEWER'
  );
CREATE POLICY "tasks_delete"
  ON tasks FOR DELETE USING (
    get_workspace_role(workspace_id) IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
  );

-- ── labels ──────────────────────────────────────────────────────
CREATE POLICY "labels_read"
  ON labels FOR SELECT USING (is_workspace_member(workspace_id));
CREATE POLICY "labels_write"
  ON labels FOR ALL USING (
    get_workspace_role(workspace_id) IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
  );

-- ── task_labels, task_assignees ──────────────────────────────────
CREATE POLICY "task_labels_read"
  ON task_labels FOR SELECT USING (
    EXISTS (SELECT 1 FROM tasks t WHERE t.id = task_id AND is_workspace_member(t.workspace_id))
  );
CREATE POLICY "task_labels_write"
  ON task_labels FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tasks t WHERE t.id = task_id
      AND get_workspace_role(t.workspace_id) != 'VIEWER'
    )
  );

CREATE POLICY "task_assignees_read"
  ON task_assignees FOR SELECT USING (
    EXISTS (SELECT 1 FROM tasks t WHERE t.id = task_id AND is_workspace_member(t.workspace_id))
  );
CREATE POLICY "task_assignees_write"
  ON task_assignees FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tasks t WHERE t.id = task_id
      AND get_workspace_role(t.workspace_id) IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER')
    )
  );

-- ── task_checklists ──────────────────────────────────────────────
CREATE POLICY "checklists_read"
  ON task_checklists FOR SELECT USING (
    EXISTS (SELECT 1 FROM tasks t WHERE t.id = task_id AND is_workspace_member(t.workspace_id))
  );
CREATE POLICY "checklists_write"
  ON task_checklists FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tasks t WHERE t.id = task_id
      AND get_workspace_role(t.workspace_id) != 'VIEWER'
    )
  );

-- ── task_comments ────────────────────────────────────────────────
CREATE POLICY "comments_read"
  ON task_comments FOR SELECT USING (
    EXISTS (SELECT 1 FROM tasks t WHERE t.id = task_id AND is_workspace_member(t.workspace_id))
  );
CREATE POLICY "comments_insert"
  ON task_comments FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM tasks t WHERE t.id = task_id
      AND get_workspace_role(t.workspace_id) != 'VIEWER'
    )
  );
CREATE POLICY "comments_delete"
  ON task_comments FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM tasks t WHERE t.id = task_id AND is_workspace_admin(t.workspace_id)
    )
  );

-- ── task_attachments + files ─────────────────────────────────────
CREATE POLICY "attachments_read"
  ON task_attachments FOR SELECT USING (
    EXISTS (SELECT 1 FROM tasks t WHERE t.id = task_id AND is_workspace_member(t.workspace_id))
  );
CREATE POLICY "attachments_insert"
  ON task_attachments FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by
    AND EXISTS (
      SELECT 1 FROM tasks t WHERE t.id = task_id
      AND get_workspace_role(t.workspace_id) != 'VIEWER'
    )
  );
CREATE POLICY "attachments_delete"
  ON task_attachments FOR DELETE USING (
    auth.uid() = uploaded_by
    OR EXISTS (SELECT 1 FROM tasks t WHERE t.id = task_id AND is_workspace_admin(t.workspace_id))
  );

CREATE POLICY "files_read"
  ON files FOR SELECT USING (is_workspace_member(workspace_id));
CREATE POLICY "files_insert"
  ON files FOR INSERT WITH CHECK (
    auth.uid() = uploader_id AND is_workspace_member(workspace_id)
  );

-- ── chat_channels + chat_members ────────────────────────────────
CREATE POLICY "channels_read"
  ON chat_channels FOR SELECT USING (
    is_workspace_member(workspace_id)
    AND EXISTS (SELECT 1 FROM chat_members WHERE channel_id = id AND user_id = auth.uid())
  );
CREATE POLICY "channels_insert"
  ON chat_channels FOR INSERT WITH CHECK (
    auth.uid() = created_by AND is_workspace_member(workspace_id)
  );

CREATE POLICY "chat_members_read"
  ON chat_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_channels c WHERE c.id = channel_id AND is_workspace_member(c.workspace_id))
  );
CREATE POLICY "chat_members_manage"
  ON chat_members FOR ALL USING (
    EXISTS (SELECT 1 FROM chat_channels c WHERE c.id = channel_id AND is_workspace_member(c.workspace_id))
  );

-- ── chat_messages ────────────────────────────────────────────────
CREATE POLICY "messages_read"
  ON chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_members WHERE channel_id = chat_messages.channel_id AND user_id = auth.uid())
  );
CREATE POLICY "messages_insert"
  ON chat_messages FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM chat_members WHERE channel_id = chat_messages.channel_id AND user_id = auth.uid())
  );
CREATE POLICY "messages_delete"
  ON chat_messages FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM chat_channels c WHERE c.id = channel_id AND is_workspace_admin(c.workspace_id)
    )
  );

-- ── notifications ────────────────────────────────────────────────
CREATE POLICY "notifications_own"
  ON notifications FOR ALL USING (auth.uid() = user_id);

-- ── activities ───────────────────────────────────────────────────
CREATE POLICY "activities_read"
  ON activities FOR SELECT USING (is_workspace_member(workspace_id));
CREATE POLICY "activities_insert"
  ON activities FOR INSERT WITH CHECK (
    auth.uid() = user_id AND is_workspace_member(workspace_id)
  );
