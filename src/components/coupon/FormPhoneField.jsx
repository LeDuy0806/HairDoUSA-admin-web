// /src/components/common/FormPhoneField.jsx
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';
import {useEffect} from 'react';

const FormPhoneField = ({
  form,
  name,
  label,
  placeholder,
  disabled,
  required = false,
  ...props
}) => {
  const phoneValue = form.watch(name);
  useEffect(() => {
    if (phoneValue) {
      // Remove all non-digit characters
      const digits = phoneValue.replace(/\D/g, '');

      // Format with spaces (3-3-4 format)
      let formattedNumber = '';
      if (digits.length <= 3) {
        formattedNumber = digits;
      } else if (digits.length <= 6) {
        formattedNumber = `${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else {
        formattedNumber = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
      }

      // Only update if the formatted value is different
      if (formattedNumber !== phoneValue) {
        form.setValue(name, formattedNumber);
      }
    }
  }, [phoneValue, name, form]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({field}) => (
        <FormItem className="gap-1">
          <div className="grid grid-cols-5 items-center gap-4">
            <FormLabel className="col-span-2">
              {label} {required ? <span className="text-red-500">*</span> : ''}
            </FormLabel>
            <div className="relative col-span-3">
              <span className="text-muted-foreground border-muted-foreground absolute top-1/2 left-2 -translate-y-1/2 border-r-2 pr-2">
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
