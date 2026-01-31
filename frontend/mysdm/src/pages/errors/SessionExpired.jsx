import { Link } from "react-router-dom";

export default function SessionExpired() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold text-red-600">Session Expired</h2>
      <p className="text-gray-600 mt-2">Please login again.</p>

      <Link to="/login" className="text-blue-600 hover:underline mt-3 inline-block">
        Go Login
      </Link>
    </div>
  );
}
