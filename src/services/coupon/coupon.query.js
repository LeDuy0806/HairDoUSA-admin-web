import {QUERY_KEY} from '@/constants/query-key';
import {useQuery} from '@tanstack/react-query';
import {couponService} from './coupon.service';

export const useGetAllCouponsQuery = query => {
  return useQuery({
    queryKey: [QUERY_KEY.COUPON.GET_ALL, query],
    queryFn: async () => {
      const res = await couponService.getAll(query);
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

export const useGetAvailableCouponByAppointmentQuery = appointmentId => {
  return useQuery({
    queryKey: [QUERY_KEY.COUPON.GET_AVAILABLE_BY_APPOINTMENT, appointmentId],
    queryFn: async () => {
      const res = await couponService.getAvailableByAppointment(appointmentId);
      return res.data;
    },
    enabled: !!appointmentId.appointmentId,
  });
};
