import { signOut } from "firebase/auth";
import { auth } from '@/lib/firebase/firebaseClient';
import { NextResponse } from "next/server";

interface FirebaseError extends Error {
  code: string;
}

export async function POST(req: Request) {
  try {
    // Log out the current user
    await signOut(auth);

    return NextResponse.json({ 
      status: "success", 
      message: "User logged out successfully"
    });
  } catch (error) {
    console.error('Error logging out:', error);

    return NextResponse.json({ 
      status: "error", 
      message: (error as Error).message
    }, { status: 400 });
  }
}
