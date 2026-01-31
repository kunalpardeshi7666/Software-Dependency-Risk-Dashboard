import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { projectApi } from "../../api/projectApi";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      // If you have GET /projects/{id}, use it.
      // For now we re-use list() to find project (works everywhere)
      const res = await projectApi.list();
      const list = res.data?.data || res.data || [];
      const found = list.find((p) => String(p.id || p.projectID) === String(id));
      setProject(found || null);
    } catch {
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <div className="bg-white p-4 rounded shadow">Loading...</div>;
  if (!project) return <div className="bg-white p-4 rounded shadow">Project not found</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{project.name || project.projectName}</h2>
          <p className="text-sm text-gray-600">{project.description || "-"}</p>
        </div>

        <button onClick={() => navigate("/projects")} className="border px-4 py-2 rounded">
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Status" value={project.status || "-"} />
        <Card title="Owner" value={project.ownerEmail || "-"} />
        <Card title="Created" value={project.createdAt ? new Date(project.createdAt).toLocaleString() : "-"} />
      </div>

      <div className="bg-white p-4 rounded shadow space-y-3">
        <h3 className="font-semibold">Quick Actions</h3>

        <div className="flex flex-wrap gap-3">
          <button
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => navigate("/dependencies")}
          >
            View Dependencies
          </button>

          <button
            className="border px-4 py-2 rounded hover:bg-gray-50"
            onClick={() => navigate("/team")}
          >
            Manage Team
          </button>

          <button
            className="border px-4 py-2 rounded hover:bg-gray-50"
            onClick={() => navigate("/audit")}
          >
            View Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
}
