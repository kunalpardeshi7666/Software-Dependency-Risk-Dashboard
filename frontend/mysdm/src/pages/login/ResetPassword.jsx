import { useState } from "react";
import { toast } from "react-toastify";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email required");
    if (!otp.trim()) return toast.error("OTP required");
    if (!newPassword.trim()) return toast.error("New password required");

    try {
      await authApi.resetPassword({ email, otp, newPassword });
      toast.success("Password reset success");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white w-full max-w-md rounded shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>

        <input className="border rounded w-full px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border rounded w-full px-3 py-2" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <input className="border rounded w-full px-3 py-2" placeholder="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

        <button className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
          Reset
        </button>
      </form>
    </div>
  );
}



// import { useState } from "react";
// import { toast } from "react-toastify";
// import { authApi } from "../../api/authApi";

// export default function ResetPassword() {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   const submit = async (e) => {
//     e.preventDefault();

//     if (!email.trim()) return toast.error("Email required");
//     if (!otp.trim()) return toast.error("OTP required");
//     if (!newPassword.trim()) return toast.error("New password required");

//     try {
//       await authApi.resetPassword({ email, otp, newPassword });
//       toast.success("Password reset successful");
//     } catch (err) {
//       toast.error(err?.response?.data?.error || "Reset failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <form
//         onSubmit={submit}
//         className="bg-white w-full max-w-md rounded shadow p-6 space-y-4"
//       >
//         <h1 className="text-2xl font-bold">Reset Password</h1>

//         <input
//           className="border rounded w-full px-3 py-2"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           className="border rounded w-full px-3 py-2"
//           placeholder="OTP"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//         />

//         <input
//           className="border rounded w-full px-3 py-2"
//           placeholder="New Password"
//           type="password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//         />

//         <button className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
//           Reset Password
//         </button>
//       </form>
//     </div>
//   );
// }
