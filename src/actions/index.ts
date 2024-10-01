'use server';
import axios, { AxiosResponse } from 'axios';
import { LocationInfo, LocationDetails } from '@/types/location';
import { Appointment } from '@/types/appointment';

export async function getLocationList (): Promise<LocationInfo[]> {
  try {
    const response: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/locations/client-list`)
    const locationList = response.data.data
    return locationList
  } catch (error) {
    console.error('Error fetching location list:', error);
    throw error;
  }
}

export async function getLocationDetails (locationId: string): Promise<LocationDetails> {
  try {
    const response: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/locations/${locationId}`)
    const locationDetails = response.data.data
    return locationDetails;
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
}

// get list of appointments of locationId from today and after
export async function getLocationAppointmentList (locationId: string): Promise<Appointment[]> {
  try {
    const response: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/v1/location-booking?locationId=${locationId}`)
    const appointments = response.data.data.map((appointment:any) => ({appointemntId: appointment.appointmentId, appointmentLength: appointment.appointmentLength, appointmentTime: appointment.appointmentTime, employeeId: appointment.employeeId}))
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}
