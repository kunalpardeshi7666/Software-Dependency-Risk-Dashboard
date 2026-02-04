import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { projectApi } from "../../api/projectApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const STATUS = ["Draft", "Active", "Completed", "OnHold"];

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "Admin";
  const isDev = user?.role === "Developer";
  const readOnly = user?.role === "Tester";

  const canCreate = isAdmin || isDev;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await projectApi.list();
      setProjects(res.data || []);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) =>
      (p.projectName || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  const createProject = async (payload) => {
    if (!canCreate) return toast.error("Only Admin/Developer can create project");

    try {
      await projectApi.create(payload);
      toast.success("Project created");
      loadProjects();
    } catch {
      toast.error("Create failed");
    }
  };

  const updateProject = async (payload) => {
    if (readOnly) return toast.error("Tester is read-only");

    try {
      await projectApi.update(payload.projectID, payload);
      toast.success("Project updated");
      loadProjects();
    } catch {
      toast.error("Update failed");
    }
  };

  const changeStatus = async (project, status) => {
    if (readOnly) return toast.error("Tester is read-only");

    try {
      await projectApi.update(project.projectID, {
        projectID: project.projectID,
        projectName: project.projectName,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status
      });

      toast.success("Status updated");
      loadProjects();
    } catch {
      toast.error("Status update failed");
    }
  };

  const removeProject = async (id) => {
    if (!isAdmin) return toast.error("Only Admin can delete project");

    try {
      await projectApi.remove(id);
      toast.success("Project deleted");
      loadProjects();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Projects</h2>
          <p className="text-sm text-gray-600">
            {readOnly ? "Read-only mode (Tester)" : "Create and manage projects"}
          </p>
        </div>

        {canCreate && <CreateProjectModal onCreate={createProject} />}
      </div>

      <input
        className="border rounded px-3 py-2 w-full max-w-md"
        placeholder="Search project..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="bg-white p-4 rounded shadow">Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Project</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr key={p.projectID} className="border-b">
                  <td className="p-3">
                    <p className="font-semibold">{p.projectName}</p>
                    <p className="text-xs text-gray-500">{p.description || "-"}</p>
                  </td>

                  <td className="p-3">
                    <select
                      className="border rounded px-2 py-1"
                      value={p.status}
                      onChange={(e) => changeStatus(p, e.target.value)}
                      disabled={readOnly}
                    >
                      {STATUS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => navigate(`/projects/${p.projectID}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>

                    {!readOnly && (
                      <EditProjectModal
                        project={p}
                        onSave={updateProject}
                      />
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => removeProject(p.projectID)}
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
                  <td colSpan={3} className="p-4 text-gray-500">
                    No projects found.
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

/* -------------------- Create Modal -------------------- */

function CreateProjectModal({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    if (!name.trim()) return toast.error("Project name required");

    onCreate({
      projectName: name.trim(),
      description: desc.trim(),
      status: "Draft"
    });

    setOpen(false);
    setName("");
    setDesc("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-900 text-white px-4 py-2 rounded"
      >
        + Create Project
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow w-full max-w-lg p-4 space-y-3">
            <h3 className="text-lg font-bold">Create Project</h3>

            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="border rounded px-3 py-2 w-full"
              rows={3}
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={submit}
                className="bg-gray-900 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* -------------------- Edit Modal -------------------- */

function EditProjectModal({ project, onSave }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(project.projectName);
  const [desc, setDesc] = useState(project.description || "");

  const submit = () => {
    if (!name.trim()) return toast.error("Name required");

    onSave({
      projectID: project.projectID,
      projectName: name.trim(),
      description: desc.trim(),
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status
    });

    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-gray-900 hover:underline">
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow w-full max-w-lg p-4 space-y-3">
            <h3 className="text-lg font-bold">Edit Project</h3>

            <input
              className="border rounded px-3 py-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="border rounded px-3 py-2 w-full"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={submit}
                className="bg-gray-900 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

