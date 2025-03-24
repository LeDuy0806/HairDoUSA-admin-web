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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {ROUTE} from '@/constants/route';
import useDebounce from '@/hooks/use-debounce';
import {cn} from '@/lib/utils';
import {useCreateAppointmentMutation} from '@/services/appointment';
import {useGetAllCustomersQuery} from '@/services/customer';
import {formatUSPhoneNumber} from '@/utils/PhoneNumberFormatter';
import {zodResolver} from '@hookform/resolvers/zod';
import {AlertCircle, Loader, PlusIcon} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router';
import {toast} from 'sonner';
import {z} from 'zod';
import {Alert, AlertDescription, AlertTitle} from '../ui/alert';
import {Input} from '../ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover';
import {ScrollArea} from '../ui/scroll-area';

const formSchema = z.object({
  phoneNumber: z.string().nonempty('Please select a customer'),
  subtotal: z.coerce
    .number({
      required_error: 'Please enter subtotal',
      invalid_type_error: 'Please enter subtotal',
    })
    .nonnegative('Please enter a valid number'),
});

const AddAppointmentDialog = ({phoneNumber, defaultOpen}) => {
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const debouncedValue = useDebounce(value, 500);

  const createAppointmentMutation = useCreateAppointmentMutation();
  const getAllCustomersQuery = useGetAllCustomersQuery({
    phoneNumber: debouncedValue?.replace('+', ''),
    select: 'firstName,lastName,phoneNumber',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (defaultOpen) {
      setOpen(defaultOpen);
    }
  }, [defaultOpen]);

  useEffect(() => {
    if (selectedCustomer) {
      form.setValue('phoneNumber', selectedCustomer);
    }
  }, [selectedCustomer]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
      subtotal: 0,
    },
  });

  useEffect(() => {
    if (phoneNumber) {
      form.reset({
        phoneNumber,
      });
      setSelectedCustomer(phoneNumber);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (commonError) {
      setCommonError(null);
    }
  }, [phoneNumber]);

  const [commonError, setCommonError] = useState(null);

  const loading = createAppointmentMutation.isPending;

  const foundCustomers = useMemo(
    () => getAllCustomersQuery.data?.data?.items ?? [],
    [getAllCustomersQuery.data],
  );

  const selectedCustomerIns = useMemo(
    () => foundCustomers.find(c => c.phoneNumber === selectedCustomer),
    [selectedCustomer],
  );

  const onConfirm = async (values, processPayment = false) => {
    if (processPayment) {
      const canContinue = await form.trigger();

      if (!canContinue) {
        return;
      }
    }

    createAppointmentMutation.mutate(
      {
        phoneNumber: values.phoneNumber,
        subtotal: Number(values.subtotal),
      },
      {
        onSuccess: res => {
          if (res.success) {
            form.reset();
            setSelectedCustomer(null);
            toast.success('Appointment created successfully');
            setOpen(false);
            if (processPayment) {
              navigate(ROUTE.APPOINTMENT.PAYMENT(res.data._id));
            }
          } else {
            setCommonError(res.message);
          }
        },
        onError: err => {
          setCommonError(err?.response?.data?.message ?? 'An error occurred');
        },
      },
    );
  };

  const onSubmit = async values => {
    await onConfirm(values);
  };

  const handleOpenChanged = open => {
    setOpen(open);
    if (!open) {
      form.reset();
      setSelectedCustomer(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChanged}>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusIcon />
          Add New Appointment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Add New Appointment</DialogTitle>
          <DialogDescription>
            Please enter the phone number of the customer to add a new
            appointment and apply the coupon if available.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={() => (
                <FormItem className="gap-1">
                  <div className="grid grid-cols-10 items-center gap-4 sm:grid-cols-5">
                    <FormLabel className="col-span-4 sm:col-span-1">
                      Customer <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            form.formState.errors['phoneNumber'] &&
                              'border-destructive focus-visible:ring-destructive',
                            'col-span-6 line-clamp-1 w-full justify-start px-1 text-start sm:col-span-4 sm:px-4',
                          )}>
                          {selectedCustomer
                            ? `${selectedCustomerIns?.firstName} ${selectedCustomerIns?.lastName} (${formatUSPhoneNumber(selectedCustomer)})`
                            : 'Select Customer'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="space-y-2">
                        <Input
                          value={value}
                          onChange={e => setValue(e.target.value)}
                        />
                        <ScrollArea className="flex max-h-60 flex-col items-center gap-1">
                          {getAllCustomersQuery.isFetching && (
                            <Loader className="size-4 animate-spin" />
                          )}
                          {foundCustomers.length > 0 ? (
                            foundCustomers.map(customer => (
                              <Button
                                variant="outline"
                                key={customer._id}
                                className="w-full justify-start"
                                onClick={() => {
                                  setSelectedCustomer(customer.phoneNumber);
                                }}>
                                <p className="line-clamp-1">
                                  {/* {customer.lastName} - {customer.phoneNumber} */}
                                  {customer.firstName} {customer.lastName} (
                                  {formatUSPhoneNumber(customer.phoneNumber)})
                                </p>
                              </Button>
                            ))
                          ) : (
                            <span className="mt-2 text-sm">
                              No customers found.
                            </span>
                          )}
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-10 items-center gap-4 sm:grid-cols-5">
                    <div className="col-span-4 sm:col-span-1" />
                    <FormMessage className="col-span-6 sm:col-span-4" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtotal"
              render={({field}) => (
                <FormItem className="gap-1">
                  <div className="grid grid-cols-10 items-center gap-4 sm:grid-cols-5">
                    <FormLabel className="col-span-4 sm:col-span-1">
                      Subtotal <span className="text-red-500">*</span>
                    </FormLabel>
                    <Input
                      {...field}
                      className={cn(
                        form.formState.errors['subtotal'] &&
                          'border-destructive focus-visible:ring-destructive',
                        'col-span-6 sm:col-span-4',
                      )}
                      placeholder="Enter subtotal"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="grid grid-cols-10 items-center gap-4 sm:grid-cols-5">
                    <div className="col-span-4 sm:col-span-1" />
                    <FormMessage className="col-span-6 sm:col-span-4" />
                  </div>
                </FormItem>
              )}
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

            <DialogFooter className="mt-8 justify-end">
              <DialogClose className="mr-auto w-full md:w-auto" asChild>
                <Button type="button" variant="ghost" disabled={loading}>
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading} variant="secondary">
                Confirm
              </Button>
              <Button
                type="button"
                disabled={loading}
                variant="default"
                onClick={() => onConfirm(form.watch(), true)}>
                Confirm and process payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentDialog;
