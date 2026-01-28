import React, { useState } from "react";
import AuthCard from "../../components/ui/AuthCard";
import { forgotPasswordApi } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await forgotPasswordApi({ email });
      nav("/reset-password", { state: { email } });
    } catch (err) {
      setMsg(err?.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Forgot Password 🔒" subtitle="We will send OTP to your email">
      <form onSubmit={submit}>
        <label style={label}>Email</label>
        <input style={input} value={email} onChange={(e) => setEmail(e.target.value)} required />
        {msg && <p style={error}>{msg}</p>}
        <button style={btn} disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </AuthCard>
  );
}

const input = { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", outline: "none", marginBottom: 12 };
const label = { fontSize: 12, fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 6 };
const btn = { width: "100%", padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 900, color: "#fff", background: "linear-gradient(135deg,#2563eb,#7c3aed)" };
const error = { color: "#b91c1c", background: "#fee2e2", padding: "8px 10px", borderRadius: 12 };
