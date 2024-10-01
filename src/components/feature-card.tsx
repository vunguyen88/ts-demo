import {
    Typography,
    Card,
    CardBody,
  } from "@material-tailwind/react";
  
  
  interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    color: string;
    children: React.ReactNode;
  }
  
  export function FeatureCard({ icon: Icon, title, color, children }: FeatureCardProps) {
    return (
      <Card color="transparent" shadow={false} onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
        <CardBody className="flex justify-start" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
          <div className="mb-4 grid h-6 w-6 place-content-center rounded-lg p-2.5 text-left text-white">
            <Icon color={color} className="h-7 w-7" />
          </div>
          <div className="ml-3">
          <Typography variant="h5" color="blue-gray" className="mb-2" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
            {title}
          </Typography>
          <Typography className=" font-normal !text-gray-500" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} placeholder>
            {children}
          </Typography>
          </div>
          
        </CardBody>
      </Card>
    );
  }

  export default FeatureCard;
  