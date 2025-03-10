import {ROUTE} from '@/constants/route';
import {
  APPOINTMENT_STATUS,
  COUPON_TYPE,
  PAYMENT_STATUS,
} from '@/constants/value';
import {
  useApplyCouponMutation,
  useCheckoutAppointmentMutation,
  useGetAppointmentDetailQuery,
  useRemoveCouponMutation,
  useUpdateAppointmentMutation,
} from '@/services/appointment';
import {zodResolver} from '@hookform/resolvers/zod';
import {AlertCircle, Loader, X} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useLocation, useNavigate} from 'react-router';
import {toast} from 'sonner';
import {z} from 'zod';
import {Alert, AlertDescription, AlertTitle} from '../ui/alert';
import {Button} from '../ui/button';
import {Checkbox} from '../ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {Form, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';

const formSchema = z.object({
  couponCode: z
    .string()
    .nonempty('Please enter a coupon code')
    .optional()
    .nullable()
    .or(z.literal('')),
});

const ProcessAppointmentPaymentDialog = ({onClose}) => {
  const navigate = useNavigate();
  const {search} = useLocation();
  const searchParams = new URLSearchParams(search);
  const appointmentId = searchParams.get('appointmentId');

  const [open, setOpen] = useState(true);
  const [commonError, setCommonError] = useState(null);
  const [isChecked, setIsChecked] = useState(true);

  const getAppointmentDetail = useGetAppointmentDetailQuery(appointmentId);

  const appointment = useMemo(
    () => getAppointmentDetail.data?.data,
    [getAppointmentDetail.data],
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const {couponCode} = form.watch();

  useEffect(() => {
    if (couponCode) {
      setCommonError(null);
    }
  }, [couponCode]);

  const applyCouponMutation = useApplyCouponMutation(appointmentId);
  const removeCouponMutation = useRemoveCouponMutation(appointmentId);
  const checkoutAppointmentMutation = useCheckoutAppointmentMutation();
  const updateAppointmentMutation = useUpdateAppointmentMutation(appointmentId);

  useEffect(() => {
    if (getAppointmentDetail.isError) {
      setOpen(false);
    }
  }, [getAppointmentDetail.isError]);

  const applyCoupon = async () => {
    const canContinue = await form.trigger();
    if (!canContinue) {
      return;
    }
    applyCouponMutation.mutate(couponCode, {
      onSuccess: res => {
        if (res.success) {
          toast.success('Coupon applied successfully');
        } else {
          setCommonError(res.message);
        }
      },
      onError: err => {
        setCommonError(err?.response?.data?.message ?? 'An error occurred');
      },
    });
  };

  const coupon = useMemo(() => appointment?.coupon, [appointment]);

  const calculatedDiscount = useMemo(() => {
    const couponDiscountValue = coupon?.discountValue ?? 0;
    const subtotal = appointment?.subtotal ?? 0;
    switch (coupon?.discountType) {
      case COUPON_TYPE.PERCENTAGE:
        return (couponDiscountValue * subtotal) / 100;
      case COUPON_TYPE.FIXED:
        return couponDiscountValue;
      default:
        return 0;
    }
  }, [coupon, appointment?.subtotal]);

  const formatCouponDiscountValue = useMemo(() => {
    switch (coupon?.discountType) {
      case COUPON_TYPE.PERCENTAGE:
        return `${coupon.discountValue}%`;
      case COUPON_TYPE.FIXED:
        return `$${coupon.discountValue}`;
      default:
        return '';
    }
  }, [coupon]);

  const onRemoveCoupon = () => {
    removeCouponMutation.mutate(appointmentId, {
      onSuccess: res => {
        if (res.success) {
          toast.success('Coupon removed successfully');
        } else {
          setCommonError(res.message);
        }
      },
      onError: err => {
        setCommonError(err?.response?.data?.message ?? 'An error occurred');
      },
    });
  };

  const updateAppointmentStatus = () => {
    updateAppointmentMutation.mutate(
      {status: APPOINTMENT_STATUS.COMPLETED},
      {
        onSuccess: res => {
          if (res.success) {
            toast.success('Appointment marked as completed');
          } else {
            setCommonError(res.message);
          }
        },
        onError: err => {
          setCommonError(err?.response?.data?.message ?? 'An error occurred');
        },
      },
    );
  };

  const onSubmit = async () => {
    checkoutAppointmentMutation.mutate(appointmentId, {
      onSuccess: res => {
        if (res.success) {
          toast.success('Payment processed successfully');
          setOpen(false);
          navigate(ROUTE.APPOINTMENT.ROOT);
          if (isChecked) {
            updateAppointmentStatus();
          }
        } else {
          setCommonError(res.message);
        }
      },
      onError: err => {
        setCommonError(err?.response?.data?.message ?? 'An error occurred');
      },
    });
  };

  const isPaid = appointment?.paymentStatus === PAYMENT_STATUS.PAID;
  const isCompleted = appointment?.status === APPOINTMENT_STATUS.COMPLETED;

  return (
    <Dialog
      defaultOpen
      open={open}
      onOpenChange={v => {
        if (!v) {
          onClose();
        }
        setOpen(v);
      }}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>
        {getAppointmentDetail.isLoading ? (
          <div className="my-4 flex items-center justify-center">
            <Loader className="size-4" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!coupon && !isPaid && (
                <FormField
                  control={form.control}
                  name="couponCode"
                  render={({field}) => (
                    <FormItem className="gap-1">
                      <div className="grid grid-cols-5 items-center gap-4">
                        <FormLabel className="col-span-2">Coupon</FormLabel>
                        <div className="col-span-3 flex gap-1">
                          <Input
                            {...field}
                            className="flex-1"
                            placeholder="Enter coupon code"
                          />
                          <Button
                            type="button"
                            onClick={applyCoupon}
                            isLoading={applyCouponMutation.isPending}>
                            Apply
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 items-center gap-4">
                        <div className="col-span-2" />
                        <FormMessage className="col-span-3" />
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-5 gap-4 text-sm">
                <p className="col-span-2">Subtotal</p>
                <p className="col-span-3 text-right">
                  ${appointment?.subtotal ?? 0}
                </p>

                {appointment?.coupon && (
                  <>
                    <p className="col-span-2">Discount</p>
                    <div className="col-span-3 inline-flex flex-col items-end gap-2">
                      <p className="text-right">-${calculatedDiscount}</p>
                      <button
                        type="button"
                        disabled={removeCouponMutation.isPending}
                        onClick={onRemoveCoupon}
                        className="bg-foreground cursor-pointer rounded px-2 py-1 text-white disabled:cursor-not-allowed disabled:bg-gray-300">
                        {coupon?.code} - {formatCouponDiscountValue}{' '}
                        {removeCouponMutation.isPending ? (
                          <Loader className="inline-block size-4 animate-spin" />
                        ) : (
                          <X className="inline-block size-4" />
                        )}
                      </button>
                    </div>
                  </>
                )}
                <hr className="col-span-5" />

                <p className="col-span-2">Total</p>
                <p className="col-span-3 text-right">
                  ${appointment?.totalAmount ?? 0}
                </p>
              </div>

              {!isPaid && !isCompleted && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status"
                    checked={isChecked}
                    onCheckedChange={setIsChecked}
                  />
                  <label
                    htmlFor="status"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Mark the appointment as completed after payment
                  </label>
                </div>
              )}

              {commonError && (
                <Alert
                  variant="destructive"
                  className="border-red-500 bg-red-50/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{commonError}</AlertDescription>
                </Alert>
              )}

              <DialogFooter className="mt-8">
                <DialogClose asChild>
                  <Button variant={isPaid ? 'default' : 'ghost'} type="button">
                    Close
                  </Button>
                </DialogClose>
                {!isPaid && (
                  <Button
                    type="submit"
                    isLoading={checkoutAppointmentMutation.isPending}>
                    Checkout
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProcessAppointmentPaymentDialog;
