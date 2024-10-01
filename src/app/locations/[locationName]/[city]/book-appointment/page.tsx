// components
import { Footer, LocationNavbar } from "@/components";

// actions
import { getLocationList } from "@/actions";
import { createLocationListDetailsCache, getLocationListDetailsCache } from "@/lib/services/location-list-details-cache"; 

// sections
import BookingLayout from "./booking-layout";
// import Hero from "./hero";

interface LocationPath {
  locationName: string;
  city: string
}

// Return a list of `params` to populate the [locationName]/[city] dynamic segment
export async function generateStaticParams(): Promise<LocationPath[]> {

  // check locationList details cache and create cache with fetch data if not available
  let locationList;
  locationList = await getLocationListDetailsCache();

  if (locationList.length === 0) {
    locationList = await getLocationList();
    if (locationList.length === 0) throw new Error('No locations found');
    else await createLocationListDetailsCache(locationList)
  }

  // create path list static params for bookappointment page
  let locationPathList: LocationPath[] = [];
  locationList.forEach(location => {
    if (location.pageView.bookAppointment.display) {
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

export default async function BookAppointment({ params }: PageProps) {
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
      <BookingLayout 
        locationId={locationDetails!.locationId} 
        businessHours={locationDetails!.businessHours} 
        services={locationDetails!.services} 
        employees={locationDetails!.employees} 
        timeSlotDuration={locationDetails!.timeSlotSizeMinutes}
        locationClosedDays={locationDetails!.closedDays}
        locationBlockedDays={locationDetails!.locationBlockedDays}
        locationType={locationDetails!.locationType}
        groupServiceByDefault={locationDetails!.groupServiceByDefault}
      />
      {/* <Footer /> */}
    </>
  );
}