import {QUERY_KEY} from '@/constants/query-key';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {couponService} from './coupon.service';

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async data => {
      const res = await couponService.create(data);

      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.COUPON.GET_ALL],
        });
      }

      return res.data;
    },
  });
};

export const useUpdateCouponMutation = id => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async data => {
      const res = await couponService.update(id, data);

      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.COUPON.GET_ALL],
        });
      }

      return res.data;
    },
  });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async id => {
      const res = await couponService.delete(id);
      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.COUPON.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

export const useApplyCouponMutation = () => {
  return useMutation({
    mutationFn: async code => {
      const res = await couponService.apply(code);
      return res.data;
    },
  });
};
