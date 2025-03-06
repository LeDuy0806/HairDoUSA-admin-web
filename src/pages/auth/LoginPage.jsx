import CardWrapper from '@/components/auth/CardWrapper';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import InputPassword from '@/components/ui/input-password';
import {ROUTE} from '@/constants/route';
import {useLoginMutation} from '@/services/auth';
import {AlertCircle} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {useNavigate} from 'react-router';
import {toast} from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();

  const form = useFormContext();

  const [commonError, setCommonError] = useState(null);
  const loginMutation = useLoginMutation();

  const loading = loginMutation.isPending;

  const {email, password} = form.watch();

  useEffect(() => {
    if (commonError) {
      setCommonError(null);
    }
  }, [email, password]);

  const onSubmit = async values => {
    loginMutation.mutate(
      {
        account: values.email,
        password: values.password,
      },
      {
        onSuccess: res => {
          if (res.success) {
            navigate(ROUTE.AUTH.TWO_FACTOR_AUTH, {
              replace: true,
            });
            toast.success(res.message);
          } else {
            setCommonError(res.message);
          }
        },
        onError: err => {
          setCommonError(
            err?.response?.data?.message ??
              'Unexpected error, please try again',
          );
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md">
      <CardWrapper
        title="Login"
        description="Please use your admin account to login">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        {...field}
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {commonError && (
              <Alert
                variant="destructive"
                className="border-red-500 bg-red-50/50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{commonError}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" isLoading={loading}>
              Continue
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default LoginPage;
