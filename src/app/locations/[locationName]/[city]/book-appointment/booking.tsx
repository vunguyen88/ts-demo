"use client";

import { Avatar, Typography, Button } from '@material-tailwind/react';
import React, { useEffect, useState, useRef } from 'react';
import { 
  getWeekdaysInMonth, 
  convertUTCToLocalHHMM, 
  generateAvailableAppointments, 
  convertTo24HourFormat, 
  convertUtcToLocalDate, 
  getDaysUntilEndOfMonth, 
  addMinutesToTime, 
  getCurrentTimeAsNumber,
  getNextAvailableTimeAsNumber
} from '@/lib/utils/helper';

import { format as dateFormatFns } from 'date-fns';
import { LocationEmployeeSelection, BusinessHours } from '@/types/location';

import { ServicesCategory } from '../services/layouts/default';
import { ServiceGroup } from '@/lib/utils/helper';
import { generateGroupService } from '@/lib/utils/helper';
import { getLocationAppointmentList } from '@/actions';

import { Service } from "@/types/service"

import ServiceAppointmentCard from '@/components/appointment-service-card';
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useSelectedServiceContext } from '@/hooks/useSelectedServiceContext';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const daysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();

interface BookingProps {
  locationId: string;
  businessHours: BusinessHours;
  servicesCategory: ServiceGroup;
  employees: LocationEmployeeSelection[];
  timeSlotDuration: number;
  locationClosedDays: number[];
  locationBlockedDays: string[];
  locationType: string;
  services: Service[];
  groupServiceByDefault: boolean;
}

interface LocationBookedAppointment {
  employeeId: string;
  startTime: string;
  appointmentLength: number;
  appointmentId: string;
  appointmentTime: string
}

