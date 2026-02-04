import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { teamApi } from "../../api/teamApi";
import { useAuth } from "../../context/AuthContext";

export default function TeamProfiles() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "Admin";

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await teamApi.list();
      setMembers(res.data || []);
    } catch {
      toast.error("Failed to load team profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return members.filter((m) => {
      const fullName = (m.fullName || "").toLowerCase();
      const email = (m.email || "").toLowerCase();
      const role = (m.role || "").toLowerCase();
      const skills = (m.technicalSkills || "").toLowerCase();

      return (
        fullName.includes(q) ||
        email.includes(q) ||
        role.includes(q) ||
        skills.includes(q)
      );
    });
  }, [members, search]);

  const removeMember = async (id) => {
    if (!isAdmin) return toast.error("Only Admin can delete member");

    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      await teamApi.remove(id);
      toast.success("Member deleted");
      loadMembers();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Team Profiles</h2>
          <p className="text-sm text-gray-600">
            Profile cards of all team members
          </p>
        </div>

        <button
          className="border px-4 py-2 rounded hover:bg-gray-50"
          onClick={() => navigate("/team")}
        >
          Back to Team
        </button>
      </div>

      {/* Search */}
      <input
        className="border rounded px-3 py-2 w-full max-w-md"
        placeholder="Search by name / email / role / skills..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Cards */}
      {loading ? (
        <div className="bg-white p-4 rounded shadow">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <ProfileCard
              key={m.userID}
              member={m}
              isAdmin={isAdmin}
              onView={() => navigate(`/team/${m.userID}`)}
              onDelete={() => removeMember(m.userID)}
            />
          ))}

          {!filtered.length && (
            <div className="col-span-full bg-white p-4 rounded shadow text-gray-500">
              No profiles found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ===========================
   Profile Card Component
=========================== */
function ProfileCard({ member, isAdmin, onView, onDelete }) {
  const initials = (member.fullName || member.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="bg-white rounded shadow p-4 space-y-3">
      {/* Top Section */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg">
          {initials}
        </div>

        <div className="min-w-0">
          <p className="font-semibold truncate">
            {member.fullName || "-"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {member.email || "-"}
          </p>
        </div>
      </div>

      {/* Role */}
      <div className="flex justify-between text-sm">
        <p className="text-gray-600">Role</p>
        <span className="px-2 py-1 rounded bg-gray-100 font-semibold">
          {member.role}
        </span>
      </div>

      {/* Experience */}
      <div className="flex justify-between text-sm">
        <p className="text-gray-600">Experience</p>
        <p className="font-semibold">
          {member.experienceYears ?? "-"} yrs
        </p>
      </div>

      {/* Skills */}
      <div className="text-sm">
        <p className="text-gray-600 mb-1">Technical Skills</p>
        <p className="font-semibold line-clamp-2">
          {member.technicalSkills || "-"}
        </p>
      </div>

      {/* Join Date */}
      <div className="flex justify-between text-sm">
        <p className="text-gray-600">Join Date</p>
        <p className="font-semibold">
          {member.joinDate ? member.joinDate.slice(0, 10) : "-"}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onView}
          className="border px-3 py-2 rounded hover:bg-gray-50 text-sm w-full"
        >
          View
        </button>

        {isAdmin && (
          <button
            onClick={onDelete}
            className="border px-3 py-2 rounded text-red-600 hover:bg-red-50 text-sm w-full"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
