import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {Checkbox} from '@/components/ui/checkbox';
import moment from 'moment-timezone';
import {useState} from 'react';
import {Line, LineChart, XAxis} from 'recharts';

const RealtimeTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(
    moment().format('MMMM Do YYYY, hh:mm:ss'),
  );
  setInterval(() => {
    setCurrentTime(moment().format('MMMM Do YYYY, hh:mm:ss'));
  }, 1000);
  return (
    <p className="text-muted-foreground text-sm font-medium">
      Current Time: {currentTime}
    </p>
  );
};

const BarChartCard = ({
  title,
  chartData,
  chartConfig,
  XAxisDataKey,
  lineDataKeys = [],
  todayPeak,
  yesterdayPeak,
  ...props
}) => {
  const [secondaryVisible, setSecondaryVisible] = useState(false);
  const currentHour = moment().hour();
  const data = chartData.filter(item => item.hour <= currentHour);

  return (
    <div
      {...props}
      className="border-border flex flex-col gap-1 rounded-md border p-5">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold">{title}</p>
          <RealtimeTimeDisplay />
        </div>
        <div className="flex flex-col items-start gap-1 md:items-end">
          <div className="flex space-x-2">
            <Checkbox
              checked={secondaryVisible}
              onCheckedChange={checked => {
                setSecondaryVisible(checked);
              }}
              className="border-2"
              id="yesterdayVisible"
            />
            <label
              htmlFor="yesterdayVisible"
              className="text-sm leading-none font-medium">
              Display Yesterday
            </label>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <p className="text-muted-foreground text-sm font-medium">
              Today peak: {todayPeak?.hour}h ({todayPeak?.total} appointments)
            </p>
            <p className="text-muted-foreground text-sm font-medium">
              Yesterday peak: {yesterdayPeak?.hour}h ({yesterdayPeak?.total}{' '}
              appointments)
            </p>
          </div>
        </div>
      </div>
      <ChartContainer className="mt-3 h-48" config={chartConfig}>
        <LineChart
          margin={{
            left: 12,
            right: 12,
            top: 36,
            bottom: 12,
          }}
          accessibilityLayer
          data={data}>
          <XAxis
            dataKey={XAxisDataKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // tickFormatter={value => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          {secondaryVisible ? (
            <>
              {lineDataKeys.map((dataKey, index) => (
                <Line
                  key={index}
                  dataKey={dataKey}
                  type="natural"
                  className={index === 0 ? '' : 'opacity-60'}
                  stroke={index === 0 ? 'var(--primary)' : 'var(--primary-50'}
                  strokeWidth={2}
                  dot={{
                    stroke:
                      index === 0 ? 'var(--primary)' : 'var(--primary-50)',
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              ))}
            </>
          ) : (
            <>
              <Line
                dataKey={lineDataKeys[0]}
                type="natural"
                stroke={'var(--primary)'}
                strokeWidth={2}
                dot={{
                  stroke: 'var(--primary)',
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </>
          )}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default BarChartCard;
