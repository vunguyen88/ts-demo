import { format, isToday, addHours, addMinutes, startOfDay, roundToNearestMinutes } from 'date-fns';

// =========================== getDecodedUrlParams =========================== //
export function getDecodedUrlParams(url: string): string {
  let isEncoded = decodeURIComponent(url) !== url;
  if (isEncoded) {
    return decodeURIComponent(url);
  }
  return url;
}

// =========================== displayUSFormatPhoneNumber =========================== //
export function displayUSFormatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.length >= 10) {
    let area: string = phoneNumber.slice(0, 3);
    return `(${area}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  }
  return ''
}

// =========================== convertNumberToTime =========================== //
export function convertNumberToTime(number: number): string {
  let timeOfDay: 'AM' | 'PM' = number > 11 ? 'PM' : 'AM';
  let hours: number = Math.floor(number);
  let minutes: number = (number % 1) * 60;
  
  return `${hours < 10 ? '0' + hours : hours > 12 ? hours - 12 : hours}:${minutes < 10 ? '0' + minutes : minutes} ${timeOfDay}`;
}

// =========================== checkLocationOpen =========================== //
import { BusinessHours } from "@/types/location";

export function checkLocationOpen(businessHours: BusinessHours): boolean {
  const date: Date = new Date();
  const today: number = date.getDay();
  const hours: number = date.getHours();
  const minutes: number = parseFloat((date.getMinutes() / 60).toFixed(1));
  const currentTime: number = hours + minutes;

  const todayHours = businessHours[today.toString()];

  if (todayHours && currentTime >= todayHours.from && currentTime <= todayHours.to) {
    return true;
  }
  
  return false;
}

// =========================== generateFirestoreId =========================== //
export function generateFirestoreId(): string {
  // Alphanumeric characters for generating the ID
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Length of the ID
  const idLength = 20;

  let id = '';

  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    id += chars.charAt(randomIndex);
  }

  return id;
}

// =========================== getLocationIsClosedDay =========================== //
export function getLocationIsClosedDay(
  closedDays: number[] = [], 
  locationBlockedDays: string[] = [], 
  weekDay: number | null = null
): [boolean, boolean, boolean] {
  let closedToday = false;
  let closedOnCalendarWeekDay = false;
  let todayIsBlockedDays = false;

  const getTodayDay = new Date().getDay();
  const currentDate = format(new Date(), 'M/d/yyyy');

  if (getTodayDay === weekDay && (closedDays.includes(getTodayDay) || locationBlockedDays.includes(currentDate))) {
    closedOnCalendarWeekDay = true;
  }

  if (closedDays.includes(getTodayDay) || locationBlockedDays.includes(currentDate)) {
    closedToday = true;
  }

  if (locationBlockedDays.includes(currentDate)) {
    todayIsBlockedDays = true;
  }

  return [closedOnCalendarWeekDay, closedToday, todayIsBlockedDays];
}

// =========================== getWeekdaysInMonth =========================== //
export function getWeekdaysInMonth(
  year: number,
  month: number, // 0-indexed: 0 = January, 8 = September
  weekdays: number[] // Array of days of the week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
): string[] {
  const dates: string[] = [];
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate(); // Get total days in the month

  // Loop through all days of the month
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();

    // Check if the current day is in the list of target weekdays
    if (weekdays.includes(dayOfWeek)) {
      // Format the date as "YYYY/MM/DD"
      const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
      dates.push(formattedDate);
    }
  }

  return dates;
}

// =========================== generateTimeSlots =========================== //
export function generateTimeSlots(
  selectedDate: string, // format (YYYY/MM/DD)
  slotSizeMinutes: number, 
  businessHours: BusinessHours
): Date[] {
  let dateObject: Date = new Date(selectedDate);
  const istoday: boolean = isToday(dateObject); // check if selected day is the current date
  if (istoday) dateObject = startOfDay(dateObject);

  // Get the weekday (0 for Sunday -> 6 for Saturday)
  const dayOfWeek: string = dateObject.getDay().toString();

  const openingTime: number = businessHours[dayOfWeek]?.from || 0;
  const openingTimeInMinutes: number = openingTime % 1 === 0 ? 0 : Math.round((openingTime % 1) * 60);

  const closingTime: number = businessHours[dayOfWeek]?.to || 0;
  const closingTimeInMinutes: number = closingTime % 1 === 0 ? 0 : Math.round((closingTime % 1) * 60);

  let openTime: Date = addHours(dateObject, openingTime); // add hours from business hours to selected date
  openTime = addMinutes(openTime, openingTimeInMinutes); // add minutes from business hours to selected date

  let endTime: Date = addHours(dateObject, closingTime);
  endTime = addMinutes(endTime, closingTimeInMinutes);

  if (istoday) {
    // Prevent rendering time slots of the past
    if (new Date().getHours() > openTime.getHours()) {
      let minutes: number = 0;
      if (new Date().getMinutes() % slotSizeMinutes < 10) {
        minutes = Math.ceil(new Date().getMinutes() / slotSizeMinutes) * slotSizeMinutes;
      } else {
        minutes = Math.ceil((new Date().getMinutes() + 10) / slotSizeMinutes) * slotSizeMinutes;
      }
      
      openTime = addHours(dateObject, new Date().getHours());
      openTime = addMinutes(openTime, minutes);
    }
  }

  let slot: Date = openTime;
  const timeSlots: Date[] = [];

  while (slot <= endTime) {
    timeSlots.push(slot);
    slot = addMinutes(slot, slotSizeMinutes);
  }

  return timeSlots;
}

// =========================== generateAvailableAppointments =========================== //
// Function to take a list of booked appointment in the same day together with duration of selected service that customer will pick
// Return available time slot that customer can pick that not overlap with current appointments
interface Appointment {
  startTime: string;  // format "09:00"
  duration: number;   // in minutes 30
}

export const generateAvailableAppointments = (
  workStartTime: string,
  workEndTime: string,
  bookedAppointments: Appointment[],
  slotDuration: number,
  newAppointmentDuration: number
): string[] => {
  const availableSlots: string[] = [];
  // Helper function to convert time (HH:mm) to minutes from start of the day
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to convert minutes back to time (HH:mm) format
  const minutesToTime = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}`;
  };

  // Generate all possible time slots between work hours
  const workStartMinutes = timeToMinutes(workStartTime);
  const workEndMinutes = timeToMinutes(workEndTime);

  // Sort booked appointments by start time to ensure proper filtering
  bookedAppointments.sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  // Generate all possible slots in increments of the given slotDuration
  for (let time = workStartMinutes; time + slotDuration <= workEndMinutes; time += slotDuration) {
    availableSlots.push(minutesToTime(time));
  }

  // Function to check if a time slot conflicts with booked appointments
  const isOverlapping = (startMinutes: number, duration: number): boolean => {
    const endMinutes = startMinutes + duration;

    return bookedAppointments.some((appointment) => {
      const bookedStartMinutes = timeToMinutes(appointment.startTime);
      const bookedEndMinutes = bookedStartMinutes + appointment.duration;

      // Check if the time slot overlaps with any booked appointment
      return (
        (startMinutes < bookedEndMinutes && startMinutes >= bookedStartMinutes) || // Overlap at the start
        (endMinutes > bookedStartMinutes && endMinutes <= bookedEndMinutes) || // Overlap at the end
        (startMinutes <= bookedStartMinutes && endMinutes >= bookedEndMinutes) // Overlap fully
      );
    });
  };

  // Filter out booked appointments and check for the new appointment's duration
  const availableAppointments: string[] = [];

  availableSlots.forEach((slot) => {
    const slotStartMinutes = timeToMinutes(slot);

    // Check if this slot overlaps with any booked appointments
    if (!isOverlapping(slotStartMinutes, newAppointmentDuration)) {
      availableAppointments.push(`${slot}`);
    }
  });

  return availableAppointments;
};

