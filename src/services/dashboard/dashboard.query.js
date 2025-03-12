import {QUERY_KEY} from '@/constants/query-key';
import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {dashboardService} from './dashboard.service';

export const useGetBarChartDataWeeklyQuery = numOfWeeks => {
  return useQuery({
    queryKey: [QUERY_KEY.DASHBOARD.GET_BAR_CHART_WEEKLY, numOfWeeks],
    queryFn: async () => {
      const res = await dashboardService.getBarChartDataWeekly(numOfWeeks);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetBarChartDataMonthlyQuery = numOfMonths => {
  return useQuery({
    queryKey: [QUERY_KEY.DASHBOARD.GET_BAR_CHART_MONTHLY, numOfMonths],
    queryFn: async () => {
      const res = await dashboardService.getBarChartDataMonthly(numOfMonths);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetAppointmentHourlyQuery = days => {
  return useQuery({
    queryKey: [QUERY_KEY.DASHBOARD.GET_APPOINTMENT_HOURLY, days],
    queryFn: async () => {
      const res = await dashboardService.getAppointmentHourly(days);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};
