// import { useState } from "react";
// import api from "../../api/api";
// import { Card,CardContent } from "../../components/ui/Cart";

// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";

// import { Mail, Lock, KeyRound } from "lucide-react";
// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState("login");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const IconInput = ({ icon: Icon, ...props }) => (
//     <div className="relative">
//       <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
//       <Input className="pl-9" {...props} />
//     </div>
//   );

//   /* ---------------- SEND OTP ---------------- */
//   const sendOtp = async () => {
//     if (!email || !password) {
//       setMessage("Please enter email and password");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const res = await api.post("/api/auth/login", {
//         email,
//         password,
//       });

//       setMessage(res.data.message || "OTP sent");
//       setStep("otp");
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- VERIFY OTP ---------------- */
//   const verifyOtp = async () => {
//     if (!otp) {
//       setMessage("Please enter OTP");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const res = await api.post("/api/auth/verify-otp", {
//         email,
//         otp,
//       });

//       if (res.data.token) {
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("userEmail", email);
//         setMessage("Login successful");
//         // navigate("/dashboard");
//       } else {
//         setMessage("Token not received");
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.message || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- RESEND OTP ---------------- */
//   const resendOtp = async () => {
//     try {
//       setLoading(true);
//       setMessage("");

//       const res = await api.post("/api/auth/resend-otp", {
//         email,
//       });

//       setMessage(res.data.message || "OTP resent");
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Resend OTP failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetLogin = () => {
//     setOtp("");
//     setStep("login");
//     setMessage("");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <Card className="w-[420px] shadow-xl rounded-2xl">
//         <CardContent className="p-6">
//           <h1 className="text-2xl font-bold text-center mb-4">Secure Login</h1>

//           {step === "login" && (
//             <div className="space-y-3">
//               <IconInput icon={Mail} placeholder="Email" value={email}
//                 onChange={(e) => setEmail(e.target.value)} />
//               <IconInput icon={Lock} type="password" placeholder="Password"
//                 value={password} onChange={(e) => setPassword(e.target.value)} />
//               <Button className="w-full" onClick={sendOtp} disabled={loading}>
//                 {loading ? "Sending OTP..." : "Send OTP"}
//               </Button>
//             </div>
//           )}

//           {step === "otp" && (
//             <div className="space-y-3">
//               <IconInput icon={KeyRound} placeholder="Enter OTP"
//                 value={otp} onChange={(e) => setOtp(e.target.value)} />
//               <Button className="w-full" onClick={verifyOtp} disabled={loading}>
//                 Verify OTP
//               </Button>
//               <Button variant="outline" onClick={resendOtp}>Resend OTP</Button>
//               <Button variant="ghost" onClick={resetLogin}>Back</Button>
//             </div>
//           )}

//           {message && (
//             <p className="text-sm text-center text-gray-700 mt-4">{message}</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState("login"); // login | otp

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const API = "https://localhost:7012/api/auth"; // ✅ change to your backend port

//   // shadcn Input doesn't support icon prop, so use wrapper
//   const IconInput = ({ icon: Icon, ...props }) => {
//     return (
//       <div className="relative">
//         <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
//         <Input className="pl-9" {...props} />
//       </div>
//     );
//   };

//   // ✅ Step 1: Login -> Send OTP
//   const sendOtp = async () => {
//     if (!email || !password) {
//       setMessage("Please enter email and password");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");
      
//       const res = await fetch(`${API}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setMessage(data.message || "Login failed");
//         return;
//       }

//       setMessage(data.message || "OTP sent ✅");
//       setStep("otp");
//     } catch (err) {
//       setMessage("Server error: unable to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Step 2: Verify OTP -> Get JWT
//   const verifyOtp = async () => {
//     if (!otp) {
//       setMessage("Please enter OTP");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const res = await fetch(`${API}/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setMessage(data.message || "OTP verification failed");
//         return;
//       }

//       if (data.token) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userEmail", email);

//         setMessage("Login successful ✅ Token saved");

//         // ✅ optional redirect after login
//         // window.location.href = "/dashboard";
//       } else {
//         setMessage("Token not received from server");
//       }
//     } catch (err) {
//       setMessage("Server error: unable to verify OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Resend OTP
//   const resendOtp = async () => {
//     if (!email) {
//       setMessage("Please enter email first");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const res = await fetch(`${API}/resend-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(email),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setMessage(data.message || "Resend OTP failed");
//         return;
//       }

//       setMessage(data.message || "OTP resent ✅");
//     } catch (err) {
//       setMessage("Server error: unable to resend OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetLogin = () => {
//     setOtp("");
//     setStep("login");
//     setMessage("");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3">
//       <Card className="w-[420px] shadow-xl rounded-2xl">
//         <CardContent className="p-6">
//           <h1 className="text-2xl font-bold text-center mb-4">Secure Login</h1>

//           {/* ✅ STEP 1: LOGIN */}
//           {step === "login" && (
//             <div className="space-y-3">
//               <IconInput
//                 icon={Mail}
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />

//               <IconInput
//                 icon={Lock}
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />

//               <Button className="w-full" onClick={sendOtp} disabled={loading}>
//                 {loading ? "Sending OTP..." : "Send OTP"}
//               </Button>
//             </div>
//           )}

//           {/* ✅ STEP 2: OTP VERIFY */}
//           {step === "otp" && (
//             <div className="space-y-3">
//               <p className="text-sm text-gray-600">
//                 OTP sent to: <b>{email}</b>
//               </p>

//               <IconInput
//                 icon={KeyRound}
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />

//               <Button className="w-full" onClick={verifyOtp} disabled={loading}>
//                 {loading ? "Verifying..." : "Verify OTP"}
//               </Button>

//               <Button
//                 variant="outline"
//                 className="w-full"
//                 onClick={resendOtp}
//                 disabled={loading}
//               >
//                 Resend OTP
//               </Button>

//               <Button
//                 variant="ghost"
//                 className="w-full"
//                 onClick={resetLogin}
//                 disabled={loading}
//               >
//                 Back
//               </Button>
//             </div>
//           )}

//           {/* ✅ MESSAGE */}
//           {message && (
//             <p className="text-sm text-center text-gray-700 mt-4">{message}</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState } from "react";
import api from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login"); // login | otp
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* -------- SEND OTP -------- */
  const sendOtp = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", { email, password });
      setMessage(res.data.message || "OTP sent");
      setStep("otp");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------- VERIFY OTP -------- */
  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/verify-otp", { email, otp });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", email);
        setMessage("Login successful");
        navigate("/dashboard");
      } else {
        setMessage("Token not received");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------- RESEND OTP -------- */
  const resendOtp = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/resend-otp", { email });
      setMessage(res.data.message || "OTP resent");
    } catch (err) {
      setMessage(err.response?.data?.message || "Resend OTP failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      {step === "login" && (
        <>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br /><br />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />

          <button onClick={sendOtp} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br /><br />

          <button onClick={verifyOtp} disabled={loading}>
            Verify OTP
          </button>

          <button onClick={resendOtp} disabled={loading}>
            Resend OTP
          </button>

          <button onClick={() => setStep("login")}>
            Back
          </button>
        </>
      )}

      <p>{message}</p>

      <Link to="/register">Create new account</Link>
    </div>
  );
}

