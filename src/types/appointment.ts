import { Address } from "./location";

export interface Appointment {
  appointmentId: string;
  appointmentLength: number;
  appointmentStatus: string;
  appointmentTime: string;
  checkin: boolean;
  checkinBy: {
    selfCheckin: boolean;
    userId: string;
    userName: string;
  };
  checkout: boolean;
  checkoutBy: {
    selfCheckin: boolean;
    userId: string;
    userName: string;
  };
  customerId: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    userDisplayName: string;
    userId: string;
  };
  customerNote: string;
  customerTip: {
    amount: number;
    type: string;
  };
  cutoffTimeForChecking: number;
  daylightSavings: boolean;
  discount: {
    discountAmount: number;
    discountCode: string;
    discountType: string;
  };
  employeeId: string;
  employeeInfo: {
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  timeZone: string;
  feedback: string;
  locationId: string;
  locationInfo: {
    address: Address;
    locationName: string;
  };
  payment: [];
  promotion: {
    promotionAmount: number;
    promotionCode: string;
  };
  rating: number;
  reminderSent: boolean;
  requirePayment: boolean;
  servicedBy: [];
  services: [];
  setReminder: boolean;
  subtotal: number;
  taxAmount: number;
  total: number;
}