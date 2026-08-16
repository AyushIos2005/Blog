import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, X } from "lucide-react";
import { createPost } from "../api/endpoints";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, "");
      if (clean && !tags.includes(clean)) setTags((t) => [...t, clean]);
      setTagInput("");
    }
  };
  const removeTag = (t) => setTags((ts) => ts.filter((x) => x !== t));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) return setError("Please add a cover image for your post.");
    if (!title.trim() || !description.trim())
      return setError("Title and content are both required.");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("description", description);
    tags.forEach((t) => fd.append("tags", t));

    setLoading(true);
    try {
      const res = await createPost(fd);
      navigate(`/app/post/${res.data.post._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't publish your post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow p-6 sm:p-8">
        <h1 className="text-xl font-bold">Create New Post</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mb-6">
          Share your knowledge with the world
        </p>

        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-sm font-medium block mb-1.5">Cover Image</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            {preview ? (
              <div className="relative rounded-xl overflow-hidden h-56 group">
                <img src={preview} alt="Cover preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  pickFile(e.dataTransfer.files?.[0]);
                }}
                className="w-full h-40 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-app)] flex flex-col items-center justify-center gap-2 text-[var(--color-ink-soft)] hover:border-[var(--color-brand-400)] transition-colors"
              >
                <ImagePlus size={22} />
                <span className="text-sm font-medium">Drag & drop an image or click to upload</span>
              </button>
            )}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title for your blog..."
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Tags</label>
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="tag-chip text-xs font-medium pl-2.5 pr-1.5 py-1 rounded-full flex items-center gap-1"
                >
                  #{t}
                  <button type="button" onClick={() => removeTag(t)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Type and press enter..."
                className="flex-1 min-w-[120px] text-sm outline-none py-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Content</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your story..."
              rows={8}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40 resize-none"
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
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold brand-gradient text-white disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
