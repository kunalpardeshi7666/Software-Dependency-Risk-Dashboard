import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load session from localStorage only (NO /auth/me call)
  const loadSession = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const role = localStorage.getItem("role");
      const email = localStorage.getItem("email");

      if (!token || !role) {
        setUser(null);
        setPermissions([]);
        return;
      }

      setUser({ role, email });

      // ✅ only valid endpoint in your backend
      const res = await authApi.myPermissions();
      setPermissions(res.data || []);
    } catch {
      setUser(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const login = (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("role", data.role);
    localStorage.setItem("email", data.email);

    setUser({ role: data.role, email: data.email });
    setLoading(false);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setPermissions([]);
  };

  return (
    <AuthContext.Provider value={{ user, permissions, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
