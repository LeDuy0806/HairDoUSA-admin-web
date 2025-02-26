import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {ChevronLeft} from 'lucide-react';
import {useNavigate} from 'react-router';

const CardWrapper = ({title, description, backButtonHref, children}) => {
  const navigate = useNavigate();

  return (
    <Card className="m-8 shadow-lg">
      {backButtonHref && (
        <Button
          variant="ghost"
          size="icon"
          className="mx-6"
          onClick={() => navigate(backButtonHref, {replace: true})}>
          <ChevronLeft className="" />
        </Button>
      )}
      <CardHeader className="pb-6">
        <CardTitle className="text-center text-2xl font-semibold">
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="pb-6" />
    </Card>
  );
};

export default CardWrapper;
