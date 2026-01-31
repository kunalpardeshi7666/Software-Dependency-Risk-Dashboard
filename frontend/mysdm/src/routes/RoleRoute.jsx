// import { Navigate } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
// import { useAuth } from "../context/AuthContext";

// export default function RoleRoute({ roles = [], children }) {
//   const { user, loading } = useAuth();

//   // ⏳ Wait for auth state to resolve
//   if (loading) {
//     return null; // or a spinner component
//   }

//   // 🔐 Not logged in → handled by ProtectedRoute
//   if (!user) {
//     return <ProtectedRoute />;
//   }

//   // ✅ No roles specified → allow any authenticated user
//   if (roles.length === 0) {
//     return <ProtectedRoute>{children}</ProtectedRoute>;
//   }

//   // 🚫 Role not allowed
//   if (!roles.includes(user.role)) {
//     return <Navigate to="/forbidden" replace />;
//   }

//   // ✅ Authorized
//   return <ProtectedRoute>{children}</ProtectedRoute>;
// }



import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {!roles || roles.includes(user?.role) ? children : <Navigate to="/forbidden" replace />}
    </ProtectedRoute>
  );
}
