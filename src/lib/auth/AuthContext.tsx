'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  Auth,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth as firebaseAuth, db as firebaseDb } from '@/lib/firebase/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  signinWithGoogle: () => Promise<void>;
  signupWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = firebaseAuth;
  const db = firebaseDb;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user profile exists
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Create user profile if it doesn't exist
          await setDoc(userRef, {
            email: user.email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          });
        } else {
          // Update last login
          await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        }

        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const signin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      // Check if email already exists in users collection
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error('auth/email-already-exists');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', userCredential.user.uid);
      
      await setDoc(userRef, {
        email: userCredential.user.email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      // Sign out after successful registration
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signupWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user already exists
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // User exists, sign out and throw error
        await signOut(auth);
        throw new Error('auth/account-exists');
      }

      // Create new user profile
      await setDoc(userRef, {
        email: userCredential.user.email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      // Sign out after successful registration
      await signOut(auth);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('auth/popup-closed');
      }
      throw new Error(error.message);
    }
  };

  const signinWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('auth/popup-closed');
      }
      throw new Error(error.message);
    }
  };

  const signout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signin,
        signup,
        signout,
        signinWithGoogle,
        signupWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 