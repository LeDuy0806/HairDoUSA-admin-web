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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {cn} from '@/lib/utils';
import {useCreateAdminMutation, useUpdateAdminMutation} from '@/services/user';
import {zodResolver} from '@hookform/resolvers/zod';
import {AlertCircle, PencilLine, PlusIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {z} from 'zod';
import {Alert, AlertDescription, AlertTitle} from '../ui/alert';
import InputPassword from '../ui/input-password';

const formSchema = z
  .object({
    name: z.string().nonempty('Please enter first name'),
    email: z
      .string()
      .nonempty('Please enter email address')
      .email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional()
      .nullable()
      .or(z.literal('')),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional()
      .nullable()
      .or(z.literal('')),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password and confirm password must be the same',
    path: ['confirmPassword'],
  });

const AddAdminDialog = ({isEdit, data}) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  const {name, email, password, confirmPassword} = form.watch();

  useEffect(() => {
    if (commonError) {
      setCommonError(null);
    }
  }, [email, name, password, confirmPassword]);

  const [commonError, setCommonError] = useState(null);
  const createAdminMutation = useCreateAdminMutation();
  const updateAdminMutation = useUpdateAdminMutation(data?._id);

  const loading =
    createAdminMutation.isPending || updateAdminMutation.isPending;

  const onSubmit = async values => {
    const handler = isEdit ? updateAdminMutation : createAdminMutation;

    handler.mutate(values, {
      onSuccess: res => {
        if (res.success) {
          form.reset();
          setOpen(false);
          toast.success(res.message);
        } else {
          setCommonError(res.message);
        }
      },
      onError: err => {
        console.error('Error adding new admin:', err);
        setCommonError(err?.response?.data?.message || 'Something went wrong');
      },
    });
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
          {isEdit ? 'Edit' : 'Add New Admin'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Please add a new admin by these information. You cannot add if the
            admin information already exists in the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormNormalField
              form={form}
              name="name"
              label="Admin Name"
              placeholder="Enter admin name"
              required
            />

            <FormNormalField
              form={form}
              name="email"
              label="Email"
              placeholder="Enter email"
              required
            />

            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem className="gap-1">
                  <div className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-2">Password</FormLabel>
                    <FormControl className="col-span-3">
                      <div className="relative">
                        <InputPassword
                          {...field}
                          placeholder="Enter your password"
                          className={cn(
                            form.formState.errors['password'] &&
                              'border-destructive focus-visible:ring-destructive',
                            '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                          )}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <div className="grid grid-cols-5 items-center gap-2">
                    <div className="col-span-2" />
                    <FormDescription className="col-span-3 pl-2 text-xs">
                      Default password is 123456
                    </FormDescription>
                    <div className="col-span-2" />
                    <FormMessage className="col-span-3" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({field}) => (
                <FormItem className="gap-1">
                  <div className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-2">
                      Confirm Password
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <div className="relative">
                        <InputPassword
                          {...field}
                          placeholder="Re-enter your password"
                          className={
                            form.formState.errors['confirmPassword']
                              ? 'border-destructive focus-visible:ring-destructive'
                              : ''
                          }
                        />
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

            <DialogFooter className="mt-8 justify-end">
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={loading}>
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" isLoading={loading} variant="default">
                {isEdit ? 'Save' : 'Confirm'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminDialog;
