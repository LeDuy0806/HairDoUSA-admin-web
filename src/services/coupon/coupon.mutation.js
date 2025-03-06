import {useMutation} from '@tanstack/react-query';
import {couponService} from './coupon.service';

export const useCreateCouponMutation = () => {
  return useMutation({
    mutationFn: async data => {
      const res = await couponService.create(data);
      return res.data;
    },
  });
};

export const useUpdateCouponMutation = id => {
  return useMutation({
    mutationFn: async data => {
      const res = await couponService.update(id, data);
      return res.data;
    },
  });
};

export const useDeleteCouponMutation = () => {
  return useMutation({
    mutationFn: async id => {
      const res = await couponService.delete(id);
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
