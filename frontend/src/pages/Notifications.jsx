import { Bell } from "lucide-react";
import RoadmapBanner from "../components/RoadmapBanner";

export default function Notifications() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>

      <RoadmapBanner>
        The notifications API (likes, comments, follows) is on the roadmap in the
        API docs — it isn't implemented in the current backend yet.
      </RoadmapBanner>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow p-12 text-center">
        <span className="inline-flex w-14 h-14 rounded-2xl bg-[var(--color-app)] items-center justify-center mb-4">
          <Bell size={22} className="text-[var(--color-muted)]" />
        </span>
        <p className="font-semibold mb-1">You're all caught up</p>
        <p className="text-sm text-[var(--color-ink-soft)]">
          New likes, comments and follows will show up here.
        </p>
      </div>
    </div>
  );
}
