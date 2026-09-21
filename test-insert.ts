import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const email = `test_${Date.now()}@example.com`;
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password: 'Password123!',
    options: {
      data: { full_name: 'Test User' }
    }
  });

  if (authErr) {
    console.error('Auth error:', authErr);
    return;
  }

  const user = authData.user;
  if (!user) return console.error('No user');

  console.log('User created:', user.id);

  // 1. Create Workspace
  const { data: ws, error: wsErr } = await supabase.from('workspaces').insert({
    name: 'Test Workspace',
    created_by: user.id
  }).select().single();

  if (wsErr) return console.error('Workspace error:', wsErr);
  console.log('Workspace created:', ws.id);

  // 2. Create Project
  const { data: proj, error: projErr } = await supabase.from('projects').insert({
    workspace_id: ws.id,
    name: 'Test Project',
    created_by: user.id
  }).select().single();

  if (projErr) return console.error('Project error:', projErr);
  console.log('Project created:', proj.id);

  // 3. Create Board
  const { data: board, error: boardErr } = await supabase.from('boards').insert({
    workspace_id: ws.id,
    project_id: proj.id,
    name: 'Test Board',
    created_by: user.id
  }).select().single();

  if (boardErr) return console.error('Board error:', boardErr);
  console.log('Board created:', board.id);

  // 4. Create Column
  const { data: col, error: colErr } = await supabase.from('columns').insert({
    board_id: board.id,
    name: 'TODO',
    position: 0
  }).select().single();

  if (colErr) return console.error('Column error:', colErr);
  console.log('Column created:', col.id);

  // 5. Create Task
  const { error: taskErr } = await supabase.from('tasks').insert({
    title: 'Test Task',
    column_id: col.id,
    board_id: board.id,
    workspace_id: ws.id,
    project_id: proj.id,
    priority: 'MEDIUM',
    status: 'TODO',
    position: 0,
    due_date: null,
    created_by: user.id,
  });

  if (taskErr) {
    console.error('Task insert error:', JSON.stringify(taskErr, null, 2));
  } else {
    console.log('Task created successfully!');
  }
}

test();
