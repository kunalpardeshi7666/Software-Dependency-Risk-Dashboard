import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
// import { useProject } from "../../context/ProjectContext";
import {useProject} from "../../context/ProjectContext"
import { scanApi } from "../../api/scanApi";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function ScanDashboard() {
  const { currentProject } = useProject();
  const navigate = useNavigate();

  const projectId = currentProject?.id;

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    scanApi
      .listProjectScans(projectId)
      .then((res) => setScans(res.data?.data || res.data || []))
      .catch(() => toast.error("Failed to load scans"))
      .finally(() => setLoading(false));
  }, [projectId]);

  const chartData = useMemo(() => {
    return scans.map((s) => ({
      name: (s.repoUrl || "Repo").slice(0, 12),
      risk: s.riskScore || 0,
      vuln: s.vulnerablePackages || 0,
      outdated: s.outdatedPackages || 0,
    }));
  }, [scans]);

  const exportCSV = () => {
    if (!scans.length) return toast.error("No scans to export");

    const rows = [
      ["RepoUrl", "RiskScore", "TotalPackages", "Outdated", "Vulnerable", "AnalyzedAt"],
      ...scans.map((s) => [
        s.repoUrl,
        s.riskScore,
        s.totalPackages,
        s.outdatedPackages,
        s.vulnerablePackages,
        s.analyzedAt,
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "scan-dashboard.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    // ✅ Placeholder: frontend button (real PDF via backend later)
    toast.info("PDF Export will be added with server-side report generator");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Scan Dashboard</h2>
          <p className="text-sm text-gray-600">
            Project: <b>{currentProject?.name || "None"}</b>
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={exportCSV} className="border px-4 py-2 rounded hover:bg-gray-50">
            Export CSV
          </button>
          <button onClick={exportPDF} className="border px-4 py-2 rounded hover:bg-gray-50">
            Export PDF
          </button>
          <button
            onClick={() => navigate("/upload-scan")}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            + Upload Scan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded shadow p-4">Loading...</div>
      ) : (
        <>
          {/* Chart */}
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Risk / Vulnerabilities / Outdated</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="risk" />
                <Bar dataKey="vuln" />
                <Bar dataKey="outdated" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="bg-white rounded shadow overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3">Repo</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Outdated</th>
                  <th className="p-3">Vulnerable</th>
                  <th className="p-3">Risk</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((s) => (
                  <tr key={s.scanRunId || s.runId || s.id} className="border-b">
                    <td className="p-3">{s.repoUrl}</td>
                    <td className="p-3">{s.totalPackages}</td>
                    <td className="p-3">{s.outdatedPackages}</td>
                    <td className="p-3">{s.vulnerablePackages}</td>
                    <td className="p-3">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {s.riskScore}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => navigate(`/scan/${s.scanRunId || s.runId || s.id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {!scans.length && (
                  <tr>
                    <td colSpan={6} className="p-4 text-gray-500">
                      No scans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
