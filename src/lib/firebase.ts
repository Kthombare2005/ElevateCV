import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDY9izp2ilKNe4mtMz6tZY2Txs3dcw1SnA",
  authDomain: "elevatecv-42abf.firebaseapp.com",
  projectId: "elevatecv-42abf",
  storageBucket: "elevatecv-42abf.firebasestorage.app",
  messagingSenderId: "24955256485",
  appId: "1:24955256485:web:f5306750ec83a9e02dd74c",
  measurementId: "G-390RKC4ZF1"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
}

export const createUser = async (email: string, password: string, userData: Omit<UserData, 'createdAt'>) => {
  try {
    // Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: new Date(),
    });

    return { success: true, user };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create user'
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to sign in'
    };
  }
};

export { auth, db }; 