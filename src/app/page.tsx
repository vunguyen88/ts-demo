// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";

export default function Landing() {
  return (
    <>
      <Navbar textColor="white"/>
      <Hero />
      <Footer />
    </>
  );
}