import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email required");
    if (!password.trim()) return toast.error("Password required");

    try {
      setLoading(true);
      const res = await authApi.login({ email, password });
      login(res.data); // {accessToken, refreshToken, role}
      toast.success("Login successful");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white w-full max-w-md rounded shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          className="border rounded w-full px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border rounded w-full px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-sm flex justify-between">
          <Link to="/register" className="text-blue-600 hover:underline">Create account</Link>
          <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot?</Link>
        </div>
      </form>
    </div>
  );
}







// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { api } from "../../mysdm/src/api/axiosInstance";
// import { useAuth } from "../../mysdm/src/context/AuthContext";

// export default function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth();

//   const from = location.state?.from?.pathname || "/";

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async (e) => {
//     e.preventDefault();

//     if (!email.trim()) return toast.error("Email is required");
//     if (!password.trim()) return toast.error("Password is required");

//     try {
//       setLoading(true);

//       // ✅ Your backend: POST /api/auth/login
//       const res = await api.post("/auth/login", { email, password });

//       // Expected response: { accessToken, refreshToken, role, ... }
//       const authResponse = res.data;

//       // ✅ Save tokens + role via context
//       login(authResponse);

//       toast.success("Login successful");
//       navigate(from, { replace: true });
//     } catch (err) {
//       toast.error(err?.response?.data?.error || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <form
//         onSubmit={submit}
//         className="bg-white w-full max-w-md rounded shadow p-6 space-y-4"
//         aria-label="Login Form"
//       >
//         <h1 className="text-2xl font-bold">Login</h1>
//         <p className="text-sm text-gray-600">
//           Sign in to Dependency Risk Dashboard
//         </p>

//         <div className="space-y-1">
//           <label className="text-sm font-medium">Email</label>
//           <input
//             className="border rounded w-full px-3 py-2"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter email"
//             type="email"
//             autoComplete="email"
//             aria-label="Email"
//           />
//         </div>

//         <div className="space-y-1">
//           <label className="text-sm font-medium">Password</label>
//           <input
//             className="border rounded w-full px-3 py-2"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter password"
//             type="password"
//             autoComplete="current-password"
//             aria-label="Password"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }
