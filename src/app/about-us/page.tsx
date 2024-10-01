// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import IntroSection from "./intro-section";
import TeamSection from "./team-section";

export default function AboutUs() {
  return (
    <>
      <Navbar textColor="white"/>
      <Hero />
      <IntroSection />
      <TeamSection />
      <Footer />
    </>
  );
}