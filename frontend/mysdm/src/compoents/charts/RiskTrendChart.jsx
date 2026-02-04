import { LineChart, Line, XAxis, YAxis } from "recharts";

const data = [
  { name: "Jan", risk: 3 },
  { name: "Feb", risk: 5 },
  { name: "Mar", risk: 2 },
];

export default function RiskTrendChart() {
  return (
    <LineChart width={400} height={250} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Line dataKey="risk" />
    </LineChart>
  );
}
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function RiskTrendChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!selectedProjectId) return;
    fetch("http://localhost:19249/api/risk/trend/1")
      .then(res => res.json())
      .then(setData);
  }, [[selectedProjectId]]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="risk"
          stroke="#ef4444"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
