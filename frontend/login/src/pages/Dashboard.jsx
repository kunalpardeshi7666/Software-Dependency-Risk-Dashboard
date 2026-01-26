import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const summary = [
    { title: "Total Dependencies", value: "128" },
    { title: "License Risks", value: "12" },
    { title: "Vulnerabilities", value: "7" },
    { title: "Overall Risk Score", value: "24/100" },
  ];

  const recentDependencies = [
    { name: "react", version: "18.2.0", license: "MIT", risk: "Low" },
    { name: "express", version: "4.18.2", license: "MIT", risk: "Low" },
    { name: "mongoose", version: "8.0.0", license: "MIT", risk: "Low" },
    { name: "some-gpl-lib", version: "2.0.1", license: "GPL-3.0", risk: "High" },
  ];

  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.main}>
        <Navbar />

        <div style={styles.content}>
          <h2 style={styles.pageTitle}>Developer Dashboard</h2>
          <p style={styles.pageDesc}>
            View dependency list, legal/license risks and security vulnerabilities
          </p>

          {/* Summary Cards */}
          <div style={styles.cardGrid}>
            {summary.map((item) => (
              <div key={item.title} style={styles.card}>
                <p style={styles.cardTitle}>{item.title}</p>
                <h3 style={styles.cardValue}>{item.value}</h3>
              </div>
            ))}
          </div>

          {/* Dependency Table */}
          <div style={styles.tableCard}>
            <h3 style={styles.tableTitle}>Recent Dependencies</h3>

            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>Dependency</th>
                  <th style={styles.th}>Version</th>
                  <th style={styles.th}>License</th>
                  <th style={styles.th}>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {recentDependencies.map((dep, index) => (
                  <tr key={index} style={styles.tr}>
                    <td style={styles.td}>{dep.name}</td>
                    <td style={styles.td}>{dep.version}</td>
                    <td style={styles.td}>{dep.license}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background:
                            dep.risk === "High"
                              ? "#FEE2E2"
                              : dep.risk === "Medium"
                              ? "#FEF3C7"
                              : "#DCFCE7",
                          color:
                            dep.risk === "High"
                              ? "#991B1B"
                              : dep.risk === "Medium"
                              ? "#92400E"
                              : "#166534",
                        }}
                      >
                        {dep.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Placeholder for charts */}
          <div style={styles.chartRow}>
            <div style={styles.chartCard}>
              <h3 style={styles.tableTitle}>Risk Trend (Weekly)</h3>
              <p style={styles.chartText}>Chart will be here (Recharts/Chart.js)</p>
            </div>

            <div style={styles.chartCard}>
              <h3 style={styles.tableTitle}>License Distribution</h3>
              <p style={styles.chartText}>Pie chart will be here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const styles = {
  wrapper: {
    display: "flex",
    background: "#F9FAFB",
    minHeight: "100vh",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    padding: "18px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "900",
    color: "#111827",
  },
  pageDesc: {
    marginTop: "4px",
    marginBottom: "16px",
    color: "#6B7280",
    fontWeight: "600",
    fontSize: "13px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
    marginBottom: "18px",
  },
  card: {
    background: "#ffffff",
    padding: "16px",
    borderRadius: "14px",
    boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
    border: "1px solid #E5E7EB",
  },
  cardTitle: {
    margin: 0,
    fontSize: "13px",
    color: "#6B7280",
    fontWeight: "700",
  },
  cardValue: {
    margin: 0,
    marginTop: "8px",
    fontSize: "22px",
    fontWeight: "900",
    color: "#111827",
  },
  tableCard: {
    background: "#ffffff",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
  },
  tableTitle: {
    margin: 0,
    marginBottom: "12px",
    fontSize: "15px",
    fontWeight: "900",
    color: "#111827",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thRow: {
    background: "#F3F4F6",
  },
  th: {
    textAlign: "left",
    padding: "10px",
    fontSize: "13px",
    fontWeight: "800",
    color: "#374151",
  },
  tr: {
    borderBottom: "1px solid #E5E7EB",
  },
  td: {
    padding: "10px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
  },
  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "12px",
    display: "inline-block",
  },
  chartRow: {
    marginTop: "16px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "14px",
  },
  chartCard: {
    background: "#ffffff",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
    minHeight: "160px",
  },
  chartText: {
    marginTop: "10px",
    color: "#6B7280",
    fontWeight: "600",
    fontSize: "13px",
  },
};
