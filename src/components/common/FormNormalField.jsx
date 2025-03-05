import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';


const FormNormalField = ({form, name, label, placeholder, disabled}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({field}) => (
        <FormItem className="gap-1">
          <div className="grid grid-cols-5 items-center gap-4">
            <FormLabel className="col-span-2">{label}</FormLabel>
            <FormControl className="col-span-3">
              <div className="relative">
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder={placeholder}
                  className={cn(
                    form.formState.errors[name] &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
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
  );
};

export default FormNormalField;
