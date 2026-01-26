import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/login/Register";
import Login from "./pages/login/Login";
import VerifyOtp from "./pages/login/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Dependencies from "./pages/Dependencies";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
         <Route
          path="/dependencies"
          element={
            <ProtectedRoute>
              <Dependencies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/license-risks"
          element={
            <ProtectedRoute>
              <Dependencies />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
