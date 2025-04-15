import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from 'firebase-admin';
import { getAuth } from '@clerk/nextjs/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if it hasn't been initialized yet
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get the current user from Clerk
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the request body
    const { clerkUserId, email } = await request.json();

    // Verify that the Clerk user ID matches the authenticated user
    if (clerkUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a custom token for Firebase
    const token = await adminAuth().createCustomToken(clerkUserId, {
      email,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error creating Firebase token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 