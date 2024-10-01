// components
import { Navbar, Footer } from "@/components";

// sections
import GeoLocationSection from "./geolocation";

import { getLocationList } from "@/actions";
import { getLocationListDetailsCache, createLocationListDetailsCache } from "@/lib/services/location-list-details-cache";

export default async function OurClients() {

  let locationList;
  locationList = await getLocationListDetailsCache();

  if (locationList.length === 0) {
    locationList = await getLocationList();
    if (locationList.length === 0) throw new Error('No locations found');
    else await createLocationListDetailsCache(locationList)
  }

  return (
    <>
      <Navbar textColor="gray"/>
      <GeoLocationSection locations={locationList}/>
      <Footer />
    </>
  );
}