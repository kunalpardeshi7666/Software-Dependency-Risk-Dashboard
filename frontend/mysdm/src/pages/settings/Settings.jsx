import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();

  if (user?.role !== "Admin") {
    return (
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold text-red-600">403 - Forbidden</h2>
        <p className="text-gray-600">Admin settings only.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-5 space-y-4">
      <h2 className="text-xl font-bold">System Settings</h2>

      <div className="space-y-2 text-sm">
        <div className="border rounded p-3">
          <p className="font-semibold">Risk Thresholds</p>
          <p className="text-gray-600">Configure Critical / High / Medium logic</p>
        </div>

        <div className="border rounded p-3">
          <p className="font-semibold">Scan Rules</p>
          <p className="text-gray-600">Auto scan scheduling & notification rules</p>
        </div>

        <div className="border rounded p-3">
          <p className="font-semibold">Audit Retention</p>
          <p className="text-gray-600">Audit log storage & compliance settings</p>
        </div>
      </div>
    </div>
  );
}
