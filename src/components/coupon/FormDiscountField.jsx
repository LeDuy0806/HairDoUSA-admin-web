import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {cn} from '@/lib/utils';

const COUPON_DISCOUNT_TYPE = {
  FIXED: 'FIXED',
  PERCENTAGE: 'PERCENTAGE',
};

const FormDiscountField = ({
  form,
  name,
  label,
  placeholder,
  value,
  onValueChange,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({field}) => (
        <FormItem className="gap-1">
          <div className="grid grid-cols-5 items-center gap-4">
            <FormLabel className="col-span-2">{label}</FormLabel>
            <FormControl className="col-span-3">
              <div className="relative flex w-full items-center">
                <Input
                  {...field}
                  type="number"
                  placeholder={placeholder}
                  className={cn(
                    'pr-12',
                    '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                    form.formState.errors[name] &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                />
                <Select
                  value={value}
                  onValueChange={onValueChange}
                  defaultValue={COUPON_DISCOUNT_TYPE.FIXED}>
                  <SelectTrigger className="absolute top-0 right-0 w-12 cursor-pointer border-0 bg-transparent px-2">
                    <SelectValue placeholder="$" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={COUPON_DISCOUNT_TYPE.FIXED}>
                      $
                    </SelectItem>
                    <SelectItem value={COUPON_DISCOUNT_TYPE.PERCENTAGE}>
                      %
                    </SelectItem>
                  </SelectContent>
                </Select>
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

export default FormDiscountField;
