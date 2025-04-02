import FormNormalField from '@/components/common/FormNormalField';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import FormSearchField from '@/components/common/FormSearchField';
import FormPhoneField from '@/components/coupon/FormPhoneField';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Input} from '@/components/ui/input';
import {ROUTE} from '@/constants/route';
import {citiesByState} from '@/constants/us-cities-by-state';
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from '@/services/customer';
import {zodResolver} from '@hookform/resolvers/zod';
import {AlertCircle, PencilLine, PlusIcon} from 'lucide-react';
import moment from 'moment-timezone';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router';
import {toast} from 'sonner';
import {z} from 'zod';

const formSchema = z.object({
  firstName: z.string().nonempty('Please enter first name'),
  lastName: z.string(),
  phoneNumber: z.string().nonempty('Please enter phone number'),
  birthDate: z.string().optional().nullable(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
});

const AddCustomerDialog = ({isEdit, data}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      birthDate: '',
      state: '',
      city: '',
      address: '',
      zipCode: '',
    },
  });

  const states = Object.keys(citiesByState);
  const [open, setOpen] = useState(false);
  const [citiesInState, setCitiesInState] = useState([]);

  const cityInputRef = useRef(null);
  const addressInputRef = useRef(null);

  const handleStateSelected = () => {
    if (cityInputRef.current) {
      setTimeout(() => {
        cityInputRef.current.setOpen(true);
      }, 100);
    }
  };

  const handleCitySelected = () => {
    setTimeout(() => {
      if (addressInputRef.current) {
        addressInputRef.current.focus();
      }
    }, 200); //gives the DOM time to update before attempting to focus the element.
  };

  const selectedState = form.watch('state');
  useEffect(() => {
    if (selectedState) {
      setCitiesInState(citiesByState[selectedState] || []);
      if (!isEdit) {
        form.setValue('city', '');
      } else {
        if (selectedState !== data.state) {
          form.setValue('city', '');
        }
      }
    } else {
      setCitiesInState([]);
    }
  }, [selectedState]);

  const formatFetchedPhoneNumber = useCallback(phoneNumber => {
    let digits = phoneNumber.replace(/\D/g, '');

    if (digits.length === 11) {
      return `${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
    }
  }, []);

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        phoneNumber: data.phoneNumber.startsWith('+1')
          ? formatFetchedPhoneNumber(data.phoneNumber)
          : data.phoneNumber,
        birthDate: data.birthDate
          ? moment(data.birthDate).format('YYYY-MM-DD')
          : '',
      });
    }
  }, [data]);

  const {
    phoneNumber,
    birthDate,
    firstName,
    lastName,
    state,
    city,
    address,
    zipCode,
  } = form.watch();

  useEffect(() => {
    if (commonError) {
      setCommonError(null);
    }
  }, [
    phoneNumber,
    birthDate,
    firstName,
    lastName,
    state,
    city,
    address,
    zipCode,
  ]);

  const navigate = useNavigate();
  const [commonError, setCommonError] = useState(null);
  const createCustomerMutation = useCreateCustomerMutation();
  const updateCustomerMutation = useUpdateCustomerMutation(data?._id);

  const loading =
    createCustomerMutation.isPending || updateCustomerMutation.isPending;

  const onContinue = async (values, withNewAppointment = true) => {
    if (withNewAppointment) {
      const canContinue = await form.trigger();
      if (!canContinue) {
        return;
      }
    }

    const handler = isEdit ? updateCustomerMutation : createCustomerMutation;

    handler.mutate(
      {
        ...values,
        phoneNumber: values.phoneNumber.startsWith('+1')
          ? values.phoneNumber.replace(/\s+/g, '')
          : `+1${values.phoneNumber.replace(/\s+/g, '')}`,
        birthDate: values.birthDate ? moment(values.birthDate) : null,
      },
      {
        onSuccess: res => {
          if (res.success) {
            form.reset();
            setOpen(false);
            toast.success(res.message);
            if (withNewAppointment) {
              navigate(ROUTE.APPOINTMENT.ROOT, {
                state: {
                  customerPhoneNumber: res.data.phoneNumber,
                  action: 'new',
                },
              });
            }
          } else {
            setCommonError(res.message);
          }
        },
        onError: err => {
          console.error('Error adding new customer:', err);
          setCommonError(
            err?.response?.data?.message || 'Something went wrong',
          );
        },
      },
    );
  };

  const onSubmit = async values => {
    const now = new Date();

    if (new Date(values.birthDate) > now) {
      setCommonError('Birth date cannot be in the future');
      return;
    }

    await onContinue(values, false);
  };

  const handleOpenChanged = open => {
    setOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChanged}>
      <DialogTrigger asChild>
        <Button variant={isEdit ? 'outline' : 'default'}>
          {isEdit ? <PencilLine /> : <PlusIcon />}
          {isEdit ? 'Edit' : 'Add New Customer'}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col gap-0 overflow-hidden p-0 sm:max-h-[90vh]">
        <DialogHeader className="px-6 py-4">
          <DialogTitle>{isEdit ? 'Edit' : 'Add New'} Customer</DialogTitle>
          {!isEdit ? (
            <DialogDescription>
              Please add a new customer by these information. You cannot add if
              the customer information already exists in the system.
            </DialogDescription>
          ) : (
            <DialogDescription />
          )}
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormNormalField
                form={form}
                name="firstName"
                label="First Name"
                placeholder="Enter first name"
                required
              />

              <FormNormalField
                form={form}
                name="lastName"
                label="Last Name"
                placeholder="Enter last name"
              />

              <FormPhoneField
                form={form}
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter phone number"
                required
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({field}) => (
                  <FormItem className="gap-1">
                    <div className="relative grid grid-cols-5 items-center gap-4">
                      <FormLabel className="col-span-2">
                        Date of Birth
                      </FormLabel>
                      <FormControl className="col-span-3">
                        <Input
                          {...field}
                          type="date"
                          // className="w-full [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2"
                          className="w-full"
                        />
                      </FormControl>
                    </div>
                    <div className="grid grid-cols-5 items-center gap-4">
                      <div className="col-span-2" />
                      <FormMessage className="col-span-3" />
                    </div>
                  </FormItem>
                )}
              />

              <FormSearchField
                form={form}
                name="state"
                label="State"
                placeholder="Select state..."
                searchPlaceholder="Search state..."
                options={states}
                emptyText="No states found."
                onValueSelected={handleStateSelected}
              />

              <FormSearchField
                form={form}
                name="city"
                label="City"
                placeholder="Select city..."
                searchPlaceholder="Search city..."
                options={citiesInState}
                emptyText="No cities found."
                disabled={!selectedState}
                onValueSelected={handleCitySelected}
                ref={cityInputRef}
              />

              <FormNormalField
                form={form}
                name="address"
                label="Address"
                placeholder="Enter address"
                ref={addressInputRef}
              />

              <FormNormalField
                form={form}
                name="zipCode"
                label="Zip Code"
                placeholder="Enter zip code"
                type="number"
              />

              {commonError && (
                <Alert
                  variant="destructive"
                  className="border-red-500 bg-red-50/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{commonError}</AlertDescription>
                </Alert>
              )}

              <DialogFooter className="mt-8">
                <DialogClose
                  className={
                    !isEdit ? 'mr-auto w-full md:w-auto' : 'w-full md:w-auto'
                  }
                  asChild>
                  <Button type="button" variant="ghost" disabled={loading}>
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={loading}
                  variant={isEdit ? 'default' : 'secondary'}>
                  {isEdit ? 'Save' : 'Confirm'}
                </Button>
                {!isEdit && (
                  <Button
                    type="button"
                    onClick={() => onContinue(form.watch(), true)}
                    disabled={loading}>
                    Confirm with new appointment
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
