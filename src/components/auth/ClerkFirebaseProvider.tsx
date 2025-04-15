'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { signInToFirebaseWithClerk } from '@/lib/clerk-firebase';

export default function ClerkFirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Sign in to Firebase with the Clerk user
      signInToFirebaseWithClerk(user).catch((error) => {
        console.error('Error signing in to Firebase with Clerk:', error);
      });
    }
  }, [isLoaded, isSignedIn, user]);

  return <>{children}</>;
} 