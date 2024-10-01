"use client";

import Image from "next/image";
import { Button, Typography } from "@material-tailwind/react";

function Hero() {
  return (
    <header className="mt-20 bg-white px-8">
      <div className="container mx-auto grid h-full min-h-[65vh] w-full grid-cols-1 place-items-center gap-y-10 lg:grid-cols-2">
        <div className="row-start-2 lg:row-auto lg:-mt-40">
          <Typography
            variant="h1"
            color="blue-gray"
            className="mb-2 max-w-sm text-3xl !leading-snug lg:mb-3 lg:text-5xl"
            onPointerEnterCapture={() => {}} 
            onPointerLeaveCapture={() => {}} 
            placeholder
          >
            Unleash the Possibilities
          </Typography>
          <Typography
            variant="lead"
            className="mb-6 font-normal !text-gray-500 md:pr-16 xl:pr-28"
            onPointerEnterCapture={() => {}} 
            onPointerLeaveCapture={() => {}} 
            placeholder
          >
            We&apos;ve got everything you need to make your business a
            smashing success! Whether you&apos;re looking to streamline appointment scheduling, enhance customer management, or gain valuable insights, we&apos;ve got everything you need.
          </Typography>
          <Button size="lg" color="gray" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
            see offers
          </Button>
        </div>
        <div className="mt-40 grid gap-6 lg:mt-0">
          <div className="grid grid-cols-4 gap-6">
            <Image
              width={768}
              height={768}
              src="/image/features/payment.png"
              className="rounded-lg shadow-md"
              alt="flowers"
            />
            <Image
              width={768}
              height={768}
              src="/image/features/calendar.jpg"
              className="-mt-28 rounded-lg shadow-md"
              alt="flowers"
            />
            <Image
              width={768}
              height={768}
              src="/image/features/notification.jpg"
              className="-mt-14 rounded-lg shadow-md"
              alt="flowers"
            />
            <Image
              width={768}
              height={768}
              src="/image/features/target.jpg"
              className="-mt-20 rounded-lg shadow-md"
              alt="flowers"
            />
          </div>
          <div className="grid grid-cols-4 gap-6">
            <div></div>
            <Image
              width={768}
              height={768}
              src="/image/features/seo.jpg"
              className="-mt-28 rounded-lg shadow-md"
              alt="flowers"
            />
            <Image
              width={768}
              height={768}
              src="/image/features/statistic.jpg"
              className="-mt-14 rounded-lg shadow-md"
              alt="flowers"
            />
            <Image
              width={768}
              height={768}
              src="/image/features/review.jpg"
              className="-mt-20 rounded-lg shadow-md"
              alt="flowers"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
export default Hero;