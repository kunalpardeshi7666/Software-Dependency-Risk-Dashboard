import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { developerApi } from "../../api/developerApi";

const ROLES = ["Admin", "Developer", "Tester"];

export default function Developers() {
  const { user } = useAuth();

  const isAdmin = user?.role === "Admin";
  const readOnly = user?.role === "Tester";

  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDev, setSelectedDev] = useState(null);

  const loadDevelopers = async () => {
    try {
      setLoading(true);
      const res = await developerApi.list();
      setDevelopers(res.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load developers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevelopers();
  }, []);

  const filtered = useMemo(() => {
    return developers.filter((d) => {
      const name = (d.developerName || "").toLowerCase();
      const email = (d.email || "").toLowerCase();
      const q = (search || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [developers, search]);

  // ✅ Create
  const createDeveloper = async (payload) => {
    if (!isAdmin) return toast.error("Only Admin can create developer");

    try {
      await developerApi.create(payload);
      toast.success("Developer created");
      setCreateOpen(false);
      loadDevelopers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Create failed");
    }
  };

  // ✅ Update
  const updateDeveloper = async (payload) => {
    if (!isAdmin) return toast.error("Only Admin can edit developer");

    try {
      await developerApi.update(payload.developerID, payload);
      toast.success("Developer updated");
      setEditOpen(false);
      setSelectedDev(null);
      loadDevelopers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  // ✅ Delete
  const deleteDeveloper = async (id) => {
    if (!isAdmin) return toast.error("Only Admin can delete developer");

    const ok = window.confirm("Are you sure you want to delete this developer?");
    if (!ok) return;

    try {
      await developerApi.remove(id);
      toast.success("Developer deleted");
      loadDevelopers();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Delete failed (backend DELETE API missing?)"
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Developers</h2>
          <p className="text-sm text-gray-600">
            {readOnly ? "Read-only mode (Tester)" : "Manage developers"}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            + Create Developer
          </button>
        )}
      </div>

      {/* Search */}
      <input
        className="border rounded px-3 py-2 w-full max-w-md"
        placeholder="Search by name or email..."
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
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Experience</th>
                <th className="p-3 w-[220px]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((d) => (
                <tr key={d.developerID} className="border-b">
                  <td className="p-3 font-semibold">{d.developerName}</td>
                  <td className="p-3">{d.email}</td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100">
                      {d.role}
                    </span>
                  </td>
                  <td className="p-3">{d.experience ?? 0} yrs</td>

                  <td className="p-3">
                    {readOnly ? (
                      <span className="text-gray-400">Read-only</span>
                    ) : (
                      <div className="flex gap-3">
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedDev(d);
                                setEditOpen(true);
                              }}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteDeveloper(d.developerID)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </>
                        )}

                        {!isAdmin && (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {!filtered.length && (
                <tr>
                  <td colSpan={5} className="p-4 text-gray-500">
                    No developers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <DeveloperModal
        open={createOpen}
        title="Create Developer"
        submitLabel="Create"
        onClose={() => setCreateOpen(false)}
        onSubmit={createDeveloper}
      />

      {/* Edit Modal */}
      <DeveloperModal
        open={editOpen}
        title="Edit Developer"
        submitLabel="Save"
        defaultValues={selectedDev}
        onClose={() => {
          setEditOpen(false);
          setSelectedDev(null);
        }}
        onSubmit={updateDeveloper}
      />
    </div>
  );
}

/* =========================================
   ✅ Developer Create/Edit Modal
========================================= */
function DeveloperModal({
  open,
  title,
  submitLabel,
  onClose,
  onSubmit,
  defaultValues,
}) {
  const [developerName, setDeveloperName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Developer");
  const [experience, setExperience] = useState(0);

  useEffect(() => {
    if (defaultValues) {
      setDeveloperName(defaultValues.developerName || "");
      setEmail(defaultValues.email || "");
      setRole(defaultValues.role || "Developer");
      setExperience(defaultValues.experience ?? 0);
    } else {
      setDeveloperName("");
      setEmail("");
      setRole("Developer");
      setExperience(0);
    }
  }, [defaultValues, open]);

  const submit = () => {
    if (!developerName.trim()) return toast.error("Developer name required");
    if (!email.trim()) return toast.error("Email required");
    if (!ROLES.includes(role)) return toast.error("Invalid role");

    const exp = Number(experience);
    if (Number.isNaN(exp) || exp < 0) return toast.error("Invalid experience");

    onSubmit({
      developerID: defaultValues?.developerID, // for update
      developerName: developerName.trim(),
      email: email.trim(),
      role,
      experience: exp,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow w-full max-w-lg p-4 space-y-3">
        <h3 className="text-lg font-bold">{title}</h3>

        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Developer name"
          value={developerName}
          onChange={(e) => setDeveloperName(e.target.value)}
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
          type="number"
          className="border rounded px-3 py-2 w-full"
          placeholder="Experience (years)"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-gray-900 text-white px-4 py-2 rounded"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
