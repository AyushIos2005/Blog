import { Search, Plus, Bell, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ search, onSearchChange, placeholder = "Search posts, people, tags..." }) {
  const { user } = useAuth();
  const initial = user?.username?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[var(--color-border)] px-4 sm:px-6 py-3 flex items-center gap-3">
      <div className="flex-1 relative max-w-xl">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
        />
        <input
          value={search ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[var(--color-app)] rounded-full pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]/40"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Link
          to="/app/create"
          className="w-9 h-9 rounded-full brand-gradient text-white flex items-center justify-center hover:opacity-90 transition"
          title="Create post"
        >
          <Plus size={18} />
        </Link>
        <button
          className="w-9 h-9 rounded-full bg-[var(--color-app)] flex items-center justify-center text-[var(--color-ink-soft)] hover:bg-brand-50 transition"
          title="Notifications"
        >
          <Bell size={17} />
        </button>
        <Link
          to="/app/notifications"
          className="w-9 h-9 rounded-full bg-[var(--color-app)] flex items-center justify-center text-[var(--color-ink-soft)] hover:bg-brand-50 transition"
          title="Messages"
        >
          <MessageSquare size={17} />
        </Link>
        <Link
          to="/app/profile"
          className="w-9 h-9 rounded-full brand-gradient text-white flex items-center justify-center text-sm font-semibold"
        >
          {initial}
        </Link>
      </div>
    </header>
  );
}
