import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      <div>
        <h3 style={styles.heading}>Software Dependency Risk Analysis</h3>
        <p style={styles.subheading}>Monitor license, security and legal issues</p>
      </div>

      <div style={styles.userBox}>
        <div style={styles.userInfo}>
          <p style={styles.userName}>{user?.name || "Developer"}</p>
          <p style={styles.userRole}>{user?.role || "User"}</p>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;

const styles = {
  navbar: {
    height: "70px",
    background: "#ffffff",
    borderBottom: "1px solid #E5E7EB",
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#111827",
    margin: 0,
  },
  subheading: {
    fontSize: "12px",
    color: "#6B7280",
    margin: 0,
    marginTop: "2px",
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  userInfo: {
    textAlign: "right",
  },
  userName: {
    margin: 0,
    fontWeight: "800",
    color: "#111827",
    fontSize: "14px",
  },
  userRole: {
    margin: 0,
    fontSize: "12px",
    color: "#6B7280",
    fontWeight: "600",
  },
  logoutBtn: {
    background: "#EF4444",
    color: "#fff",
    border: "none",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
};
