// components
import { Footer, LocationNavbar } from "@/components";

// actions
import { getLocationList, getLocationDetails } from "@/actions";
// import { createLocationCachePathList, getLocationCachePathList } from "@/lib/services/location-path-url-cache";
import { createLocationListDetailsCache, getLocationListDetailsCache } from "@/lib/services/location-list-details-cache"; 

// sections
// import Hero from "./hero";

interface LocationPath {
  locationName: string;
  city: string
}

// Return a list of `params` to populate the [locationName] dynamic segment
export async function generateStaticParams(): Promise<LocationPath[]> {
  // check locationList details cache and create cache with fetch data if not available
  let locationList;
  locationList = await getLocationListDetailsCache();

  if (locationList.length === 0) {
    locationList = await getLocationList();
    if (locationList.length === 0) throw new Error('No locations found');
    else await createLocationListDetailsCache(locationList)
  }

  // create path list static params for checkin page
  let locationPathList: LocationPath[] = [];
  locationList.forEach(location => {
    if (location.pageView.checkin.display) {
      locationPathList.push({
        locationName: location.locationNameUrl,
        city: location.address.city.toLowerCase()
      })
    }
  })

  return locationPathList;
}

interface PageParams {
  locationName: string;
  city: string
}

interface PageProps {
  params: PageParams;
}

export default async function CheckIn({ params }: PageProps) {
  let { locationName, city } = params;

  const locationList = await getLocationList();

  const locationDetails = locationList.find(location => {
    if (location.locationNameUrl === locationName && location.address.city.toLowerCase() === city) {
      return location.locationNameUrl === locationName && location.address.city.toLowerCase() === city
    }
  })

  return (
    <>
      <LocationNavbar textColor="gray" pageView={locationDetails!.pageView} locationBaseUrl={`${locationDetails!.locationNameUrl}/${locationDetails!.address.city.toLowerCase()}`} locationName={locationDetails!.locationName}/>
      {/* <Footer /> */}
    </>
  );
}