import {QUERY_KEY} from '@/constants/query-key';
import {STORAGE_KEY} from '@/constants/storage-key';
import {useQuery} from '@tanstack/react-query';
import {authService} from './auth.service';

export const useGetMeQuery = () => {
  const accessToken = localStorage.getItem(STORAGE_KEY.AUTH.ACCESS_TOKEN);
  return useQuery({
    queryKey: [QUERY_KEY.AUTH.GET_ME],
    queryFn: async () => {
      const res = await authService.getMe();
      return res.data;
    },
    enabled: !!accessToken,
  });
};
