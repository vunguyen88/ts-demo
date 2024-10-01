import React from "react";
import Link from "next/link";
import {
  Navbar as MTNavbar,
  Collapse,
  IconButton,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import useCurrentDisplaySize from "@/hooks/useCurrentDisplaySize";

interface NavBarProps {
  textColor?: string;
}

interface NavItemProps {
  textColor?: string;
  isScrolling?: boolean;
  isMobile?: boolean;
  children: React.ReactNode;
  href?: string;
}

function NavItem({ textColor, isScrolling, isMobile, children, href }: NavItemProps) {
  return (
    <Link href={href || "#"}>
      <Typography
        target={href ? "_blank" : "_self"}
        variant="small"
        onPointerEnterCapture={() => {}} 
        onPointerLeaveCapture={() => {}} 
        placeholder=""
        className={`font-medium ${
          textColor==="gray" || isScrolling || isMobile ? `text-gray-900` : "text-white"
          // textColor || isScrolling ? `text-gray-900` : texC
        }`}
      >
        {children}
      </Typography>
    </Link>
  );
}

export function Navbar({ textColor }: NavBarProps) {
  const [open, setOpen] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const windowSize = useCurrentDisplaySize();
  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  React.useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MTNavbar
      fullWidth
      shadow={false}
      blurred={false}
      color={isScrolling ? "white" : "transparent"}
      className="fixed top-0 z-50 border-0"
      onPointerEnterCapture={() => {}} 
      onPointerLeaveCapture={() => {}} 
      placeholder=""
    >
      <div className={windowSize === 'desktop' || windowSize === 'laptop' ? 'mx-10 flex items-center justify-between' : 'container mx-auto flex items-center justify-between'}>
      {/* <div className="container mx-auto flex items-center justify-between"> */}
        <Link href="/">
          <Typography
            target="_blank"
            variant="h5"
            className={`${
              textColor==="gray" || isScrolling ? `text-gray-900` : "text-white"
            }`}
            onPointerEnterCapture={() => {}} 
            onPointerLeaveCapture={() => {}} 
            placeholder=""
          >
            Mint Booking
          </Typography>
        </Link>
        <ul
          className={`ml-10 hidden items-center gap-6 lg:flex ${
            textColor ? `text-${textColor}-900` : isScrolling ? "text-gray-900" : "text-white"
          }`}
        >
          <NavItem href="/about-us" isScrolling={isScrolling} textColor={textColor} isMobile={open}>About Us</NavItem>
          <NavItem href="/features" isScrolling={isScrolling} textColor={textColor} isMobile={open}>Features</NavItem>
          <NavItem href="/our-clients" isScrolling={isScrolling} textColor={textColor} isMobile={open}>Our Clients</NavItem>
          <NavItem href="/contact-us" isScrolling={isScrolling} textColor={textColor} isMobile={open}>Contact Us</NavItem>
        </ul>
        <div className="hidden gap-2 lg:flex lg:items-center">
          {/* <IconButton
            variant="text"
            color={isScrolling ? "gray" : "white"}
            size="sm"
          >
            <i className="fa-brands fa-twitter text-base" />
          </IconButton>
          <IconButton
            variant="text"
            color={isScrolling ? "gray" : "white"}
            size="sm"
          >
            <i className="fa-brands fa-facebook text-base" />
          </IconButton>
          <IconButton
            variant="text"
            color={isScrolling ? "gray" : "white"}
            size="sm"
          >
            <i className="fa-brands fa-instagram text-base" />
          </IconButton> */}
          <Link href="/auth/login">
            <Button
              // color={textColor ? textColor : isScrolling ? "gray" : "white"}
              color={textColor==="gray" || isScrolling ? "gray" : "white"}
              size="sm" onPointerEnterCapture={() => {}} 
              onPointerLeaveCapture={() => {}} 
              placeholder=""
            >
              sign in
            </Button>
          </Link>
        </div>
        <IconButton
          variant="text"
          // color={textColor ? textColor : isScrolling ? "gray" : "white"}
          color={textColor==="gray" || isScrolling ? "gray" : "white"}
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
          onPointerEnterCapture={() => {}} 
          onPointerLeaveCapture={() => {}} 
          placeholder=""
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-4 rounded-lg border-t border-blue-gray-50 bg-white px-6 py-5">
          <ul className="flex flex-col gap-4 text-blue-gray-900">
            <NavItem href="/about-us" textColor={textColor} isMobile={open}>About Us</NavItem>
            <NavItem href="/features" textColor={textColor} isMobile={open}>Features</NavItem>
            <NavItem href="/our-clients" textColor={textColor} isMobile={open}>Our Clients</NavItem>
            <NavItem href="/contact-us" textColor={textColor} isMobile={open}>Contact Us</NavItem>
          </ul>
          <div className="mt-4 flex items-center gap-2">
            <a href="https://www.material-tailwind.com/blocks" target="_blank">
              <Button color="gray" size="sm" className="ml-auto" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder="">
                sign in
              </Button>
            </a>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;