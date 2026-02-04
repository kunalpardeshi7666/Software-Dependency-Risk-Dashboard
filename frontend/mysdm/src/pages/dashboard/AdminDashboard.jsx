import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const riskTrend = [
  { day: "Mon", risk: 30 },
  { day: "Tue", risk: 55 },
  { day: "Wed", risk: 40 },
  { day: "Thu", risk: 70 },
  { day: "Fri", risk: 65 },
  { day: "Sat", risk: 50 },
  { day: "Sun", risk: 35 },
];

const severityData = [
  { name: "Critical", value: 4 },
  { name: "High", value: 8 },
  { name: "Medium", value: 15 },
  { name: "Low", value: 22 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <button
  onClick={() => navigate("/admin")}
  className="bg-gray-900 text-white px-4 py-2 rounded"
>
  Go to Admin Panel →
</button>

      <div>
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <p className="text-sm text-gray-600">
          KPIs, trends, risk overview, recent activity
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Total Projects" value="12" onClick={() => navigate("/projects")} />
        <KpiCard title="High Risk Packages" value="7" onClick={() => navigate("/dependencies")} />
        <KpiCard title="Total Scans" value="28" onClick={() => navigate("/scan-dashboard")} />
        <KpiCard title="Users" value="9" onClick={() => navigate("/admin")} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Risk Trend (7 days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={riskTrend}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#111827" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {severityData.map((_, i) => (
                  <Cell key={i} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <button
            onClick={() => navigate("/dependencies")}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            View all vulnerabilities →
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}

function KpiCard({ title, value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded shadow p-4 text-left hover:ring-2 hover:ring-gray-900"
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </button>
  );
}

function RecentActivity() {
  const activity = [
    { msg: "Project created: Dependency Risk Dashboard", time: "10:10 AM" },
    { msg: "Member added: Amit (Developer)", time: "10:20 AM" },
    { msg: "Scan uploaded successfully", time: "10:45 AM" },
    { msg: "Role updated: Rahul → Tester", time: "11:10 AM" },
  ];

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-3">Recent Activity</h3>
      <ul className="space-y-2 text-sm">
        {activity.map((a, i) => (
          <li key={i} className="flex justify-between border-b pb-2">
            <span className="text-gray-700">{a.msg}</span>
            <span className="text-gray-400">{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
