import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { developerApi } from "../../api/developerApi";
// import DeveloperForm from "./components/developers/DeveloperForm";
import { useAuth } from "../../context/AuthContext";
import DeveloperForm from "./DeveloperForm";
const DevelopersPage = () => {
  const { user } = useAuth(); // ✅ correct
  const role = user?.role;

  const [developers, setDevelopers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const readOnly = role === "ReadOnly";
  const canManage = role === "Admin" || role === "Developer";

  const loadDevelopers = async () => {
    try {
      setLoading(true);
      const res = await developerApi.getAll();
      setDevelopers(res.data || []);
    } catch (error) {
      console.log("Load developers error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch developers ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevelopers();
  }, []);

  const handleCreate = async (data) => {
    try {
      if (!canManage) return toast.error("You don't have permission ❌");

      console.log("CREATE PAYLOAD:", data);

      await developerApi.create(data);

      toast.success("Developer created ✅");
      await loadDevelopers();
    } catch (error) {
      console.log("Create developer error:", error);
      toast.error(error?.response?.data?.message || "Create failed ❌");
    }
  };

  const handleUpdate = async (data) => {
    try {
      if (!canManage) return toast.error("You don't have permission ❌");

      console.log("UPDATE PAYLOAD:", data);

      await developerApi.update(data.developerID, data);

      toast.success("Developer updated ✅");
      setSelected(null);
      await loadDevelopers();
    } catch (error) {
      console.log("Update developer error:", error);
      toast.error(error?.response?.data?.message || "Update failed ❌");
    }
  };

  return (
    <div className="container space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Developers</h2>

        {selected && canManage && (
          <button
            onClick={() => setSelected(null)}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* ✅ Show Form only if Admin/Developer */}
      {canManage && (
        <DeveloperForm
          onSubmit={selected ? handleUpdate : handleCreate}
          initialData={selected}
          readOnly={readOnly}
        />
      )}

      {/* ✅ Table */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Experience</th>
              {canManage && <th className="p-3">Action</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={canManage ? 5 : 4} className="p-4 text-gray-500">
                  Loading developers...
                </td>
              </tr>
            ) : developers.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 5 : 4} className="p-4 text-gray-500">
                  No developers found.
                </td>
              </tr>
            ) : (
              developers.map((d) => (
                <tr key={d.developerID} className="border-b">
                  <td className="p-3 font-medium">{d.developerName}</td>
                  <td className="p-3">{d.email}</td>
                  <td className="p-3">{d.role}</td>
                  <td className="p-3">{d.experience}</td>

                  {canManage && (
                    <td className="p-3">
                      <button
                        onClick={() => setSelected(d)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ ReadOnly message */}
      {readOnly && (
        <p className="text-sm text-gray-600">
          You are in <b>ReadOnly</b> mode — you can only view developers.
        </p>
      )}
    </div>
  );
};

export default DevelopersPage;
