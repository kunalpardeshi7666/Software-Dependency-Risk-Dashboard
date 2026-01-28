import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { auth } = useAuth();

  if (!auth.accessToken) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(auth.role))
    return <Navigate to="/unauthorized" replace />;

  return children;
}
