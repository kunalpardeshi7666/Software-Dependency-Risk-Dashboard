import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Dependencies = () => {
  return (
    <div style={{ display: "flex", background: "#F9FAFB", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ padding: 18 }}>
          <h2>Dependencies Page</h2>
          <p>Dependency list table will be shown here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dependencies;
