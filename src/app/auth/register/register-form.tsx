"use client";

import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import Link from "next/link";
import { useAuthContext } from "@/hooks/useAuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '@/lib/firebase/firebaseClient';
import { validateEmail } from "@/lib/utils/helper";

export function RegisterSection() {
  const { authState, registerSuccess, registerError } = useAuthContext();
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: ''});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authState.isSignedIn) {
      setSuccess('');
      setError('');
    }
  }, [authState])

  const handleRegisterFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (success) setSuccess('');
    if (error) setError('');
    const { name, value } = event.target;
    setRegisterData((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) setError('');
    if (success) setSuccess('');

    if (!validateEmail(registerData.email)) return setError('Email is invalid');
    if (registerData.password.length < 6) return setError('Password length is not enough'); 
    
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: registerData.email, password: registerData.password, name: registerData.name }),
    });

    if (response.ok) {
      const responseJson = await response.json();
      const userInfo = responseJson.data;
      registerSuccess({ 
        isSignedIn: true, 
        loading: false,
        userId: userInfo.userId,
        displayName: registerData.name,
        photoURL: '',
        token: userInfo.token,
        exp: userInfo.exp,
        email: userInfo.email,
        error: false,
        errorMessage: ''
      })
      setSuccess('Success');
    } else {
      const responseJson = await response.json();
      setError(responseJson.message);
    }
  };

  // for Google signin, check if customer signin the first time, then create add user customer type into db and update auth
  // if customer already has profile, update auth
  const handleGoogleSignIn = async () => {
    if (error) setError('');
    if (success) setSuccess('');

    try {
      // const result = await signInWithRedirect(auth, googleProvider);
      const { providerId, user } = await signInWithPopup(auth, googleProvider);

      // get user profile with token
      let token = await user.getIdToken();
      let { claims } = await user.getIdTokenResult();

      const url = `${process.env.NEXT_PUBLIC_API_URL}/self/profile`
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      // success get user profile, update auth state
      if (response.ok) {
        let userProfile = await response.json();

        registerSuccess({ 
          isSignedIn: true, 
          loading: false,
          userId: userProfile.data.userId,
          displayName: userProfile.data.displayName ? userProfile.data.displayName : '',
          photoURL: userProfile.data.photoURL ? userProfile.data.photoURL : '',
          token: token,
          exp: typeof claims.exp === 'number' ? claims.exp : 0,
          email: user.email ? user.email : "",
          error: false,
          errorMessage: ''
        })
        return setSuccess('Success');
      }

      // user profile not found, create new customer user in db
      const newCustomerSignInUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/customers`;

      let addNewCustomerRes = await fetch(newCustomerSignInUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: user.email, uid: user.uid, displayName: user.displayName, requestType: 'new-customer', signinProvider: providerId, photoURL: user.photoURL, emailVerified: user.emailVerified }),
      });

      // create new customer user success, update auth state 
      if (addNewCustomerRes.ok) {
        let responseData = await addNewCustomerRes.json();

        registerSuccess({ 
          isSignedIn: true,
          loading: false,
          userId: responseData.data.userId,
          displayName: responseData.data.displayName ? responseData.data.displayName : '',
          photoURL: responseData.data.photoURL ? responseData.data.photoURL : '',
          token: token,
          exp: typeof claims.exp === 'number' ? claims.exp : 0,
          email: user.email ? user.email : "",
          error: false,
          errorMessage: ''
        })
        return setSuccess('Success');
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return setError('Login with Google failed')
    }
  };

  return (
    <section className="m-4 flex items-center justify-center gap-4 h-[80vh]">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>Register</Typography>
        </div>
        <form className="sm:mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleRegister}>
          <div className="mb-1 flex flex-col gap-5">
            <Typography variant="small" color="blue-gray" className="-mb-4 font-medium" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
              Name
            </Typography>
            <Input
              type="text"
              name="name"
              size="lg"
              placeholder="John Doe"
              crossOrigin
              onPointerEnterCapture={() => {}} 
              onPointerLeaveCapture={() => {}}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={registerData.name} 
              onChange={handleRegisterFormChange} 
            />
            <Typography variant="small" color="blue-gray" className="-mb-4 font-medium" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
              Email
            </Typography>
            <Input
              size="lg"
              name="email"
              type="email"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              onPointerEnterCapture={() => {}} 
              onPointerLeaveCapture={() => {}}
              crossOrigin
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={registerData.email}
              onChange={handleRegisterFormChange}
            />
            <Typography variant="small" color="blue-gray" className="-mb-4 font-medium" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
              Password
            </Typography>
            <Input
              type="password"
              name="password"
              size="lg"
              placeholder="********"
              crossOrigin
              onPointerEnterCapture={() => {}} 
              onPointerLeaveCapture={() => {}}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={registerData.password} 
              onChange={handleRegisterFormChange} 
            />
          </div>
          <Button className="mt-8" fullWidth onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder type="submit">
            Sign Up
          </Button>

          <div className="flex items-center text-center mt-6">
            <hr className="flex-grow border-t border-gray-300 mx-6"></hr>
            <span className="text-gray-500">or</span>
            <hr className="flex-grow border-t border-gray-300 mx-6"></hr>
          </div>

          {error && <p className="text-sm text-red-800 mt-[1rem]">{error}</p>}
          {success && <p className="text-sm text-green-900 mt-[1rem]">{success}</p>}
          <div className="space-y-4 mt-6">
            <Button 
              size="lg" color="blue-gray" variant="outlined" 
              className="flex items-center gap-2 justify-center shadow-md" 
              fullWidth onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder
              onClick={handleGoogleSignIn}
            >
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1156_824)">
                  <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                  <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                  <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                  <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_1156_824">
                    <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
              <span>Sign in With Google</span>
            </Button>
          </div>
          <Typography variant="paragraph" className="text-center text-gray-900 font-medium mt-6" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
            Already have an account?
            <Link href="/auth/login"  className="text-blue-700 ml-1">Sign in</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default RegisterSection;