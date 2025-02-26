import {QUERY_KEY} from '@/constants/query-key';
import {useQuery} from '@tanstack/react-query';
import {customerService} from './customer.service';

export const useGetAllCustomersQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.CUSTOMER.GET_ALL],
    queryFn: async () => {
      const res = await customerService.getAll();
      return res.data;
    },
  });
};
