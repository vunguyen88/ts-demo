"use client";

import { IconButton, Typography } from "@material-tailwind/react";
import type { TypographyStylesType } from "@material-tailwind/react";


function Hero() {
  return (
    <div className="relative bg-center min-h-screen w-full bg-[url('/image/company/culture-fit-at-work.jpg')] bg-cover bg-no-repeat">
      <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
        <div className="grid min-h-screen px-8">
          <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
            <Typography variant="h1" color="white" className="" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
              About Us
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mt-4 mb-12 w-full md:max-w-full lg:max-w-3xl"
              placeholder=""
              onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            >
              Meet the amazing team behind this project and find out more about how we work.
            </Typography>
            <Typography
              variant="paragraph"
              color="white"
              placeholder=""
              className="mt-1 mb-7 font-medium uppercase"
              onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
            >
              Connect with us on:
            </Typography>
            <div className="gap-8 flex">
              <IconButton variant="text" color="white" size="sm" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                <i className="fa-brands fa-twitter text-base" />
              </IconButton>
              <IconButton variant="text" color="white" size="sm" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                <i className="fa-brands fa-facebook text-base" />
              </IconButton>
              <IconButton variant="text" color="white" size="sm" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
                <i className="fa-brands fa-instagram text-base" />
              </IconButton>
            </div>
        </div>
      </div>
    </div>
  );
}
export default Hero;