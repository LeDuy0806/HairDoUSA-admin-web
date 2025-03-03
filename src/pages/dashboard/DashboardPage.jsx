import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react";
import ChartCard from "@/components/dashboard/ChartCard";

const newCustomersData = [
  {
    week: 'Week 1',
    customers: 320,
  },
  {
    week: 'Week 2',
    customers: 280,
  },
  {
    week: 'Week 3',
    customers: 450,
  },
  {
    week: 'Week 4',
    customers: 390,
  },
  {
    week: 'Week 5',
    customers: 480,
  },
  {
    week: 'Week 6',
    customers: 520,
  },
  {
    week: 'Week 7',
    customers: 430,
  },
  {
    week: 'Week 8',
    customers: 550,
  },
];

const newCouponsData = [
  {
    week: 'Week 1',
    coupons: 45,
  },
  {
    week: 'Week 2',
    coupons: 32,
  },
  {
    week: 'Week 3',
    coupons: 48,
  },
  {
    week: 'Week 4',
    coupons: 28,
  },
  {
    week: 'Week 5',
    coupons: 43,
  },
  {
    week: 'Week 6',
    coupons: 39,
  },
  {
    week: 'Week 7',
    coupons: 52,
  },
  {
    week: 'Week 8',
    coupons: 45,
  },
];

const newCustomersChartConfig = {
  customers: {
    label: "Customers",
  },
};

const newCouponsChartConfig = {
  coupons: {
    label: 'Coupons',
  },
};


const DashboardPage = () => {
  return (
    <div className="h-full w-full">
      <h3 className="text-2xl font-semibold">Dashboard</h3>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="my-5 [&[data-state=open]>div>svg]:-rotate-180">
          <div className="flex cursor-pointer items-center">
            <ChevronDown className="mr-2 size-6 transition-transform duration-200" />
            <p className="text-lg font-semibold">Week</p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="grid grid-cols-3 gap-5">
          <ChartCard
            title="New Customers"
            chartData={newCustomersData}
            chartConfig={newCustomersChartConfig}
            chartDataKey="customers"
            timeSpanText="week"
          />
          <ChartCard
            title="New Coupons"
            chartData={newCouponsData}
            chartConfig={newCouponsChartConfig}
            chartDataKey="coupons"
            timeSpanText="week"
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
          <ChartCard
            title="New Customers"
            chartData={newCustomersData}
            chartConfig={newCustomersChartConfig}
            chartDataKey="customers"
            timeSpanText="month"
          />
          <ChartCard
            title="New Coupons"
            chartData={newCouponsData}
            chartConfig={newCouponsChartConfig}
            chartDataKey="coupons"
            timeSpanText="month"
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DashboardPage;
