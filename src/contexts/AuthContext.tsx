import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  arrayUnion 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string, role?: 'admin' | 'employee', teamCode?: string, workspaceName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          id: userDoc.id,
          ...data,
          lastActive: data.lastActive?.toDate(),
        } as User);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Create user document in Firestore
  const createUserDocument = async (user: FirebaseUser, displayName: string) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const userData: Omit<User, 'id'> = {
        displayName: displayName || user.displayName || 'Anonymous',
        email: user.email || '',
        photoURL: user.photoURL || null,
        workspaces: [],
        settings: {
          theme: 'light',
          notifications: {
            email: true,
            push: true,
            mentions: true,
            assignments: true,
          },
        },
        lastActive: new Date(),
      };

      await setDoc(userRef, {
        ...userData,
        lastActive: serverTimestamp(),
      });

      await fetchUserData(user.uid);
    }
  };

  // Sign up with email and password
  const signup = async (email: string, password: string, displayName: string, role?: 'admin' | 'employee', teamCode?: string, workspaceName?: string) => {
    try {
      // Validate inputs based on role
      if (role === 'admin') {
        if (!teamCode) throw new Error('Team code is required for admins');
        if (!workspaceName) throw new Error('Workspace name is required for admins');
        
        // Check if team code already exists - handled below
        // const q = query(collection(db, 'workspaces'), where('teamCode', '==', teamCode));
      }

      // Check for code uniqueness or existence BEFORE creating auth user to fail fast
      if (role === 'admin' && teamCode) {
        const workspacesRef = collection(db, 'workspaces');
        const q = query(workspacesRef, where('teamCode', '==', teamCode));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          throw new Error('This Team Code is already taken. Please choose another.');
        }
      }

      let workspaceIdToJoin: string | null = null;

      if (role === 'employee' && teamCode) {
        const workspacesRef = collection(db, 'workspaces');
        const q = query(workspacesRef, where('teamCode', '==', teamCode));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          throw new Error('Invalid Team Code. Please check and try again.');
        }
        workspaceIdToJoin = snapshot.docs[0].id;
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      
      // Create user document
      await createUserDocument(result.user, displayName);

      // Handle Workspace Logic
      if (role === 'admin' && teamCode && workspaceName) {
        // Create new workspace
        const workspaceData = {
          name: workspaceName,
          ownerId: result.user.uid,
          teamCode: teamCode,
          members: [{
            userId: result.user.uid,
            role: 'admin',
            joinedAt: new Date()
          }],
          createdAt: serverTimestamp(),
          settings: {
            allowGuestAccess: false,
            taskPrefix: 'TASK'
          }
        };

        const workspaceRef = await addDoc(collection(db, 'workspaces'), workspaceData);
        
        // Add workspace to user
        await updateDoc(doc(db, 'users', result.user.uid), {
          workspaces: arrayUnion(workspaceRef.id)
        });
      } else if (role === 'employee' && workspaceIdToJoin) {
        // Join existing workspace
        const workspaceRef = doc(db, 'workspaces', workspaceIdToJoin);
        
        await updateDoc(workspaceRef, {
          members: arrayUnion({
            userId: result.user.uid,
            role: 'member',
            joinedAt: new Date()
          })
        });

        // Add workspace to user
        await updateDoc(doc(db, 'users', result.user.uid), {
          workspaces: arrayUnion(workspaceIdToJoin)
        });
      }

      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error; // Re-throw to handle in component
    }
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user, result.user.displayName || 'Google User');
      toast.success('Logged in with Google!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      toast.success('Logged out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, updates, { merge: true });
      await fetchUserData(currentUser.uid);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
