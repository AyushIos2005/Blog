import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts, toggleLike } from "../api/endpoints";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/format";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllPosts();
      setPosts(res.data.posts || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load the feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLike = async (post) => {
    // optimistic toggle
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== post._id) return p;
        const already = (p.like || []).some((l) => (l.user || l) === user?.id);
        return {
          ...p,
          like: already
            ? p.like.filter((l) => (l.user || l) !== user?.id)
            : [...(p.like || []), { user: user?.id }],
        };
      })
    );
    try {
      await toggleLike(post._id);
    } catch {
      load(); // resync on failure
    }
  };

  const trendingTags = useMemo(() => {
    const counts = {};
    posts.forEach((p) => (p.tags || []).forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [posts]);

  const authors = useMemo(() => {
    const map = new Map();
    posts.forEach((p) => {
      if (p.author?._id && p.author._id !== user?.id) map.set(p.author._id, p.author);
    });
    return Array.from(map.values()).slice(0, 5);
  }, [posts, user]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[1fr_300px] gap-6">
      <div className="min-w-0">
        <div className="flex items-center gap-6 mb-5 border-b border-[var(--color-border)] text-sm font-semibold">
          {["For You", "Following", "Trending"].map((t, i) => (
            <button
              key={t}
              className={`pb-3 -mb-px border-b-2 ${
                i === 0
                  ? "border-[var(--color-brand-500)] text-[var(--color-brand-600)]"
                  : "border-transparent text-[var(--color-muted)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-white border border-[var(--color-border)] animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 text-center">
            <p className="text-sm text-rose-600 mb-3">{error}</p>
            <button
              onClick={load}
              className="text-sm font-semibold text-[var(--color-brand-600)]"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-10 text-center">
            <p className="font-semibold mb-1">No posts yet</p>
            <p className="text-sm text-[var(--color-ink-soft)] mb-4">
              Be the first to share something with the community.
            </p>
            <Link
              to="/app/create"
              className="inline-block brand-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
            >
              Create Post
            </Link>
          </div>
        )}

        <div className="space-y-5">
          {!loading &&
            !error &&
            posts
              .slice()
              .reverse()
              .map((post) => (
                <PostCard key={post._id} post={post} currentUserId={user?.id} onLike={handleLike} />
              ))}
        </div>
      </div>

      <aside className="hidden lg:block space-y-5">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Trending Tags</h3>
          </div>
          {trendingTags.length === 0 ? (
            <p className="text-xs text-[var(--color-muted)]">Tags will show up once posts are published.</p>
          ) : (
            <ul className="space-y-3">
              {trendingTags.map(([tag, count]) => (
                <li key={tag} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--color-brand-600)]">#{tag}</span>
                  <span className="text-xs text-[var(--color-muted)]">{count} posts</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow p-5">
          <h3 className="font-semibold text-sm mb-3">Active Authors</h3>
          {authors.length === 0 ? (
            <p className="text-xs text-[var(--color-muted)]">No other authors yet.</p>
          ) : (
            <ul className="space-y-3">
              {authors.map((a) => (
                <li key={a._id} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full brand-gradient text-white flex items-center justify-center text-xs font-semibold">
                    {initials(a.username)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{a.username}</p>
                    <p className="text-xs text-[var(--color-muted)] truncate">{a.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl brand-gradient p-5 text-white">
          <p className="font-semibold text-sm mb-1">Keep Sharing!</p>
          <p className="text-xs text-white/80">Your knowledge matters. Publish your next post.</p>
          <Link
            to="/app/create"
            className="inline-block mt-3 bg-white/15 hover:bg-white/25 transition text-xs font-semibold px-3 py-2 rounded-lg"
          >
            Write a post
          </Link>
        </div>
      </aside>
    </div>
  );
}
