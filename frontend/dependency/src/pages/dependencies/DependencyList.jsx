import { useState } from "react";
import { RiskBadge } from "../../components/common/RiskBadge";
import { scanDependencies, scanGithubRepo } from "../../services/dependencyService";

export default function DependencyList() {
  const [file, setFile] = useState(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [data, setData] = useState([]);

  const handleFileScan = async () => {
    const res = await scanDependencies(file);
    setData(res);
  };

  const handleRepoScan = async () => {
    const res = await scanGithubRepo(repoUrl);
    setData(res);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Upload Dependency File</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleFileScan} className="ml-2">Scan</button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">GitHub Repository Scanner</h2>
        <input
          type="text"
          placeholder="https://github.com/user/repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <button onClick={handleRepoScan} className="ml-2">Scan Repo</button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="text-left">
            <th className="p-2">Package</th>
            <th>Version</th>
            <th>License</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.name}>
              <td className="p-2">{d.name}</td>
              <td>{d.version}</td>
              <td>{d.license}</td>
              <td><RiskBadge level={d.risk} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
