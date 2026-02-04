import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { teamApi } from "../../../api/teamApi";
import { projectTeamApi } from "../../../api/projectTeamApi";
import { useAuth } from "../../../context/AuthContext";

export default function ProjectTeamSection({ projectId }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [allMembers, setAllMembers] = useState([]);
  const [assigned, setAssigned] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [teamRole, setTeamRole] = useState("Member");

  const loadAllMembers = async () => {
    try {
      const res = await teamApi.list();
      setAllMembers(res.data || []);
    } catch {
      toast.error("Failed to load team members");
    }
  };

  const loadAssigned = async () => {
    try {
      const res = await projectTeamApi.listAssigned(projectId);
      setAssigned(res.data || []);
    } catch {
      toast.error("Failed to load assigned members");
    }
  };

  useEffect(() => {
    if (!projectId) return;
    loadAllMembers();
    loadAssigned();
  }, [projectId]);

  const available = useMemo(() => {
    const assignedIds = new Set(assigned.map((x) => x.userID));
    return allMembers.filter((m) => !assignedIds.has(m.userID));
  }, [allMembers, assigned]);

  const assignMember = async () => {
    if (!selectedUserId) return toast.error("Select member first");

    try {
      await projectTeamApi.assign(projectId, {
        userID: selectedUserId,
        teamRole,
      });

      toast.success("Member assigned");
      setSelectedUserId("");
      setTeamRole("Member");
      loadAssigned();
    } catch {
      toast.error("Assign failed");
    }
  };

  const removeMember = async (userId) => {
    if (!isAdmin) return toast.error("Only Admin can remove members");

    try {
      await projectTeamApi.remove(projectId, userId);
      toast.success("Member removed");
      loadAssigned();
    } catch {
      toast.error("Remove failed");
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 space-y-4">
      <h3 className="text-lg font-bold">Project Team</h3>

      {/* ✅ Assign UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          className="border rounded px-3 py-2"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">Select Member</option>
          {available.map((m) => (
            <option key={m.userID} value={m.userID}>
              {m.fullName || m.email} ({m.role})
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={teamRole}
          onChange={(e) => setTeamRole(e.target.value)}
        >
          <option value="Member">Member</option>
          <option value="Lead">Lead</option>
          <option value="Reviewer">Reviewer</option>
          <option value="Tester">Tester</option>
        </select>

        <button
          className="bg-gray-900 text-white px-4 py-2 rounded"
          onClick={assignMember}
        >
          Assign
        </button>
      </div>

      {/* ✅ Assigned Team List */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-3">Member</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {assigned.map((x) => (
            <tr key={x.userID} className="border-b">
              <td className="p-3">{x.fullName || "-"}</td>
              <td className="p-3">{x.email}</td>
              <td className="p-3">{x.teamRole}</td>
              <td className="p-3">
                {isAdmin ? (
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => removeMember(x.userID)}
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
                No team assigned yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
