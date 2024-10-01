"use client";

import { Service } from "@/types/service";
import DefaultLayout from "./layouts/default";

interface UnknownObject {
  [key: string]: unknown;
}

interface ServiceLayoutPropsType {
  services: Service[];
  layout: string;
  servicesOffered: string[];
  content?: UnknownObject;
}

function ServiceLayout({services, servicesOffered, layout, content}: ServiceLayoutPropsType) {

  // if (layout === 'design') return
  
  return <DefaultLayout services={services} servicesOffered={servicesOffered}/>
}

export default ServiceLayout;