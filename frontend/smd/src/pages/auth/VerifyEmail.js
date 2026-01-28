import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthCard from "../../components/ui/AuthCard";
import { verifyEmailOtp } from "../../api/auth.api";

export default function VerifyEmail() {
  const nav = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await verifyEmailOtp({ email, otp });
      nav("/login", { replace: true });
    } catch (err) {
      setMsg(err?.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Verify Email ✅" subtitle="Enter OTP received on email">
      <form onSubmit={submit}>
        <label style={label}>Email</label>
        <input style={input} value={email} onChange={(e) => setEmail(e.target.value)} />

        <label style={label}>OTP</label>
        <input style={input} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" required />

        {msg && <p style={error}>{msg}</p>}

        <button style={btn} disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </AuthCard>
  );
}

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  outline: "none",
  marginBottom: 12,
};
const label = { fontSize: 12, fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 6 };
const btn = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  fontWeight: 900,
  color: "#fff",
  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
};
const error = { color: "#b91c1c", background: "#fee2e2", padding: "8px 10px", borderRadius: 12 };
