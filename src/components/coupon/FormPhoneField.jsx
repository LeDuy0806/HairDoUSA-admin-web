// /src/components/common/FormPhoneField.jsx
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const FormPhoneField = ({
  form,
  name,
  label,
  placeholder,
  disabled,
  ...props
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1">
          <div className="grid grid-cols-5 items-center gap-4">
            <FormLabel className="col-span-2">{label}</FormLabel>
            <div className="col-span-3 relative">
              <span className="absolute pr-2 left-2 top-1/2 -translate-y-1/2 text-muted-foreground border-r-2 border-muted-foreground">
                +1
              </span>
              <FormControl>
                <Input
                  {...field}
                  {...props}
                  disabled={disabled}
                  placeholder={placeholder}
                  className={cn(
                    'pl-12', // Add left padding for the prefix
                    form.formState.errors[name] &&
                      'border-destructive focus-visible:ring-destructive',
                    '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                  )}
                />
              </FormControl>
            </div>
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

export default FormPhoneField;