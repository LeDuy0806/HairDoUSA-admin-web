import BarChartCard from '@/components/dashboard/BarChartCard';
import LineChartCard from '@/components/dashboard/LineChartCard';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  useGetAppointmentHourlyQuery,
  useGetBarChartDataMonthlyQuery,
  useGetBarChartDataWeeklyQuery,
} from '@/services/dashboard/dashboard.query';
import {ChevronDown} from 'lucide-react';
import moment from 'moment-timezone';
import {useMemo} from 'react';

const newCustomersChartConfig = {
  total: {
    label: 'Customers',
  },
};

const newAppointmentChartConfig = {
  total: {
    label: 'Appointments',
  },
};

const revenueChartConfig = {
  total: {
    label: 'Revenue',
  },
};

const appointmentHourlyConfig = {
  total: {
    label: 'Today',
  },
  totalYesterday: {
    label: 'Yesterday',
  },
};

const formatMonthlyResponse = data => {
  return data.map(item => {
    return {
      ...item,
      month: moment(item.month, 'MM-YYYY').format('MMM YYYY'),
    };
  });
};

// Example: 11-2025 => 2025-03-10 - 2025-03-16
const weekNumberToDateRange = week => {
  const [weekNumber, year] = week.split('-');
  const startDate = moment()
    .isoWeekYear(year)
    .isoWeek(weekNumber)
    .startOf('isoWeek');
  const endDate = moment()
    .isoWeekYear(year)
    .isoWeek(weekNumber)
    .endOf('isoWeek');
  return `${startDate.format('MM/DD')} - ${endDate.format('MM/DD')}`;
};

const formatWeeklyResponse = data => {
  return data.map(item => {
    return {
      ...item,
      week: weekNumberToDateRange(item.week),
    };
  });
};

const mergeHourlyData = (todayData, yesterdayData) => {
  const yesterdayMap = new Map();

  yesterdayData.forEach(item => {
    yesterdayMap.set(item.hour, item.total);
  });

  return todayData.map(todayItem => {
    return {
      hour: todayItem.hour,
      total: todayItem.total,
      totalYesterday: yesterdayMap.get(todayItem.hour) || 0,
    };
  });
};

