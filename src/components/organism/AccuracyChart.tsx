import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useAppSelector } from "../../store";
import { selectAccuracyChartData } from "../../store/historySlice";

export const AccuracyChart = () => {
  const data = useAppSelector(selectAccuracyChartData);

  if (data.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500">データがありません</p>
    );
  }

  return (
    <div className="w-full h-50 p-4 border border-gray-300 rounded-lg bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "正答率"]}
            labelFormatter={(label) => `${label}回目の回答`}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#2563EB"
            strokeWidth={2}
            dot={{ r: 4, fill: "#2563EB" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
