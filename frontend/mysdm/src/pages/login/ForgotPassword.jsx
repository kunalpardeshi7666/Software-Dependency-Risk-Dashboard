import { useState } from "react";
import { toast } from "react-toastify";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email required");

    try {
      await authApi.forgotPassword({ email });
      toast.success("OTP sent (if email exists)");
      navigate("/reset-password");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white w-full max-w-md rounded shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold">Forgot Password</h1>

        <input className="border rounded w-full px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <button className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
          Send OTP
        </button>
      </form>
    </div>
  );
}














// import { useState } from "react";
// import { toast } from "react-toastify";
// import { authApi } from "../../api/authApi";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!email.trim()) return toast.error("Email required");

//     try {
//       await authApi.forgotPassword({ email });
//       toast.success("OTP sent if email exists");
//     } catch (err) {
//       toast.error(err?.response?.data?.error || "Failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <form
//         onSubmit={submit}
//         className="bg-white w-full max-w-md rounded shadow p-6 space-y-4"
//       >
//         <h1 className="text-2xl font-bold">Forgot Password</h1>

//         <input
//           className="border rounded w-full px-3 py-2"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <button className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
//           Send OTP
//         </button>
//       </form>
//     </div>
//   );
// }
