import { useParams, Link } from "react-router-dom";

export default function DependencyDetail() {
  const { name } = useParams();

  return (
    <div className="bg-white rounded shadow p-4 space-y-3">
      <h2 className="text-xl font-bold">Dependency Detail</h2>

      <p className="text-gray-600 text-sm">
        Package: <b>{name}</b>
      </p>

      <div className="border rounded p-3 text-sm text-gray-700">
        <p><b>Risk Reasons:</b></p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Outdated version detected</li>
          <li>Known vulnerabilities (CVE) possible</li>
          <li>License compliance needs review</li>
        </ul>
      </div>

      <Link to="/dependencies" className="text-blue-600 hover:underline">
        ← Back to Dependencies
      </Link>
    </div>
  );
}
