import React, { useState, useEffect } from 'react';

import {
  Card,
  CardBody,
} from "@material-tailwind/react";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useSelectedServiceContext } from '@/hooks/useSelectedServiceContext';

interface ServiceAppointmentCardProps {
  // icon: React.ElementType;
  title: string;
  description?: string;
  serviceTime: number;
  price?: number;
  isSelected: boolean;
  serviceId: string;
  selectedEmployee: string;
  //serviceDescription: React.ReactNode;
}

export function ServiceAppointmentCard({ 
  //icon: Icon, 
  title, 
  description,
  serviceTime,
  price,
  serviceId,
  selectedEmployee
}: ServiceAppointmentCardProps) {
  const [showDescription, setShowDescription] = useState(true);
  const { selectedServiceState, setSelectedServiceState } = useSelectedServiceContext();
  
  // update appointment context when user click on appointment service card 
  const onServicePick = () => {
    setSelectedServiceState({serviceId, title, description, price, serviceTime, selectedEmployee});
  }

  const toggleDescription = () => {
    setShowDescription(!showDescription)
  }

  // check whether service is selected by check component serviceId is in selectedServiceState context 
  const selectedServiceId = selectedServiceState.map(service => service.serviceId);
  const isEmployeeSelect = selectedServiceState.find(service => service.selectedEmployee === selectedEmployee)
  const isSelected = selectedServiceId.includes(serviceId) && isEmployeeSelect;

  return (
    <Card className={`border border-gray-300 shadow-sm ${isSelected ? 'bg-blue-700' : ''}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      {/* @ts-ignore */}
      <CardBody className={`grid p-4`}>
        <div className="flex cursor-pointer items-center" onClick={onServicePick}>
          <div className={`ml-0`}>
            <p color="blue-gray" className={`font-normal ${isSelected ? 'text-white ' : 'text-black'}`}>
              {title}
            </p>
          </div>
          <div className="flex items-center ml-auto mr-2">
            <p className={`text-xs font-normal ${isSelected ? 'text-white ' : 'text-black'}`}>
              ${price} - &nbsp;
            </p>
            <p className={`text-xs font-normal ${isSelected ? 'text-white' : 'text-black'}`}>
              {serviceTime} minutes
            </p>
          </div>
        </div>
        
        {
          description && (
            <div>
              <div className="flex items-center justify-start cursor-pointer my-2" onClick={toggleDescription}>
                <p className={`text-xs ${isSelected ? 'text-white' : 'text-black'}`}>
                  Description
                </p>
                {
                  showDescription 
                    ? <ChevronUpIcon strokeWidth={2} className={`text-xs font-normal pl-1 h-4 w-5 ml-1 ${isSelected ? 'text-white ' : 'text-black'}`} />
                    : <ChevronDownIcon strokeWidth={2} className={`text-xs font-normal pl-1 h-4 w-5 ml-1 ${isSelected ? 'text-white ' : 'text-black'}`}  />
                }
                </div>
                  {
                    showDescription && (
                      <div className="flex mr-1">
                        <p className={`text-xs font-normal ${isSelected ? 'text-white' : 'text-black'} leading-[120%] text-justify`}>
                            {description}
                        </p>
                      </div>)
                  }
            </div>
          )
        }
      </CardBody>
    </Card>
  );
}

export default ServiceAppointmentCard;
