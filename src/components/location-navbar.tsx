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
import { PageView } from "@/types/location";

interface NavBarProps {
  textColor?: string;
  pageView: PageView,
  locationBaseUrl: string,
  locationName?: string,
  locationLogo?: string
}

interface PageProps {
  href: string,
  text: string
}

type PageViewKey = keyof PageView;

interface NavItemProps {
  textColor?: string;
  isScrolling?: boolean;
  isMobile?: boolean;
  children: React.ReactNode;
  href?: string;
}

function NavItem({ textColor, isScrolling, isMobile , children, href }: NavItemProps) {
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
        }`}
      >
        {children}
      </Typography>
    </Link>
  );
}

export function LocationNavbar({ textColor, pageView, locationBaseUrl, locationName, locationLogo="" }: NavBarProps) {

  const [open, setOpen] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);

  const keyToHrefAndTextMap: { [key: string]: { href: string, text: string } } = {
    bookAppointment: { href: "/book-appointment", text: "Book Appointment" },
    landing: { href: "/landing", text: "Landing" },
    checkin: { href: "/checkin", text: "Check In" },
    location: { href: "/location", text: "Location" },
    designs: { href: "/designs", text: "Designs" },
    services: { href: "/services", text: "Services" },
    employees: { href: "/employees", text: "Employees" },
    contactUs: { href: "/contact-us", text: "Contact Us" },
  };

  const navItemList: PageProps[] = (Object.keys(pageView) as PageViewKey[]).reduce<PageProps[]>((acc, key) => {
    if (pageView[key].display) {
      const mapped = keyToHrefAndTextMap[key];
      acc.push({ href: mapped.href, text: mapped.text });
    }

    return acc.filter(item => item.text !== 'Landing');
  }, []);

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
      <div className="container mx-auto flex items-center justify-between">
        <Link href={`/locations/${locationBaseUrl}`}>
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
            {locationName}
          </Typography>
        </Link>
        <ul
          className={`ml-10 hidden items-center gap-6 lg:flex ${
            textColor ? `text-${textColor}-900` : isScrolling ? "text-gray-900" : "text-white"
          }`}
        >
          {
            navItemList.map((item, idx) => (
              <NavItem key={idx} href={`/locations/${locationBaseUrl}${item.href}`} isScrolling={isScrolling} textColor={textColor} isMobile={open}>
                {item.text}
              </NavItem>
            ))
          }
        </ul>
        <div className="hidden gap-2 lg:flex lg:items-center">
          <Link href="/auth/login">
            <Button
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
            {
              navItemList.map((item, idx) => (
                <NavItem key={idx} href={`/locations/${locationBaseUrl}${item.href}`} isScrolling={isScrolling} textColor={textColor} isMobile={open}>
                  {item.text}
                </NavItem>
              ))
            }
          </ul>
          <div className="mt-4 flex items-center gap-2">
            <Link href="/auth/login">
              <Button color="gray" size="sm" className="ml-auto" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder="">
                sign in
              </Button>
            </Link>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default LocationNavbar;