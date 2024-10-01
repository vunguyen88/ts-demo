import { Employee } from "./employee";
import { Service } from "./service";

export interface Address {
  zipCode: string,
  city: string,
  street: string,
  intersection?: string,
  state: string
}

export interface LocationStatus {
  isActive: boolean;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface SocialUrls {
  youtube?: string,
  x?: string,
  tiktok?: string,
  facebook?: string,
  yelp?: string,
  pinterest?: string,
  instagram?: string
}

export interface BusinessHours {
  [key: string]: {
    from: number;
    to: number;
  };
}

export interface LocationEmployeeSelection {
  userId: string;
  displayName?: string;
  photoURL?: string;
  position?: {
    [key: string]: {
      isAvailableToBook: boolean
    }
  };
  workHours?: {
    [key: string]: {
      from: number;
      to: number;
    };
  };
  offDays: number[];
  employeeBlockedDays: string[];
  employeeServices: string[];
  isAvailable?: boolean;
  gender?: string;
}
// export interface BusinessHours {
//   "0": {
//       "from": number, 
//       "to": number
//   },
//   "1": {
//       "from": number,
//       "to": number
//   },
//   "2": {
//     "from": number,
//     "to": number
//   },
//   "3": {
//       "from": number, 
//       "to": number
//   },
//   "4": {
//       "from": number,
//       "to": number
//   },
//   "5": {
//     "from": number,
//     "to": number
//   },
//   "6": {
//     "from": number,
//     "to": number
//   }
// }

export interface PageView {
  landing: {
    content: {},
    layout: string;
    display: boolean
  },
  checkin: {
    content: {},
    layout: string;
    display: boolean
  },
  contactUs: {
    content: {},
    layout: string;
    display: boolean
  },
  location: {
    content: {},
    layout: string;
    display: boolean
  },
  services: {
    content: {},
    layout: string;
    display: boolean
  },
  designs: {
    content: {},
    layout: string;
    display: boolean
  },
  employees: {
    content: {},
    layout: string;
    display: boolean
  },
  giftcard: {
    content: {},
    layout: string;
    display: boolean
  },
  bookAppointment: {
    content: {},
    layout: string;
    display: boolean
  }
}

export interface ServiceInfo {
  serviceType?: string,
  createdAt: string,
  price?: number,
  locationId: string,
  serviceDescription?: string,
  serviceName: string,
  serviceId: string,
  serviceTime?: number,
  serviceCategory?: string,
}

export interface ServiceTypes {
  "facial"?: [ServiceInfo],
  "eyebrow"?: [ServiceInfo],
  "manicures"?: [ServiceInfo],
  "pedicures"?: [ServiceInfo],
  "eyelashes"?: [ServiceInfo],
  "kid"?: [ServiceInfo],
  "wax"?: [ServiceInfo],
}

export interface LocationInfo {
  locationId: string,
  locationName: string,
  locationNameUrl: string,
  locationLogo: string,
  locationStatus: LocationStatus,
  prefixUrl: string,
  landingIntroduction?: string,
  locationType: string,
  locationTimeZone: string,
  daylightSavingTime?: boolean,
  checkinTime?: number,
  earlyCheckin?: number,
  acceptWalkins: boolean,
  phoneNumber: string,
  locationEmail?: string,
  googleMapLinkIframe?: string,
  address: Address,
  geoLocation: GeoLocation,
  socialUrls: SocialUrls,
  taxRate?: number,
  businessHours: BusinessHours,
  closedDays: number[],
  locationBlockedDays: string[],
  timeSlotSizeMinutes: number,
  servicesOffered: string[],
  bookWithDesign?: boolean,
  bookWithEmployee?: boolean,
  pageView: PageView,
  googleMapUrl?: string,
  services:Service[],
  employees: LocationEmployeeSelection[],
  groupServiceByDefault: boolean,
}

export interface LocationDetails {
  locationId: string,
  locationName: string,
  locationNameUrl: string,
  locationLogo: string,
  locationStatus: LocationStatus,
  prefixUrl: string,
  landingIntroduction?: string,
  locationType: string,
  locationTimeZone: string,
  daylightSavingTime?: boolean,
  checkinTime?: number,
  earlyCheckin?: number,
  owner: any[],
  acceptWalkins: boolean,
  phoneNumber: string,
  locationEmail?: string,
  googleMapLinkIframe?: string,
  address: Address,
  geoLocation: GeoLocation,
  socialUrls: SocialUrls,
  taxRate?: number,
  pageView: PageView,
  nailDesigns: string[],
  businessHours: BusinessHours,
  closedDays: number[],
  locationBlockedDays: string[],
  timeSlotSizeMinutes: number,
  serviceTypes: ServiceTypes,
  employees: Employee[],
  servicesOffered: string[],
  bookWithDesign?: boolean,
  bookWithEmployee?: boolean,
  googleMapUrl: string
}

