import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {CalendarDays} from 'lucide-react';

const CouponCard = ({title, description, validFrom, expiredDate}) => {
  return (
    <Card className="w-full cursor-pointer">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-start gap-3 my-3">
        <div className="flex gap-2">
          <CalendarDays className="text-muted-foreground h-4 w-4" />
          <p className="text-muted-foreground text-sm">From: {validFrom}</p>
        </div>
        <div className="flex gap-2">
          <CalendarDays className="text-muted-foreground h-4 w-4" />
          <p className="text-muted-foreground text-sm">To: {expiredDate}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CouponCard;
