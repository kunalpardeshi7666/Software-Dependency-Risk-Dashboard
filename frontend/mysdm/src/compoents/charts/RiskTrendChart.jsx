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
