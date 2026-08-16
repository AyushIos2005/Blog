import { useEffect, useMemo, useState } from "react";
import { getAllPosts } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/format";
import RoadmapBanner from "../components/RoadmapBanner";

const tabs = ["People", "Requests", "Suggested"];

export default function Network() {
  const { user } = useAuth();
  const [tab, setTab] = useState("People");
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllPosts();
        const map = new Map();
        (res.data.posts || []).forEach((p) => {
          if (p.author?._id && p.author._id !== user?.id) map.set(p.author._id, p.author);
        });
        setPeople(Array.from(map.values()));
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const list = useMemo(() => people, [people]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-xl font-bold mb-4">Network</h1>

      <RoadmapBanner>
        Follow requests and friend connections aren't implemented in the current
        backend yet — they're listed as a future social layer in the API docs
        (section 8). Below is a live list of authors who've published on CodeHub.
      </RoadmapBanner>

      <div className="flex items-center gap-6 mb-5 border-b border-[var(--color-border)] text-sm font-semibold">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 -mb-px border-b-2 ${
              tab === t
                ? "border-[var(--color-brand-500)] text-[var(--color-brand-600)]"
                : "border-transparent text-[var(--color-muted)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "People" ? (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow divide-y divide-[var(--color-border)]">
          {loading && <p className="p-6 text-sm text-[var(--color-muted)]">Loading...</p>}
          {!loading && list.length === 0 && (
            <p className="p-6 text-sm text-[var(--color-muted)]">
              No other authors have published yet.
            </p>
          )}
          {list.map((p) => (
            <div key={p._id} className="flex items-center gap-3 px-5 py-4">
              <span className="w-11 h-11 rounded-full brand-gradient text-white flex items-center justify-center font-semibold">
                {initials(p.username)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.username}</p>
                <p className="text-xs text-[var(--color-muted)] truncate">{p.email}</p>
              </div>
              <button
                disabled
                title="Follow API coming soon"
                className="text-xs font-semibold px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] cursor-not-allowed"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow p-10 text-center text-sm text-[var(--color-muted)]">
          {tab} will appear here once the friend-request API ships.
        </div>
      )}
    </div>
  );
}
