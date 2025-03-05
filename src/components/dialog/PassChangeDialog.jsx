import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {zodResolver} from '@hookform/resolvers/zod';
import {Eye, EyeOff} from 'lucide-react';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

const PASSWORD_MIN_LENGTH = 6;

const formSchema = z
  .object({
    currentPassword: z.string().nonempty('Please enter your current password'),
    newPassword: z.string().min(PASSWORD_MIN_LENGTH, {
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    }),
    confirmPassword: z.string().nonempty('Please confirm your new password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Confirm password does not match',
    path: ['confirmPassword'],
  });

const GeneralPasswordField = ({form, name, label, placeholder}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({field}) => (
        <FormItem>
          <div className="grid grid-cols-5 items-center gap-4">
            <FormLabel className="col-span-2">
              {label} <span className="text-red-600">*</span>
            </FormLabel>
            <FormControl className="col-span-3">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...field}
                  placeholder={placeholder}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-1 h-full hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
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
  );
};

const PassChangeDialog = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async values => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password changed:', values);
      form.reset();
      setOpen(false);
    } catch (err) {
      console.error('Error changing password:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChanged = open => {
    setOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const handleCancelClick = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChanged}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center">Change Password</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <GeneralPasswordField
              form={form}
              name="currentPassword"
              label="Current Password"
              placeholder="Enter current password"
            />
            <GeneralPasswordField
              form={form}
              name="newPassword"
              label="New Password"
              placeholder="Enter new password"
            />
            <GeneralPasswordField
              form={form}
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Enter confirm new password"
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelClick}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loading}>
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PassChangeDialog;
