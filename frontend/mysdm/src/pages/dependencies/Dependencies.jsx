import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const MOCK = [
  { name: "axios", version: "1.6.0", severity: "Low", riskScore: 25 },
  { name: "react", version: "18.2.0", severity: "Medium", riskScore: 55 },
  { name: "lodash", version: "4.17.21", severity: "High", riskScore: 78 },
  { name: "express", version: "4.18.2", severity: "Critical", riskScore: 92 },
];

export default function Dependencies() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "Admin";
  const isDev = user?.role === "Developer";
  const isTester = user?.role === "Tester";

  const canMutate = isAdmin || isDev; // tester read-only

  const [filter, setFilter] = useState("All");
  const list = useMemo(() => {
    if (filter === "All") return MOCK;
    return MOCK.filter((x) => x.severity === filter);
  }, [filter]);

  const severityCount = {
    Critical: MOCK.filter((x) => x.severity === "Critical").length,
    High: MOCK.filter((x) => x.severity === "High").length,
    Medium: MOCK.filter((x) => x.severity === "Medium").length,
    Low: MOCK.filter((x) => x.severity === "Low").length,
  };

  const runScan = () => {
    if (!canMutate) return toast.error("Tester has read-only access");
    toast.success("Scan triggered (mock)");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Dependencies & Risk</h2>
          <p className="text-sm text-gray-600">
            {isTester ? "Read-only mode (Tester)" : "View and manage dependency scans"}
          </p>
        </div>

        <button
          onClick={runScan}
          disabled={!canMutate}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
        >
          Run Scan
        </button>
      </div>

      {/* Risk Widgets (clickable drilldown) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <RiskCard label="Critical" value={severityCount.Critical} onClick={() => setFilter("Critical")} />
        <RiskCard label="High" value={severityCount.High} onClick={() => setFilter("High")} />
        <RiskCard label="Medium" value={severityCount.Medium} onClick={() => setFilter("Medium")} />
        <RiskCard label="Low" value={severityCount.Low} onClick={() => setFilter("Low")} />
      </div>

      {/* Filter + Table */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing: <b>{filter}</b>
        </p>
        <button
          className="border px-4 py-2 rounded"
          onClick={() => setFilter("All")}
        >
          Reset
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Package</th>
              <th className="p-3">Version</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Risk Score</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>

          <tbody>
            {list.map((d) => (
              <tr key={d.name} className="border-b">
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3">{d.version}</td>
                <td className="p-3">
                  <span className={badge(d.severity)}>{d.severity}</span>
                </td>
                <td className="p-3">{d.riskScore}</td>
                <td className="p-3">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => navigate(`/dependencies/${d.name}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {!list.length && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={5}>
                  No dependencies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Graph Placeholder */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Dependency Graph (Placeholder)</h3>
        <p className="text-sm text-gray-600">
          This section will render ReactFlow / D3 graph using your API:
          <code className="bg-gray-100 px-2 py-1 rounded ml-2">
            /api/dependency-graph/{`{projectId}`}
          </code>
        </p>
        <div className="mt-3 border rounded p-4 text-sm text-gray-500">
          Nodes + Edges preview will appear here.
        </div>
      </div>
    </div>
  );
}

function RiskCard({ label, value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded shadow p-4 text-left hover:ring-2 hover:ring-gray-900"
      aria-label={`Drilldown ${label} risks`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </button>
  );
}

function badge(sev) {
  if (sev === "Critical") return "text-xs bg-red-100 text-red-700 px-2 py-1 rounded";
  if (sev === "High") return "text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded";
  if (sev === "Medium") return "text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded";
  return "text-xs bg-green-100 text-green-700 px-2 py-1 rounded";
}
