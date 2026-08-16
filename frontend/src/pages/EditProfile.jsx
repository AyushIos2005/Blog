import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { getMyProfile, createProfile, updateProfile } from "../api/endpoints";

const emptyForm = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  socialMediaLinks: "",
  bio: "",
  currentProfession: "",
  educationStatus: "",
};

export default function EditProfile() {
  const [form, setForm] = useState(emptyForm);
  const [profileId, setProfileId] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfile();
        const p = res.data.profile;
        setProfileId(p._id);
        setForm({
          fullName: p.fullName || "",
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : "",
          gender: p.gender || "",
          socialMediaLinks: p.socialMediaLinks || "",
          bio: p.bio || "",
          currentProfession: p.currentProfession || "",
          educationStatus: p.educationStatus || "",
        });
        setPreview(p.profileImage || null);
      } catch {
        // no profile yet -> creation mode
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.fullName.trim()) return setError("Full name is required.");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });
    if (file) fd.append("profileImage", file);

    setSaving(true);
    try {
      if (profileId) {
        await updateProfile(profileId, fd);
      } else {
        await createProfile(fd);
      }
      navigate("/app/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="h-64 rounded-2xl bg-white border border-[var(--color-border)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow p-6 sm:p-8">
        <h1 className="text-xl font-bold mb-1">{profileId ? "Edit Profile" : "Set up your profile"}</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mb-6">
          This is how other developers will see you on CodeHub.
        </p>

        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[var(--color-app)] border border-[var(--color-border)] flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <Camera size={20} className="text-[var(--color-muted)]" />
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm font-semibold text-[var(--color-brand-600)]"
            >
              Change photo
            </button>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Full Name</label>
            <input
              required
              value={form.fullName}
              onChange={update("fullName")}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={update("dateOfBirth")}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={update("gender")}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
              >
                <option value="">Prefer not to say</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Current Profession</label>
            <input
              value={form.currentProfession}
              onChange={update("currentProfession")}
              placeholder="Software Developer"
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Education Status</label>
            <select
              value={form.educationStatus}
              onChange={update("educationStatus")}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            >
              <option value="">Select...</option>
              <option value="High School">High School</option>
              <option value="College Student">College Student</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Social Media Link</label>
            <input
              value={form.socialMediaLinks}
              onChange={update("socialMediaLinks")}
              placeholder="linktr.ee/yourname"
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={update("bio")}
              rows={3}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-ink-soft)] border border-[var(--color-border)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold brand-gradient text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
