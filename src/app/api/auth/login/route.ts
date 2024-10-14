import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/firebase/firebaseClient';
import { NextResponse } from "next/server";

interface FirebaseError extends Error {
  code: string;
}

export async function POST(req: Request) {
  const { email, password } = await req.json();
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    let {claims, token} = await user.getIdTokenResult();

    if (token) {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/self/profile`
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        let responseData = await response.json();
        let userInfo = responseData.data;

        return NextResponse.json({ 
          status: "success", 
          data: { ...userInfo, token: token, exp: claims.exp } 
        });
      } else {
        return NextResponse.json({ 
          status: "error",
          message: "Failed to fetch user profile", 
          data: null 
        });
      }
    }

    return NextResponse.json({ 
      status: "error",
      message: "Login failed",
      user: null
    });
  } catch (error) {
    if ((error as Error).message === 'Firebase: Error (auth/wrong-password).' || (error as Error).message === 'Firebase: Error (auth/user-not-found).') {
      console.error('Wrong credential');

      return NextResponse.json({ 
        status: "error", 
        message: 'email/password is incorrect',
        user: null
      }, { status: 400 });
    }

    if ((error as FirebaseError).code === 'auth/too-many-requests') {
      console.error('This account is temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.');

      return NextResponse.json({ 
        status: "error", 
        message: 'This account is temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.',
        user: null
      }, { status: 400 });
    }

    return NextResponse.json({ 
      status: "error", 
      message: (error as Error).message,
      user: null
    }, { status: 400 });
  }
}
