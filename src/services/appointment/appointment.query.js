import {QUERY_KEY} from '@/constants/query-key';
import {useQuery} from '@tanstack/react-query';
import {appointmentService} from './appointment.service';

export const useGetAllAppointmentsQuery = query => {
  return useQuery({
    queryKey: [QUERY_KEY.APPOINTMENT.GET_ALL, query],
    queryFn: async () => {
      const res = await appointmentService.getAll(query);
      return res.data;
    },
  });
};

export const useGetAppointmentDetailQuery = id => {
  return useQuery({
    queryKey: [QUERY_KEY.APPOINTMENT.GET_DETAIL, id],
    queryFn: async () => {
      const res = await appointmentService.getDetail(id);
      return res.data;
    },
    enabled: !!id,
  });
};
