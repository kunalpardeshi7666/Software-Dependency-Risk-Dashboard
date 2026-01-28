import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
      role: localStorage.getItem("role"),
      email: localStorage.getItem("email"),
    };
  });

  const saveAuth = ({ accessToken, refreshToken, role, email }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);

    setAuth({ accessToken, refreshToken, role, email });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ accessToken: null, refreshToken: null, role: null, email: null });
  };

  return (
    <AuthContext.Provider value={{ auth, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
