import CardWrapper from '@/components/auth/CardWrapper';
import {ROUTE} from '@/constants/route';
import {useState} from 'react';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

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
import {useNavigate} from 'react-router';

const formSchema = z.object({
  otp: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

const TwoFactorAuthPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async value => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (value.otp !== '123456') {
        form.setError('otp', {
          message: 'Invalid OTP code, please check your email again',
        });
      } else {
        console.log('Submitted: ', value);
        navigate(ROUTE.DASHBOARD, {replace: true});
      }
    } catch (err) {
      form.setError('otp', {
        message: 'Unexpected error, please try again',
      });
      console.log('Error when submitting OTP form: ', err);
    } finally {
      setLoading(false);
    }
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
            <Button type="submit" className="w-full" isLoading={loading}>
              Verify
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default TwoFactorAuthPage;
