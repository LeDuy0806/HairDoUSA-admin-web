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
import {useCreateAppointmentMutation} from '@/services/appointment';
import {useGetAllCustomersQuery} from '@/services/customer';
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

const formSchema = z.object({
  phoneNumber: z.string().nonempty('Please enter phone number'),
  subtotal: z.coerce.number().nonnegative('Please enter a valid number'),
});

const AddAppointmentDialog = ({phoneNumber, defaultOpen}) => {
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const debouncedValue = useDebounce(value, 500);

  const creatAppointmentMutation = useCreateAppointmentMutation();
  const getAllCustomersQuery = useGetAllCustomersQuery({
    phoneNumber: debouncedValue?.replace('+', ''),
    select: 'lastName,phoneNumber',
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
      subtototal: 0,
    },
  });

  useEffect(() => {
    if (phoneNumber) {
      form.reset({
        phoneNumber,
      });
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (commonError) {
      setCommonError(null);
    }
  }, [phoneNumber]);

  const [commonError, setCommonError] = useState(null);

  const loading = creatAppointmentMutation.isPending;

  const foundCustomers = useMemo(
    () => getAllCustomersQuery.data?.data?.items ?? [],
    [getAllCustomersQuery.data],
  );

  const selectedCustomerIns = useMemo(
    () => foundCustomers.find(c => c.phoneNumber === selectedCustomer),
    [foundCustomers, selectedCustomer],
  );

  const onConfirm = async (values, processPayment = false) => {
    if (processPayment) {
      const canContinue = await form.trigger();

      if (!canContinue) {
        return;
      }
    }

    creatAppointmentMutation.mutate(values, {
      onSuccess: res => {
        if (res.success) {
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
    });
  };

  const onSubmit = async values => {
    await onConfirm(values);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={() => (
                <FormItem className="gap-1">
                  <div className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-2">Customer</FormLabel>
                    <Popover className="col-span-3">
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="col-span-3 w-full justify-start">
                          {selectedCustomer
                            ? `${selectedCustomerIns?.lastName} - ${selectedCustomer}`
                            : 'Select Customer'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="space-y-2">
                        <Input
                          value={value}
                          onChange={e => setValue(e.target.value)}
                        />
                        <div className="flex max-h-60 flex-col items-center gap-1 overflow-auto">
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
                                  {customer.lastName} - {customer.phoneNumber}
                                </p>
                              </Button>
                            ))
                          ) : (
                            <span className="mt-2 text-sm">
                              No customers found
                            </span>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-5 items-center gap-4">
                    <div className="col-span-2" />
                    <FormMessage className="col-span-3" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtotal"
              render={({field}) => (
                <FormItem className="gap-1">
                  <div className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-2">Subtotal</FormLabel>
                    <Input
                      {...field}
                      className="col-span-3"
                      placeholder="Enter subtotal"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="grid grid-cols-5 items-center gap-4">
                    <div className="col-span-2" />
                    <FormMessage className="col-span-3" />
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

            <DialogFooter className="justify-end gap-2">
              <Button
                type="button"
                disabled={loading}
                variant="default"
                onClick={() => onConfirm(form.watch(), true)}>
                Confirm and process payment
              </Button>
              <Button type="submit" disabled={loading} variant="secondary">
                Confirm
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={loading}>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentDialog;
