// components
import { Navbar, Footer } from "@/components";

// sections
import SignUpForm from "./register-form";

export default function Register() {
  return (
    <>
      <Navbar textColor="gray"/>
      <SignUpForm />
      <Footer />
    </>
  );
}