import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const PERMS = [
  "ProjectCreate",
  "ProjectView",
  "ProjectEdit",
  "ProjectDelete",
  "ProjectManageMembers",
  "ProjectDashboardView",
  "ProjectViewAudit",
  "DependencyScanCreate",
  "DependencyScanView",
  "DependencyGraphView",
  "DependencyHistoryView",
];

const ROLES = ["Admin", "Developer", "Tester", "Viewer"];

export default function RolePermissions() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  // ✅ Hooks ALWAYS on top (no return before hooks)
  const [selectedRole, setSelectedRole] = useState("Admin");

  const [rolePerms, setRolePerms] = useState({
    Admin: PERMS,
    Developer: [
      "ProjectCreate",
      "ProjectView",
      "ProjectEdit",
      "DependencyScanCreate",
      "DependencyScanView",
    ],
    Tester: [
      "ProjectView",
      "DependencyScanView",
      "DependencyGraphView",
      "DependencyHistoryView",
    ],
    Viewer: ["ProjectView"],
  });

  const enabled = useMemo(
    () => rolePerms[selectedRole] || [],
    [rolePerms, selectedRole]
  );

  // ✅ NOW you can return forbidden
  if (!isAdmin) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold text-red-600">403 - Forbidden</h2>
        <p className="text-gray-600 mt-2">Admin only.</p>
      </div>
    );
  }

  const toggle = (perm) => {
    setRolePerms((prev) => {
      const current = prev[selectedRole] || [];
      const updated = current.includes(perm)
        ? current.filter((p) => p !== perm)
        : [...current, perm];
      return { ...prev, [selectedRole]: updated };
    });
  };

  const save = () => {
    toast.success(`Permissions saved for ${selectedRole} (mock)`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Role Permissions</h2>
          <p className="text-sm text-gray-600">
            Permission-driven access control
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <select
            className="border rounded px-3 py-2"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <button
            onClick={save}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">
          Permissions for: {selectedRole}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PERMS.map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 border rounded p-3 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={enabled.includes(p)}
                onChange={() => toggle(p)}
              />
              <span className="text-sm">{p}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
