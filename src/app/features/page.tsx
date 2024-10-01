// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import FeaturesSection from "./features-section";

export default function Features() {
  return (
    <>
      <Navbar textColor="gray" />
      <Hero />
      <FeaturesSection />
      <Footer />
    </>
  );
}