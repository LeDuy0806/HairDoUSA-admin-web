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
    <Card className="shadow-lg m-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter />
    </Card>
  );
};

export default CardWrapper;
