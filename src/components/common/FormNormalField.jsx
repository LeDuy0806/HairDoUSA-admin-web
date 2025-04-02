import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';
import {forwardRef} from 'react';
import {Textarea} from '../ui/textarea';

const FormNormalField = forwardRef(
  (
    {
      form,
      name,
      label,
      placeholder,
      disabled,
      isTextarea = false,
      required = false,
      ...props
    },
    ref,
  ) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({field}) => (
          <FormItem className="gap-1">
            <div
              className={cn(
                'grid grid-cols-5 gap-4',
                isTextarea ? 'items-start' : 'items-center',
              )}>
              <FormLabel className="col-span-2">
                {label}{' '}
                {required ? <span className="text-red-500">*</span> : ''}
              </FormLabel>
              <FormControl className="col-span-3">
                {isTextarea ? (
                  <Textarea
                    {...field}
                    ref={ref}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={cn(
                      'h-[100px] resize-none',
                      form.formState.errors[name] &&
                        'border-destructive focus-visible:ring-destructive',
                    )}
                  />
                ) : (
                  <Input
                    {...field}
                    {...props}
                    disabled={disabled}
                    placeholder={placeholder}
                    ref={ref}
                    className={cn(
                      form.formState.errors[name] &&
                        'border-destructive focus-visible:ring-destructive',
                      '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                    )}
                  />
                )}
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
  },
);

export default FormNormalField;
