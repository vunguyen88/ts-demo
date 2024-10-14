import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/firebase/firebaseClient';
import { NextResponse } from "next/server";

interface FirebaseError extends Error {
  code: string;
}

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    let {claims, token} = await user.getIdTokenResult();

    // Success create new customer user
    if (token) {
      // Add new user to firestore 
      const url = `${process.env.NEXT_PUBLIC_API_URL}/users/customers`
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email, uid: claims.user_id, displayName: name, requestType: 'new-customer', signinProvider: 'password' }),
      });

      if (response.ok) {
        let responseData = await response.json();
        let userInfo = responseData.data;
        console.log('Success create new customer user', userInfo);
        return NextResponse.json({ 
          status: "success",
          message: '',
          data: { ...userInfo, token: token, exp: claims.exp } 
        });
      } else {
        console.error('Failed to fetch user info');
        return NextResponse.json({ 
          status: "success",
          message: '',
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
    if ((error as Error).message === 'Firebase: Error (auth/email-already-in-use).') {
      console.error('EMAIL ALREADY IN USE')
      return NextResponse.json({ 
        status: "error",
        message: "Email already in use", 
        data: null
      }, { status: 400 });
    }
    return NextResponse.json({
      status: "error",
      message: (error as Error).message, 
      data: null
    }, { status: 400 });
  }
}
