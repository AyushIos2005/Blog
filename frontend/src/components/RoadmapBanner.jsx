import { Info } from "lucide-react";

export default function RoadmapBanner({ children }) {
  return (
    <div className="flex items-start gap-2.5 bg-brand-50 border border-[var(--color-brand-100)] text-[var(--color-brand-700)] text-xs rounded-xl px-4 py-3 mb-5">
      <Info size={15} className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  );
}