// =========================== convertTo24HourFormat =========================== //
// Function to convert 24-hour format from number to string
// etc 9.5 -> 09:30, 19 -> "19:00", 14.75 -> "14:45" 
export function convertTo24HourFormat(time: number | undefined): string {
  if (!time) return '23:00';
  // Separate the integer (hours) and the decimal (minutes)
  const hours = Math.floor(time); // Get the hours part (e.g., 9 from 9.5)
  const minutes = (time - hours) * 60; // Convert decimal to minutes (e.g., 0.5 * 60 = 30)

  // Format the hours and minutes as two digits
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = Math.round(minutes).toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}

// =========================== convertUTCToLocalHHMM - 24H format =========================== //
export function convertUTCToLocalHHMM(utcTime: string): string {
  // Parse the UTC date string
  const date = new Date(utcTime);

  // Extract hours and minutes for local time
  const hours = date.getHours().toString().padStart(2, '0');    // Local hours
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Local minutes

  // Return in "hh:mm" format (local time)
  return `${hours}:${minutes}`;
}

// =========================== convertUTCToLocalDate - format (month/date) =========================== //
export const convertUtcToLocalDate = (utcTime: string): string => {
  const date = new Date(utcTime);

  // Get the local month and day
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-based
  const day = date.getDate().toString().padStart(2, '0');

  // Return in MM/DD format
  return `${month}/${day}`;
};

// =========================== convert local time to number - (10:30am -> 10.5, 11:15pm -> 23.25) =========================== //
export function getCurrentTimeAsNumber(): number {
  const now = new Date();

  // Get current hours and minutes
  const hours = now.getHours(); // Returns hour in 24-hour format (0-23)
  const minutes = now.getMinutes(); // Returns minutes (0-59)

  // Convert minutes to fractional hours
  const fractionalHours = minutes / 60;

  // Combine hours and fractional hours
  return hours + fractionalHours;
}

// =========================== getDaysUntilEndOfMonth - format [days] =========================== //
export function getDaysUntilEndOfMonth(): number[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const lastDayOfMonth = new Date(year, month + 1, 0).getDate(); // Get last day of the month
  const days: number[] = [];

  for (let day = today.getDate(); day <= lastDayOfMonth; day++) {
    days.push(day);
  }

  return days;
}

