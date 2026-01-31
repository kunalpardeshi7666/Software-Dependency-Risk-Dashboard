import { useAuth } from "./AuthContext";

export default function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (user.role !== role) return null;
  return children;
}
