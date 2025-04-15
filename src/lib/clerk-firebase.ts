import { auth } from './firebase';
import { signInWithCustomToken } from 'firebase/auth';

// Function to get a Firebase custom token from Clerk
export async function getFirebaseToken(clerkUser: any): Promise<string> {
  try {
    if (!clerkUser?.id || !clerkUser?.emailAddresses?.[0]?.emailAddress) {
      throw new Error('Invalid Clerk user data');
    }

    // Call your backend API to get a Firebase custom token
    const response = await fetch('/api/firebase-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get Firebase token');
    }

    const { token } = await response.json();
    if (!token) {
      throw new Error('No token received from server');
    }

    return token;
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    throw error;
  }
}

// Function to sign in to Firebase with a Clerk user
export async function signInToFirebaseWithClerk(clerkUser: any): Promise<void> {
  try {
    // Check if already signed in
    if (auth.currentUser) {
      console.log('Already signed in to Firebase');
      return;
    }

    const token = await getFirebaseToken(clerkUser);
    await signInWithCustomToken(auth, token);
    console.log('Signed in to Firebase with Clerk user');
  } catch (error) {
    console.error('Error signing in to Firebase with Clerk:', error);
    throw error;
  }
} 