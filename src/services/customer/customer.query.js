import {QUERY_KEY} from '@/constants/query-key';
import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {customerService} from './customer.service';

export const useGetAllCustomersQuery = query => {
  return useQuery({
    queryKey: [QUERY_KEY.CUSTOMER.GET_ALL, query],
    queryFn: async () => {
      const res = await customerService.getAll(query);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetCustomerDetailQuery = id => {
  return useQuery({
    queryKey: [QUERY_KEY.CUSTOMER.GET_DETAIL, id],
    queryFn: async () => {
      const res = await customerService.getDetail(id);
      return res.data;
    },
  });
};
