import React, { useState } from "react";
import Image from "next/image";
import { Card, CardBody, Typography, Dialog, DialogBody, Button } from "@material-tailwind/react";

interface Service {
  title: string,
  desc?: string,
  serviceTime?: number,
  price?: number,
  displayMemberPrice?: boolean,
  memberPrice?: number
}

interface ServiceCardProps {
  img: string,
  title: string,
  desc?: string,
  services: Service[]
}
  
function ServiceCard({ img, title, desc, services }: ServiceCardProps) {
  const [openServiceMenuDialog, setOpenServiceMenuDialog] = useState(false);

  const handleOpenServiceMenuDialog = () => setOpenServiceMenuDialog(!openServiceMenuDialog);

  const displayService = (services: Service[]) => {
    if (!services.length) return;

    return (
      services.map((service, idx) => {
        return (
        <div key={idx} className="my-[1.5rem]">
          { idx!=0 && <hr className="h-1 pb-3 bg-gray[900]"/> }
          {/* @ts-ignore */}
          <Typography className="text-center font-serif pb-2 text-black" variant="h4">{service.title}</Typography>
          { 
            service.desc && 
              <p className="text-center pb-2 text-sm text-black">
                {service.desc}
              </p>
          }
          {
            service.displayMemberPrice && service.memberPrice
              ? <div>
                  <div>
                    { service.serviceTime && <span>Guest: {service.serviceTime} min |</span> }
                    { service.price && <span>&nbsp;${service.price}</span>}
                  </div>
                  <div>
                    { service.serviceTime && <span>Member: {service.serviceTime} min |</span> }
                    { service.price && <span>&nbsp;${service.price}</span>}
                  </div>
                </div>
              : <div className="flex justify-center items-center">
                  { service.serviceTime && <span className="font-medium text-black text-sm">{service.serviceTime} min |</span> }
                  { service.price && <span className="font-medium text-black text-sm">&nbsp;${service.price}</span>}
                </div>
          }
        </div>
      )})
    )
  }

  return (
    <div className={`relative w-full min-h-[12rem] cursor-pointer perspective-1000 group perspective`} onClick={handleOpenServiceMenuDialog}>
      <div className={`relative w-full h-full`}>
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
            <div className="absolute inset-0 h-full w-full bg-black/45" />
            {/* @ts-ignore */}
            <CardBody className="relative">
              <div className='flex items-center justify-center'>
                {/* @ts-ignore */}
                <Typography variant="h1" className="mt-10 font-serif" color="white">
                  {title}
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* @ts-ignore */}
      <Dialog 
        open={openServiceMenuDialog} 
        handler={handleOpenServiceMenuDialog} 
        className="h-5/5 w-1/2"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        {/* @ts-ignore */}
        <DialogBody className="relative h-[calc(100vh-120px)] w-full overflow-y-auto">
          <div className="flex justify-end pr-1" onClick={handleOpenServiceMenuDialog}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
          <div>{displayService(services)}</div>
        </DialogBody>
      </Dialog>
    </div>
  );
}

export default ServiceCard