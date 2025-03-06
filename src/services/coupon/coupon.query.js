import {QUERY_KEY} from '@/constants/query-key';
import {useQuery} from '@tanstack/react-query';
import {couponService} from './coupon.service';

export const useGetAllCouponsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.COUPON.GET_ALL],
    queryFn: async () => {
      const res = await couponService.getAll();
      return res.data;
    },
  });
};

export const useGetCouponDetailQuery = id => {
  return useQuery({
    queryKey: [QUERY_KEY.COUPON.GET_DETAIL, id],
    queryFn: async () => {
      const res = await couponService.getDetail(id);
      return res.data;
    },
  });
};
