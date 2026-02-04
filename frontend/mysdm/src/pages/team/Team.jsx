import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { teamApi } from "../../api/teamApi";
import { useAuth } from "../../context/AuthContext";

const ROLES = ["Admin", "Developer", "Tester"];

export default function Team() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "Admin";
  const isDev = user?.role === "Developer";
  const readOnly = user?.role === "Tester";
  const canCreate = isAdmin || isDev;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await teamApi.list();
      setMembers(res.data || []);
    } catch {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const name = (m.fullName || "").toLowerCase();
      const email = (m.email || "").toLowerCase();
      return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    });
  }, [members, search]);

  const createMember = async (payload) => {
    if (!canCreate) return toast.error("Only Admin/Developer can add member");

    try {
      await teamApi.create(payload);
      toast.success("Member added");
      loadMembers();
    } catch (err) {
      toast.error("Add member failed");
    }
  };

  const deleteMember = async (id) => {
    if (!isAdmin) return toast.error("Only Admin can delete member");
    if (!window.confirm("Delete this team member?")) return;

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
          <h2 className="text-xl font-bold">Team</h2>
          <p className="text-sm text-gray-600">
            {readOnly ? "Read-only mode (Tester)" : "Manage your team members"}
          </p>
        </div>

        <div className="flex gap-2">
          {canCreate && <CreateMemberModal onCreate={createMember} />}

          <button
            className="border px-4 py-2 rounded hover:bg-gray-50"
            onClick={() => navigate("/team/profiles")}
          >
            Profiles View
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        className="border rounded px-3 py-2 w-full max-w-md"
        placeholder="Search by name/email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      {loading ? (
        <div className="bg-white p-4 rounded shadow">Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Member</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m) => (
                <tr key={m.userID} className="border-b">
                  <td className="p-3">
                    <p className="font-semibold">{m.fullName || "-"}</p>
                    <p className="text-xs text-gray-500">ID: {m.userID}</p>
                  </td>

                  <td className="p-3">{m.email || "-"}</td>

                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-gray-100">
                      {m.role}
                    </span>
                  </td>

                  <td className="p-3">{m.experienceYears ?? "-"}</td>

                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => navigate(`/team/${m.userID}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>

                    {/* ✅ Only Admin can change role using profile update */}
                    {isAdmin && (
                      <RoleChangeModal member={m} onUpdated={loadMembers} />
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => deleteMember(m.userID)}
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
                  <td colSpan={5} className="p-4 text-gray-500">
                    No team members found.
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

/* ===========================
   Create Member Modal
=========================== */
function CreateMemberModal({ onCreate }) {
  const [open, setOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Developer");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (!fullName.trim()) return toast.error("Full name required");
    if (!email.trim()) return toast.error("Email required");

    onCreate({
      fullName: fullName.trim(),
      email: email.trim(),
      role,
      password: password.trim() || null,
    });

    setOpen(false);
    setFullName("");
    setEmail("");
    setRole("Developer");
    setPassword("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-900 text-white px-4 py-2 rounded"
      >
        + Add Member
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow w-full max-w-lg p-4 space-y-3">
            <h3 className="text-lg font-bold">Add Team Member</h3>

            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <select
              className="border rounded px-3 py-2 w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="bg-gray-900 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ===========================
   Admin Role Change Modal
=========================== */
function RoleChangeModal({ member, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(member.role || "Developer");

  const submit = async () => {
    try {
      await teamApi.updateProfile(member.userID, { role });
      toast.success("Role updated");
      setOpen(false);
      onUpdated();
    } catch {
      toast.error("Role update failed");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-gray-900 hover:underline">
        Role
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow w-full max-w-md p-4 space-y-3">
            <h3 className="text-lg font-bold">Change Role</h3>

            <select
              className="border rounded px-3 py-2 w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={submit} className="bg-gray-900 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
