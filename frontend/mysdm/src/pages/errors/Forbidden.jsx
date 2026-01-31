
import { Link } from "react-router-dom";
export default function Forbidden() {
  return (
    <div className="p-5 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-red-600">403 - Forbidden</h2>
      <p className="text-gray-600 mt-2">You don't have permission.</p>
     <Link to="/" className="text-blue-600 hover:underline mt-3 inline-block">
        Go Dashboard
      </Link>
    </div>
  );
}
