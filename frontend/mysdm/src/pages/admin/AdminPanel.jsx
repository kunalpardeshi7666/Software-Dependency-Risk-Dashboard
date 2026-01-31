import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const ROLES = ["Admin", "Developer", "Tester", "Viewer"];

export default function AdminPanel() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ hooks ke baad hi condition return
  useEffect(() => {
    if (!isAdmin) return;

    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await authApi.getUsers();
        const list = res.data?.data || res.data || [];

        const normalized = list.map((u) => ({
          id: u.id,
          email: u.email,
          role: u.role || u.roles?.[0] || "Developer",
          lockoutEnd: u.lockoutEnd || null,
        }));

        setUsers(normalized);
      } catch (e) {
        toast.error(e?.response?.data?.error || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [isAdmin]);

  const assignRole = async (userId, role) => {
    try {
      await authApi.assignRole({ userId, role });
      toast.success("Role assigned");
    } catch {
      toast.error("Role assign failed");
    }
  };

  const lockUser = async (userId, lock) => {
    try {
      await authApi.lockUser({ userId, lock });
      toast.success(lock ? "User locked" : "User unlocked");
    } catch {
      toast.error("Lock update failed");
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold text-red-600">403 - Forbidden</h2>
        <p className="text-gray-600 mt-2">Admin access only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-gray-600">Users, role assignment, lock/unlock</p>
      </div>

      {loading ? (
        <div className="bg-white p-4 rounded shadow">Loading users...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-3">{u.email}</td>

                  <td className="p-3">
                    <select
                      className="border rounded px-2 py-1"
                      value={u.role}
                      onChange={(e) => assignRole(u.id, e.target.value)}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-3">
                    {u.lockoutEnd ? (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Locked
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      className="border px-3 py-1 rounded hover:bg-gray-50"
                      onClick={() => lockUser(u.id, true)}
                    >
                      Lock
                    </button>
                    <button
                      className="border px-3 py-1 rounded hover:bg-gray-50"
                      onClick={() => lockUser(u.id, false)}
                    >
                      Unlock
                    </button>
                  </td>
                </tr>
              ))}

              {!users.length && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={4}>
                    No users found.
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
