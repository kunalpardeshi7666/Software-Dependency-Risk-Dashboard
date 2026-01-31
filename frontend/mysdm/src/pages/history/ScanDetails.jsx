import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { historyApi } from "../../api/historyApi";

export default function ScanDetails() {
  const { runId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await historyApi.details(runId);
      setData(res.data?.data || res.data);
    } catch {
      toast.error("Failed to load run details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [runId]);

  if (loading) return <div className="bg-white p-4 rounded shadow">Loading...</div>;
  if (!data) return <div className="bg-white p-4 rounded shadow">No data found</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Scan Details</h2>
          <p className="text-sm text-gray-600">{data.repoUrl}</p>
        </div>

        <button
          onClick={() => navigate("/history")}
          className="border px-4 py-2 rounded hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Packages" value={data.totalPackages} />
        <Card title="Outdated" value={data.outdatedPackages} />
        <Card title="Vulnerable" value={data.vulnerablePackages} />
        <Card title="Risk Score" value={data.riskScore} />
      </div>

      <div className="bg-white rounded shadow p-4 space-y-3">
        <h3 className="font-semibold">Actions</h3>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/history/${runId}/outdated`)}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            View Outdated Packages
          </button>

          <button
            onClick={() => navigate(`/history/${runId}/vulnerabilities`)}
            className="border px-4 py-2 rounded hover:bg-gray-50"
          >
            View Vulnerabilities
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Full Result JSON (Preview)</h3>
        <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-80">
          {JSON.stringify(data.result, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}
