import { useState } from "react";
import { changePassword } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await changePassword(form);
      setSuccess(res.data.message);
      setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't update your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-xl font-bold mb-1">Settings</h1>
      <p className="text-sm text-[var(--color-ink-soft)] mb-6">
        Manage your CodeHub account
      </p>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow p-6 mb-5">
        <h2 className="font-semibold text-sm mb-3">Account</h2>
        <div className="text-sm space-y-1.5 text-[var(--color-ink-soft)]">
          <p><span className="text-[var(--color-ink)] font-medium">Username:</span> {user?.username}</p>
          <p><span className="text-[var(--color-ink)] font-medium">Email:</span> {user?.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow p-6">
        <h2 className="font-semibold text-sm mb-4">Change Password</h2>

        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-4">
            {success}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Current password</label>
            <input
              type="password"
              required
              value={form.oldPassword}
              onChange={update("oldPassword")}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">New password</label>
            <input
              type="password"
              required
              value={form.newPassword}
              onChange={update("newPassword")}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Confirm new password</label>
            <input
              type="password"
              required
              value={form.confirmNewPassword}
              onChange={update("confirmNewPassword")}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="brand-gradient text-white font-semibold rounded-xl px-6 py-2.5 text-sm disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
