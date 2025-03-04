import {STORAGE_KEY} from '@/constants/storage-key';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {authService} from './auth.service';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async data => {
      const res = await authService.login(data);
      return res.data;
    },
  });
};

export const useVerifyLoginOtpMutation = () => {
  return useMutation({
    mutationFn: async data => {
      const res = await authService.verifyLoginOtp(data);
      return res.data;
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async data => {
      const res = await authService.changePassword(data);
      return res.data;
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      queryClient.clear();
      localStorage.removeItem(STORAGE_KEY.AUTH.ACCESS_TOKEN);
    },
  });
};