// =========================== addMinutesToTime - format [days] =========================== //
// selectTime format "1:30 pm" or "23:30" and return format "3:30 pm" or "01:00"
export function addMinutesToTime(selectTime: string, minutes: number, format: '12-hours' | '24-hours'): string {
  // Parse the input time string (e.g., "02:30 PM" for 12-hour or "14:30" for 24-hour format)
  const [time, period] = selectTime.split(' ');
  let [hours, mins] = time.split(':').map(Number);

  // Add minutes
  mins += minutes;
  hours += Math.floor(mins / 60);
  mins = mins % 60;
  hours = hours % 24;

  // Handle 12-hour format
  if (format === '12-hours') {
    let suffix = period || (hours >= 12 ? 'pm' : 'am');
    if (hours === 0) {
      hours = 12; // Midnight in 12-hour format
    } else if (hours > 12) {
      hours -= 12;
      suffix = 'am';
    } else if (hours === 12) {
      suffix = 'am';
    } else {
      suffix = 'pm';
    }

    return `${hours}:${mins.toString().padStart(2, '0')} ${suffix}`;
  }

  // Handle 24-hour format
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// =========================== generateGroupService =========================== //
import { Service } from '@/types/service';
export interface ServiceGroup {
  [key: string]: {
    title: string;
    desc: string;
    img: string;
    services: {
      serviceId: string;
      serviceName: string;
      desc: string;
      price: number;
      serviceTime: number;
    }[];
  };
}

export const generateGroupService = (services: Service[], groupServiceByDefault: boolean) => {
  if (!groupServiceByDefault) {
    let serviceGroup: ServiceGroup = {};

    services.forEach(service => {
      if (service.serviceGroup) {
        if (!(service.serviceGroup in serviceGroup)) {
          
          return serviceGroup[service.serviceGroup] = { 
            title: service.serviceGroup.charAt(0).toUpperCase() + service.serviceGroup.slice(1), desc: "", img: "", services: [
              { serviceId: service.serviceId, serviceName: service.serviceName, desc: service.serviceDescription ? service.serviceDescription : "", price: service.price ? service.price : 0, serviceTime: service.serviceTime}
            ] 
          };
        }

        return serviceGroup[service.serviceGroup].services.push(
          { serviceId: service.serviceId, serviceName: service.serviceName, desc: service.serviceDescription ? service.serviceDescription : "", price: service.price ? service.price : 0, serviceTime: service.serviceTime }
        );
      }
    })

    return serviceGroup;
  }

  const servicesCategory: ServiceGroup = {
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
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      desc: service.serviceDescription ? service.serviceDescription : "",
      price: service.price ? service.price : 0,
      serviceTime: service.serviceTime
    })
  })

  return servicesCategory;
}

// =========================== getNextAvailableTimeAsNumber =========================== //
// Function to return next available time as a number
export function getNextAvailableTimeAsNumber(slotDuration: number): number {
  const now = new Date();
  let currentMinutes = now.getMinutes();
  let currentHours = now.getHours();

  // Calculate the remainder when dividing current minutes by slotDuration
  const remainder = currentMinutes % slotDuration;
  const nextSlotMinutes = currentMinutes + (slotDuration - remainder);

  // If the next available time slot is less than 10 minutes away, skip to the next one
  if (nextSlotMinutes - currentMinutes < 10) {
    currentMinutes = nextSlotMinutes + slotDuration;
  } else {
    currentMinutes = nextSlotMinutes;
  }

  // Handle hour overflow if minutes exceed 60
  if (currentMinutes >= 60) {
    currentHours += Math.floor(currentMinutes / 60);
    currentMinutes = currentMinutes % 60;
  }

  // Return the time as a number (e.g., 10.5 for 10:30)
  return currentHours + currentMinutes / 60;
}

// =========================== getNextAvailableTimeAsString =========================== //
// Function to return next available time as a string in "HH:mm" format
export function getNextAvailableTimeAsString(slotDuration: number): string {
  const now = new Date();
  let currentMinutes = now.getMinutes();
  let currentHours = now.getHours();

  // Calculate the remainder when dividing current minutes by slotDuration
  const remainder = currentMinutes % slotDuration;
  const nextSlotMinutes = currentMinutes + (slotDuration - remainder);

  // If the next available time slot is less than 10 minutes away, skip to the next one
  if (nextSlotMinutes - currentMinutes < 10) {
    currentMinutes = nextSlotMinutes + slotDuration;
  } else {
    currentMinutes = nextSlotMinutes;
  }

  // Handle hour overflow if minutes exceed 60
  if (currentMinutes >= 60) {
    currentHours += Math.floor(currentMinutes / 60);
    currentMinutes = currentMinutes % 60;
  }

  // Format time to "HH:mm"
  const formattedHours = currentHours.toString().padStart(2, '0');
  const formattedMinutes = currentMinutes.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}