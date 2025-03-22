'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface UserProfile {
  firstName: string;
  lastName: string;
  contactNumber: string;
  jobTitle: string;
  industry: string;
  experienceLevel: string;
  email: string | null;
  uid: string;
  createdAt?: any;
  updatedAt?: any;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, profile: Omit<UserProfile, 'uid' | 'email'>) => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data() as Omit<UserProfile, 'uid'>;
      }
      return null;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const profile = await fetchUserProfile(firebaseUser.uid);
          if (profile) {
            setUser({
              ...profile,
              uid: firebaseUser.uid
            });
          } else {
            setUser({
              email: firebaseUser.email,
              uid: firebaseUser.uid,
              firstName: '',
              lastName: '',
              jobTitle: '',
              industry: '',
              experienceLevel: '',
              contactNumber: ''
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchUserProfile(result.user.uid);
      if (profile) {
        setUser({
          ...profile,
          uid: result.user.uid
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Failed to login. Please check your credentials.');
      throw err;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    profile: Omit<UserProfile, 'uid' | 'email'>
  ) => {
    try {
      setError(null);
      
      // First check if email exists in users collection
      const usersRef = collection(db, 'users');
      const emailQuery = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(emailQuery);
      
      if (!querySnapshot.empty) {
        throw new Error('auth/email-already-exists');
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save additional user data to Firestore with timestamps
      const userData = {
        ...profile,
        email: result.user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const userDocRef = doc(db, 'users', result.user.uid);
      await setDoc(userDocRef, userData);

      setUser({
        ...userData,
        uid: result.user.uid
      });

      // Sign out after successful registration
      await signOut(auth);
      setUser(null);
      
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use' || err.message === 'auth/email-already-exists') {
        setError('This email is already registered. Please try logging in instead.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      throw err;
    }
  };

  const signupWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Check if email exists with different provider
        const email = result.user.email;
        if (email) {
          const usersRef = collection(db, 'users');
          const emailQuery = query(usersRef, where('email', '==', email));
          const querySnapshot = await getDocs(emailQuery);
          
          if (!querySnapshot.empty) {
            // Delete the auth user since we don't want to create a duplicate
            await result.user.delete();
            throw new Error('auth/email-already-exists');
          }
        }
        
        // Create new user profile in Firestore
        const nameParts = result.user.displayName?.split(' ') || ['', ''];
        const newProfile = {
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
          contactNumber: '',
          jobTitle: '',
          industry: '',
          experienceLevel: '',
          email: result.user.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        try {
          await setDoc(userDocRef, newProfile);
          
          setUser({
            ...newProfile,
            uid: result.user.uid
          });

          // Sign out after successful registration
          await signOut(auth);
          setUser(null);
          
        } catch (firestoreErr) {
          console.error('Error creating user profile:', firestoreErr);
          // If profile creation fails, delete the auth user
          await result.user.delete();
          throw new Error('Failed to create user profile');
        }
      } else {
        throw new Error('auth/email-already-exists');
      }
    } catch (err: any) {
      console.error('Google signup error:', err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in was cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked by your browser. Please enable pop-ups for this site.');
      } else if (err.code === 'auth/account-exists-with-different-credential' || err.message === 'auth/email-already-exists') {
        setError('An account already exists with this email. Please sign in instead.');
      } else {
        setError(err.message || 'Failed to sign up with Google. Please try again.');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, signupWithGoogle, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 