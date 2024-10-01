import React, {useState} from 'react';
import Image from "next/image";

import { Card, CardBody, Typography } from "@material-tailwind/react";

interface CategoryCardProps {
  img: string;
  title: string;
  desc: string;
  icon?: React.ElementType;
  flipIcon?: React.ElementType;
}
  
function CategoryCard({ img, title, desc, icon: Icon }: CategoryCardProps) {

  return (
    <div
      className={`relative w-full min-h-[12rem] cursor-pointer perspective-1000 group perspective`}>
      <div
        className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-1000 group-hover:rotate-y-180`}
      >
        {/* Front Side */}
        <div className={`absolute inset-0 w-full h-full backface-hidden`}>
          {/* @ts-ignore */}
          <Card className="relative grid min-h-[12rem] w-full overflow-hidden">
            <Image
              width={768}
              height={768}
              src={img}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 h-full w-full bg-black/70" />
            {/* @ts-ignore */}
            <CardBody className="relative flex flex-col justify-between">
              {Icon && <Icon className="h-8 w-8 text-white" />}
              <div>
                {/* @ts-ignore */}
                <Typography variant="h5" className="mb-1" color="white">
                  {title}
                </Typography>
                {/* @ts-ignore */}
                <Typography color="white" className="text-xs font-bold opacity-50">
                  ---
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>
        {/* Back Side */}
        <div className={`absolute rotate-y-180 backface-hidden inset-0 h-full w-full}`}>
          {/* @ts-ignore */}
          <Card className="relative grid min-h-[12rem] w-full overflow-hidden">
            <Image
              width={768}
              height={768}
              src={img}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 h-full w-full bg-black/40" />
            {/* @ts-ignore */}
            <CardBody className="relative flex flex-col justify-evenly">
              {Icon && <Icon className="h-8 w-8 text-white" />}
              <div>
                {/* @ts-ignore */}
                <Typography color="white" className="text-sm font-bold opacity-80">
                  {desc}
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default CategoryCard