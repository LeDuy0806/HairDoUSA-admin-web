import CardWrapper from '@/components/auth/CardWrapper';
import {ROUTE} from '@/constants/route';

import {useFormContext} from 'react-hook-form';

import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';
import {useVerifyLoginOtpMutation} from '@/services/auth';
import {useEffect} from 'react';
import {useNavigate} from 'react-router';
import {toast} from 'sonner';

const TwoFactorAuthPage = () => {
  const navigate = useNavigate();

  const form = useFormContext();
  const {email, otp} = form.watch();

  useEffect(() => {
    if (!email) {
      navigate(ROUTE.AUTH.LOGIN, {replace: true});
    }
  }, [email]);

  const verifyLoginOtpMutation = useVerifyLoginOtpMutation();
  const loading = verifyLoginOtpMutation.isPending;

  const onSubmit = async value => {
    verifyLoginOtpMutation.mutate(
      {
        email,
        otp: value.otp,
      },
      {
        onSuccess: async res => {
          if (res.success) {
            toast.success(res.message);
            location.href = ROUTE.DASHBOARD;
          } else {
            form.setError('otp', res.message);
          }
        },
        onError: err => {
          form.setError('otp', {
            message:
              err?.response?.data?.message ||
              'Unexpected error, please try again',
          });
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md">
      <CardWrapper
        title="2-step verification"
        description="This step is to ensure your website’s security. Please contact admin if you want to unable."
        backButtonHref={ROUTE.AUTH.LOGIN}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="otp"
              render={({field}) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="mb-2 self-start">OTP Code</FormLabel>
                  <FormControl>
                    <InputOTP
                      autoFocus
                      className="w-full"
                      maxLength={6}
                      {...field}>
                      <InputOTPGroup>
                        {Array.from({length: 6}).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-center text-sm">
                    Enter your OTP Code which has been sent to your email
                    address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
              disabled={otp?.length < 6 || loading}>
              Verify
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default TwoFactorAuthPage;
