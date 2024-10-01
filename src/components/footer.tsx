import Link from 'next/link'
import { Typography, Button } from "@material-tailwind/react";

const LINKS = [
  { "name": "Home", "path": "/" },
  { "name": "About Us", "path": "/about-us" },
  { "name": "Features", "path": "/features" },
  { "name": "Contact Us", "path": "/contact-us" },
];
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-5 px-8 pt-20">
      <div className="container mx-auto">
        <div className="mt-16 flex flex-wrap items-center justify-center gap-y-4 border-t border-gray-200 py-6 md:justify-between">
          <Typography className="text-center font-normal !text-gray-700" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder="">
            &copy; {CURRENT_YEAR} {" "}
            <a href="https://www.material-tailwind.com" target="_blank">
              Mint Booking
            </a>{" "}
              by{" "}
            <a href="https://www.creative-tim.com" target="_blank">
              Vu Nguyen
            </a>
            .
          </Typography>
          <ul className="flex gap-4 items-center">
            {LINKS.map((link) => (
              <Link href={link.path} key={link.path}>
                <Typography 
                  variant="small" 
                  className="font-normal text-gray-700 hover:text-gray-900 transition-colors"
                  onPointerEnterCapture={() => {}} 
                  onPointerLeaveCapture={() => {}} 
                  placeholder=""
                >
                  {link.name}
                </Typography>
              </Link>
            ))}
            {/* <Button color="gray" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder="">subscribe</Button> */}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;