const DashboardPage = () => {
  const barChartDataWeeklyQuery = useGetBarChartDataWeeklyQuery({
    numberWeek: 8,
  });
  const barChartWeeklyData = useMemo(
    () => barChartDataWeeklyQuery?.data?.data ?? [],
    [barChartDataWeeklyQuery.data],
  );
  const weeklyCustomers = barChartWeeklyData?.customers ?? [];
  const weeklyAppointments = barChartWeeklyData?.appointments ?? [];
  const weeklyRevenue = barChartWeeklyData?.revenue ?? [];
  const formatWeeklyCustomers = formatWeeklyResponse(weeklyCustomers);
  const formatWeeklyAppointments = formatWeeklyResponse(weeklyAppointments);
  const formatWeeklyRevenue = formatWeeklyResponse(weeklyRevenue);

  const barChartDataMonthlyQuery = useGetBarChartDataMonthlyQuery({
    numberMonth: 8,
  });
  const barChartMonthlyData = useMemo(
    () => barChartDataMonthlyQuery?.data?.data ?? [],
    [barChartDataMonthlyQuery.data],
  );
  const monthlyCustomers = barChartMonthlyData?.customers ?? [];
  const monthlyAppointments = barChartMonthlyData?.appointments ?? [];
  const monthlyRevenue = barChartMonthlyData?.revenue ?? [];
  const formatMonthlyCustomers = formatMonthlyResponse(monthlyCustomers);
  const formatMonthlyAppointments = formatMonthlyResponse(monthlyAppointments);
  const formatMonthlyRevenue = formatMonthlyResponse(monthlyRevenue);

  const appointmentHourlyQuery = useGetAppointmentHourlyQuery({
    // today: '2025-03-08', // For testing, the best data between this time span
    // yesterday: '2025-02-13',
    today: moment().format('YYYY-MM-DD'),
    yesterday: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  });

  const appointmentHourlyToday = useMemo(
    () => appointmentHourlyQuery.data?.data?.today ?? [],
    [appointmentHourlyQuery.data],
  );
  const appointmentHourlyYesterday = useMemo(
    () => appointmentHourlyQuery.data?.data?.yesterday ?? [],
    [appointmentHourlyQuery.data],
  );
  const lineChartData = mergeHourlyData(
    appointmentHourlyToday,
    appointmentHourlyYesterday,
  );
  const aptTodayHourlyPeekHour = useMemo(
    () => appointmentHourlyQuery.data?.data?.todayPeakHour ?? '',
    [appointmentHourlyQuery.data],
  );
  const aptYesterdayPeekHour = useMemo(
    () => appointmentHourlyQuery.data?.data?.yesterdayPeakHour ?? '',
    [appointmentHourlyQuery.data],
  );

  return (
    <div className="h-full w-full">
      <h3 className="text-2xl font-semibold">Dashboard</h3>
      <div className="mt-5">
        <LineChartCard
          title="Appointments per hour"
          chartData={lineChartData}
          chartConfig={appointmentHourlyConfig}
          XAxisDataKey="hour"
          lineDataKeys={['total', 'totalYesterday']}
          todayPeak={aptTodayHourlyPeekHour}
          yesterdayPeak={aptYesterdayPeekHour}
        />
      </div>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="my-5 [&[data-state=open]>div>svg]:-rotate-180">
          <div className="flex cursor-pointer items-center">
            <ChevronDown className="mr-2 size-6 transition-transform duration-200" />
            <p className="text-lg font-semibold">Week</p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="grid grid-cols-3 gap-5">
          <BarChartCard
            title="New Customers"
            chartData={
              formatWeeklyCustomers ? [...formatWeeklyCustomers].reverse() : []
            }
            chartConfig={newCustomersChartConfig}
            chartDataKey="total"
            timeSpanText="week"
            XAxisKey={'week'}
          />
          <BarChartCard
            title="New Appointments"
            chartData={
              formatWeeklyAppointments
                ? [...formatWeeklyAppointments].reverse()
                : []
            }
            chartConfig={newAppointmentChartConfig}
            chartDataKey="total"
            timeSpanText="week"
            XAxisKey={'week'}
          />
          <BarChartCard
            title="Revenue"
            chartData={
              formatWeeklyRevenue ? [...formatWeeklyRevenue].reverse() : []
            }
            chartConfig={revenueChartConfig}
            chartDataKey="total"
            timeSpanText="week"
            XAxisKey={'week'}
            differenceUnitCharacter="$"
          />
        </CollapsibleContent>
      </Collapsible>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="my-5 [&[data-state=open]>div>svg]:-rotate-180">
          <div className="flex cursor-pointer items-center">
            <ChevronDown className="mr-2 size-6 transition-transform duration-200" />
            <p className="text-lg font-semibold">Month</p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="grid grid-cols-3 gap-5">
          <BarChartCard
            title="New Customers"
            chartData={
              formatMonthlyCustomers
                ? [...formatMonthlyCustomers].reverse()
                : []
            }
            chartConfig={newCustomersChartConfig}
            chartDataKey="total"
            timeSpanText="month"
            XAxisKey={'month'}
          />
          <BarChartCard
            title="New Appointments"
            chartData={
              formatMonthlyAppointments
                ? [...formatMonthlyAppointments].reverse()
                : []
            }
            chartConfig={newAppointmentChartConfig}
            chartDataKey="total"
            timeSpanText="month"
            XAxisKey={'month'}
          />
          <BarChartCard
            title="Revenue"
            chartData={
              formatMonthlyRevenue ? [...formatMonthlyRevenue].reverse() : []
            }
            chartConfig={revenueChartConfig}
            chartDataKey="total"
            timeSpanText="month"
            XAxisKey={'month'}
            differenceUnitCharacter="$"
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DashboardPage;
