import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api/axiosInstance";

export default function OutdatedPackages() {
  const { runId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/dependency-scans/${runId}/outdated`)
      .then((res) => setData(res.data?.data || res.data || []))
      .catch(() => toast.error("Failed to load outdated packages"))
      .finally(() => setLoading(false));
  }, [runId]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Outdated Packages</h2>
        <button onClick={() => navigate(-1)} className="border px-4 py-2 rounded">
          ← Back
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-4 rounded shadow">Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Package</th>
                <th className="p-3">Current</th>
                <th className="p-3">Latest</th>
              </tr>
            </thead>
            <tbody>
              {data.map((x, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3 font-medium">{x.name || x.packageName}</td>
                  <td className="p-3">{x.currentVersion}</td>
                  <td className="p-3">{x.latestVersion}</td>
                </tr>
              ))}

              {!data.length && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={3}>
                    No outdated packages.
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
