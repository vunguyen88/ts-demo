"use client"
// contexts/MyContext.tsx
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface SelectedServiceState {
  title?: string, 
  description?: string,
  serviceTime: number,
  price?: number,
  serviceId: string,
  selectedEmployee: string;
}

// Define the type for the context
interface SelectedServiceContextProps {
  selectedServiceState: SelectedServiceState[];
  setSelectedServiceState: (selectedService: SelectedServiceState) => void;
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

  return (
    <SelectedServiceContext.Provider value={{ selectedServiceState, setSelectedServiceState }}>
      {children}
    </SelectedServiceContext.Provider>
  );
};