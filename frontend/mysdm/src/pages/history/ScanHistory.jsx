import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { historyApi } from "../../api/historyApi";
import { useAuth } from "../../context/AuthContext";

export default function ScanHistory() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await historyApi.list();
      setList(res.data?.data || res.data || []);
    } catch {
      toast.error("Failed to load scan history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return list.filter((x) =>
      (x.repoUrl || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [list, search]);

  const remove = async (runId) => {
    if (!isAdmin) return toast.error("Admin only");
    try {
      await historyApi.deleteRun(runId);
      toast.success("Run deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Dependency Scan History</h2>
          <p className="text-sm text-gray-600">All previous analysis runs</p>
        </div>
      </div>

      <input
        className="border rounded px-3 py-2 w-full max-w-lg"
        placeholder="Search by repo url..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search scan history"
      />

      {loading ? (
        <div className="bg-white p-4 rounded shadow">Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Repo</th>
                <th className="p-3">Analyzed</th>
                <th className="p-3">Total</th>
                <th className="p-3">Outdated</th>
                <th className="p-3">Vulnerable</th>
                <th className="p-3">Risk</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((x) => (
                <tr key={x.runId} className="border-b">
                  <td className="p-3">
                    <p className="font-medium">{x.repoUrl}</p>
                    <p className="text-xs text-gray-500">{x.runId}</p>
                  </td>

                  <td className="p-3 text-gray-600">
                    {new Date(x.analyzedAt).toLocaleString()}
                  </td>

                  <td className="p-3">{x.totalPackages}</td>
                  <td className="p-3">{x.outdatedPackages}</td>
                  <td className="p-3">{x.vulnerablePackages}</td>

                  <td className="p-3">
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {x.riskScore}
                    </span>
                  </td>

                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => navigate(`/history/${x.runId}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => remove(x.runId)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {!filtered.length && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={7}>
                    No history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
