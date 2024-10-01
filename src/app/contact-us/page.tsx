// components
import { Navbar, Footer } from "@/components";

// sections
import ContactForm from "./contact-form";

export default function ContactUs() {
  return (
    <>
      <Navbar textColor="gray"/>
      <ContactForm />
      <Footer />
    </>
  );
}