import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { forgetPassword, resetPassword } from "../api/endpoints";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: request otp, 2: reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await forgetPassword({ email });
      setInfo(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword({ email, otp, newPassword, confirmNewPassword });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="CH"
      title={step === 1 ? "Forgot password" : "Reset password"}
      subtitle={step === 1 ? "We'll email you a reset code" : `Enter the code sent to ${email}`}
      footer={
        <Link to="/login" className="text-[var(--color-brand-600)] font-semibold text-sm">
          Back to login
        </Link>
      }
    >
      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}
      {info && step === 2 && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-4">
          {info}
        </p>
      )}

      {step === 1 ? (
        <form onSubmit={requestOtp} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full brand-gradient text-white font-semibold rounded-xl py-2.5 text-sm disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset code"}
          </button>
        </form>
      ) : (
        <form onSubmit={submitReset} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">OTP Code</label>
            <input
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">New password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Confirm new password</label>
            <input
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full brand-gradient text-white font-semibold rounded-xl py-2.5 text-sm disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
