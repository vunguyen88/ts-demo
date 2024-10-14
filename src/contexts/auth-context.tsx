"use client"

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export  interface AuthState {
  isSignedIn: boolean;
  userId: string;
  displayName: string;
  photoURL: string;
  loading: boolean;
  token: string;
  exp: number;
  email: string;
  error: boolean;
  errorMessage: string;
}

// Define the type for the context
interface AuthContextProps {
  authState: AuthState;
  loginSuccess: (auth: AuthState) => void;
  loginError: (auth: AuthState) => void;
  registerSuccess: (auth: AuthState) => void;
  registerError: (auth: AuthState) => void;
  logoutSuccess: () => void;
}

// Create the context
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Create the provider component
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isSignedIn: false,
    userId: '',
    displayName: '',
    photoURL: '',
    loading: false,
    token: '',
    exp: 0,
    email: '',
    error: false,
    errorMessage: ''
  });

  // Custom setter function to add or remove a single service object from the array
  const loginSuccess = (authState: AuthState) => {

    setAuthState(prevState => {
      
      return {...authState};
    });
  };

  const loginError = (authState: AuthState) => {

    // setAuthState(prevState => {
      
    //   return ;
    // });
  }

  const registerSuccess = (authState: AuthState) => {

    setAuthState(prevState => {
      
      return {...authState};
    });
  };
  
  const registerError = (authState: AuthState) => {

    // setAuthState(prevState => {
      
    //   return ;
    // });
  }

  const logoutSuccess = () => {

    setAuthState(prevState => {
      
      return {
        isSignedIn: false,
        userId: '',
        displayName: '',
        photoURL: '',
        loading: false,
        token: '',
        exp: 0,
        email: '',
        error: false,
        errorMessage: ''
      };
    });
  }

  return (
    <AuthContext.Provider value={{ authState, loginSuccess, loginError, registerSuccess, registerError, logoutSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};