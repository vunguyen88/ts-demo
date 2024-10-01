"use client";
import { useEffect, useState } from "react";
import { Typography, Card, CardBody, Input, Radio, Textarea, Button } from "@material-tailwind/react";
import { Address, BusinessHours } from "@/types/location";
import { displayUSFormatPhoneNumber, getLocationIsClosedDay, convertNumberToTime } from "@/lib/utils/helper";

interface ContactFormPropsType {
  address: Address | undefined;
  locationBlockedDays: string[];
  closedDays: number[];
  businessHours: BusinessHours;
  phoneNumber: string;
}

interface InfoAreaPropsType {
  title: string;
  description: React.ReactNode;
  icon: {
    name: "clock" | "phone" | "location";
    stroke?: string;
    size?: string;
    fill?: string;
  };
}

function InfoArea(props: InfoAreaPropsType) {
  const iconName = {
    "clock":  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke={props.icon.stroke?props.icon.stroke:''} className={`size-9`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>,
    "phone":  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={props.icon.stroke?props.icon.stroke:''} className={`size-9`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>,
    "location": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={props.icon.stroke?props.icon.stroke:''} className={`size-9`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
  }

  return (
    <div className="flex my-4">
      {iconName[props.icon.name]}
      <div className="pl-[1rem]">
        {/* @ts-ignore */}
        <Typography variant="h5">{props.title}</Typography>
        {/* @ts-ignore */}
        <div className="pt-[.75rem]">{props.description}</div>
      </div>
    </div>
  )
}

function ContactForm({address, phoneNumber, closedDays, locationBlockedDays, businessHours}: ContactFormPropsType) {
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState<string>('');

  useEffect(() => {
    // Ensure the phone number is formatted only on the client side
    setFormattedPhoneNumber(displayUSFormatPhoneNumber(phoneNumber));
  }, [phoneNumber]);

  return (
    <div className="container mx-auto mt-[4rem] mb-[3rem]">
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col ml-[4%] md:ml-[10%]">
          <InfoArea 
            title="Find us at" 
            description={
              <span>
                {address!.street},
                <br /> {address!.city}, {address!.state} - {address!.zipCode}
              </span>
            }
            icon={{name: "location", stroke: 'red', size: '9' }}
          />

          <InfoArea 
            title="Give us a call" 
            description={
              <span>
                +1 {displayUSFormatPhoneNumber(formattedPhoneNumber!)}
              </span>
            }
            icon={{name: "phone", stroke: 'purple', size: '9' }}
          />

          <InfoArea 
            title="Opening hours" 
            description={
              <div className="container grid gap-3 grid-cols-1 grid-cols-2">
                <div className={`font-${new Date().getDay() === 0 ? 'bold' : 'normal'}`}>Sunday</div>
                <span className={`font-${new Date().getDay() === 0 ? 'bold' : 'normal'}`}>{!getLocationIsClosedDay(closedDays, locationBlockedDays, 0)[0] ? `${convertNumberToTime(businessHours['0'].from)} - ${convertNumberToTime(businessHours['0'].to)}` : 'Closed'}</span>
                <div className={`font-${new Date().getDay() === 1 ? 'bold' : 'normal'}`}>Monday</div>
                <span className={`font-${new Date().getDay() === 1 ? 'bold' : 'normal'}`}>{!getLocationIsClosedDay(closedDays, locationBlockedDays, 1)[0] ? `${convertNumberToTime(businessHours['0'].from)} - ${convertNumberToTime(businessHours['0'].to)}` : 'Closed'}</span>
                <div className={`font-${new Date().getDay() === 2 ? 'bold' : 'normal'}`}>Tuesday</div>
                <span className={`font-${new Date().getDay() === 2 ? 'bold' : 'normal'}`}>{!getLocationIsClosedDay(closedDays, locationBlockedDays, 2)[0] ? `${convertNumberToTime(businessHours['0'].from)} - ${convertNumberToTime(businessHours['0'].to)}` : 'Closed'}</span>
                <div className={`font-${new Date().getDay() === 3 ? 'bold' : 'normal'}`}>Wednesday</div>
                <span className={`font-${new Date().getDay() === 3 ? 'bold' : 'normal'}`}>{!getLocationIsClosedDay(closedDays, locationBlockedDays, 3)[0] ? `${convertNumberToTime(businessHours['0'].from)} - ${convertNumberToTime(businessHours['0'].to)}` : 'Closed'}</span>
                <div className={`font-${new Date().getDay() === 4 ? 'bold' : 'normal'}`}>Thursday</div>
                <span className={`font-${new Date().getDay() === 4 ? 'bold' : 'normal'}`}>{!getLocationIsClosedDay(closedDays, locationBlockedDays, 4)[0] ? `${convertNumberToTime(businessHours['0'].from)} - ${convertNumberToTime(businessHours['0'].to)}` : 'Closed'}</span>
                <div className={`font-${new Date().getDay() === 5 ? 'bold' : 'normal'}`}>Friday</div>
                <span className={`font-${new Date().getDay() === 5 ? 'bold' : 'normal'}`}>{!getLocationIsClosedDay(closedDays, locationBlockedDays, 5)[0] ? `${convertNumberToTime(businessHours['0'].from)} - ${convertNumberToTime(businessHours['0'].to)}` : 'Closed'}</span>
                <div className={`font-${new Date().getDay() === 6 ? 'bold' : 'normal'}`}>Saturday</div>
                <span className={`font-${new Date().getDay() === 6 ? 'bold' : 'normal'}`}>{!getLocationIsClosedDay(closedDays, locationBlockedDays, 6)[0] ? `${convertNumberToTime(businessHours['0'].from)} - ${convertNumberToTime(businessHours['0'].to)}` : 'Closed'}</span>
              </div>
            }
            icon={{name: "clock", stroke: 'teal', size: '9' }}
          />
        </div>
        
        <div className={`flex flex-col ml-3 md:ml-0 mr-3 md:mr-[10%]`}>
          {/* @ts-ignore */}
          <Typography color="blue-gray" variant="h5" className="mb-[2rem]">
            Having question about our products or services?
          </Typography>
          {/* @ts-ignore */}
          <Card shadow={true} className="container mx-auto border border-gray/50">
          {/* @ts-ignore */}
          <CardBody className="grid grid-cols-1">
            <div className="w-full mt-8 md:mt-0 md:px-10 col-span-4 h-full p-5">
              <form action="#">
                {/* @ts-ignore */}
                <Input
                  color="gray"
                  size="lg"
                  variant="static"
                  label="Name"
                  name="first-name"
                  placeholder="eg. John"
                  containerProps={{
                    className: "!min-w-full mb-8",
                  }}
                />
                {/* @ts-ignore */}
                <Input
                  color="gray"
                  size="lg"
                  variant="static"
                  label="Email"
                  name="first-name"
                  placeholder="eg. jdoe@mail.com"
                  containerProps={{
                    className: "!min-w-full mb-8",
                  }}
                />
                {/* @ts-ignore */}
                <Input
                  color="gray"
                  size="lg"
                  variant="static"
                  label="Phone"
                  name="first-name"
                  placeholder="eg. (111) 111-1111"
                  containerProps={{
                    className: "!min-w-full mb-8",
                  }}
                />
                <Typography
                  variant="lead"
                  className="!text-blue-gray-500 text-sm mb-2"
                  onPointerEnterCapture={() => {}} 
                  onPointerLeaveCapture={() => {}} 
                  placeholder
                >
                  What are you interested on?
                </Typography>
                <div className="-ml-3 mb-14 ">
                  {/* @ts-ignore */}
                  <Radio
                    color="gray"
                    name="type"
                    label="Product"
                    defaultChecked
                  />
                  {/* @ts-ignore */}
                  <Radio color="gray" name="type" label="Service" />
                  {/* @ts-ignore */}
                  <Radio color="gray" name="type" label="Pricing" />
                  {/* @ts-ignore */}
                  <Radio color="gray" name="type" label="Other" />
                </div>
                {/* @ts-ignore */}
                <Textarea
                  color="gray"
                  size="lg"
                  variant="static"
                  label="Your Message"
                  name="first-name"
                  containerProps={{
                    className: "!min-w-full mb-8",
                  }}
                />
                <div className="w-full flex justify-end">
                  <Button className="w-full md:w-fit" color="gray" size="md" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
                    Send message
                  </Button>
                </div>
              </form>
            </div>
          </CardBody>
        </Card>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;