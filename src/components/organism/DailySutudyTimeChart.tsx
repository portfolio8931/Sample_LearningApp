import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useAppSelector } from "../../store";
import { selectDailyStudyTimeChartData } from "../../store/historySlice";

export const DailyStudyTimeChart = () => {
  const chartData = useAppSelector(selectDailyStudyTimeChartData);

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white h-50 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} unit="分" />
          <Tooltip
            formatter={(value) => [`${value} 分`, "学習時間"]}
            labelFormatter={(label) => `日付: ${label}`}
          />
          <Bar dataKey="minutes" fill="#2563EB" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
