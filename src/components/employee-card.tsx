import React from "react";
import { Typography, Card, CardBody, Avatar } from "@material-tailwind/react";

interface TestimonialCardProps {
  img: string;
  bio: string;
  name: string;
  title: string;
}

export function EmployeeCard({
  img,
  bio,
  name,
  title,
}: TestimonialCardProps) {
  return (
    <Card shadow={false} className="items-center text-center" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
      <CardBody onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
        <Avatar src={img} className="mb-3" alt={name} size="xxl" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder/>
        <Typography variant="h6" color="blue-gray" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
          {name}
        </Typography>
        <Typography variant="small" className="mb-3 font-medium !text-gray-700" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
          {title}
        </Typography>
        <Typography
          variant="paragraph"
          className="mb-5 font-normal !text-gray-500 text-justify"
          onPointerEnterCapture={() => {}} 
          onPointerLeaveCapture={() => {}} 
          placeholder
        >
          &quot;{bio}&quot;
        </Typography>
      </CardBody>
    </Card>
  );
}

export default EmployeeCard;