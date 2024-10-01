"use client";

import { Typography } from "@material-tailwind/react"

import { BusinessHours, ServiceInfo } from "@/types/location";
import { Service } from "@/types/service"
import { LocationEmployeeSelection } from "@/types/location";
import { ServicesCategory } from "../services/layouts/default";
import Booking from "./booking";

import { generateGroupService } from "@/lib/utils/helper";

interface BookingLayoutPropsType {
  locationId: string;
  businessHours: BusinessHours;
  services: Service[];
  employees: LocationEmployeeSelection[];
  timeSlotDuration: number;
  locationClosedDays: number[];
  locationBlockedDays: string[];
  locationType: string;
  groupServiceByDefault: boolean;
}

function BookingLayout({ businessHours, services, employees, locationClosedDays, locationBlockedDays, locationId, timeSlotDuration, locationType, groupServiceByDefault }: BookingLayoutPropsType) {

  // const generateServiceCategory = (services) => {

  // }

  const servicesCategory = generateGroupService(services, groupServiceByDefault)

  // type: manicure, pedicure, wax, combo, eyelash, massage, polish change, facial, signature
  // const servicesCategory: ServicesCategory  = {
  //   "manicure": {
  //     img: "/image/locations/manicure.webp",
  //     title: "Manicure",
  //     desc: "",
  //     services: []
  //   },
  //   "pedicure": {
  //     img: "/image/locations/pedicure.webp",
  //     title: "Pedicure",
  //     desc: "",
  //     services: []
  //   },
  //   "facial": {
  //     img: "/image/locations/facial.webp",
  //     title: "Facial",
  //     desc: "",
  //     services: []
  //   },
  //   "eyelash": {
  //     img: "/image/locations/eyeslash.jpeg",
  //     title: "Eyelash",
  //     desc: "",
  //     services: []
  //   },
  //   "massage": {
  //     img: "/image/locations/massage.webp",
  //     title: "Massage",
  //     desc: "",
  //     services: []
  //   },
  //   "wax": {
  //     img: "/image/locations/wax.jpg",
  //     title: "Wax",
  //     desc: "",
  //     services: []
  //   },
  //   "kid": {
  //     img: "/image/locations/kid-manicure.jpg",
  //     title: "Kid",
  //     desc: "",
  //     services: []
  //   }
  // }

  // services && services.forEach(service => {
  //   if (service.serviceCategory in servicesCategory) servicesCategory[service.serviceCategory].services.push({
  //     serviceId: service.serviceId,
  //     title: service.serviceName,
  //     desc: service.serviceDescription,
  //     price: service.price,
  //     serviceTime: service.serviceTime
  //   })
  // })

  return (
    <div className="my-20">
      {/* @ts-ignore */}
      <Typography variant="h2" className="text-center">
        Booking
      </Typography>
      <Booking
        locationId={locationId}
        businessHours={businessHours}
        servicesCategory={servicesCategory}
        services={services}
        employees={employees}
        timeSlotDuration={timeSlotDuration}
        locationClosedDays={locationClosedDays}
        locationBlockedDays={locationBlockedDays}
        locationType={locationType}
        groupServiceByDefault={groupServiceByDefault}
      />
    </div>
  )
}

export default BookingLayout;