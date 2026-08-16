import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../api/endpoints";
import { gradientFor } from "../utils/format";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllPosts();
        setPosts(res.data.posts || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const tags = useMemo(() => {
    const counts = {};
    posts.forEach((p) => (p.tags || []).forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filtered = posts.filter((p) => {
    const matchesTag = !activeTag || p.tags?.includes(activeTag);
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase());
    return matchesTag && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-xl font-bold mb-1">Explore</h1>
      <p className="text-sm text-[var(--color-ink-soft)] mb-5">
        Discover posts from the CodeHub community
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search blogs, people, tags..."
        className="w-full max-w-md mb-5 rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
      />

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
              !activeTag
                ? "brand-gradient text-white border-transparent"
                : "border-[var(--color-border)] text-[var(--color-ink-soft)] bg-white"
            }`}
          >
            All
          </button>
          {tags.map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                activeTag === tag
                  ? "brand-gradient text-white border-transparent"
                  : "border-[var(--color-border)] text-[var(--color-ink-soft)] bg-white"
              }`}
            >
              #{tag} · {count}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-white border border-[var(--color-border)] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-10 text-center text-sm text-[var(--color-ink-soft)]">
          No posts match your search.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Link
              key={p._id}
              to={`/app/post/${p._id}`}
              className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow overflow-hidden"
            >
              <div className="h-36" style={{ background: gradientFor(p._id) }}>
                {p.file?.[0] && (
                  <img src={p.file[0]} alt={p.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-bold line-clamp-2 mb-1">{p.title}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {p.like?.length || 0} likes · by {p.author?.username || "Unknown"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
