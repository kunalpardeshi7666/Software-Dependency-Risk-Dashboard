// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

/* Layout */
import Layout from "../compoents/layout/Layout";

/* Guards */
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

/* Auth Pages */
import Login from "../pages/login/Login";
import Register from "../pages/login/Register";
import VerifyEmail from "../pages/login/VerifyEmail";
import ForgotPassword from "../pages/login/ForgotPassword";
import ResetPassword from "../pages/login/ResetPassword";

/* Core Pages */
import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/projects/Projects";
import ProjectDetails from "../pages/projects/ProjectDetails";

import Tasks from "../pages/tasks/Tasks";

/* Developers */
import Developers from "../pages/developers/Developers";
import DeveloperDashboard from "../pages/developers/DeveloperDashboard";
import DevelopersPage from "../pages/developers/DevelopersPage";
import DeveloperForm from "../pages/developers/DeveloperForm";

/* Dependencies */
import Dependencies from "../pages/dependencies/Dependencies";
import DependencyDetail from "../pages/dependencies/DependencyDetail";
import DependencyGraph from "../pages/dependencies/DependencyGraph";

/* Scans */
import ScanDashboard from "../pages/gitscans/ScanDashboard";
import UploadScan from "../pages/gitscans/UploadScan";
import ScanDetail from "../pages/gitscans/ScanDetail";

/* History */
import ScanHistory from "../pages/history/ScanHistory";
import ScanDetails from "../pages/history/ScanDetails";
import OutdatedPackages from "../pages/history/OutdatedPackages";
import Vulnerabilities from "../pages/history/Vulnerabilities";

/* Admin / System */
import AdminPanel from "../pages/admin/AdminPanel";
import RolePermissions from "../pages/admin/RolePermissions";
import AuditLogs from "../pages/audit/AuditLogs";
import Reports from "../pages/reports/Reports";


import Modules from "../pages/modules/Modules"
/* User */
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";
import Notifications from "../pages/notifications/Notifications";

/* Errors */
import Forbidden from "../pages/errors/Forbidden";
import NotFound from "../pages/errors/NotFound";
//  Team 
import Team from "../pages/team/Team";
import TeamDetails from "../pages/team/TeamDetails";
import TeamProfiles from "../pages/team/TeamProfiles";
import ProjectsPage from "../pages/projects/ProjectsPage";

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
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
{/* Team */}
  <Route path="/team" element={<Team />} />
<Route path="/team/:id" element={<TeamDetails />} />
<Route path="/team/profiles" element={<TeamProfiles />} />
          {/* Modules */}
         <Route
  path="/modules"
  element={
    <RoleRoute roles={["Admin", "Developer", "Tester"]}>
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

          {/* Developers */}
          <Route element={<ProtectedRoute />}>
  <Route >
    <Route path="/" element={<Dashboard />} />
    <Route path="/developers" element={<Developers />} />
  </Route>
</Route>

          {/* <Route
  path="/developers"
  element={
    <RoleRoute roles={["Admin", "Developer", "Tester"]}>
      <Developers />
    </RoleRoute>
  }
/> */}

          <Route
            path="/developers/dashboard"
            element={
              <RoleRoute roles={["Admin", "Developer"]}>
                <DeveloperDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/developers/form"
            element={
              <RoleRoute roles={["Admin", "Developer"]}>
                <DeveloperForm />
              </RoleRoute>
            }
          />
          <Route
            path="/developers/manage"
            element={
              <RoleRoute roles={["Admin", "Developer"]}>
                <DevelopersPage />
              </RoleRoute>
            }
          />

          {/* Scans */}
          <Route path="/scan-dashboard" element={<ScanDashboard />} />
          <Route path="/upload-scan" element={<UploadScan />} />
          <Route path="/scan/:scanId" element={<ScanDetail />} />

          {/* History */}
          <Route path="/history" element={<ScanHistory />} />
          <Route path="/history/:runId" element={<ScanDetails />} />
          <Route path="/history/:runId/outdated" element={<OutdatedPackages />} />
          <Route
            path="/history/:runId/vulnerabilities"
            element={<Vulnerabilities />}
          />

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
