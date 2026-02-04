import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { teamApi } from "../../../api/teamApi";
import { projectTeamApi } from "../../../api/projectTeamApi";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../../context/AuthContext";
function AssignTeamModal({ project, onClose }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [allMembers, setAllMembers] = useState([]);
  const [assigned, setAssigned] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [teamRole, setTeamRole] = useState("Member");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [membersRes, assignedRes] = await Promise.all([
        teamApi.list(),
        projectTeamApi.listAssigned(project.projectID),
      ]);

      setAllMembers(membersRes.data || []);
      setAssigned(assignedRes.data || []);
    } catch {
      toast.error("Failed to load project team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [project.projectID]);

  const availableMembers = useMemo(() => {
    const assignedIds = new Set(assigned.map((x) => x.userID));
    return allMembers.filter((m) => !assignedIds.has(m.userID));
  }, [allMembers, assigned]);

  const assignMember = async () => {
    if (!selectedUserId) return toast.error("Select team member");

    try {
      await projectTeamApi.assign(project.projectID, {
        userID: selectedUserId,
        teamRole,
      });

      toast.success("Member assigned");
      setSelectedUserId("");
      setTeamRole("Member");
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Assign failed");
    }
  };

  const removeMember = async (userId) => {
    if (!isAdmin) return toast.error("Only Admin can remove");

    if (!window.confirm("Remove member from project?")) return;

    try {
      await projectTeamApi.remove(project.projectID, userId);
      toast.success("Member removed");
      loadData();
    } catch {
      toast.error("Remove failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow w-full max-w-3xl p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Assign Team</h3>
            <p className="text-sm text-gray-600">
              Project: <b>{project.projectName}</b>
            </p>
          </div>

          <button
            onClick={onClose}
            className="border px-3 py-2 rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="p-3 text-gray-600">Loading...</div>
        ) : (
          <>
            {/* Assign Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                className="border rounded px-3 py-2 w-full"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Select team member</option>
                {availableMembers.map((m) => (
                  <option key={m.userID} value={m.userID}>
                    {m.fullName || m.email} ({m.role})
                  </option>
                ))}
              </select>

              <select
                className="border rounded px-3 py-2 w-full"
                value={teamRole}
                onChange={(e) => setTeamRole(e.target.value)}
              >
                <option value="Member">Member</option>
                <option value="Lead">Lead</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Tester">Tester</option>
              </select>

              <button
                onClick={assignMember}
                className="bg-gray-900 text-white px-4 py-2 rounded"
              >
                Assign
              </button>
            </div>

            {/* Assigned Table */}
            <div className="bg-gray-50 rounded p-2 overflow-auto">
              <table className="w-full text-sm">
               <thead>
  <tr className="border-b text-left">
    <th className="p-3">Member</th>
    <th className="p-3">Email</th>
    <th className="p-3">Team Role</th>
    <th className="p-3">Profile</th>   {/* ✅ NEW */}
    <th className="p-3">Action</th>
  </tr>
</thead>



                <tbody>
                  {assigned.map((x) => (
                    <tr key={x.userID} className="border-b">
                     <td className="p-3">
  <button
    onClick={() => window.open(`/team/${x.userID}`, "_blank")}
    className="text-blue-600 hover:underline font-semibold"
  >
    {x.fullName || "View Profile"}
  </button>
</td>
<td className="p-3 font-semibold">{x.fullName || "-"}</td>
<td className="p-3">{x.email || "-"}</td>
<td className="p-3">{x.teamRole}</td>

{/* ✅ NEW Profile button */}
<td className="p-3">
  <button
    onClick={() => window.open(`/team/${x.userID}`, "_blank")}
    className="text-blue-600 hover:underline"
  >
    View
  </button>
</td>

<td className="p-3">
  {isAdmin ? (
    <button
      onClick={() => removeMember(x.userID)}
      className="text-red-600 hover:underline"
    >
      Remove
    </button>
  ) : (
    <span className="text-gray-400">Admin only</span>
  )}
</td>

                      <td className="p-3">{x.email || "-"}</td>
                      <td className="p-3">{x.teamRole}</td>
                      <td className="p-3">
                        {isAdmin ? (
                          <button
                            onClick={() => removeMember(x.userID)}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="text-gray-400">Admin only</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {!assigned.length && (
                    <tr>
                      <td colSpan={4} className="p-4 text-gray-500">
                        No members assigned to this project.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AssignTeamModal;
