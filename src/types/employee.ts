export interface WorkHours {
  [key: number]: {
    from: number;
    to: number;
  };
}

export interface Employee {
  appointments: string[];
  profilePhoto: string;
  phoneNumber: string;
  requestDayoff: string[];
  workHours: WorkHours;
  name: string;
  serviceTypes: { [key: string]: any };
  offDays: number[];
  employeeId: string;
  services: string[];
  isAvailableToBook: boolean;
  email: string;
}