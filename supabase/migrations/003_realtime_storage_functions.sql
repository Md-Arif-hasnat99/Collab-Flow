-- ═══════════════════════════════════════════════════════════════
-- CollabFlow V2 — Realtime + Storage + Functions
-- Migration: 003_realtime.sql  (run after 002)
-- Migration: 004_storage.sql   (run after 003)
-- Migration: 005_functions.sql (run after 004)
-- All combined into one file for convenience.
-- ═══════════════════════════════════════════════════════════════

-- ── 003: Supabase Realtime Publications ─────────────────────────
-- Enable Realtime for collaborative tables
BEGIN;
  -- Drop and recreate the publication to add tables
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE
    tasks,
    columns,
    task_comments,
    task_checklists,
    chat_messages,
    chat_members,
    notifications,
    activities,
    workspace_members;
COMMIT;

-- ── 004: Storage Buckets ─────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars',            'avatars',            true,  5242880,   ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('task-attachments',   'task-attachments',   false, 52428800,  NULL),
  ('workspace-files',    'workspace-files',    false, 52428800,  NULL),
  ('chat-files',         'chat-files',         false, 26214400,  NULL)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
-- Avatars: public read, authenticated write own
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_upload_own"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Task attachments: workspace members only
CREATE POLICY "task_attach_read"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'task-attachments'
    AND auth.uid() IS NOT NULL
  );
CREATE POLICY "task_attach_upload"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'task-attachments' AND auth.uid() IS NOT NULL
  );

-- Workspace files
CREATE POLICY "ws_files_read"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'workspace-files' AND auth.uid() IS NOT NULL
  );
CREATE POLICY "ws_files_upload"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'workspace-files' AND auth.uid() IS NOT NULL
  );

-- Chat files
CREATE POLICY "chat_files_read"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'chat-files' AND auth.uid() IS NOT NULL
  );
CREATE POLICY "chat_files_upload"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'chat-files' AND auth.uid() IS NOT NULL
  );

-- ── 005: Functions & Triggers ────────────────────────────────────

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    full_name  = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-generate activity on task create/update/move
CREATE OR REPLACE FUNCTION public.log_task_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_type activity_type;
  v_meta JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_type := 'TASK_CREATED';
    v_meta := jsonb_build_object('title', NEW.title);
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.column_id != NEW.column_id THEN
      v_type := 'TASK_MOVED';
      v_meta := jsonb_build_object(
        'title', NEW.title,
        'from_column', OLD.column_id,
        'to_column', NEW.column_id
      );
    ELSE
      v_type := 'TASK_UPDATED';
      v_meta := jsonb_build_object('title', NEW.title);
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    v_type := 'TASK_DELETED';
    v_meta := jsonb_build_object('title', OLD.title);
    INSERT INTO activities (workspace_id, project_id, task_id, user_id, type, meta)
    VALUES (OLD.workspace_id, OLD.project_id, OLD.id, auth.uid(), v_type, v_meta);
    RETURN OLD;
  END IF;

  INSERT INTO activities (workspace_id, project_id, task_id, user_id, type, meta)
  VALUES (NEW.workspace_id, NEW.project_id, NEW.id, COALESCE(auth.uid(), NEW.created_by), v_type, v_meta);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER task_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON tasks
  FOR EACH ROW EXECUTE FUNCTION public.log_task_activity();

-- Auto-generate notification on task assignment
CREATE OR REPLACE FUNCTION public.notify_task_assigned()
RETURNS TRIGGER AS $$
DECLARE
  v_task RECORD;
  v_actor_name TEXT;
BEGIN
  SELECT t.*, p.full_name AS creator_name
  INTO v_task
  FROM tasks t
  LEFT JOIN profiles p ON p.id = auth.uid()
  WHERE t.id = NEW.task_id;

  SELECT COALESCE(full_name, email) INTO v_actor_name
  FROM profiles WHERE id = auth.uid();

  -- Don't notify if you assigned yourself
  IF NEW.user_id != auth.uid() THEN
    INSERT INTO notifications (user_id, actor_id, type, title, body, link)
    VALUES (
      NEW.user_id,
      auth.uid(),
      'TASK_ASSIGNED',
      v_actor_name || ' assigned you a task',
      v_task.title,
      '/app/tasks/' || NEW.task_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER notify_on_task_assigned
  AFTER INSERT ON task_assignees
  FOR EACH ROW EXECUTE FUNCTION public.notify_task_assigned();

-- Auto-generate notification on comment
CREATE OR REPLACE FUNCTION public.notify_task_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_task RECORD;
  v_actor_name TEXT;
  v_assignee RECORD;
BEGIN
  SELECT * INTO v_task FROM tasks WHERE id = NEW.task_id;
  SELECT COALESCE(full_name, email) INTO v_actor_name FROM profiles WHERE id = NEW.user_id;

  -- Notify task creator (if not the commenter)
  IF v_task.created_by != NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, title, body, link)
    VALUES (
      v_task.created_by, NEW.user_id, 'COMMENT_CREATED',
      v_actor_name || ' commented on ' || v_task.title,
      LEFT(NEW.content, 100),
      '/app/tasks/' || NEW.task_id
    )
    ON CONFLICT DO NOTHING;
  END IF;

  -- Notify assignees (except commenter)
  FOR v_assignee IN
    SELECT user_id FROM task_assignees WHERE task_id = NEW.task_id AND user_id != NEW.user_id
  LOOP
    INSERT INTO notifications (user_id, actor_id, type, title, body, link)
    VALUES (
      v_assignee.user_id, NEW.user_id, 'COMMENT_CREATED',
      v_actor_name || ' commented on ' || v_task.title,
      LEFT(NEW.content, 100),
      '/app/tasks/' || NEW.task_id
    )
    ON CONFLICT DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER notify_on_comment
  AFTER INSERT ON task_comments
  FOR EACH ROW EXECUTE FUNCTION public.notify_task_comment();

-- Auto-expire invitations
CREATE OR REPLACE FUNCTION public.expire_old_invitations()
RETURNS void AS $$
  UPDATE workspace_invitations
  SET status = 'EXPIRED'
  WHERE status = 'PENDING' AND expires_at < now();
$$ LANGUAGE sql SECURITY DEFINER;

-- Workspace slug generator
CREATE OR REPLACE FUNCTION public.generate_workspace_slug(name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  base_slug := lower(regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := substring(base_slug, 1, 40);
  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM workspaces WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Accept invitation function (called client-side after auth)
CREATE OR REPLACE FUNCTION public.accept_invitation(p_token TEXT)
RETURNS JSONB AS $$
DECLARE
  v_inv RECORD;
BEGIN
  SELECT * INTO v_inv
  FROM workspace_invitations
  WHERE token = p_token AND status = 'PENDING' AND expires_at > now();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Invitation not found, already used, or expired');
  END IF;

  -- Add to workspace
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (v_inv.workspace_id, auth.uid(), v_inv.role)
  ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = EXCLUDED.role;

  -- Mark invitation as accepted
  UPDATE workspace_invitations SET status = 'ACCEPTED' WHERE id = v_inv.id;

  -- Log activity
  INSERT INTO activities (workspace_id, user_id, type, meta)
  VALUES (v_inv.workspace_id, auth.uid(), 'MEMBER_JOINED', '{}');

  RETURN jsonb_build_object('workspace_id', v_inv.workspace_id, 'role', v_inv.role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
