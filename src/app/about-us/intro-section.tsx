"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";

import {
  ArrowPathIcon,
  RocketLaunchIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

import FeatureCard from "@/components/feature-card";

const FEATURES = [
  {
    icon: ArrowPathIcon,
    title: "Latest technology",
    color: "black",
    children:
      "Passionate about leveraging the latest cutting-edge technologies to craft innovative and efficient software solutions, we bring the best and latest technology to you.",
  },
  {
    icon: RocketLaunchIcon,
    title: "Unlock Your Potentials",
    color: "teal",
    children:
      "Dedicated to unlocking the full potential and reach new heights of success of our clients with our technology and innovative solutions.",
  },
  {
    icon: StarIcon,
    title: "Thrive For The Best",
    color: "red",
    children:
      "Our relentless pursuit of excellence drives us to deliver nothing but the best, and assist you in every possible way.",
  },
];

export function IntroSection() {
  return (
    <section className="py-28 px-4">
      <div className="container mx-auto mb-20 text-center">
        <Typography variant="h1" color="blue-gray" className="mb-4" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
          We here to assist your business
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full px-4 !text-gray-500 lg:w-11/12 lg:px-8"
          placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
        >
          Our dedicated team is always here to offer personalized solutions and expert guidance to address your unique needs. 
          Count on us to provide unparalleled support every step of the way.
        </Typography>
      </div>
      <div className="container mx-auto grid max-w-8xl grid-cols-1 gap-2 gap-y-12 md:grid-cols-3">
        {FEATURES.map((props, idx) => (
          <FeatureCard key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
export default IntroSection;
