import instance from '../instance';

export const dashboardService = {
  getBarChartDataWeekly: async numOfWeeks =>
    await instance.get('/analytic/week-resource', {
      params: numOfWeeks,
    }),
  getBarChartDataMonthly: async numOfMonths =>
    await instance.get('/analytic/month-resource', {
      params: numOfMonths,
    }),
  getAppointmentHourly: async days =>
    await instance.get('/analytic/hour', {
      params: days,
    }),
};
