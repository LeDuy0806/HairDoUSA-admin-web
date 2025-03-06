import OptionDropdown from '@/components/common/OptionDropdown';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Switch} from '@/components/ui/switch';
import {CalendarDays} from 'lucide-react';

const CouponCard = ({title, description, validFrom, expiredDate}) => {
  return (
    <Card className="w-full pt-3">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p className="line-clamp-1">{title}</p>
          <OptionDropdown />
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="my-3 justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <CalendarDays className="text-muted-foreground h-4 w-4" />
            <p className="text-muted-foreground text-sm">From: {validFrom}</p>
          </div>
          <div className="flex gap-2">
            <CalendarDays className="text-muted-foreground h-4 w-4" />
            <p className="text-muted-foreground text-sm">To: {expiredDate}</p>
          </div>
        </div>
        <Switch className="cursor-pointer self-end" />
      </CardFooter>
    </Card>
  );
};

export default CouponCard;
