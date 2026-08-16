import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { loginUser } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(form);
      await refreshUser();
      navigate(location.state?.from?.pathname || "/app/home", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="CH"
      title="Welcome Back"
      subtitle="Login to your CodeHub account"
      footer={
        <span className="text-[var(--color-ink-soft)]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[var(--color-brand-600)] font-semibold">
            Sign up
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
        <div>
          <label className="text-sm font-medium block mb-1.5">Email address</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            placeholder="you@codehub.com"
            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium">Password</label>
            <Link to="/forgot-password" className="text-xs text-[var(--color-brand-600)] font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              value={form.password}
              onChange={update("password")}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full brand-gradient text-white font-semibold rounded-xl py-2.5 text-sm disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthShell>
  );
}
