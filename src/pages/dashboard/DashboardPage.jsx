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

  const barChartDataMonthlyQuery = useGetBarChartDataMonthlyQuery({
    numberMonth: 4,
  });
  const barChartMonthlyData = useMemo(
    () => barChartDataMonthlyQuery?.data?.data ?? [],
    [barChartDataMonthlyQuery.data],
  );
  const monthlyCustomers = barChartMonthlyData?.customers ?? [];
  const monthlyAppointments = barChartMonthlyData?.appointments ?? [];
  const monthlyRevenue = barChartMonthlyData?.revenue ?? [];

  console.log('today: ', moment().format('YYYY-MM-DD'));
  console.log('yesterday: ', moment().subtract(1, 'day').format('YYYY-MM-DD'));
  const appointmentHourlyQuery = useGetAppointmentHourlyQuery({
    // today: '2025-03-08', // For testing, the best data between this time span
    // yesterday: '2025-02-13',
    today: moment().format('YYYY-MM-DD'),
    yesterday: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  });


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
            chartData={weeklyCustomers ? [...weeklyCustomers].reverse() : []}
            chartConfig={newCustomersChartConfig}
            chartDataKey="total"
            timeSpanText="week"
          />
          <BarChartCard
            title="New Appointments"
            chartData={
              weeklyAppointments ? [...weeklyAppointments].reverse() : []
            }
            chartConfig={newAppointmentChartConfig}
            chartDataKey="total"
            timeSpanText="week"
          />
          <BarChartCard
            title="Revenue"
            chartData={weeklyRevenue ? [...weeklyRevenue].reverse() : []}
            chartConfig={revenueChartConfig}
            chartDataKey="total"
            timeSpanText="week"
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
            chartData={monthlyCustomers ? [...monthlyCustomers].reverse() : []}
            chartConfig={newCustomersChartConfig}
            chartDataKey="total"
            timeSpanText="month"
          />
          <BarChartCard
            title="New Appointments"
            chartData={
              monthlyAppointments ? [...monthlyAppointments].reverse() : []
            }
            chartConfig={newAppointmentChartConfig}
            chartDataKey="total"
            timeSpanText="month"
          />
          <BarChartCard
            title="Revenue"
            chartData={monthlyRevenue ? [...monthlyRevenue].reverse() : []}
            chartConfig={revenueChartConfig}
            chartDataKey="total"
            timeSpanText="month"
            differenceUnitCharacter="$"
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DashboardPage;
