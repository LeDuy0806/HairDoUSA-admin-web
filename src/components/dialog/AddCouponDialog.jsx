import FormDatePickerField from '@/components/common/FormDatePickerField';
import FormNormalField from '@/components/common/FormNormalField';
import FormDiscountField from '@/components/coupon/FormDiscountField';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Form, FormControl, FormField, FormItem} from '@/components/ui/form';
import {Separator} from '@/components/ui/separator';

import {zodResolver} from '@hookform/resolvers/zod';
import moment from 'moment-timezone';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

const COUPON_DISCOUNT_TYPE = {
  FIXED: 'FIXED',
  PERCENTAGE: 'PERCENTAGE',
};

const AddCouponDialog = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [discountType, setDiscountType] = useState(COUPON_DISCOUNT_TYPE.FIXED);

  const formSchema = z
    .object({
      couponName: z.string().nonempty('Please enter coupon name'),
      discount: z.string().nonempty('Please enter discount amount'),
      usageLimit: z.string({
        required_error: 'Please enter usage limit',
      }).nonempty('Please enter usage limit'),
      description: z.string().max(100, {
        message: 'Description must be less than 100 characters',
      }),
      couponCode: z.string().max(30, {
        message: 'Coupon code must be less than 30 characters',
      }),
      validFromDate: z.date({
        required_error: 'Please pick a valid from date',
      }),
      expiredDate: z.date({
        required_error: 'Please pick an expired date',
      }),
      isAutoGeneratedCode: z.boolean(),
      isPermanent: z.boolean(),
    })
    .refine(
      data => {
        const discountValue = Number(data.discount);

        // For percentage: must be between 1-100
        if (discountType === COUPON_DISCOUNT_TYPE.PERCENTAGE) {
          return discountValue >= 1 && discountValue <= 100;
        }

        // For fixed amount: must be non-negative
        return discountValue >= 0;
      },
      {
        message:
          discountType === COUPON_DISCOUNT_TYPE.PERCENTAGE
            ? 'Percentage must be between 1-100%'
            : 'Amount must be a non-negative number',
        path: ['discount'],
      },
    )
    .refine(
      data => {
        // Skip validation if either date is missing
        if (!data.validFromDate || !data.expiredDate) return true;

        // Compare dates - expiredDate must be after validFromDate
        return data.expiredDate > data.validFromDate;
      },
      {
        message: 'Expired date must be after valid from date',
        path: ['expiredDate'],
      },
    )
    .refine(
      data => {
        return (
          data.isAutoGeneratedCode ||
          data.couponCode ||
          data.couponCode.trim() !== ''
        );
      },
      {
        message: 'Please enter coupon code',
        path: ['couponCode'],
      },
    );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      couponName: '',
      discount: '',
      description: '',
      couponCode: '',
      isAutoGeneratedCode: false,
      isPermanent: false,
    },
  });

  const onSubmit = async values => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('New coupon added:', values);
      form.reset();
      setOpen(false);
    } catch (err) {
      console.error('Error adding new coupon:', err);
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

  const handleAutoGeneratedChange = checked => {
    form.setValue('isAutoGeneratedCode', checked);

    if (checked) {
      form.clearErrors('couponCode');
    } else {
      form.trigger('couponCode');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChanged}>
      <DialogTrigger asChild>
        <Button className="my-6">+ Add New Coupon</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Add New Coupon</DialogTitle>
          <DialogDescription>
            Please add a new coupon by these information.{' '}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormNormalField
              form={form}
              name="couponName"
              label="Coupon Name"
              placeholder="Enter coupon name"
            />
            <FormDiscountField
              form={form}
              name="discount"
              label="Discount"
              placeholder="Enter discount amount"
              value={discountType}
              onValueChange={setDiscountType}
            />
            <FormNormalField
              form={form}
              name="usageLimit"
              label="Usage Limit"
              placeholder="Enter coupon usage limit"
              type="number"
            />
            <FormNormalField
              form={form}
              name="description"
              label="Description"
              placeholder="Enter description"
            />
            <FormNormalField
              form={form}
              name="couponCode"
              label="Coupon Code"
              placeholder="Enter coupon code"
              disabled={form.watch('isAutoGeneratedCode')}
            />
            <FormField
              control={form.control}
              name="isAutoGeneratedCode"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={checked => {
                          field.onChange(checked);
                          handleAutoGeneratedChange(checked);
                        }}
                      />
                      <p className="text-sm font-medium">
                        Auto generate coupon code
                      </p>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Separator className="my-3" />
            <FormDatePickerField
              form={form}
              name="validFromDate"
              label="Valid From"
              placeholder="Pick a valid from date"
              disabledDate={date => date < moment()}
            />
            <FormDatePickerField
              form={form}
              name="expiredDate"
              label="Expired Date"
              placeholder="Pick an expired date"
              disabledDate={date => {
                const validFrom = form.getValues('validFrom');
                return validFrom && date < moment(validFrom);
              }}
            />
            <Separator className="my-3" />
            <DialogFooter className="justify-end gap-2">
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

export default AddCouponDialog;
