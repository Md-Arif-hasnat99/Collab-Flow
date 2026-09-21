import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Board, Column, Task } from '../types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface BoardContextType {
  currentBoard: Board | null;
  columns: Column[];
  tasks: Task[];
  loading: boolean;
  setCurrentBoardId: (boardId: string | null) => void;
  createColumn: (name: string, color: string) => Promise<void>;
  updateColumn: (columnId: string, updates: Partial<Column>) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  createTask: (columnId: string, taskData: Partial<Task>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newColumnId: string, newOrder: number) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
  isAdmin: boolean;
  userRole: 'admin' | 'member' | 'viewer' | null;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBoardId, setCurrentBoardIdState] = useState<string | null>(() => {
    return localStorage.getItem('lastBoardId');
  });

  const setCurrentBoardId = (id: string | null) => {
    setCurrentBoardIdState(id);
    if (id) {
      localStorage.setItem('lastBoardId', id);
    } else {
      localStorage.removeItem('lastBoardId');
    }
  };
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  // const [loading, setLoading] = useState(false); // Removed duplicate
  const { currentUser: authUser, userData } = useAuth(); // Renamed to authUser for clarity, accessing userData from AuthContext
  const [userRole, setUserRole] = useState<'admin' | 'member' | 'viewer' | null>(null);

  const isAdmin = userRole === 'admin';

  // Fetch workspace role
  useEffect(() => {
    const fetchRole = async () => {
      // Assuming user belongs to at least one workspace for now, or finding workspace associated with board
      if (!authUser || !userData?.workspaces?.length) {
        setUserRole(null);
        return;
      }

      // For now, simplistically check the role in the first workspace (as per single workspace model assumption in parts of app)
      // Ideally, we should fetch the workspace document corresponding to the current board.
      // But we don't readily have workspaceId here unless we fetch board first.
      // Let's rely on fetching the workspace document that maps to userData.workspaces[0]
      
      try {
        const workspaceId = userData.workspaces[0];
        if (workspaceId) {
            const workspaceDoc = await import('firebase/firestore').then(mod => mod.getDoc(mod.doc(db, 'workspaces', workspaceId)));
            if (workspaceDoc.exists()) {
                const workspaceData = workspaceDoc.data();
                const member = workspaceData.members.find((m: any) => m.userId === authUser.uid);
                setUserRole(member?.role || null);
            }
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
    fetchRole();
  }, [authUser, userData]);

  // Listen to board changes
  useEffect(() => {
    if (!currentBoardId) {
      setCurrentBoard(null);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, 'boards', currentBoardId),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentBoard({
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          } as Board);
        } else {
          // Board was deleted
          setCurrentBoard(null);
          // We can't easily reset currentBoardId here without causing a loop if not careful,
          // usually the layout handling the list will handle re-selection.
          // But cleaning up the state is important.
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to board:', error);
        toast.error('Failed to load board');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentBoardId]);

  // Listen to columns changes
  useEffect(() => {
    if (!currentBoardId) {
      setColumns([]);
      return;
    }

    const q = query(
      collection(db, 'columns'),
      where('boardId', '==', currentBoardId),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const columnsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Column[];
        setColumns(columnsData);
      },
      (error) => {
        console.error('Error listening to columns:', error);
      }
    );

    return unsubscribe;
  }, [currentBoardId]);

  // Listen to tasks changes
  useEffect(() => {
    if (!currentBoardId) {
      setTasks([]);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('boardId', '==', currentBoardId),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            dueDate: data.dueDate?.toDate(),
          };
        }) as Task[];
        setTasks(tasksData);
      },
      (error) => {
        console.error('Error listening to tasks:', error);
      }
    );

    return unsubscribe;
  }, [currentBoardId]);

  // Create a new column
  const createColumn = async (name: string, color: string) => {
    if (!currentBoardId || !authUser) return;
    if (!isAdmin) {
        toast.error("Only admins can create columns");
        return;
    }

    try {
      const newColumn = {
        boardId: currentBoardId,
        name,
        color,
        order: columns.length,
      };

      const docRef = await addDoc(collection(db, 'columns'), newColumn);

      // Update board's columns array
      await updateDoc(doc(db, 'boards', currentBoardId), {
        columns: [...(currentBoard?.columns || []), docRef.id],
        updatedAt: serverTimestamp(),
      });

      toast.success('Column created successfully');
    } catch (error) {
      console.error('Error creating column:', error);
      toast.error('Failed to create column');
    }
  };

  // Update a column
  const updateColumn = async (columnId: string, updates: Partial<Column>) => {
    try {
      await updateDoc(doc(db, 'columns', columnId), updates);
      toast.success('Column updated');
    } catch (error) {
      console.error('Error updating column:', error);
      toast.error('Failed to update column');
    }
  };

  // Delete a column
  const deleteColumn = async (columnId: string) => {
    if (!currentBoardId) return;
    if (!isAdmin) {
        toast.error("Only admins can delete columns");
        return;
    }

    try {
      const batch = writeBatch(db);

      // Delete all tasks in the column
      const columnTasks = tasks.filter((task) => task.columnId === columnId);
      columnTasks.forEach((task) => {
        batch.delete(doc(db, 'tasks', task.id));
      });

      // Delete the column
      batch.delete(doc(db, 'columns', columnId));

      // Update board's columns array
      const updatedColumns = currentBoard?.columns.filter((id) => id !== columnId) || [];
      batch.update(doc(db, 'boards', currentBoardId), {
        columns: updatedColumns,
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
      toast.success('Column deleted');
    } catch (error) {
      console.error('Error deleting column:', error);
      toast.error('Failed to delete column');
    }
  };

  // Create a new task
  const createTask = async (columnId: string, taskData: Partial<Task>) => {
    if (!currentBoardId || !authUser) return;
    if (!isAdmin) {
        toast.error("Only admins can create tasks");
        return;
    }

    try {
      const columnTasks = tasks.filter((task) => task.columnId === columnId);
      const newTask = {
        boardId: currentBoardId,
        columnId,
        title: taskData.title || 'Untitled Task',
        description: taskData.description || '',
        assignedTo: taskData.assignedTo || [],
        priority: taskData.priority || 'medium',
        tags: taskData.tags || [],
        createdBy: authUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        comments: 0,
        attachments: [],
        order: columnTasks.length,
        checklist: [],
      };

      await addDoc(collection(db, 'tasks'), newTask);
      toast.success('Task created');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  // Update a task
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Move a task to a different column
  const moveTask = async (taskId: string, newColumnId: string, newOrder: number) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        columnId: newColumnId,
        order: newOrder,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Failed to move task');
    }
  };

  // Delete a board
  const deleteBoard = async (boardId: string) => {
    if (!isAdmin) {
        toast.error("Only admins can delete boards");
        return;
    }
    try {
      const batch = writeBatch(db);

      // 1. Get all columns for this board
      const columnsQuery = query(collection(db, 'columns'), where('boardId', '==', boardId));
      const columnsSnapshot = await import('firebase/firestore').then(mod => mod.getDocs(columnsQuery));
      
      // 2. Get all tasks for this board
      const tasksQuery = query(collection(db, 'tasks'), where('boardId', '==', boardId));
      const tasksSnapshot = await import('firebase/firestore').then(mod => mod.getDocs(tasksQuery));

      // 3. Delete all tasks
      tasksSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // 4. Delete all columns
      columnsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // 5. Delete the board
      batch.delete(doc(db, 'boards', boardId));

      await batch.commit();

      if (currentBoardId === boardId) {
        setCurrentBoardId(null);
      }

      toast.success('Board deleted successfully');
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error('Failed to delete board');
    }
  };

  const value: BoardContextType = {
    currentBoard,
    columns,
    tasks,
    loading,
    setCurrentBoardId,
    createColumn,
    updateColumn,
    deleteColumn,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    deleteBoard,
    isAdmin,
    userRole
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};
