"use client";

import React from "react";
import { Typography, Card, CardBody, Avatar } from "@material-tailwind/react";
import { UserIcon } from "@heroicons/react/24/solid";
import EmployeeCard from "@/components/employee-card";


const EMPLOYEES = [
  {
    bio:
      "As a software engineer and web developer, I embarked on a journey to create a solution that simplifies booking and maximizes efficiency. With years of experience in the industry and a deep understanding of the challenges faced by businesses, I envisioned a user-friendly platform that streamlines appointment booking, eliminates scheduling conflicts, and empowers users to take control of their time.",
    name: "Vu Nguyen",
    title: "WEB DEVELOPER",
    img: "/image/company/faces/vu.jpeg",
  },
];

export function TeamSection() {
  return (
    <section className="px-10 !py-10">
      <div className="container mx-auto">
        <div className="mb-20 flex w-full flex-col items-center">
          <Typography variant="h2" color="blue-gray" className="mb-2" placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
            Meet Our Team
          </Typography>
          <Typography
            variant="lead"
            className="mb-10 max-w-3xl text-center !text-gray-600"
            placeholder="" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}
          >
            Meet our talented team of experts who are passionate about bringing value and innovation to your business, working tirelessly to exceed your expectations and drive your success.
          </Typography>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3 lg:px-20">
          {EMPLOYEES.map((props, key) => (
            <EmployeeCard key={key} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
export default TeamSection;
