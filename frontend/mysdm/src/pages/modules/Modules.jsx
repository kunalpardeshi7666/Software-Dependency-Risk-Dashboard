import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useProject } from "../../context/ProjectContext";
import { moduleApi } from "../../api/moduleApi";

// ✅ MUST MATCH BACKEND ENUM
const STATUS = ["Pending", "InProgress", "Completed", "OnHold", "Blocked"];

export default function Modules() {
  const { user } = useAuth();
  const { currentProject, loadingProjects } = useProject();

  const isAdmin = user?.role === "Admin";
  const isDev = user?.role === "Developer";
  const readOnly = user?.role === "Tester";
  const canManage = isAdmin || isDev;

  // ✅ projectId from ProjectSwitcher
  const projectId =
    currentProject?.id || currentProject?.projectID || currentProject?.ProjectID;

  const projectName =
    currentProject?.name ||
    currentProject?.projectName ||
    currentProject?.ProjectName;

  const [search, setSearch] = useState("");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const normalizeModule = (m) => ({
    moduleID: m.moduleID ?? m.ModuleID,
    projectID: m.projectID ?? m.ProjectID,
    moduleName: m.moduleName ?? m.ModuleName,
    description: m.description ?? m.Description,
    status: m.status ?? m.Status,
  });

  const loadModules = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const res = await moduleApi.listByProject(projectId);
      const data = res.data || [];
      setModules(data.map(normalizeModule));
    } catch {
      toast.error("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reload modules on project change
  useEffect(() => {
    if (projectId) loadModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const filtered = useMemo(() => {
    return modules.filter((m) =>
      (m.moduleName || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [modules, search]);

  // ✅ Create
  const createModule = async (payload) => {
    if (!canManage) return toast.error("Only Admin/Developer allowed");
    if (!projectId) return toast.error("Please select a project");

    try {
      await moduleApi.create({
        ProjectID: projectId,
        ModuleName: payload.moduleName,
        Description: payload.description,
        Status: payload.status,
      });

      toast.success("Module created");
      setCreateOpen(false);
      loadModules();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

  // ✅ Edit open
  const openEdit = (module) => {
    if (!canManage) return;
    setSelectedModule(module);
    setEditOpen(true);
  };

  // ✅ Update full module
  const updateModule = async (payload) => {
    if (!canManage) return toast.error("Only Admin/Developer allowed");
    if (!selectedModule) return;

    try {
      await moduleApi.update(selectedModule.moduleID, {
        ModuleID: selectedModule.moduleID,
        ProjectID: projectId,
        ModuleName: payload.moduleName,
        Description: payload.description,
        Status: payload.status,
      });

      toast.success("Module updated");
      setEditOpen(false);
      setSelectedModule(null);
      loadModules();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  // ✅ Inline Status Update (dropdown)
  const updateStatusInline = async (moduleRow, newStatus) => {
    if (!canManage) return toast.error("Only Admin/Developer allowed");
    if (!STATUS.includes(newStatus)) return toast.error("Invalid status");

    try {
      // ✅ Optimistic UI update
      setModules((prev) =>
        prev.map((m) =>
          m.moduleID === moduleRow.moduleID ? { ...m, status: newStatus } : m
        )
      );

      await moduleApi.update(moduleRow.moduleID, {
        ModuleID: moduleRow.moduleID,
        ProjectID: projectId,
        ModuleName: moduleRow.moduleName,
        Description: moduleRow.description,
        Status: newStatus,
      });

      toast.success("Status updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Status update failed");
      loadModules(); // rollback refresh
    }
  };

  // ✅ Delete
  const deleteModule = async (id) => {
    if (!isAdmin) return toast.error("Only Admin can delete module");
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      await moduleApi.remove(id);
      toast.success("Module deleted");
      loadModules();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✅ Loading projects
  if (loadingProjects) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold">Modules</h2>
        <p className="text-sm text-gray-600">Loading projects...</p>
      </div>
    );
  }

  // ✅ No project selected
  if (!projectId) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold">Modules</h2>
        <p className="text-sm text-gray-600">
          Please select a project to view modules.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ✅ Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">
            Modules{" "}
            <span className="text-gray-500 font-normal text-sm">
              ({projectName || `Project #${projectId}`})
            </span>
          </h2>

          <p className="text-sm text-gray-600">
            {readOnly ? "Read-only mode (Tester)" : "Manage modules per project"}
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            + Create Module
          </button>
        )}
      </div>

      {/* ✅ Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <input
          className="border rounded px-3 py-2 w-full md:max-w-sm"
          placeholder="Search module..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={loadModules}
          className="border px-4 py-2 rounded hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* ✅ Table */}
      {loading ? (
        <div className="bg-white p-4 rounded shadow">Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Module</th>
                <th className="p-3">Status</th>
                <th className="p-3 w-[240px]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m) => (
                <tr key={m.moduleID} className="border-b">
                  <td className="p-3">
                    <p className="font-semibold">{m.moduleName}</p>
                    <p className="text-xs text-gray-500">{m.description || "-"}</p>
                  </td>

                  {/* ✅ Inline Status Dropdown */}
                  <td className="p-3">
                    {canManage && !readOnly ? (
                      <select
                        value={m.status}
                        onChange={(e) => updateStatusInline(m, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {STATUS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <StatusBadge status={m.status} />
                    )}
                  </td>

                  <td className="p-3">
                    {readOnly ? (
                      <span className="text-gray-400">Read-only</span>
                    ) : (
                      <div className="flex gap-3">
                        {canManage && (
                          <button
                            onClick={() => openEdit(m)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => deleteModule(m.moduleID)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        )}

                        {!canManage && !isAdmin && (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {!filtered.length && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={3}>
                    No modules found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Create Modal */}
      <ModuleModal
        open={createOpen}
        title="Create Module"
        submitLabel="Create"
        onClose={() => setCreateOpen(false)}
        onSubmit={createModule}
      />

      {/* ✅ Edit Modal */}
      <ModuleModal
        open={editOpen}
        title="Edit Module"
        submitLabel="Update"
        defaultValues={selectedModule}
        onClose={() => {
          setEditOpen(false);
          setSelectedModule(null);
        }}
        onSubmit={updateModule}
      />
    </div>
  );
}

/* =========================================
   ✅ Status Badge
========================================= */
function StatusBadge({ status }) {
  const map = {
    Pending: "bg-gray-100 text-gray-700",
    InProgress: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    OnHold: "bg-yellow-100 text-yellow-700",
    Blocked: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded font-medium ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================================
   ✅ Modal Component (Create/Edit)
========================================= */
function ModuleModal({
  open,
  title,
  submitLabel,
  onClose,
  onSubmit,
  defaultValues,
}) {
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    if (defaultValues) {
      setModuleName(defaultValues.moduleName || "");
      setDescription(defaultValues.description || "");
      setStatus(defaultValues.status || "Pending");
    } else {
      setModuleName("");
      setDescription("");
      setStatus("Pending");
    }
  }, [defaultValues, open]);

  const submit = () => {
    if (!moduleName.trim()) return toast.error("Module name required");
    if (!STATUS.includes(status)) return toast.error("Invalid status selected");

    onSubmit({
      moduleName: moduleName.trim(),
      description: description.trim(),
      status,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded shadow p-4 space-y-3">
        <h3 className="text-lg font-bold">{title}</h3>

        <input
          className="border rounded w-full px-3 py-2"
          placeholder="Module name"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
        />

        <textarea
          className="border rounded w-full px-3 py-2"
          rows={3}
          placeholder="Module description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="border rounded w-full px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={submit}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
