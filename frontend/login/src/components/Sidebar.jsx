import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Dependencies", path: "/dependencies" },
    { name: "License Risks", path: "/license-risks" },
    { name: "Security Risks", path: "/security-risks" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Risk Dashboard</h2>

      <div style={styles.menu}>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.link,
              background: isActive ? "#2563EB" : "transparent",
              color: isActive ? "#fff" : "#111827",
            })}
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      <div style={styles.bottomBox}>
        <p style={styles.bottomText}>Secure • Low Cost • Legal Safe</p>
      </div>
    </div>
  );
};

export default Sidebar;

const styles = {
  sidebar: {
    width: "240px",
    background: "#ffffff",
    borderRight: "1px solid #E5E7EB",
    padding: "18px",
    minHeight: "100vh",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "800",
    marginBottom: "18px",
    color: "#111827",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: "10px",
    fontWeight: "700",
    transition: "0.2s",
  },
  bottomBox: {
    marginTop: "auto",
    paddingTop: "18px",
  },
  bottomText: {
    fontSize: "12px",
    color: "#6B7280",
    fontWeight: "600",
  },
};
