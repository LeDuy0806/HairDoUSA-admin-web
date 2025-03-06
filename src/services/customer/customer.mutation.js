import {QUERY_KEY} from '@/constants/query-key';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {customerService} from './customer.service';

export const useCreateCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async data => {
      const res = await customerService.create(data);

      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.CUSTOMER.GET_ALL],
        });
      }

      return res.data;
    },
  });
};

export const useUpdateCustomerMutation = id => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async data => {
      const res = await customerService.update(id, data);

      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.CUSTOMER.GET_ALL],
        });
      }

      return res.data;
    },
  });
};

export const useDeleteCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async id => {
      const res = await customerService.delete(id);

      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.CUSTOMER.GET_ALL],
        });
      }

      return res.data;
    },
  });
};
