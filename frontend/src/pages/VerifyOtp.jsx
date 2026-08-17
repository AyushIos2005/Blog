import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { verifyOtp } from "../api/endpoints";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp({ email: email.trim(), otp: otp.trim() });
      setSuccess(res.data.message || "Verified successfully");
      setTimeout(() => navigate("/app/home"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="OTP"
      title="Verify your email"
      subtitle="Enter the 8-digit code we emailed you"
      footer={
        <span className="text-[var(--color-ink-soft)]">
          Wrong account?{" "}
          <Link to="/register" className="text-[var(--color-brand-600)] font-semibold">
            Go back
          </Link>
        </span>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
            {success}
          </p>
        )}
        <div>
          <label className="text-sm font-medium block mb-1.5">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">OTP Code</label>
          <input
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="12345678"
            maxLength={8}
            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none tracking-[0.5em] text-center font-semibold focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full brand-gradient text-white font-semibold rounded-xl py-2.5 text-sm disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </AuthShell>
  );
}
