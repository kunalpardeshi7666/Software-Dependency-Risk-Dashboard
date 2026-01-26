import { Shield, List, BarChart3, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Item = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg 
       hover:bg-gray-100 dark:hover:bg-gray-700
       ${isActive ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""}`
    }
  >
    <Icon size={18} />
    {children}
  </NavLink>
);

export default function Sidebar() {
  const { role } = AuthContext();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-4 text-xl font-bold">Dependency Scanner</div>

      <nav className="space-y-1 p-4">
        <Item to="/dashboard" icon={BarChart3}>Dashboard</Item>
        <Item to="/dependencies" icon={List}>Dependencies</Item>

        {role === "Admin" && (
          <Item to="/admin/users" icon={Users}>Users</Item>
        )}

        <Item to="/reports" icon={Shield}>Reports</Item>
      </nav>
    </aside>
  );
}
