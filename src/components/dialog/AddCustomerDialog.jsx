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

import {ROUTE} from '@/constants/route';
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from '@/services/customer';
import {zodResolver} from '@hookform/resolvers/zod';
import {AlertCircle, PencilLine, PlusIcon} from 'lucide-react';
import moment from 'moment-timezone';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router';
import {toast} from 'sonner';
import {z} from 'zod';
import {Alert, AlertDescription, AlertTitle} from '../ui/alert';
import {Input} from '../ui/input';

const formSchema = z.object({
  firstName: z.string().nonempty('Please enter first name'),
  lastName: z.string().nonempty('Please enter last name'),
  phoneNumber: z.string().nonempty('Please enter phone number'),
  birthDate: z.string().optional().nullable(),
});

const AddCustomerDialog = ({isEdit, data}) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      birthDate: '2000-01-01',
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        birthDate: data.birthDate
          ? moment(data.birthDate).format('YYYY-MM-DD')
          : '2000-01-01',
      });
    }
  }, [data]);

  const {phoneNumber, birthDate, firstName, lastName} = form.watch();

  useEffect(() => {
    if (commonError) {
      setCommonError(null);
    }
  }, [phoneNumber, birthDate, firstName, lastName]);

  const navigate = useNavigate();
  const [commonError, setCommonError] = useState(null);
  const createCustomerMutation = useCreateCustomerMutation();
  const updateCustomerMutation = useUpdateCustomerMutation(data?._id);

  const loading =
    createCustomerMutation.isPending || updateCustomerMutation.isPending;

  const onContinue = async (values, withNewAppoinment = true) => {
    if (withNewAppoinment) {
      const canContinue = await form.trigger();
      if (!canContinue) {
        return;
      }
    }

    const handler = isEdit ? updateCustomerMutation : createCustomerMutation;

    handler.mutate(
      {
        ...values,
        birthDate: values.birthDate ? moment(values.birthDate) : null,
      },
      {
        onSuccess: res => {
          if (res.success) {
            form.reset();
            setOpen(false);
            toast.success(res.message);
            if (withNewAppoinment) {
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
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>{isEdit ? 'Edit' : 'Add New'} Customer</DialogTitle>
          {!isEdit && (
            <DialogDescription>
              Please add a new customer by these information. You cannot add if
              the customer information already exists in the system.
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormNormalField
              form={form}
              name="firstName"
              label="Customer First Name"
              placeholder="Enter customer first name"
            />

            <FormNormalField
              form={form}
              name="lastName"
              label="Customer Last Name"
              placeholder="Enter customer last name"
            />

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
                    <FormLabel className="col-span-2">Date of Birth</FormLabel>
                    <FormControl className="col-span-3">
                      <div className="relative">
                        <Input {...field} type="date" className="w-full" />
                      </div>
                    </FormControl>
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
              {!isEdit && (
                <Button
                  type="button"
                  onClick={() => onContinue(form.watch(), true)}
                  disabled={loading}>
                  Confirm with new appointment
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                variant={isEdit ? 'default' : 'secondary'}>
                {isEdit ? 'Save' : 'Confirm'}
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

export default AddCustomerDialog;
