import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../mysdm/src/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-4">Loading...</div>;

  // not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
