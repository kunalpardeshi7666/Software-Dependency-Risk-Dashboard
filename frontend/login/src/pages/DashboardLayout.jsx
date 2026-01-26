import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-wrapper">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`main-area ${collapsed ? "expanded" : ""}`}>
        <Navbar />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
