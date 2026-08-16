import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { timeAgo, initials, gradientFor } from "../utils/format";

export default function PostCard({ post, currentUserId, onLike }) {
  const author = post.author || {};
  const liked = Array.isArray(post.like)
    ? post.like.some((l) => (l.user || l) === currentUserId)
    : false;
  const likeCount = Array.isArray(post.like) ? post.like.length : 0;
  const commentCount = Array.isArray(post.comment) ? post.comment.length : 0;
  const cover = post.file?.[0];

  return (
    <article className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow overflow-hidden">
      <div className="p-4 sm:p-5 pb-3 flex items-center gap-3">
        <span className="w-10 h-10 rounded-full brand-gradient flex items-center justify-center text-white font-semibold shrink-0">
          {initials(author.username)}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{author.username || "Unknown"}</p>
          <p className="text-xs text-[var(--color-muted)]">
            {timeAgo(post.createdAt)} ago
          </p>
        </div>
      </div>

      <Link to={`/app/post/${post._id}`} className="block">
        <div className="px-4 sm:px-5">
          <h3 className="text-lg font-bold leading-snug mb-1.5 hover:text-[var(--color-brand-600)] transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-[var(--color-ink-soft)] line-clamp-2 mb-3">
            {post.description}
          </p>
        </div>

        <div
          className="mx-4 sm:mx-5 rounded-xl h-44 sm:h-56 overflow-hidden flex items-center justify-center"
          style={!cover ? { background: gradientFor(post._id) } : undefined}
        >
          {cover ? (
            <img src={cover} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white/90 font-bold text-xl px-4 text-center">
              {post.title}
            </span>
          )}
        </div>
      </Link>

      {!!post.tags?.length && (
        <div className="px-4 sm:px-5 pt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="tag-chip text-xs font-medium px-2.5 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="px-4 sm:px-5 py-3 mt-2 flex items-center gap-5 border-t border-[var(--color-border)] mt-3">
        <button
          onClick={() => onLike?.(post)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            liked ? "text-pink-600" : "text-[var(--color-ink-soft)] hover:text-pink-600"
          }`}
        >
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
          {likeCount}
        </button>
        <Link
          to={`/app/post/${post._id}`}
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-brand-600)] transition-colors"
        >
          <MessageCircle size={17} />
          {commentCount}
        </Link>
        <button className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-brand-600)] transition-colors">
          <Bookmark size={17} />
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-brand-600)] transition-colors ml-auto">
          <Share2 size={17} />
          Share
        </button>
      </div>
    </article>
  );
}
