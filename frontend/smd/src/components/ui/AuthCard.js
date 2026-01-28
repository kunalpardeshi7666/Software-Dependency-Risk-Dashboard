import React from "react";
import { motion } from "framer-motion";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div style={styles.wrap}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={styles.card}
      >
        <div style={{ marginBottom: 14 }}>
          <h2 style={styles.title}>{title}</h2>
          <p style={styles.sub}>{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg,#eef2ff,#f5f3ff,#ecfeff)",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    padding: 18,
    border: "1px solid #eef2ff",
  },
  title: { margin: 0, fontWeight: 900, fontSize: 22 },
  sub: { margin: "6px 0 0", color: "#6b7280", fontSize: 13 },
};
