"use client";

import { Typography } from "@material-tailwind/react";
import { Address } from "@/types/location";

interface LocationMapPropsType {
  address: Address | undefined;
  googleMapLinkIframe: string | undefined;
}

function LocationMap({address, googleMapLinkIframe}: LocationMapPropsType) {
  return (
    <div className="container mx-auto mt-[7rem]">
      <div className="flex justify-center my-[3rem]">
        {/* @ts-ignore */}
        <Typography variant="h2">
          Get in Touch With Us
        </Typography>
      </div>
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col items-center w-[90%] mx-auto">
          {/* @ts-ignore */}
          <Typography color="blue-gray" className="mb-2 max-w-sm font-bold">
            Our salon locate at
          </Typography>
          {/* @ts-ignore */}
          <Typography>
            {`${address!.street}, ${address!.city}, ${address!.state} ${address!.zipCode}`}
          </Typography>
        </div>
        <div className="flex flex-col items-center w-[90%] mx-auto">
          {/* @ts-ignore */}
          <Typography color="blue-gray" className="mb-2 max-w-sm font-bold">
            Cross streets
          </Typography>
          {/* @ts-ignore */}
          <Typography color="blue-gray">
            {address?.intersection}
          </Typography>
        </div>
      </div>
      
      <div className="mt-[2rem] h-[50vh]">
        <iframe
          src={googleMapLinkIframe}
          width="100%" 
          height="100%" 
          style={{border: '0'}} 
          allowFullScreen={true}
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        >
        </iframe>
      </div>
    </div>
  );
}

export default LocationMap;