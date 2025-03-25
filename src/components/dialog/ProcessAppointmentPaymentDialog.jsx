import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {QUERY_KEY} from '@/constants/query-key';
import {ROUTE} from '@/constants/route';
import {
  APPOINTMENT_STATUS,
  COUPON_TYPE,
  PAYMENT_STATUS,
} from '@/constants/value';
import {cn} from '@/lib/utils';
import {
  useApplyCouponMutation,
  useCheckoutAppointmentMutation,
  useGetAppointmentDetailQuery,
  useRemoveCouponMutation,
  useUpdateAppointmentMutation,
} from '@/services/appointment';
import {useGetAvailableCouponByAppointmentQuery} from '@/services/coupon';
import {zodResolver} from '@hookform/resolvers/zod';
import {useQueryClient} from '@tanstack/react-query';
import {AlertCircle, CircleX, Loader} from 'lucide-react';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {Form, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Textarea} from '../ui/textarea';

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
  const [fieldOpen, setFieldOpen] = useState(false);
  const [commonError, setCommonError] = useState(null);
  const [isChecked, setIsChecked] = useState(true);

  const getAppointmentDetail = useGetAppointmentDetailQuery(appointmentId);
  const getAvailableCouponByAppointment =
    useGetAvailableCouponByAppointmentQuery({appointmentId});

  const appointment = useMemo(
    () => getAppointmentDetail.data?.data,
    [getAppointmentDetail.data],
  );

  const availableCoupons = useMemo(
    () =>
      getAvailableCouponByAppointment.data?.data.map(coupon => {
        return {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        };
      }) ?? [],
    [getAvailableCouponByAppointment.data],
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      couponCode: '',
    },
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

  const formatCouponDiscountValue = coupon => {
    switch (coupon?.discountType) {
      case COUPON_TYPE.PERCENTAGE:
        return `${coupon.discountValue}%`;
      case COUPON_TYPE.FIXED:
        return `$${coupon.discountValue}`;
      default:
        return '';
    }
  };

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

  const queryClient = useQueryClient();
  const onSubmit = async () => {
    checkoutAppointmentMutation.mutate(appointmentId, {
      onSuccess: res => {
        if (res.success) {
          queryClient.removeQueries({
            queryKey: [QUERY_KEY.COUPON.GET_AVAILABLE_BY_APPOINTMENT],
          });
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
          <DialogDescription />
        </DialogHeader>
        {getAppointmentDetail.isLoading ? (
          <div className="my-4 flex items-center justify-center">
            <Loader className="size-4 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!coupon && !isPaid && (
                <FormField
                  control={form.control}
                  name="couponCode"
                  render={() => (
                    <FormItem className="gap-1">
                      <div className="grid grid-cols-5 items-center gap-4">
                        <FormLabel className="col-span-2">Coupon</FormLabel>
                        <div className="col-span-3 flex gap-1">
                          <Popover
                            modal={true}
                            open={fieldOpen}
                            onOpenChange={setFieldOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                aria-expanded={fieldOpen}
                                className="w-full justify-start text-left">
                                {form.getValues('couponCode')
                                  ? form.getValues('couponCode')
                                  : 'Select coupon'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Command>
                                <CommandInput
                                  placeholder={'Search coupon code...'}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    {'No coupon found.'}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {availableCoupons.map(coupon => (
                                      <CommandItem
                                        key={coupon.code}
                                        value={coupon.code}
                                        onSelect={currentValue => {
                                          form.setValue(
                                            'couponCode',
                                            currentValue ===
                                              form.getValues('couponCode')
                                              ? form.getValues('couponCode')
                                              : currentValue,
                                          );
                                          setFieldOpen(false);
                                        }}>
                                        {coupon?.code} -{' '}
                                        <span className="font-semibold text-green-600">
                                          {formatCouponDiscountValue(
                                            coupon,
                                          )}{' '}
                                        </span>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
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
                    <p className="col-span-2 text-green-600">Discount</p>
                    <div className="col-span-3 inline-flex flex-col items-end gap-2 text-green-600">
                      <p className="text-right">-${calculatedDiscount}</p>
                      <button
                        type="button"
                        disabled={removeCouponMutation.isPending}
                        onClick={
                          appointment?.paymentStatus === PAYMENT_STATUS.UNPAID
                            ? onRemoveCoupon
                            : undefined
                        }
                        className="bg-foreground flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-white disabled:cursor-not-allowed disabled:bg-gray-300">
                        {coupon?.code} - {formatCouponDiscountValue(coupon)}{' '}
                        {appointment?.paymentStatus ===
                        PAYMENT_STATUS.UNPAID ? (
                          <>
                            {removeCouponMutation.isPending ? (
                              <Loader className="inline-block size-4 animate-spin" />
                            ) : (
                              <CircleX className="inline-block size-4" />
                            )}
                          </>
                        ) : null}
                      </button>
                    </div>
                  </>
                )}
                <hr className="col-span-5" />

                <p className="col-span-2 text-lg font-medium">Total</p>
                <p className="col-span-3 text-right text-lg font-medium">
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

              <div className="mt-10 flex flex-col gap-2">
                <div className="text-sm font-medium">Note:</div>
                <Textarea
                  readOnly
                  className={cn(
                    'h-[100px] resize-none',
                    form.formState.errors['note'] &&
                      'border-destructive focus-visible:ring-destructive',
                  )}
                  value={appointment?.note}
                />
              </div>

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
