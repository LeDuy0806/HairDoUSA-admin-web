import {useMutation} from '@tanstack/react-query';
import {userService} from './user.service';

export const useCreateAdminMutation = () => {
  return useMutation({
    mutationFn: async data => {
      const res = await userService.createAdmin(data);
      return res.data;
    },
  });
};

export const useUpdateAdminMutation = id => {
  return useMutation({
    mutationFn: async data => {
      const res = await userService.updateAdmin(id, data);
      return res.data;
    },
  });
};

export const useDeleteAdminMutation = () => {
  return useMutation({
    mutationFn: async id => {
      const res = await userService.deleteAdmin(id);
      return res.data;
    },
  });
};
