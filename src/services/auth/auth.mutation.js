import {useMutation} from '@tanstack/react-query';
import {authService} from './auth.service';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async data => {
      const res = await authService.login(data);
      return res.data;
    },
  });
};
