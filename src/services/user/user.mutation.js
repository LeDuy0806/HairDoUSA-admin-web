import {QUERY_KEY} from '@/constants/query-key';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {userService} from './user.service';

export const useCreateAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async data => {
      const res = await userService.createAdmin(data);

      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.ADMIN.GET_ALL],
        });
      }

      return res.data;
    },
  });
};

export const useUpdateAdminMutation = id => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async data => {
      const res = await userService.updateAdmin(id, data);

      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.ADMIN.GET_ALL],
        });
      }

      return res.data;
    },
  });
};

export const useDeleteAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async id => {
      const res = await userService.deleteAdmin(id);
      if (res.data.success) {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.ADMIN.GET_ALL],
        });
      }

      return res.data;
    },
  });
};
