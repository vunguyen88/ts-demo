"use client";

import { Button, Typography, Card } from "@material-tailwind/react";
import Link from "next/link";

import { Address } from "@/types/location";

interface HeroProps {
  locationNameUrl: string;
  address: Address;
}

function Hero({ locationNameUrl, address }: HeroProps) {

  return (
    <div className="relative min-h-screen w-full bg-[url('/image/locations/nail-cover.jpeg')] bg-cover bg-no-repeat">
      <div className="absolute inset-0 h-full w-full bg-gray-900/60" />
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <Typography
            variant="h1"
            color="white"
            className="md:max-w-full lg:max-w-3xl"
            onPointerEnterCapture={() => {}} 
            onPointerLeaveCapture={() => {}} 
            placeholder
          >
            Unleash the Possibilities
          </Typography>
          <Typography
            variant="lead"
            color="white"
            className="mt-6 mb-10 w-full md:max-w-full lg:max-w-3xl"
            onPointerEnterCapture={() => {}} 
            onPointerLeaveCapture={() => {}} 
            placeholder
          >
            Elevate Your Experience With Our Dynamic Features
          </Typography>
          <div>
            <Link href={`/locations/${locationNameUrl}/${address.city.toLowerCase()}/book-appointment`}>
              <Button 
                variant="outlined" 
                color="white" 
                className="flex justify-center items-center gap-3"
                onPointerEnterCapture={() => {}} 
                onPointerLeaveCapture={() => {}} 
                placeholder
              >
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Hero;
