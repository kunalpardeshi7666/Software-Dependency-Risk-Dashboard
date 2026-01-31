import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded shadow p-5 space-y-3">
      <h2 className="text-xl font-bold">My Profile</h2>

      <div className="text-sm space-y-2">
        <p>
          <b>Name:</b> {user?.name || "-"}
        </p>
        <p>
          <b>Role:</b> {user?.role || "-"}
        </p>
      </div>

      <p className="text-xs text-gray-500">
        Profile edit will be added later (Change password, mobile verify, etc.)
      </p>
    </div>
  );
}
