import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../../components/ui/AuthCard";
import { registerUser } from "../../api/auth.api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        fullName: form.fullName,
        email: form.email,
        mobileNumber: form.mobileNumber,
        password: form.password,
      });

      // Go verify page
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err) {
      setMsg(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create account 🚀" subtitle="Register and verify OTP to continue">
      <form onSubmit={submit}>
        <label style={label}>Full Name</label>
        <input style={input} value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />

        <label style={label}>Email</label>
        <input style={input} type="email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required />

        <label style={label}>Mobile Number</label>
        <input style={input} value={form.mobileNumber}
          onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} required />

        <label style={label}>Password</label>
        <input style={input} type="password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required />

        <label style={label}>Confirm Password</label>
        <input style={input} type="password" value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />

        {msg && <p style={error}>{msg}</p>}

        <button style={btn} disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <div style={{ marginTop: 12 }}>
          <Link to="/login" style={link}>Already have an account? Login</Link>
        </div>
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
  background: "linear-gradient(135deg,#16a34a,#2563eb)",
};
const link = { fontSize: 13, fontWeight: 700, color: "#4f46e5", textDecoration: "none" };
const error = { color: "#b91c1c", background: "#fee2e2", padding: "8px 10px", borderRadius: 12 };
