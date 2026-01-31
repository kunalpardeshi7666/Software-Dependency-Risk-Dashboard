import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDrawer } from "../../context/DrawerContext";

export default function Sidebar() {
  const { user } = useAuth();
  const { open, close } = useDrawer();

 const menu = [
  { label: "Dashboard", path: "/", roles: ["Admin", "Developer", "Tester"] },
  { label: "Projects", path: "/projects", roles: ["Admin", "Developer", "Tester"] },
  { label: "Modules", path: "/modules", roles: ["Admin", "Developer"] },
  { label: "Tasks", path: "/tasks", roles: ["Developer"] },

  // ✅ NEW
  { label: "Developers", path: "/developers", roles: ["Admin", "Developer"] },

  { label: "Dependencies", path: "/dependencies", roles: ["Admin", "Developer", "Tester"] },
  { label: "Dependency Graph", path: "/dependency-graph", roles: ["Admin", "Developer", "Tester"] },

  { label: "Scan Dashboard", path: "/scan-dashboard", roles: ["Admin", "Developer", "Tester"] },
  { label: "Upload Scan", path: "/upload-scan", roles: ["Admin", "Developer", "Tester"] },

  { label: "Scan History", path: "/history", roles: ["Admin", "Developer", "Tester"] },
  { label: "Audit Logs", path: "/audit", roles: ["Admin", "Developer", "Tester"] },

  { label: "Reports", path: "/reports", roles: ["Admin", "Developer", "Tester"] },
  { label: "Notifications", path: "/notifications", roles: ["Admin", "Developer", "Tester"] },

  { label: "Profile", path: "/profile", roles: ["Admin", "Developer", "Tester"] },

  { label: "Settings", path: "/settings", roles: ["Admin"] },
  { label: "Admin Panel", path: "/admin", roles: ["Admin"] },
  { label: "Role Permissions", path: "/role-permissions", roles: ["Admin"] },
];


  const filtered = menu.filter((m) => m.roles.includes(user?.role));

  return (
    <>
      {/* ✅ Overlay (mobile) */}
      {open && (
        <button
          onClick={close}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 z-50 h-full w-72
          bg-gray-900 text-white p-5
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl">Menu</h2>

          <button
            onClick={close}
            className="lg:hidden px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="text-xs bg-gray-800 px-3 py-2 rounded mb-4">
          Signed in as: <b>{user?.role}</b>
        </div>

        <ul className="space-y-2">
          {filtered.map((m) => (
            <li key={m.path}>
              <NavLink
                to={m.path}
                onClick={close}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded transition ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-800"
                  }`
                }
              >
                {m.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
