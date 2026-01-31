import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../../components/ui/AuthCard";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await loginUser(form);

      // ✅ expected response example:
      // { accessToken, refreshToken, role, email }
      saveAuth({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        role: res.role,
        email: res.email || form.email,
      });

      // ✅ Role based routing
      if (res.role === "Admin") navigate("/admin", { replace: true });
      else if (res.role === "Developer") navigate("/developer", { replace: true });
      else if (res.role === "Tester") navigate("/tester", { replace: true });
      else navigate("/", { replace: true });

    } catch (err) {
      setMsg(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back " subtitle="Login to continue">
      <form onSubmit={submit}>
        <label style={label}>Email</label>
        <input
          style={input}
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          required
        />

        <label style={label}>Password</label>
        <input
          style={input}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          required
        />

        {msg && <p style={error}>{msg}</p>}

        <button style={btn} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <Link to="/forgot-password" style={link}>Forgot Password?</Link>
          <Link to="/register" style={link}>Create account</Link>
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
  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
};
const link = { fontSize: 13, fontWeight: 700, color: "#4f46e5", textDecoration: "none" };
const error = { color: "#b91c1c", background: "#fee2e2", padding: "8px 10px", borderRadius: 12 };
