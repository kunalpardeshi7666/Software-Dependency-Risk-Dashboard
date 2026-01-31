// src/pages/developer/DeveloperDashboard.jsx
import { useEffect, useState } from "react";
import { developerApi } from "../../api/developerApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DeveloperDashboard = () => {
  const { user } = useAuth(); // { role, email }
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);

  const canCreateDeveloper = user?.role === "Admin" || user?.role === "Developer";

  useEffect(() => {
    const loadMyProfile = async () => {
      try {
        const res = await developerApi.getAll();

        const me = res.data.find(
          (d) => d.email.toLowerCase() === user?.email?.toLowerCase()
        );

        setDeveloper(me || null);
      } catch (err) {
        console.log("Error loading developer profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      loadMyProfile();
    }
  }, [user]);

  if (loading) return <p className="p-4">Loading dashboard...</p>;

  if (!developer) {
    return (
      <div className="container">
        <h2>Developer Dashboard</h2>
        <p className="text-red-600">
          Developer profile not found for: {user?.email}
        </p>

        {user?.role === "Admin" && (
          <button
            onClick={() => navigate("/developers")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Create Developer Profile
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2>Developer Dashboard</h2>

        {/* ✅ New Developer button */}
        {canCreateDeveloper && (
          <button
            onClick={() => navigate("/developers")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New Developer
          </button>
        )}
      </div>

      {/* Profile */}
      <section className="card">
        <h3 className="text-lg font-semibold mb-2">Profile</h3>

        <p>
          <b>Name:</b> {developer.developerName}
        </p>
        <p>
          <b>Email:</b> {developer.email}
        </p>
        <p>
          <b>Role:</b> {developer.role}
        </p>
        <p>
          <b>Experience:</b> {developer.experience} yrs
        </p>
      </section>

      {/* Projects section */}
      <section className="card mt-4">
        <h3 className="text-lg font-semibold mb-2">Projects</h3>
        <p>No project assignment API connected yet.</p>
      </section>

      {/* Modules section */}
      <section className="card mt-4">
        <h3 className="text-lg font-semibold mb-2">Modules</h3>
        <p>No module assignment API connected yet.</p>
      </section>

      {/* Tasks section */}
      <section className="card mt-4">
        <h3 className="text-lg font-semibold mb-2">Tasks</h3>
        <p>No task assignment API connected yet.</p>
      </section>
    </div>
  );
};

export default DeveloperDashboard;
