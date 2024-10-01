"use client";

import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogBody, Typography } from "@material-tailwind/react";

import useCurrentDisplaySize from '@/hooks/useCurrentDisplaySize'; 

import { useLoadScript, useGoogleMap, GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import { LocationInfo } from "@/types/location";
import LocationContainer from "./location-container";
import MapContainer from "./map-container";

import { GeoLocation } from "@/types/location";


interface Location {
  locationId: string;
  locationName: string;
  geoLocation: GeoLocation;
  icon?: google.maps.Icon;
  distanceFromCenterPoint?: string;
}

interface LocationInfoWithDistance extends LocationInfo {
  distanceFromCenterPoint?: string;
}

interface GeoLocationSectionProps {
  locations: LocationInfoWithDistance[]
}

export function GeoLocationSection({ locations }: GeoLocationSectionProps) {

  const windowSize = useCurrentDisplaySize();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [locationListData, setLocationListData] = useState(locations);
  const [locationData, setLocationData] = useState(locations);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_MAPS_APIS_KEY!,
    libraries: ["geometry"], 
  });

  // use default location in Avalon Park, Orlando
  const [userCurrentPosition, setUserCurrentPosition] = useState<GeoLocation>({
    "latitude": 28.5404261,
    "longitude": -81.1539639
  });

  const handleOpenDialog = () => setOpenDialog(!openDialog);
  
  // function to repopulate locations data with distance from user position
  const updateLocationDistances = (locations: LocationInfoWithDistance[]) => {
    setLocationData([...locations])
  }

  // function to return user current position
  const useMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setUserCurrentPosition({
            // ...geoLocation,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          handleOpenDialog();
        },
        (error: GeolocationPositionError) => {
          alert(error.message);
        }
      );
    } else {
      // setLocationError('Geolocation is not supported by this browser.');
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <section className={`mt-${windowSize === 'desktop' ? '20' : windowSize === 'laptop' ? '20' : '16'} px-${windowSize === 'desktop' ? '10' : windowSize === 'laptop' ? '8' : '3'}`}>
      <div className={windowSize === 'laptop' || windowSize === 'desktop' ? 'mx-auto mb-4 text-center flex' : 'container mx-auto mb-5 flex items-center'}>
        {/* @ts-ignore */}
        <Typography>
          Locations near you
        </Typography>
        {/* @ts-ignore */}
        <Typography className="text-blue-500 ml-2 cursor-pointer" onClick={handleOpenDialog}>
          Update location
        </Typography>
      </div>
      <div 
        className={
          `${windowSize === 'mobile' || windowSize === 'tablet' ? 'container' : ''} flex-col' : 'flex-row-reverse'} mx-auto flex ${windowSize === 'mobile' ? 'flex-col' : 'flex-row-reverse'} 
          ${windowSize === 'tablet' ? 'gap-4' : 'gap-6'} items-start`
        }
      >
        <div className={`${windowSize === 'mobile' ? 'w-[100%]' : windowSize === 'tablet' ? 'w-[50%]' : 'w-[55%]'} bg-blue-500`}>
          { isLoaded ? <MapContainer windowSize={windowSize} userCurrentPosition={userCurrentPosition} locationData={locationData} updateLocationDistances={updateLocationDistances}/> : <></>}
        </div>
        <div className={`${windowSize === 'mobile' ? 'w-[100%]' : windowSize === 'tablet' ? 'w-[50%]' : 'w-[45%]'}`}>
          <LocationContainer windowSize={windowSize} locationListData={locationData } />
        </div>
      </div>
      {/* @ts-ignore */}
      <Dialog open={openDialog} handler={handleOpenDialog} className="h-1/2 w-1/2">
        {/* @ts-ignore */}
        <DialogBody className="relative h-full w-full">
          {/* @ts-ignore */}
          <Button onClick={useMyLocation} className="absolute top-[20%] left-1/2 transform -translate-x-1/2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 2C8.686 2 6 4.686 6 8c0 3.314 3.5 8.305 5.124 10.652a1 1 0 001.752 0C14.5 16.305 18 11.314 18 8c0-3.314-2.686-6-6-6zm0 10a2 2 0 110-4 2 2 0 010 4z"
              />
            </svg>
            &nbsp; My Location
          </Button>
        </DialogBody>
      </Dialog>
    </section> 
  );
}
export default GeoLocationSection;
