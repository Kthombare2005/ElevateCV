import { db, storage } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { AnalysisResponse } from './gemini-ai';

// Interface for user data
export interface UserData {
  userId: string;
  resumeUrl?: string;
  analysisReport?: AnalysisResponse;
  createdAt: Date;
  updatedAt: Date;
}

// Function to save resume to Firebase Storage
export async function saveResumeToStorage(userId: string, file: File): Promise<string> {
  const storageRef = ref(storage, `resumes/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

// Function to save user data to Firestore
export async function saveUserData(userId: string, data: Partial<UserData>): Promise<void> {
  const userDataRef = collection(db, 'userData');
  const q = query(userDataRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    // Create new user data document
    await addDoc(userDataRef, {
      userId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    // Update existing user data document
    const docRef = doc(db, 'userData', querySnapshot.docs[0].id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  }
}

// Function to get user data from Firestore
export async function getUserData(userId: string): Promise<UserData | null> {
  const userDataRef = collection(db, 'userData');
  const q = query(userDataRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  return querySnapshot.docs[0].data() as UserData;
}

// Function to delete user data from Firestore
export async function deleteUserData(userId: string): Promise<void> {
  const userDataRef = collection(db, 'userData');
  const q = query(userDataRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = doc(db, 'userData', querySnapshot.docs[0].id);
    await deleteDoc(docRef);
  }
}

// Function to delete resume from Firebase Storage
export async function deleteResumeFromStorage(userId: string, fileName: string): Promise<void> {
  const storageRef = ref(storage, `resumes/${userId}/${fileName}`);
  await deleteObject(storageRef);
} 