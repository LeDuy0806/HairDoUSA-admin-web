import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {Bar, BarChart} from 'recharts';

const BarChartCard = ({
  title,
  chartDataKey,
  chartData,
  chartConfig,
  timeSpanText,
  differenceUnitCharacter = '',
}) => {
  const lastTimeSpanAmount =
    chartData && chartData.length >= 2
      ? chartData[chartData.length - 2][chartDataKey]
      : 0;
  const currentTimeSpanAmount =
    chartData && chartData.length >= 2
      ? chartData[chartData.length - 1][chartDataKey]
      : 0;

  const difference = currentTimeSpanAmount - lastTimeSpanAmount;
  const percentageChange =
    lastTimeSpanAmount > 0
      ? ((difference / lastTimeSpanAmount) * 100).toFixed(0)
      : 0;

  const barColor =
    currentTimeSpanAmount >= lastTimeSpanAmount
      ? 'var(--chart-profit)'
      : 'var(--chart-loss)';

  return (
    <div className="border-border flex flex-col gap-2 rounded-md border p-5">
      <p className="text-sm font-normal">{title}</p>
      <div>
        <p className="text-2xl font-bold">
          {currentTimeSpanAmount - lastTimeSpanAmount >= 0 ? '+' : ''}
          {currentTimeSpanAmount - lastTimeSpanAmount}{differenceUnitCharacter}
        </p>
        <p className="text-muted-foreground text-xs font-normal">
          {percentageChange > 0 ? '+' : ''}
          {percentageChange}% from last {timeSpanText}
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-[76px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey={chartDataKey} fill={barColor} radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default BarChartCard;
