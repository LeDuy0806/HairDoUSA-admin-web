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
import InputPassword from '@/components/ui/input-password';
import {ROUTE} from '@/constants/route';
import {useResetPasswordMutation} from '@/services/auth';
import {AlertCircle} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {useLocation, useNavigate} from 'react-router';
import {toast} from 'sonner';

const ResetPassword = () => {
  const navigate = useNavigate();

  const form = useFormContext();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const [commonError, setCommonError] = useState(null);
  const resetPasswordMutation = useResetPasswordMutation();

  const loading = resetPasswordMutation.isPending;

  const {newPassword, confirmPassword} = form.watch();

  useEffect(() => {
    if (commonError) {
      setCommonError(null);
    }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (!token) {
      location.href = ROUTE.AUTH.LOGIN;
    }
  }, [token]);

  const onSubmit = async values => {
    if (values.newPassword === '') {
      form.setError('newPassword', {
        message: 'Please enter your new password',
      });
      return;
    }

    if (values.confirmPassword === '') {
      form.setError('confirmPassword', {
        message: 'Please confirm your new password',
      });
      return;
    }

    resetPasswordMutation.mutate(
      {
        token,
        newPassword: values.newPassword,
      },
      {
        onSuccess: res => {
          if (res.success) {
            navigate(ROUTE.AUTH.LOGIN, {
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
        title="Update Password"
        description="Set new password for the account">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="newPassword"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      New Password <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="Enter your new password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      Confirm New Password{' '}
                      <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="Confirm your new password"
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

export default ResetPassword;
