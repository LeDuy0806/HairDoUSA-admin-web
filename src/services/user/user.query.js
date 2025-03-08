import {QUERY_KEY} from '@/constants/query-key';
import {useQuery} from '@tanstack/react-query';
import {userService} from './user.service';

export const useGetAllAdminsQuery = query => {
  return useQuery({
    queryKey: [QUERY_KEY.ADMIN.GET_ALL, query],
    queryFn: async () => {
      const res = await userService.getAllAdmins(query);
      return res.data;
    },
  });
};

export const useGetAdminDetailQuery = id => {
  return useQuery({
    queryKey: [QUERY_KEY.ADMIN.GET_DETAIL, id],
    queryFn: async () => {
      const res = await userService.getAdminDetail(id);
      return res.data;
    },
  });
};
