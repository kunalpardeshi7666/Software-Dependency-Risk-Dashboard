import EditProjectModal from "./EditProjectModal";

const STATUS = ["Draft", "Active", "Completed", "OnHold"];

export default function ProjectsTable({
  loading,
  projects,
  user,
  onView,
  onEdit,
  onDelete,
  onChangeStatus,
  onAssignTeam,
  onAddModule,
}) {
  const isAdmin = user?.role === "Admin";
  const isDev = user?.role === "Developer";
  const readOnly = user?.role === "Tester";

  if (loading) {
    return <div className="bg-white p-4 rounded shadow">Loading...</div>;
  }

  return (
    <div className="bg-white rounded shadow overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-3">Project</th>
            <th className="p-3">Start</th>
            <th className="p-3">End</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr key={p.projectID} className="border-b">
              <td className="p-3">
                <p className="font-semibold">{p.projectName}</p>
                <p className="text-xs text-gray-500">
                  {p.description || "-"}
                </p>
              </td>

              <td className="p-3">
                {p.startDate ? p.startDate.slice(0, 10) : "-"}
              </td>

              <td className="p-3">
                {p.endDate ? p.endDate.slice(0, 10) : "-"}
              </td>

              <td className="p-3">
                <select
                  className="border rounded px-2 py-1"
                  value={p.status}
                  onChange={(e) => onChangeStatus(p, e.target.value)}
                  disabled={readOnly}
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>

              <td className="p-3">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onView(p.projectID)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>

                  {!readOnly && (
                    <EditProjectModal
                      project={p}
                      onSave={onEdit}
                    />
                  )}

                  <button
                    onClick={() => onAssignTeam(p)}
                    className="text-green-600 hover:underline"
                  >
                    Assign Team
                  </button>

                  {(isAdmin || isDev) && (
                    <button
                      onClick={() => onAddModule(p)}
                      className="text-purple-600 hover:underline"
                    >
                      + Add Module
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => onDelete(p.projectID)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {!projects.length && (
            <tr>
              <td colSpan={5} className="p-4 text-gray-500">
                No projects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
