import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { role, email }
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load session on app start / refresh
  const loadSession = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const role = localStorage.getItem("role");
      const email = localStorage.getItem("email");

      if (!token || !role) {
        setUser(null);
        setPermissions([]);
        setLoading(false); // ✅ FIX
        return;
      }

      setUser({ role, email });

      // ✅ Fetch permissions from backend
      const res = await authApi.myPermissions();
      setPermissions(res.data || []);
    } catch (err) {
      console.error("Session load failed", err);
      localStorage.clear();
      setUser(null);
      setPermissions([]);
    } finally {
      setLoading(false); // ✅ ALWAYS stop loading
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  // ✅ Login handler
  const login = async (authResponse) => {
    localStorage.setItem("accessToken", authResponse.accessToken);
    localStorage.setItem("refreshToken", authResponse.refreshToken);
    localStorage.setItem("role", authResponse.role);
    localStorage.setItem("email", authResponse.email);

    setUser({
      role: authResponse.role,
      email: authResponse.email,
    });

    try {
      const res = await authApi.myPermissions();
      setPermissions(res.data || []);
    } catch {
      setPermissions([]);
    }

    setLoading(false);
  };

  // ✅ Logout handler
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setPermissions([]);
    setLoading(false);
  };

  // ✅ Permission helper
  const hasPermission = (permission) =>
    permissions.includes(permission);

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        loading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
