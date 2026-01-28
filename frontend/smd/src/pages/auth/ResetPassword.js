import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthCard from "../../components/ui/AuthCard";
import { resetPasswordApi } from "../../api/auth.api";

export default function ResetPassword() {
  const nav = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await resetPasswordApi({ email, otp, newPassword });
      nav("/login", { replace: true });
    } catch (err) {
      setMsg(err?.response?.data?.error || "Reset password failed");
    }
  };

  return (
    <AuthCard title="Reset Password ✅" subtitle="Enter OTP and set new password">
      <form onSubmit={submit}>
        <label style={label}>Email</label>
        <input style={input} value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label style={label}>OTP</label>
        <input style={input} value={otp} onChange={(e) => setOtp(e.target.value)} required />

        <label style={label}>New Password</label>
        <input style={input} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />

        {msg && <p style={error}>{msg}</p>}

        <button style={btn}>Reset Password</button>
      </form>
    </AuthCard>
  );
}

const input = { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", outline: "none", marginBottom: 12 };
const label = { fontSize: 12, fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 6 };
const btn = { width: "100%", padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 900, color: "#fff", background: "linear-gradient(135deg,#16a34a,#2563eb)" };
const error = { color: "#b91c1c", background: "#fee2e2", padding: "8px 10px", borderRadius: 12 };
