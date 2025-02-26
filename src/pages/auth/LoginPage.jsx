import { useState } from 'react';
import CardWrapper from '@/components/auth/CardWrapper';
import { useForm } from 'react-hook-form';
import {useNavigate} from 'react-router';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ROUTE } from '@/constants/route';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),

  password: z.string().min(1, {
    message: 'Please enter your password.',
  }),
});

const LoginPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitted: ', values);
      navigate(ROUTE.AUTH.TWO_FACTOR_AUTH);

      // Navigate or handle success
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
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
                      <Input {...field} placeholder="Enter your email" />
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
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
