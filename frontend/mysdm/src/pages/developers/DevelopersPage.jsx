import { useEffect, useState } from "react";
import { developerApi } from "../../api/developerApi";
import DeveloperForm from "../../components/developers/DeveloperForm";
import { useAuth } from "../../context/AuthContext";

const DevelopersPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [selected, setSelected] = useState(null);
  const { role } = useAuth();

  const readOnly = role === "ReadOnly";

  const loadDevelopers = async () => {
    const res = await developerApi.getAll();
    setDevelopers(res.data);
  };

  useEffect(() => {
    loadDevelopers();
  }, []);

  const handleCreate = async (data) => {
    try {
      if (readOnly) return;

      console.log("CREATE PAYLOAD:", data);

      await developerApi.create(data);

      await loadDevelopers();
      alert("Developer created ✅");
    } catch (error) {
      console.log("Create developer error:", error);
      alert(error?.response?.data?.message || "Create failed ❌ Check console");
    }
  };

  const handleUpdate = async (data) => {
    try {
      if (readOnly) return;

      console.log("UPDATE PAYLOAD:", data);

      await developerApi.update(data.developerID, data);

      setSelected(null);
      await loadDevelopers();
      alert("Developer updated ✅");
    } catch (error) {
      console.log("Update developer error:", error);
      alert(error?.response?.data?.message || "Update failed ❌ Check console");
    }
  };

  return (
    <div className="container">
      <h2>Developers</h2>

      {(role === "Admin" || role === "Developer") && (
        <DeveloperForm
          onSubmit={selected ? handleUpdate : handleCreate}
          initialData={selected}
          readOnly={readOnly}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Experience</th>
            {(role === "Admin" || role === "Developer") && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {developers.map((d) => (
            <tr key={d.developerID}>
              <td>{d.developerName}</td>
              <td>{d.email}</td>
              <td>{d.role}</td>
              <td>{d.experience}</td>

              {(role === "Admin" || role === "Developer") && (
                <td>
                  <button onClick={() => setSelected(d)}>Edit</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DevelopersPage;
