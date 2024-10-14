// components
import { Navbar, Footer } from "@/components";

// sections
import SignInForm from "./login-form";
import React from "react";

export default function Login() {
  return (
    <>
      <Navbar textColor="gray"/>
      <SignInForm />
      <Footer />
    </>
  );
}