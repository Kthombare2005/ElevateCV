import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserData {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  jobTitle?: string;
  experience?: string;
  skills?: string[];
  industry?: string;
  createdAt: string;
  updatedAt: string;
}

export async function signUp(email: string, password: string, userData: Partial<UserData>): Promise<FirebaseUser> {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    if (userData.displayName) {
      await updateProfile(user, { displayName: userData.displayName });
    }
    
    // Create user document in Firestore
    const userDoc = {
      id: user.uid,
      email: user.email,
      displayName: userData.displayName || '',
      photoURL: user.photoURL || '',
      jobTitle: userData.jobTitle || '',
      experience: userData.experience || '',
      skills: userData.skills || [],
      industry: userData.industry || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', user.uid), userDoc);
    
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
}

export async function updateUserData(userId: string, userData: Partial<UserData>): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
} 