const Booking: React.FC<BookingProps> = ({ locationId, businessHours, services, servicesCategory, locationClosedDays, locationBlockedDays, employees, timeSlotDuration, locationType, groupServiceByDefault }) => {
  const { selectedServiceState, setSelectedServiceState } = useSelectedServiceContext();
  const [employeeList, setEmployeeList] = useState<LocationEmployeeSelection[]>([{
    userId: "LocationDefault", 
    isAvailable: true, 
    displayName: "No Preference", 
    photoURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSmTojySPSO--8DfK3HqQZQFfqwj-69YYtzA&s",
    offDays: [],
    employeeBlockedDays: [],
    employeeServices: [],
    // workPositions: {nailTech: {isAvailableToBook: true}}
  }, 
    ...employees
  ]);
  const currentDate = new Date();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(dateFormatFns(new Date(), 'MM/dd'));
  const [monthlyOpeningStatus, setMonthlyOpeningStatus] = useState<{ isOpen: boolean; dateStr: string; day: number }[]>([]);
  // serviceGroup including group name and service list in the group, update when select new employee
  const [serviceGroup, setServiceGroup] = useState<ServiceGroup>(() => JSON.parse(JSON.stringify(servicesCategory)));
  const [selectServiceType, setSelectServiceType] = useState(() => {
    if (groupServiceByDefault) return "manicure";
    return Object.keys(servicesCategory).filter(key => servicesCategory[key].services.length)[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("LocationDefault");
  const [locationBookedAppointments, setLocationBookedAppointments] = useState<LocationBookedAppointment[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState<string>(dateFormatFns(new Date(), 'yyyy/MM/dd'))
  const [serviceGroupList, setServiceGroupList] = useState(Object.keys(servicesCategory).filter(key => servicesCategory[key].services.length));

  // Refs to store previous values of dependencies
  const prevSelecteDateAndMonthRef = useRef<string>();
  const prevSelectedMonthIndex = useRef<number>();
  const prevSelectedEmployeeRef = useRef<string>();

  // get list of servicesType that location can offered
  // const serviceGroupList = Object.keys(servicesCategory).filter(key => servicesCategory[key].services.length);

  // ========================= Define function in useEffect ========================= //
  // get all closed days in a select month for either location or employee with format ["YYY/MM/DD"] by union BlockedDays and ClosedDays
  const getMonthClosedDays = (locationClosedDays: number[], locationBlockedDays: string[], employeeOffDays: number[] = [], employeeBlockedDays: string[] = []) => {
    const locationClosedDaysInMonth = getWeekdaysInMonth(selectedYear, selectedMonthIndex, locationClosedDays);
    const locationBlockedDaysInMonth = locationBlockedDays.filter(day => day.includes(`${selectedYear}/${selectedMonthIndex+1 < 10 ? ('0'+(selectedMonthIndex+1)) : selectedMonthIndex+1}`));
    const employeeOffDaysInMonth = getWeekdaysInMonth(selectedYear, selectedMonthIndex, employeeOffDays);
    const employeeBlockedDaysInMonth = employeeBlockedDays.filter(day => day.includes(`${selectedYear}/${selectedMonthIndex+1 < 10 ? ('0'+(selectedMonthIndex+1)) : selectedMonthIndex+1}`));
    
    return [...new Set([...locationClosedDaysInMonth, ...locationBlockedDaysInMonth, ...employeeOffDaysInMonth, ...employeeBlockedDaysInMonth])].sort((a, b) => a.localeCompare(b));
  }

  // get opening days status [{"isOpen": boolean, "dateStr": string, "day": number}] by checking each day in month with getMonthClosedDays list
  // function return opening day status of location and employee depends on selectedEmployee value
  const getLocaionOpeningDaysStatus = (month: number) => {
    const totalDaysInMonth = daysInMonth(month, selectedYear);
    let monthClosedDays;
    let selectedEmployeeInfo;

    if (selectedEmployee !== 'LocationDefault') selectedEmployeeInfo = employees.find(emp => emp.userId === selectedEmployee);
    
    monthClosedDays = getMonthClosedDays(locationClosedDays, locationBlockedDays, selectedEmployeeInfo?.offDays ? selectedEmployeeInfo.offDays : [], selectedEmployeeInfo?.employeeBlockedDays ? selectedEmployeeInfo.employeeBlockedDays : []);

    const startDay = selectedMonthIndex === currentDate.getMonth() && selectedYear === currentDate.getFullYear() 
      ? currentDate.getDate() // Start from current day if in current month and year
      : 1; // Start from the first day otherwise

    // create a list of days in month, if current month, will start at current day
    const openingDayStatus = Array.from({ length: totalDaysInMonth - startDay + 1 }, (_, i) => startDay + i).map(day => {
      let dateStr = `${ selectedYear }/${ month < 10 ? ('0' + month) : month }/${day < 10 ? ('0' + day) : day}`

      if (monthClosedDays.includes(dateStr)) return { isOpen: false, dateStr: dateStr, day: day }

      return { isOpen: true, dateStr: dateStr, day: day };
    })

    return openingDayStatus;
  }

  const getBookedAppointmentstOnSelectedDate = (selectedEmployee: string, selectedDate: string): ({startTime: string, duration: number}[]) => {
    if (selectedEmployee !== 'LocationDefault') {
      const employeeBookedApptsOnSelectDate = locationBookedAppointments.filter(appt => appt.employeeId === selectedEmployee && convertUtcToLocalDate(appt.appointmentTime) === selectedDate).map(appt => ({startTime: appt.startTime, duration: appt.appointmentLength}));
      return employeeBookedApptsOnSelectDate;
    }
    return []
  }

  const getWorkHoursOnSelectedDate = (selectedEmployee: string, selectedDate: string) => {
    let year = selectedAppointmentDate.split('/')[0];
    if (prevSelecteDateAndMonthRef.current !== selectedDate) {
      year = selectedYear.toString()
    }
    const dayOfWeek = (new Date(`${year}/${selectedDate}`)).getDay();
    let workStartTime = businessHours![dayOfWeek.toString()].from;
    let workEndTime = businessHours![dayOfWeek.toString()].to;
    if (selectedEmployee !== 'LocationDefault') {
      const selectedEmployeeWorkHour = employees.find(empl => empl.userId === selectedEmployee)?.workHours;
      workStartTime = selectedEmployeeWorkHour![dayOfWeek.toString()].from;
      workEndTime = selectedEmployeeWorkHour![dayOfWeek.toString()].to;
    }
    // check if selectedDate is today and current time is later than work start time, then work start time will round up to next available time
    const selectedDateIsToday = (dateFormatFns(new Date(), 'MM/dd') === selectedDate);
    const currentTimeAsNumber = getCurrentTimeAsNumber();
 
    if (selectedDateIsToday && currentTimeAsNumber > workStartTime) workStartTime = getNextAvailableTimeAsNumber(timeSlotDuration);
    return { workStartTime: workStartTime, workEndTime: workEndTime }
  }

  // get initial data in the first render
  // check if any employee is not available in the first render for the current date
  useEffect(() => {
    const fetchLocationAppointments = async () => {
      try {
        const appointments = await getLocationAppointmentList(locationId);
        const bookedAppointments: LocationBookedAppointment[] = appointments.map(appt => {
          return ({
            appointmentId: appt.appointmentId,
            employeeId: appt.employeeId,
            appointmentLength: appt.appointmentLength,
            appointmentTime: appt.appointmentTime,
            startTime: convertUTCToLocalHHMM(appt.appointmentTime),
          })
        })
        if (bookedAppointments.length) setLocationBookedAppointments([...bookedAppointments])
      } catch (err) {
        console.error('err ', err)
        // setError('Failed to fetch data');
      }
    };

    // Call the fetch function
    fetchLocationAppointments();

    let employeeAvailability = employeeList.map(employee => {
      if (employee.userId !== "LocationDefault") {
        let monthOffDays = getMonthClosedDays(locationClosedDays, locationBlockedDays, employee.offDays, employee.employeeBlockedDays);
        let employeeAvailabilityOnNewDate = !(monthOffDays.includes(dateFormatFns(new Date(), 'yyyy/MM/dd')));
        return {...employee, isAvailable: employeeAvailabilityOnNewDate}
      }
      
      return {...employee}
    })
    setEmployeeList([...employeeAvailability])
  }, [])
  
  // update dom whenever date, employee or service change as well as update available booking slots
  useEffect(() => {
    const monthlyOpeningDayStatus: { isOpen: boolean; dateStr: string; day: number }[] = getLocaionOpeningDaysStatus(selectedMonthIndex + 1);
    setMonthlyOpeningStatus([...monthlyOpeningDayStatus])

    // check if selectedAppointmentDate currently in closedDays or offDays when customer pick new employee then reset selectedAppointmentDate to empty string
    if (monthlyOpeningDayStatus.filter(dayStatus => dayStatus.dateStr === selectedAppointmentDate && dayStatus.isOpen === false).length) {
      setSelectedAppointmentDate('invalid');
    }

    const bookedAppointmentsOnSelectedDate = getBookedAppointmentstOnSelectedDate(selectedEmployee, selectedDate);
    const workHoursOnSelectedDate = getWorkHoursOnSelectedDate(selectedEmployee, selectedDate);

    // get all selected service total time => number
    const appointmentLength = selectedServiceState.reduce((total, service) => total + service.serviceTime, 0);
    let availableTimeSlotsForSelectedDate: string[] = [];

    if (selectedEmployee === 'LocationDefault') {
      let employeeListToPerformService: LocationEmployeeSelection[] = [];
      if (selectedServiceState.length) {
        console.log('No preference with particular service');
        // get list of employees capable of doing selected services on selected date
        employeeListToPerformService = employeeList.filter(employee => {
          if (!employee.isAvailable) return;
          const intersection = selectedServiceState.filter(service => new Set(employee.employeeServices).has(service.serviceId));
          if (intersection.length) return employee;
        })
      }
      if (!selectedServiceState.length) {
        console.log('No preference without particular service');
        console.log('services that available in service group ', serviceGroup[selectServiceType].services)
        // get list of employees capable of doing services in selected service group on selected date
        employeeListToPerformService = employeeList.filter(employee => {
          if (!employee.isAvailable) return;
          const intersection = serviceGroup[selectServiceType].services.filter(service => new Set(employee.employeeServices).has(service.serviceId));
          if (intersection.length) return employee;
        })
      }
      if (employeeListToPerformService.length) employeeListToPerformService.forEach(employee => {
        const employeeWorkHourOnSelectedDate = getWorkHoursOnSelectedDate(employee.userId, selectedDate);
        const employeeBookedAppointmentsOnSelectedDate = getBookedAppointmentstOnSelectedDate(employee.userId, selectedDate);
        const employeeAvailableTimeSlotsForSelectedDate = generateAvailableAppointments(
          convertTo24HourFormat(employeeWorkHourOnSelectedDate.workStartTime), 
          convertTo24HourFormat(employeeWorkHourOnSelectedDate.workEndTime),
          employeeBookedAppointmentsOnSelectedDate,
          timeSlotDuration,
          appointmentLength
        );
        availableTimeSlotsForSelectedDate = Array.from(new Set([...availableTimeSlots, ...employeeAvailableTimeSlotsForSelectedDate]))
      });
    }

    if (selectedEmployee !== 'LocationDefault') {
      console.log('Selected employee')
      availableTimeSlotsForSelectedDate = generateAvailableAppointments(
        convertTo24HourFormat(workHoursOnSelectedDate.workStartTime), 
        convertTo24HourFormat(workHoursOnSelectedDate.workEndTime),
        bookedAppointmentsOnSelectedDate,
        timeSlotDuration,
        appointmentLength
      );
    }

    setAvailableTimeSlots(availableTimeSlotsForSelectedDate);

    // generateSelectedDayTimeSlots();

    // const timeSlots = generateSelectedDayTimeSlots();
    // Update the refs with the current values after every render
    prevSelectedEmployeeRef.current = selectedEmployee;
    prevSelectedMonthIndex.current = selectedMonthIndex;
    prevSelecteDateAndMonthRef.current = selectedDate;
  }, [locationBookedAppointments, selectedDate, selectServiceType, selectedMonthIndex, selectedEmployee, selectedServiceState])

  // Get day of the week for a specific date
  const getDayOfWeek = (date: number) => {
    const dayOfWeek = new Date(selectedYear, selectedMonthIndex, date).getDay();
    return daysOfWeek[dayOfWeek];
  };

  // Move to next or previous month
  const handleMonthChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (selectedMonthIndex === 0) {
        setSelectedMonthIndex(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonthIndex(selectedMonthIndex - 1);
      }
    } else {
      if (selectedMonthIndex === 11) {
        setSelectedMonthIndex(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonthIndex(selectedMonthIndex + 1);
      }
    }
    //setSelectedDate(1); // Reset date to 1 when month changes
  };

  // When select appointment date, check available employees on that day and setAvailableEmployees
  // If employee is not available, gray out the avatar and disable button
  const handleDateChange = (date: number) => {
    let newDate = `${selectedMonthIndex+1 < 10 ? '0' + (selectedMonthIndex+1) : (selectedMonthIndex+1)}/${date < 10 ? '0' + date : date}`;
    if (newDate !== selectedDate) {
      let employeeAvailability = employeeList.map(employee => {
        if (employee.userId !== "LocationDefault") {
          let monthOffDays = getMonthClosedDays(locationClosedDays, locationBlockedDays, employee.offDays, employee.employeeBlockedDays);
          let employeeAvailabilityOnNewDate = !(monthOffDays.includes(`${selectedYear}/${newDate}`))
          return {...employee, isAvailable: employeeAvailabilityOnNewDate}
        }
        
        return {...employee}
      })
      setEmployeeList([...employeeAvailability])
      setSelectedDate(newDate);
    }
    setSelectedAppointmentDate(() => `${selectedYear}/${selectedMonthIndex+1 < 10 ? '0' + (selectedMonthIndex+1) : selectedMonthIndex+1}/${date < 10 ? ('0'+date) : date}`);
  };

  // When select employee, check services that employee is capable of and render new service group
  // Remove selectedTimeSlot to avoid conflict in time between employees
  // Check if new select employee serviceGroup does not have current selectedServiceGroup, then set selectedServiceGroup to empty string
  const handleEmployeeChange = (userId: string) => {
    let updatedServiceGroup = servicesCategory;
    let updatedEmployeeServiceType = Object.keys(updatedServiceGroup).filter(key => updatedServiceGroup[key].services.length)
    if (userId !== 'LocationDefault') {
      let employeeServiceIds = employees.find(employee => employee.userId === userId)!.employeeServices;
      const employeeServices = services.filter(service => employeeServiceIds.includes(service.serviceId));
      updatedServiceGroup = generateGroupService(employeeServices, groupServiceByDefault);
      let updatedEmployeeServiceType = Object.keys(updatedServiceGroup).filter(key => updatedServiceGroup[key].services.length);
      setServiceGroupList(updatedEmployeeServiceType);
      setSelectedTimeSlot('');
      setSelectedEmployee(userId);
      setServiceGroup(JSON.parse(JSON.stringify(updatedServiceGroup)))
      return
    }
    setServiceGroupList(updatedEmployeeServiceType);
    setSelectedTimeSlot('');
    setServiceGroup(JSON.parse(JSON.stringify(servicesCategory)))
    setSelectedEmployee(userId);
  }

  const handleServiceGroupChange = (serviceType: string) => {
    setSelectServiceType(serviceType)
  }

  const handleTimeSlotChange = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  }

  const handleBookAppointmentClick = () => {
    console.log('BOOK APPT')
  }

  // const availableTimeSlotsForSelectedDate = generateTimeSlots(selectedAppointmentDate, 15, businessHours)

  const isMorning = (timeSlot: string): boolean => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    return hours < 12;
};

  const isAfternoon = (timeSlot: string): boolean => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    return  hours >= 12 && hours < 17;
  }

  const isEvening = (timeSlot: string): boolean => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    return hours >= 17 &&  hours < 23;
  }

  let morningTimeSlots = availableTimeSlots.filter(timeSlot => isMorning(timeSlot));
  let afternoonTimeSlots = availableTimeSlots.filter(timeSlot => isAfternoon(timeSlot));
  let eveningTimeSlots = availableTimeSlots.filter(timeSlot => isEvening(timeSlot));
  let totalServiceTime = selectedServiceState.reduce((total, service) => total + service.serviceTime, 0)

  const renderServiceGroupButton = (types: string[]) => {
    
    return (
      <div className='flex overflow-x-auto gap-4 hide-scrollbar my-3 whitespace-nowrap'>
        {types.map( (type, idx) => (
          <div key={idx}>
            {/* @ts-ignore */}
            <Button  variant="outlined" className={`${type===selectServiceType ? 'bg-blue-700 text-white border border-white' : ''}`} onClick={ () => handleServiceGroupChange(type) }>
              {type}
            </Button>
          </div>
        ))}
      </div>
    )
  }

  const renderServiceList = (serviceType: string) => {
    if (!(serviceType in serviceGroup)) return <></>;
    if (serviceGroup[serviceType].services.length === 0) return <></>
    return (
      <div className='mt-5 grid max-w-6xl grid-cols-1 gap-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* {servicesCategory[serviceType].services.map( service => ( */}
        {serviceGroup[serviceType].services.map(service => (
          <ServiceAppointmentCard 
            key={service.serviceId} 
            title={service.serviceName} 
            description={service.desc} 
            serviceTime={service.serviceTime}
            price={service.price}
            isSelected={true}
            serviceId={service.serviceId}
            selectedEmployee={selectedEmployee}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="lg:flex">
      <div className="p-4 min-h-screen">

        {/* ==================== Month Section ==================== */}
        <div className="flex justify-between items-center py-2 bg-white border-b">
          <button 
            className={`text-2xl font-light pl-[1rem] ${
              selectedMonthIndex === currentDate.getMonth() && selectedYear === currentDate.getFullYear()
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-black'
            }`}
            onClick={() => handleMonthChange("prev")}
            disabled={selectedMonthIndex === currentDate.getMonth() && selectedYear === currentDate.getFullYear()}
          >
            &lt;
          </button>
          {/* @ts-ignore */}
          <Typography className="" variant='lead'>{months[selectedMonthIndex]} {selectedYear}</Typography>
          <button className="text-2xl font-light pr-[1rem]" onClick={() => handleMonthChange("next")}>&gt;</button>
        </div>

        {/* ==================== Date Section ==================== */}
        <div className="text-sm mt-[1rem]">DATE</div>
        <div className="flex overflow-x-auto py-4 bg-white space-x-2 hide-scrollbar">
          {monthlyOpeningStatus.map(day => (
            <div
              key={day.dateStr}
              className={`
                min-w-[40px] p-2 text-center rounded-lg 
                ${ day.dateStr === (selectedAppointmentDate)
                  ? 'bg-blue-700 text-white'
                  : day.isOpen 
                    ? 'cursor-pointer bg-white-200 border-black text-black border border-gray-800' 
                    : 'bg-gray-500 text-white cursor-not-allowed pointer-events-none' }
                `}
              onClick={() => handleDateChange(day.day)}
            >
              <div>{day.day}</div>
              <div className="font-light text-xs">{getDayOfWeek(day.day)}</div>
            </div>
          ))}
        </div>

        {/* ==================== Nail tech selecction ==================== */}
        <div className="text-sm mt-[1rem]">TECHNICIAN</div>
        <div className="flex overflow-x-auto py-4 bg-white space-x-2 hide-scrollbar">
          {employeeList.map(employee => (
            <div
              key={employee.userId}
              // className={`min-w-[100px] p-2 text-center rounded-lg cursor-pointer`}
              className={
                `min-w-[100px] p-2 text-center rounded-lg 
                ${employee.isAvailable 
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed pointer-events-none opacity-35'
                  }
                `
              }
              onClick={() => handleEmployeeChange(employee.userId)}
            >
              {/* @ts-ignore */}
              <Avatar 
                src={ employee.photoURL ? employee.photoURL 
                  : (employee.gender === 'female') 
                  ? "/icons/girl1.webp" 
                    : "/icons/boy1.webp"
              }
                alt="avatar" 
                variant="rounded" 
                size="xl" 
                className={`
                ${ selectedEmployee === employee.userId ? 'border-4 border-blue-500' : ''} 
              `}/>
              <div>
                {/* @ts-ignore */}
                <p className='font-bold mt-2'>{employee.displayName}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ==================== Service Type selecction ==================== */}
        <div className="text-sm">SERVICE</div>
        <div>
          { renderServiceGroupButton(serviceGroupList) }
        </div>

        {/* ==================== Service List selecction ==================== */}
        { selectServiceType && renderServiceList(selectServiceType) }

        {/* ==================== Time Section ==================== */}
        <div className="text-sm my-5">TIME</div>
        <div className="-mt-2">
          <div className="pl-2 text-sm my-1">morning</div>
          <div className="lg:w-4/5">
            {morningTimeSlots.length > 0 ? (
              morningTimeSlots.map((timeSlot, idx) => (
                <div key={idx} className={`inline-block p-2 m-1.5 shadow-sm rounded-lg ${selectedTimeSlot === timeSlot ? 'bg-blue-700 text-white' : 'text-black border border-gray-700'}`} onClick={() => handleTimeSlotChange(timeSlot)}>
                  {/* {format(timeSlot, 'hh:mm aa ')} */}
                  { timeSlot }
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No times available</div>
            )}
          </div>
          <div className="pl-2 text-sm my-1">afternoon</div>
          <div className="lg:w-4/5">
            {afternoonTimeSlots.length > 0 ? (
              afternoonTimeSlots.map((timeSlot, idx) => (
                <div key={idx} className={`inline-block p-2 m-1.5 shadow-sm rounded-lg ${selectedTimeSlot === timeSlot ? 'bg-blue-700 text-white' : 'text-black border border-gray-700'}`} onClick={() => handleTimeSlotChange(timeSlot)}>
                  {/* {format(timeSlot, 'hh:mm aa ')} */}
                  { timeSlot }
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No times available</div>
            )}
          </div>
          
          <div className="pl-2 text-sm my-1">evening</div>
          <div className="lg:w-4/5">
            {eveningTimeSlots.length > 0 ? (
              eveningTimeSlots.map((timeSlot, idx) => (
                <div key={idx} className={`inline-block p-2 m-1.5 shadow-sm rounded-lg ${selectedTimeSlot === timeSlot ? 'bg-blue-700 text-white' : 'text-black border border-gray-700'}`} onClick={() => handleTimeSlotChange(timeSlot)}>
                  {/* {format(timeSlot, 'hh:mm aa ')} */}
                  { timeSlot }
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No times available</div>
            )}
          </div>
        </div>
        <hr className='lg:hidden mt-[2rem]'/>
      </div>
      
       {/* ======================= Review and Booking Button ======================= */}
      <div className='lg:mt-[2rem] p-4 lg:basis-1/3 lg:mx-[1.5rem] lg:sticky lg:top-20'>
        <div className='flex justify-center items-center pl-1'>
          <CalendarIcon strokeWidth={2} className={`font-normal h-6 w-6`}/> 
          <div className='ml-1 md:ml-2'>
            { selectedAppointmentDate === 'invalid' ? 'Please select date' : new Date(selectedAppointmentDate).toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'})}
          </div>
          <div className='ml-auto mr-3'>
            { 
              selectedTimeSlot && totalServiceTime 
                ? `${selectedTimeSlot} - ${addMinutesToTime(selectedTimeSlot, totalServiceTime, '24-hours')}` 
                : ''
            }
          </div>
        </div>
        <div className='pl-1 my-2'>
          <p>Services:</p>
          <div>
            {selectedServiceState.map(service => (
              <div key={service.serviceId}>
                <span className='ml-3'>- {service.title} </span>
                <span>
                  { service.selectedEmployee === 'LocationDefault' 
                    ? 'No Preference' 
                    : employees.filter(employee => (employee.userId === service.selectedEmployee))[0].displayName}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className='mt-6 flex justify-center lg:justify-start'>
          {/* @ts-ignore */}
          <Button 
            variant="filled"
            disabled={selectedAppointmentDate === 'invalid' || selectedServiceState.length === 0 || (!selectedTimeSlot)}
            className={``}
            onClick={() => {handleBookAppointmentClick()}}
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
