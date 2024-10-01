import { Address, GeoLocation } from "./location";

interface LocationInfo {
  address: Address;
  geoLocation: GeoLocation
}

export interface Service {
  createdAt: string;
  locationId: string;
  locationInfo?: LocationInfo;
  price?: number;
  serviceCategory: string;
  serviceDescription?: string;
  serviceId: string;
  serviceName: string;
  serviceTime: number;
  serviceType?: string;
  serviceGroup?: string;
}