import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Dashboardmain from "../pages/Dashboard";
// import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import DependencyList from "../pages/dependencies/DependencyList";
import Reports from "../pages/reports/Reports";
import Users from "../pages/admin/Users";

export default function RoutesConfig() {
  return (
    <Routes>
      {/* Public route */}
      {/* <Route path="/login" element={<Login />} /> */}

      {/* Protected layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboardmain/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dependencies" element={<DependencyList />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin/users" element={<Users />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
