import {Calendar} from '@/components/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

import {cn} from '@/lib/utils';
import {CalendarIcon} from 'lucide-react';
import moment from 'moment-timezone';

// Right now when user pick a Date, it will display the day before the picked date because of the timezone of the "moment" library is now  America/Los_Angeles
const FormDatePickerField = ({
  form,
  name,
  label,
  placeholder,
  disabledDate,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({field}) => (
        <FormItem className="gap-1">
          <div className="grid grid-cols-5 items-center gap-4">
            <FormLabel className="col-span-2">{label}</FormLabel>
            <Popover modal={true}>
              <PopoverTrigger className="col-span-3">
                <FormControl>
                  <div
                    className={cn(
                      'border-input bg-background ring-offset-background flex w-full cursor-pointer items-center justify-start gap-2 rounded-md border px-3 py-2 text-sm',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none',
                      !field.value && 'text-muted-foreground',
                      form.formState.errors[name] &&
                        'border-destructive focus-visible:ring-destructive',
                    )}>
                    <CalendarIcon className="size-4" />
                    {field.value ? (
                      <span>{moment(field.value).format('DD/MM/YYYY')}</span>
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </div>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={disabledDate}
                  initialFocus
                />
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
  );
};

export default FormDatePickerField;
