"use client";

import { Typography } from "@material-tailwind/react"
import ServiceCard from "@/components/service-card";

import { Service } from "@/types/service"

interface DefaultLayoutPropsType {
  services: Service[],
  servicesOffered: string[]
}

interface ServiceCategory {
  img: string;
  title: string;
  desc: string;
  services: {
    serviceId: string,
    title: string,
    desc?: string,
    serviceTime: number,
    price?: number,
  }[]
}

export interface ServicesCategory {
  [key: string]: ServiceCategory;
}

function DefaultLayout({services, servicesOffered}: DefaultLayoutPropsType) {

  const servicesCategory: ServicesCategory  = {
    "manicure": {
      img: "/image/locations/manicure.webp",
      title: "Manicure",
      desc: "",
      services: []
    },
    "pedicure": {
      img: "/image/locations/pedicure.webp",
      title: "Pedicure",
      desc: "",
      services: []
    },
    "facial": {
      img: "/image/locations/facial.webp",
      title: "Facial",
      desc: "",
      services: []
    },
    "eyelash": {
      img: "/image/locations/eyeslash.jpeg",
      title: "Eyelash",
      desc: "",
      services: []
    },
    "massage": {
      img: "/image/locations/massage.webp",
      title: "Massage",
      desc: "",
      services: []
    },
    "wax": {
      img: "/image/locations/wax.jpg",
      title: "Wax",
      desc: "",
      services: []
    },
    "kid": {
      img: "/image/locations/kid-manicure.jpg",
      title: "Kid",
      desc: "",
      services: []
    }
  }

  services && services.forEach(service => {
    if (service.serviceCategory in servicesCategory) servicesCategory[service.serviceCategory].services.push({
      title: service.serviceName,
      desc: service.serviceDescription,
      price: service.price,
      serviceTime: service.serviceTime,
      serviceId: service.serviceId
    })
  })

  const renderServiceCard = (servicesOffered: string[]) => {
    let servicesOfferedMap = servicesOffered.map(service => servicesCategory[service.toLowerCase()])

    return (
      <div className="my-[3rem] mx-[1rem] md:mx-[2rem] lg:mx-[3rem]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicesOfferedMap.map((service, idx) => {
            // Display service card only if there is actual service
            return service.services.length > 0 && <ServiceCard key={idx} img={service.img} title={service.title} services={service.services} />
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="my-20">
      {/* @ts-ignore */}
      <Typography variant="h2" className="text-center">
        Our Services
      </Typography>
      {
        servicesOffered.length && renderServiceCard(servicesOffered)
      }
    </div>
  )
}

export default DefaultLayout;