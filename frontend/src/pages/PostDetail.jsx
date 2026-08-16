import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Share2, Bookmark, Trash2 } from "lucide-react";
import { getAllPosts, toggleLike, addComment, getComments, deletePost } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { timeAgo, initials } from "../utils/format";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllPosts();
      const posts = res.data.posts || [];
      const found = posts.find((p) => p._id === id);
      setPost(found || null);
      setRelated(posts.filter((p) => p._id !== id).slice(0, 3));

      if (found) {
        try {
          const commentsRes = await getComments(id);
          setComments(commentsRes.data.comments || []);
        } catch {
          setComments([]);
        }
      } else {
        setComments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const liked = post?.like?.some((l) => (l.user || l) === user?.id);

  const handleLike = async () => {
    setPost((p) => ({
      ...p,
      like: liked
        ? p.like.filter((l) => (l.user || l) !== user?.id)
        : [...(p.like || []), { user: user?.id }],
    }));
    try {
      await toggleLike(id);
    } catch {
      load();
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const res = await addComment(id, comment.trim());
      setComments((c) => [...c, { ...res.data.comment, user: { username: user?.username } }]);
      setComment("");
    } catch {
      // no-op, keep the draft so the user can retry
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post? This can't be undone.")) return;
    try {
      await deletePost(id);
      navigate("/app/home");
    } catch {
      alert("Couldn't delete this post right now.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="h-96 rounded-2xl bg-white border border-[var(--color-border)] animate-pulse" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="font-semibold mb-2">Post not found</p>
        <Link to="/app/home" className="text-sm text-[var(--color-brand-600)] font-semibold">
          Back to feed
        </Link>
      </div>
    );
  }

  const isAuthor = post.author?._id === user?.id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[1fr_280px] gap-6">
      <div className="min-w-0 bg-white rounded-2xl border border-[var(--color-border)] card-shadow p-6 sm:p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[var(--color-ink-soft)] mb-4 hover:text-[var(--color-brand-600)]"
        >
          ← Back
        </button>

        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{post.title}</h1>
          {isAuthor && (
            <button
              onClick={handleDelete}
              className="shrink-0 w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100"
              title="Delete post"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 rounded-full brand-gradient text-white flex items-center justify-center font-semibold">
            {initials(post.author?.username)}
          </span>
          <div>
            <p className="text-sm font-semibold">{post.author?.username || "Unknown"}</p>
            <p className="text-xs text-[var(--color-muted)]">
              {timeAgo(post.createdAt)} ago · {Math.max(1, Math.ceil((post.description?.length || 0) / 800))} min read
            </p>
          </div>
        </div>

        {post.file?.[0] && (
          <img
            src={post.file[0]}
            alt={post.title}
            className="w-full rounded-xl max-h-96 object-cover mb-6"
          />
        )}

        <p className="text-[15px] leading-relaxed text-[var(--color-ink)] whitespace-pre-line mb-6">
          {post.description}
        </p>

        {!!post.tags?.length && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((t) => (
              <span key={t} className="tag-chip text-xs font-medium px-2.5 py-1 rounded-full">
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-5 border-t border-b border-[var(--color-border)] py-3 mb-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-medium ${
              liked ? "text-pink-600" : "text-[var(--color-ink-soft)]"
            }`}
          >
            <Heart size={17} fill={liked ? "currentColor" : "none"} />
            {post.like?.length || 0}
          </button>
          <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)]">
            {comments.length} Comments
          </span>
          <button className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)]">
            <Bookmark size={17} /> Save
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)] ml-auto">
            <Share2 size={17} /> Share
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Comments ({comments.length})</h3>
          <form onSubmit={submitComment} className="flex items-start gap-3 mb-6">
            <span className="w-9 h-9 rounded-full brand-gradient text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {initials(user?.username)}
            </span>
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40 resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={posting || !comment.trim()}
                  className="px-4 py-2 rounded-lg text-xs font-semibold brand-gradient text-white disabled:opacity-50"
                >
                  {posting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">Be the first to comment.</p>
            )}
            {comments
              .slice()
              .reverse()
              .map((c) => (
                <div key={c._id || Math.random()} className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full bg-[var(--color-app)] flex items-center justify-center text-xs font-semibold text-[var(--color-brand-600)] shrink-0">
                    {initials(c.user?.username)}
                  </span>
                  <div className="flex-1 bg-[var(--color-app)] rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{c.user?.username || "User"}</p>
                      {c.createdAt && (
                        <span className="text-xs text-[var(--color-muted)]">{timeAgo(c.createdAt)} ago</span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-ink-soft)]">{c.comment}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <aside className="hidden lg:block space-y-4">
        <h3 className="font-semibold text-sm px-1">Related Posts</h3>
        {related.length === 0 && (
          <p className="text-xs text-[var(--color-muted)] px-1">No related posts yet.</p>
        )}
        {related.map((r) => (
          <Link
            key={r._id}
            to={`/app/post/${r._id}`}
            className="block bg-white rounded-xl border border-[var(--color-border)] overflow-hidden card-shadow"
          >
            {r.file?.[0] ? (
              <img src={r.file[0]} alt={r.title} className="h-24 w-full object-cover" />
            ) : (
              <div className="h-24 w-full brand-gradient" />
            )}
            <div className="p-3">
              <p className="text-sm font-semibold line-clamp-2">{r.title}</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">{r.like?.length || 0} likes</p>
            </div>
          </Link>
        ))}
      </aside>
    </div>
  );
}
