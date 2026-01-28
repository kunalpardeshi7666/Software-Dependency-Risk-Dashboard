import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DeveloperDashboard from "./pages/dashboards/DeveloperDashboard";
import TesterDashboard from "./pages/dashboards/TesterDashboard";

function Unauthorized() {
  return (
    <div style={{ padding: 30 }}>
      <h2>Unauthorized </h2>
      <p>You don’t have access.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/developer" element={
            <ProtectedRoute allowedRoles={["Developer"]}>
              <DeveloperDashboard />
            </ProtectedRoute>
          } />

          <Route path="/tester" element={
            <ProtectedRoute allowedRoles={["Tester"]}>
              <TesterDashboard />
            </ProtectedRoute>
          } />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
