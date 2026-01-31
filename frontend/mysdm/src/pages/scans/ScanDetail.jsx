import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { scanApi } from "../../api/scanApi";

export default function ScanDetail() {
  const { scanId } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    scanApi
      .getDetails(scanId)
      .then((res) => setDetails(res.data?.data || res.data))
      .catch(() => toast.error("Failed to load scan details"))
      .finally(() => setLoading(false));
  }, [scanId]);

  if (loading) return <div className="bg-white p-4 rounded shadow">Loading...</div>;
  if (!details) return <div className="bg-white p-4 rounded shadow">No details found</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Scan Detail</h2>
          <p className="text-sm text-gray-600">{details.repoUrl}</p>
        </div>

        <button onClick={() => navigate(-1)} className="border px-4 py-2 rounded">
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total" value={details.totalPackages} />
        <Card title="Outdated" value={details.outdatedPackages} />
        <Card title="Vulnerable" value={details.vulnerablePackages} />
        <Card title="Risk Score" value={details.riskScore} />
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Drilldown</h3>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate(`/history/${scanId}/outdated`)}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Outdated Packages
          </button>

          <button
            onClick={() => navigate(`/history/${scanId}/vulnerabilities`)}
            className="border px-4 py-2 rounded hover:bg-gray-50"
          >
            Vulnerabilities
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Raw JSON</h3>
        <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-80">
          {JSON.stringify(details, null, 2)}
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
