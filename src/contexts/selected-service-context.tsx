"use client"
import { AdditionalOptions } from '@/types/service';
// contexts/MyContext.tsx
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export  interface SelectedServiceState {
  serviceName?: string, 
  description?: string,
  serviceTime: number,
  price?: number,
  serviceId: string,
  selectedEmployee: string;
  checkedOptions: AdditionalOptions[]
}

// Define the type for the context
interface SelectedServiceContextProps {
  selectedServiceState: SelectedServiceState[];
  setSelectedServiceState: (selectedService: SelectedServiceState) => void;
  updateSelectedServiceState: (selectedService: SelectedServiceState) => void;
}

// Create the context
export const SelectedServiceContext = createContext<SelectedServiceContextProps | undefined>(undefined);

// Create the provider component
export const SelectedServiceContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedServiceState, setSelectedServiceStateArray] = useState<SelectedServiceState[]>([]);

  // Custom setter function to add or remove a single service object from the array
  const setSelectedServiceState = (selectedService: SelectedServiceState) => {
    setSelectedServiceStateArray(prevState => {
      // Check if the service is already selected
      const isServiceSelected = prevState.some(service => service.serviceId === selectedService.serviceId);
      const isSameEmployee = prevState.some(service => service.selectedEmployee === selectedService.selectedEmployee);

      // If service is selected and has the same employee, remove it
      if (isServiceSelected && isSameEmployee) {
        return prevState.filter(service => service.serviceId !== selectedService.serviceId);
      } 
      // If service is selected and has different employee, replace the current service with new one
      if (isServiceSelected && !isSameEmployee) {
        return prevState.filter(service => service.serviceId !== selectedService.serviceId).concat(selectedService);
      } 
      // add selectedService
      else {
        return [...prevState, selectedService];
      }
    });
  };

  const updateSelectedServiceState = (selectedService: SelectedServiceState) => {
    const serviceAlreadySelected = selectedServiceState.filter(service => service.serviceId === selectedService.serviceId && service.selectedEmployee === selectedService.selectedEmployee);
    // Check if updateSelectedService is not in selectedServiceState with serviceId and selectedEmployee then do nothing.
    if (!serviceAlreadySelected.length) {
      return;
    }

    // Check if updateSelectedService is already in selectedServiceState with serviceId and selectedEmployee then update service with new price, time and additionalOptions
    // const updatedSelectedService = selectedServiceState.filter(service => ((service.serviceId !== selectedService.serviceId) && (service.selectedEmployee !== selectedService.selectedEmployee)));
    const updatedSelectedService = selectedServiceState.map(service => {
      if ((service.serviceId === selectedService.serviceId) && (service.selectedEmployee === selectedService.selectedEmployee)) {
        return {...selectedService}
      }
      return {...service}
    });

    setSelectedServiceStateArray(prevState => [...updatedSelectedService])
  }

  return (
    <SelectedServiceContext.Provider value={{ selectedServiceState, setSelectedServiceState, updateSelectedServiceState }}>
      {children}
    </SelectedServiceContext.Provider>
  );
};