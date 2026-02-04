import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="w-full bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow">
      <h2 className="text-lg font-bold tracking-wide">
        DevDep Dependency System
      </h2>

      <div className="text-sm bg-gray-800 px-4 py-1 rounded">
        Logged in as:{" "}
        <span className="font-semibold">
          {user?.name || user?.email || user?.role || "Guest"}
        </span>
      </div>
    </header>
  );
}
