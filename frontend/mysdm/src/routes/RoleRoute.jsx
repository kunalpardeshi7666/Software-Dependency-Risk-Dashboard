import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-4">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ If used as wrapper: <ProtectedRoute>...</ProtectedRoute>
  if (children) return children;

  // ✅ If used as nested route: <Route element={<ProtectedRoute />} />
  return <Outlet />;
}
