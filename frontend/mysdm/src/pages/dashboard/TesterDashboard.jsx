import { useNavigate } from "react-router-dom";

export default function TesterDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Tester Dashboard (Read-only)</h2>
        <p className="text-sm text-gray-600">
          You can review dependency scans, risk levels and graph only.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Critical Issues" value="4" onClick={() => navigate("/dependencies")} />
        <Card title="High Issues" value="8" onClick={() => navigate("/dependencies")} />
        <Card title="Outdated Packages" value="12" onClick={() => navigate("/dependencies")} />
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold">Quick Actions</h3>
        <div className="flex gap-3 mt-3 flex-wrap">
          <button
            onClick={() => navigate("/dependencies")}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            View Risk Table
          </button>

          <button
            onClick={() => navigate("/dependency-graph")}
            className="border px-4 py-2 rounded hover:bg-gray-50"
          >
            View Dependency Graph
          </button>

          <button
            onClick={() => navigate("/audit")}
            className="border px-4 py-2 rounded hover:bg-gray-50"
          >
            View Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, onClick }) {
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
