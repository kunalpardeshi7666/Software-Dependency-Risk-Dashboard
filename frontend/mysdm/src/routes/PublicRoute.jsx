import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // ✅ already logged in -> go dashboard
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
