"use client";

import React from "react";
import { LocationInfo } from "@/types/location";
import { LocationCard } from "./location-card";

interface LocationInfoWithDistance extends LocationInfo {
  distanceFromCenterPoint?: string;
} 

interface LocationContainerProps {
  locationListData: LocationInfoWithDistance[];
  windowSize: string;
}

export function LocationContainer({ locationListData, windowSize }: LocationContainerProps) {

  return (
    <>
      {
        locationListData.map(location => {
          return (
            <div key={location.locationId} className={`mb-5`}>
              <LocationCard
                locationId={location.locationId}
                locationLogo={location.locationLogo}
                windowSize={windowSize}
                locationName={location.locationName}
                locationNameUrl={location.locationNameUrl}
                geoLocation={location.geoLocation}
                servicesOffered={location.servicesOffered}
                address={{street: location.address.street, city: location.address.city, state: location.address.state, zipCode: location.address.zipCode}}
                acceptWalkins={true}
                phoneNumber={location.phoneNumber}
                prefixUrl={location.prefixUrl}
                businessHours={location.businessHours}
                distanceFromCenterPoint={location.distanceFromCenterPoint}
              />
            </div>
          )
        })
      }
    </>
  );
}
export default LocationContainer;
