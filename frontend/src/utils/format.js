export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month}mo`;
  return `${Math.floor(month / 12)}y`;
}

export function initials(name = "") {
  return name.trim().slice(0, 1).toUpperCase() || "U";
}

// Deterministic accent gradient per post so cards without much variety
// still feel distinct, mirroring the source design's colored cover art.
const GRADIENTS = [
  "linear-gradient(135deg,#312e81,#7c3aed)",
  "linear-gradient(135deg,#0f766e,#22d3ee)",
  "linear-gradient(135deg,#7c2d12,#f97316)",
  "linear-gradient(135deg,#4c1d95,#db2777)",
  "linear-gradient(135deg,#134e4a,#16a34a)",
];

export function gradientFor(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}
