import { useAuth } from "../../context/AuthContext";
import ProjectSwitcher from "./ProjectSwitcher";
import { useNavigate } from "react-router-dom";
import { useDrawer } from "../../context/DrawerContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toggle } = useDrawer();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex items-center justify-between bg-white shadow px-5 py-3">
      <div className="flex items-center gap-3">
        {/* ✅ Hamburger only on mobile */}
        <button
          onClick={toggle}
          className="lg:hidden border px-3 py-2 rounded hover:bg-gray-50"
          aria-label="Open sidebar drawer"
        >
          ☰
        </button>

        <h1 className="font-bold text-lg">Dependency Risk Dashboard</h1>
      </div>

      <div className="flex gap-4 items-center">
        <ProjectSwitcher />

        <span className="text-sm bg-gray-200 px-3 py-1 rounded">
          {user?.role || "Guest"}
        </span>

        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            aria-label="Logout"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}











// import { useAuth } from "../../context/AuthContext";
// import ProjectSwitcher from "./ProjectSwitcher";

// export default function Navbar() {
//   const { user } = useAuth();

//   return (
//     <div className="flex items-center justify-between bg-white shadow px-5 py-3">
//       <h1 className="font-bold text-lg">Dependency Risk Dashboard</h1>
//       <div className="flex gap-4 items-center">
//         <ProjectSwitcher />
//         <span className="text-sm bg-gray-200 px-3 py-1 rounded">
//           {user?.role}
//         </span>
//       </div>
//     </div>
//   );
// }
