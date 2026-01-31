import { useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function Reports() {
  const [range, setRange] = useState("7d");
  const [severity, setSeverity] = useState("All");

  // ✅ mock results
  const [rows] = useState([
    { id: 1, repo: "repo-a", severity: "Critical", risk: 95, date: "2026-01-29" },
    { id: 2, repo: "repo-b", severity: "High", risk: 75, date: "2026-01-28" },
    { id: 3, repo: "repo-c", severity: "Medium", risk: 55, date: "2026-01-27" },
    { id: 4, repo: "repo-d", severity: "Low", risk: 25, date: "2026-01-26" },
  ]);

  const filtered = useMemo(() => {
    return rows.filter((r) => (severity === "All" ? true : r.severity === severity));
  }, [rows, severity]);

  const exportCSV = () => {
    const csv = [
      ["Repo", "Severity", "Risk", "Date"],
      ...filtered.map((r) => [r.repo, r.severity, r.risk, r.date]),
    ]
      .map((x) => x.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const exportPDF = () => toast.info("PDF export will be added using backend report engine");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Reports</h2>
          <p className="text-sm text-gray-600">Export risk reports by filters</p>
        </div>

        <div className="flex gap-2">
          <button onClick={exportCSV} className="border px-4 py-2 rounded hover:bg-gray-50">
            Export CSV
          </button>
          <button onClick={exportPDF} className="border px-4 py-2 rounded hover:bg-gray-50">
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4 flex flex-wrap gap-3 items-center">
        <select
          className="border rounded px-3 py-2"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>

        <select
          className="border rounded px-3 py-2"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="All">All Severity</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <span className="text-xs text-gray-500">
          (Range filter is UI-only now, will be real after backend)
        </span>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Repo</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-3">{r.repo}</td>
                <td className="p-3">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">{r.severity}</span>
                </td>
                <td className="p-3">{r.risk}</td>
                <td className="p-3 text-gray-600">{r.date}</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500">
                  No records.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
