import {
  Card,
  Typography,
  Button,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { GeoLocation, BusinessHours, Address } from "@/types/location"; 
import { displayUSFormatPhoneNumber, convertNumberToTime, checkLocationOpen } from "@/lib/utils/helper";

interface LocationCardProps {
  locationId: string;
  locationLogo: string;
  locationName?: string;
  locationNameUrl?: string;
  address?: Address;
  phoneNumber: string;
  geoLocation?: GeoLocation;
  servicesOffered?: string[];
  prefixUrl?: string;
  isDefaultLocation?: string;
  businessHours: BusinessHours;
  dateTime?: string;
  members?: string;
  dropdown?: string; 
  acceptWalkins?: boolean; 
  distance?: string;
  windowSize?: string
  distanceFromCenterPoint?: string;
}

export function LocationCard(
  {
    locationId,
    locationLogo,
    locationName,
    address,
    phoneNumber,
    geoLocation,
    servicesOffered,
    locationNameUrl,
    isDefaultLocation,
    businessHours,
    dateTime,
    members,
    dropdown,
    acceptWalkins,
    distanceFromCenterPoint,
    windowSize
  }: LocationCardProps) {

    return (
      <Card className={`my-${windowSize==='mobile'?'6':'3'} border border-gray/50 bg-gray-50`} placeholder={''} variant="gradient" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}>
        <div className={`ml-3 pt-${windowSize==='mobile'?'1.5':'3'} relative`}>
          {/* Top section */}
          <div>
            <div className="flex items-start">
              <Image 
                alt="Location image icon"
                width={50}
                height={50}
                style={{marginTop: "1em"}}
                src={locationLogo}
              />
              <div className={`ml-${windowSize==="mobile" || windowSize==="tablet" ? '3' : '4'}`}>
                {/* @ts-ignore */}
                <Typography variant="h6" className="mb-0.5">
                  <Link href={`/locations/${locationNameUrl}/${address?.city.toLowerCase()}`}>
                    {locationName}
                  </Link>
                </Typography>
                {/* @ts-ignore */}
                <Typography variant="small">
                  {address?.street}
                </Typography>
                {/* @ts-ignore */}
                <Typography variant="small">
                  {address?.city}, {address?.state} - {address?.zipCode}
                </Typography>
                {/* @ts-ignore */}
                <Typography variant="small">
                  {displayUSFormatPhoneNumber(phoneNumber)}
                </Typography>
              </div>
              <div className="mt-1 flex flex-col absolute right-[5%] items-end">
                {
                  isDefaultLocation
                    ? <>
                        {/* @ts-ignore */}
                        <Button size="sm" variant="outlined">
                          Selected
                        </Button>
                      </>
                    : <>
                        {/* @ts-ignore */}
                        <Button size="sm" variant="outlined">
                          Select
                        </Button>
                      </>
                }
                {
                  {distanceFromCenterPoint} 
                  &&  <>
                        {/* @ts-ignore */}
                        <Typography className="text-xs pr-2 pt-1.5">{distanceFromCenterPoint} mi</Typography>
                      </>
                }
              </div>
            </div>
          </div>

          {/* Divider section */}
          <div>
            <hr className="my-3 mx-4" />
          </div>
          
          {/* Services section */}
          <div className="flex items-center">
            {/* @ts-ignore */}
            <Typography className="text-sm font-bold">Services</Typography>
            {/* @ts-ignore */}
            <Typography variant="small" className="ml-8">{servicesOffered!.join(' - ')}</Typography>
          </div>

          {/* Hours section */}
          <div className="flex items-center my-2">
            {/* @ts-ignore */}
            <Typography className="text-sm font-bold">Today Hour</Typography>
            {
              checkLocationOpen(businessHours)
                ? <>
                    {/* @ts-ignore */}
                    <Typography variant="small" color="green" className="ml-3 font-medium">Open &nbsp;</Typography>
                    {/* @ts-ignore */}
                    <Typography variant="small">until {convertNumberToTime(businessHours[`${new Date().getDay()}`]['to'])}</Typography>
                  </>
                : <>
                    {/* @ts-ignore */}
                    <Typography variant="small" color="red" className="ml-3 font-medium" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Closed</Typography>
                  </>
            }
          </div>

          {/* Walkin section */}
          <div className="flex items-center mb-2">
            {/* @ts-ignore */}
            <Typography variant="small">{acceptWalkins ? "Walk-ins Welcome" : "Appointment Only"}</Typography>
          </div>
        </div>
      </Card>
    );
}