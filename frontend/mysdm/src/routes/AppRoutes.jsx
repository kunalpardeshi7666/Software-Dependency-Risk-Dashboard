import { Routes, Route } from "react-router-dom";

/* Layout */
// import Layout from "../components/layout/Layout";
import Layout from "../compoents/layout/Layout";
/* Guards */
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
// import DevelopersPage from "../pages/developers/DevelopersPage";
import DeveloperDashboard from "../pages/developers/DeveloperDashboard";  
/* Auth Pages */
import Login from "../pages/login/Login";
import Register from "../pages/login/Register";
import VerifyEmail from "../pages/login/VerifyEmail";
import ForgotPassword from "../pages/login/ForgotPassword";
import ResetPassword from "../pages/login/ResetPassword";

/* Core Pages */
import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/projects/Projects";
import Modules from "../pages/modules/Modules";
import Tasks from "../pages/tasks/Tasks";
import ProjectDetails from "../pages/projects/ProjectDetails";

/* Dependency Pages */
import Dependencies from "../pages/dependencies/Dependencies";
import DependencyDetail from "../pages/dependencies/DependencyDetail";
import DependencyGraph from "../pages/dependencies/DependencyGraph";

/* Scan Pages */
import ScanDashboard from "../pages/scans/ScanDashboard";
import UploadScan from "../pages/scans/UploadScan";
import ScanDetail from "../pages/scans/ScanDetail";

/* History Pages */
import ScanHistory from "../pages/history/ScanHistory";
import ScanDetails from "../pages/history/ScanDetails";
import OutdatedPackages from "../pages/history/OutdatedPackages";
import Vulnerabilities from "../pages/history/Vulnerabilities";

/* Admin / System */
import AdminPanel from "../pages/admin/AdminPanel";
import RolePermissions from "../pages/admin/RolePermissions";
import AuditLogs from "../pages/audit/AuditLogs";
import Reports from "../pages/reports/Reports";

/* User */
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";
import Notifications from "../pages/notifications/Notifications";

/* Errors */
import Forbidden from "../pages/errors/Forbidden";
import NotFound from "../pages/errors/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Public Routes (only before login) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* ✅ Protected Routes (only after login) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* User */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />

          {/* Projects */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />

          {/* Modules */}
          <Route
            path="/modules"
            element={
              <RoleRoute roles={["Admin", "Developer"]}>
                <Modules />
              </RoleRoute>
            }
          />

          {/* Tasks */}
          <Route
            path="/tasks"
            element={
              <RoleRoute roles={["Developer"]}>
                <Tasks />
              </RoleRoute>
            }
          />

          {/* Dependencies */}
          <Route path="/dependencies" element={<Dependencies />} />
          <Route path="/dependencies/:name" element={<DependencyDetail />} />
          <Route path="/dependency-graph" element={<DependencyGraph />} />

          {/* Scans */}
          <Route path="/scan-dashboard" element={<ScanDashboard />} />
          <Route path="/upload-scan" element={<UploadScan />} />
          <Route path="/scan/:scanId" element={<ScanDetail />} />
<Route path="/developers" element={<DeveloperDashboard />} />
          {/* History */}
          <Route path="/history" element={<ScanHistory />} />
          <Route path="/history/:runId" element={<ScanDetails />} />
          <Route path="/history/:runId/outdated" element={<OutdatedPackages />} />
          <Route path="/history/:runId/vulnerabilities" element={<Vulnerabilities />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <RoleRoute roles={["Admin"]}>
                <AdminPanel />
              </RoleRoute>
            }
          />

          <Route
            path="/role-permissions"
            element={
              <RoleRoute roles={["Admin"]}>
                <RolePermissions />
              </RoleRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <RoleRoute roles={["Admin"]}>
                <Settings />
              </RoleRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <RoleRoute roles={["Admin"]}>
                <Reports />
              </RoleRoute>
            }
          />
          <Route
  path="/developers"
  element={
    <RoleRoute roles={["Admin", "Developer"]}>
      <DeveloperDashboard />
    </RoleRoute>
  }
/>


          {/* Audit */}
          <Route path="/audit" element={<AuditLogs />} />

          {/* Errors */}
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
