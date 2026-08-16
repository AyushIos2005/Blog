import { Bookmark } from "lucide-react";
import RoadmapBanner from "../components/RoadmapBanner";

export default function Saved() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-xl font-bold mb-4">Saved</h1>

      <RoadmapBanner>
        Saving posts for later isn't wired up to the backend yet — the current API
        only supports likes and comments on posts.
      </RoadmapBanner>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] card-shadow p-12 text-center">
        <span className="inline-flex w-14 h-14 rounded-2xl bg-[var(--color-app)] items-center justify-center mb-4">
          <Bookmark size={22} className="text-[var(--color-muted)]" />
        </span>
        <p className="font-semibold mb-1">Nothing saved yet</p>
        <p className="text-sm text-[var(--color-ink-soft)]">
          Posts you bookmark will be collected here.
        </p>
      </div>
    </div>
  );
}
