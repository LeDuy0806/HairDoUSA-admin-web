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

import {useGetAllCouponsQuery} from '@/services/coupon';
import {zodResolver} from '@hookform/resolvers/zod';
import {AlertCircle, PlusIcon} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Alert, AlertDescription, AlertTitle} from '../ui/alert';
import {Select, SelectTrigger, SelectValue} from '../ui/select';

const formSchema = z.object({
  phoneNumber: z.string().nonempty('Please enter phone number'),
});

const AddAppointmentDialog = ({phoneNumber, defaultOpen}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (defaultOpen) {
      setOpen(defaultOpen);
    }
  }, [defaultOpen]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
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
  const getAllCouponsQuery = useGetAllCouponsQuery();
  const coupons = useMemo(
    () => getAllCouponsQuery.data?.data ?? [],
    [getAllCouponsQuery.data],
  );

  console.log(coupons);

  const loading = false;

  const onSubmit = async values => {};

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
            <FormNormalField
              form={form}
              name="phoneNumber"
              label="Phone number"
              placeholder="Enter phone number"
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({field}) => (
                <FormItem className="gap-1">
                  <div className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-2">Coupon</FormLabel>
                    <Select {...field}>
                      <FormControl className="col-span-3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a coupon" />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
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
              <Button type="submit" disabled={loading} variant="default">
                Confirm
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={loading}>
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
