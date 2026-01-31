import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api/axiosInstance";

export default function Vulnerabilities() {
  const { runId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/dependency-scans/${runId}/vulnerabilities`)
      .then((res) => setData(res.data?.data || res.data || []))
      .catch(() => toast.error("Failed to load vulnerabilities"))
      .finally(() => setLoading(false));
  }, [runId]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Vulnerabilities</h2>
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
                <th className="p-3">Severity</th>
                <th className="p-3">CVE</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((x, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3 font-medium">{x.packageName || x.name}</td>
                  <td className="p-3">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      {x.severity || "High"}
                    </span>
                  </td>
                  <td className="p-3">{x.cve || "-"}</td>
                  <td className="p-3 text-gray-600">{x.description || "-"}</td>
                </tr>
              ))}

              {!data.length && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={4}>
                    No vulnerabilities.
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
