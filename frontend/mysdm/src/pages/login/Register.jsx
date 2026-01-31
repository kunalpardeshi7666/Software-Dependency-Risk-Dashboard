import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return toast.error("Full name required");
    if (!form.email.trim()) return toast.error("Email required");
    if (!form.mobileNumber.trim()) return toast.error("Mobile number required");
    if (!form.password.trim()) return toast.error("Password required");
    if (form.password !== form.confirmPassword) return toast.error("Confirm password mismatch");

    try {
      await authApi.register(form);
      toast.success("Registered! Verify email OTP.");
      navigate("/verify-email");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white w-full max-w-lg rounded shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>

        <input className="border rounded w-full px-3 py-2" name="fullName" placeholder="Full Name" value={form.fullName} onChange={onChange} />
        <input className="border rounded w-full px-3 py-2" name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input className="border rounded w-full px-3 py-2" name="mobileNumber" placeholder="Mobile Number" value={form.mobileNumber} onChange={onChange} />

        <input className="border rounded w-full px-3 py-2" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />
        <input className="border rounded w-full px-3 py-2" name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={onChange} />

        <button className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
          Create Account
        </button>

        <p className="text-sm">
          Already have account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}





// import { useState } from "react";
// import { toast } from "react-toastify";
// import { authApi } from "../../api/authApi";

// export default function Register() {
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     mobileNumber: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const onChange = (e) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const submit = async (e) => {
//     e.preventDefault();

//     if (!form.fullName.trim()) return toast.error("Full name required");
//     if (!form.email.trim()) return toast.error("Email required");
//     if (!form.mobileNumber.trim()) return toast.error("Mobile number required");
//     if (!form.password.trim()) return toast.error("Password required");
//     if (form.password !== form.confirmPassword)
//       return toast.error("Confirm password not match");

//     try {
//       await authApi.register(form);
//       toast.success("Registration successful. OTP sent.");
//     } catch (err) {
//       toast.error(err?.response?.data?.error || "Register failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <form
//         onSubmit={submit}
//         className="bg-white w-full max-w-lg rounded shadow p-6 space-y-4"
//       >
//         <h1 className="text-2xl font-bold">Register</h1>

//         <input
//           className="border rounded w-full px-3 py-2"
//           placeholder="Full Name"
//           name="fullName"
//           value={form.fullName}
//           onChange={onChange}
//         />

//         <input
//           className="border rounded w-full px-3 py-2"
//           placeholder="Email"
//           name="email"
//           value={form.email}
//           onChange={onChange}
//         />

//         <input
//           className="border rounded w-full px-3 py-2"
//           placeholder="Mobile Number"
//           name="mobileNumber"
//           value={form.mobileNumber}
//           onChange={onChange}
//         />

//         <input
//           className="border rounded w-full px-3 py-2"
//           placeholder="Password"
//           type="password"
//           name="password"
//           value={form.password}
//           onChange={onChange}
//         />

//         <input
//           className="border rounded w-full px-3 py-2"
//           placeholder="Confirm Password"
//           type="password"
//           name="confirmPassword"
//           value={form.confirmPassword}
//           onChange={onChange}
//         />

//         <button className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
//           Create Account
//         </button>
//       </form>
//     </div>
//   );
// }
