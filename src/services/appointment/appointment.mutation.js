import {QUERY_KEY} from '@/constants/query-key';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {appointmentService} from './appointment.service';

export const useCreateAppointmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async data => {
      const res = await appointmentService.create(data);

      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.APPOINTMENT.GET_ALL],
        });
      }

      return res.data;
    },
  });
};

export const useUpdateAppointmentMutation = id => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async data => {
      const res = await appointmentService.update(id, data);

      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.APPOINTMENT.GET_ALL],
        });
      }

      return res.data;
    },
  });
};

export const useDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async id => {
      const res = await appointmentService.delete(id);
      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.APPOINTMENT.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

export const useCheckoutAppointmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async id => {
      const res = await appointmentService.checkout(id);

      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.APPOINTMENT.GET_ALL],
        });
      }

      return res.data;
    },
  });
};

export const useApplyCouponMutation = id => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async couponCode => {
      const res = await appointmentService.applyCoupon(id, couponCode);
      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.APPOINTMENT.GET_DETAIL, id],
        });
      }
      return res.data;
    },
  });
};

export const useRemoveCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async id => {
      const res = await appointmentService.removeCoupon(id);
      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.APPOINTMENT.GET_DETAIL, id],
        });
      }
      return res.data;
    },
  });
};
