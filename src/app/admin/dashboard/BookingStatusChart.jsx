import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function BookingStatusChart({ bookings }) {
  const statusCount = {
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  };

  bookings.forEach((b) => {
    statusCount[b.status] += 1;
  });

  const data = Object.keys(statusCount).map((key) => ({
    name: key,
    value: statusCount[key],
  }));

  const COLORS = ["#16a34a", "#f59e0b", "#ef4444"];

  return (
    <div className="h-64">
        <div>
            <h3>
                Bookings Status Analysis
            </h3>
        </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}