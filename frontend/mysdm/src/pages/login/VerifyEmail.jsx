import { useState } from "react";
import { toast } from "react-toastify";
import { authApi } from "../../api/authApi";
import { Link } from "react-router-dom";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email required");
    if (!otp.trim()) return toast.error("OTP required");

    try {
      await authApi.verifyEmail({ email, otp });
      toast.success("Email verified!");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white w-full max-w-md rounded shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold">Verify Email</h1>

        <input className="border rounded w-full px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border rounded w-full px-3 py-2" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />

        <button className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
          Verify
        </button>

        <Link to="/login" className="text-blue-600 hover:underline text-sm">
          Go Login
        </Link>
      </form>
    </div>
  );
}




















// import { useState } from "react";
// import { toast } from "react-toastify";
// import { authApi } from "../../api/authApi";

// export default function VerifyEmail() {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!email.trim()) return toast.error("Email required");
//     if (!otp.trim()) return toast.error("OTP required");

//     try {
//       await authApi.verifyEmail({ email, otp });
//       toast.success("Email verified successfully");
//     } catch (err) {
//       toast.error(err?.response?.data?.error || "Verification failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <form
//         onSubmit={submit}
//         className="bg-white w-full max-w-md rounded shadow p-6 space-y-4"
//       >
//         <h1 className="text-2xl font-bold">Verify Email</h1>

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

//         <button className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
//           Verify
//         </button>
//       </form>
//     </div>
//   );
// }
