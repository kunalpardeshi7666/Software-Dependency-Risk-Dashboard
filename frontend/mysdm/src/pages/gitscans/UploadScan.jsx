import { useState } from "react";
import { toast } from "react-toastify";
import { scanApi } from "../../api/scanApi";
import {useProject} from "../../context/ProjectContext"
import { useAuth } from "../../context/AuthContext";

export default function UploadScan() {
  const { currentProject } = useProject();
  const { user } = useAuth();

  const [repoUrl, setRepoUrl] = useState("");
  const [sbomJson, setSbomJson] = useState("");
  const [loading, setLoading] = useState(false);

  const projectId = currentProject?.id;

  const submit = async (e) => {
    e.preventDefault();
    if (!projectId) return toast.error("Select a project first");
    if (!repoUrl.trim()) return toast.error("Repo URL required");
    if (!sbomJson.trim()) return toast.error("SBOM JSON required");

    try {
      setLoading(true);

      // ✅ matches CreateScanRunDto (your backend)
      const payload = {
        projectId,
        repoUrl,
        sbomJson,
      };

      await scanApi.createScan(payload);
      toast.success("Scan uploaded successfully");
      setRepoUrl("");
      setSbomJson("");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Upload Dependency Scan</h2>
        <p className="text-sm text-gray-600">
          Role: <b>{user?.role}</b> | Project: <b>{currentProject?.name || "None"}</b>
        </p>
      </div>

      <form onSubmit={submit} className="bg-white rounded shadow p-4 space-y-4">
        <div>
          <label className="text-sm font-medium">Repo URL</label>
          <input
            className="border rounded w-full px-3 py-2"
            placeholder="https://github.com/user/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">SBOM JSON</label>
          <textarea
            className="border rounded w-full px-3 py-2 font-mono text-xs"
            rows={10}
            placeholder='Paste SBOM JSON here (CycloneDX / npm list / etc.)'
            value={sbomJson}
            onChange={(e) => setSbomJson(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload Scan"}
        </button>
      </form>
    </div>
  );
}
