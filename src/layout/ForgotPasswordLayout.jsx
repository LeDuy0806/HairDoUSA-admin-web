import {ROUTE} from '@/constants/route';
import {useAuthContext} from '@/context/AuthContext';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader} from 'lucide-react';
import {useEffect} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {Outlet} from 'react-router';
import {z} from 'zod';

const PASSWORD_MIN_LENGTH = 6;

const formSchema = z
  .object({
    email: z
      .string()
      .email({
        message: 'Please enter a valid email address',
      })
      .or(z.literal('')),

    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      })
      .or(z.literal('')),

    confirmPassword: z
      .string()
      .nonempty('Please confirm your new password')
      .or(z.literal('')),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Confirm password does not match',
    path: ['confirmPassword'],
  });

const ForgotPasswordLayout = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const {isAuthenticated, isLoadingUser} = useAuthContext();

  useEffect(() => {
    if (isAuthenticated && !isLoadingUser) {
      location.href = ROUTE.DASHBOARD;
    }
  }, [isAuthenticated, isLoadingUser]);

  return isLoadingUser ? (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  ) : (
    <div className="flex h-screen w-full">
      <div className="w-1/2">
        <img
          src="/assets/images/frontdoor.webp"
          alt="HairDo Frontdoor"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <FormProvider {...form}>
          <Outlet />
        </FormProvider>
      </div>
    </div>
  );
};

export default ForgotPasswordLayout;
