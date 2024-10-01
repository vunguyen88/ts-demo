"use client";

import React from "react";
import CategoryCard from "@/components/category-card";

import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
  GlobeEuropeAfricaIcon,
  MicrophoneIcon,
  PuzzlePieceIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PresentationChartBarIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

const CATEGORIES = [
  {
    img: "/image/features/payment.png",
    icon: CreditCardIcon,
    title: "Payment Processing",
    desc: "Experience secure and hassle-free payment processing with our seamless and reliable payment solution.",
  },
  {
    img: "/image/features/calendar.jpg",
    icon: CalendarDaysIcon,
    title: "Book Appointment",
    desc: "Simplify your client scheduling process and increase satisfaction with our intuitive self-booking feature.",
  },
  {
    img: "/image/features/notification.jpg",
    icon: ChatBubbleLeftRightIcon,
    title: "SMS Notification",
    desc: "Engage your audience in real-time with our powerful SMS feature, delivering instant and impactful messages.",
  },
  {
    img: "/image/features/marketing.jpg",
    icon: EnvelopeIcon,
    title: "Marketing",
    desc: "Amplify your marketing efforts and reach your target audience with our comprehensive marketing feature set.",
  },
  {
    img: "/image/features/payment.png",
    icon: PresentationChartBarIcon,
    title: "Performance Indicators",
    desc: "Click to flip card and see description",
  },
  {
    img: "/image/features/payment.png",
    icon: UsersIcon,
    title: "Client Management",
    desc: "Click to flip card and see description",
  },
];

export function Features() {
  return (
    <section className="container mx-auto px-8 pb-5 pt-20 lg:pt-0">
      <div className="mb-20 grid place-items-center text-center">
        <Typography variant="h2" color="blue-gray" className="my-3" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
          Our Features
        </Typography>
        <Typography variant="lead" className="!text-gray-500 lg:w-6/12" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
          Explore our features to uncover the full potential of our web solutions for your business.
        </Typography>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 flex flex-col gap-6">
          {CATEGORIES.slice(0, 2).map((props, key) => (
            <CategoryCard key={key} {...props} />
          ))}
        </div>
        <div className="col-span-1 flex flex-col gap-6">
          {CATEGORIES.slice(2, 4).map((props, key) => (
            <CategoryCard key={key} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;