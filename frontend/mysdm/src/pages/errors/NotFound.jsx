import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold text-gray-900">404 - Page Not Found</h2>
      <p className="text-gray-600 mt-2">This page does not exist.</p>

      <Link to="/" className="text-blue-600 hover:underline mt-3 inline-block">
        Go Dashboard
      </Link>
    </div>
  );
}
