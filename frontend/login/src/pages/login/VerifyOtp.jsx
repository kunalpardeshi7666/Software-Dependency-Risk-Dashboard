import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem("otpEmail");

  // Redirect if email not present
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      setMsg("OTP expired. Please request a new OTP.");
      return;
    }

    if (otp.length !== 6) {
      setMsg("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.removeItem("otpEmail");

      setMsg("OTP verified. Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "OTP verification failed");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Verify OTP</h2>
      <p>Email: {email}</p>

      <form onSubmit={handleVerifyOtp}>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          maxLength={6}
          pattern="\d*"
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />
        <br /><br />

        <button type="submit" disabled={loading || timeLeft <= 0}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <h3>
        Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
      </h3>

      {timeLeft <= 0 && (
        <p style={{ color: "red" }}>OTP expired</p>
      )}

      <p>{msg}</p>
    </div>
  );
}
