import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "Admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <p className="text-gray-600 mt-2">
        Welcome {user?.email} ({user?.role})
      </p>
    </div>
  );
}
