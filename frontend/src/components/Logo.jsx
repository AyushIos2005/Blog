import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ dark = false, to = "/" }) {
  return (
    <Link to={to} className="flex items-center gap-2 shrink-0">
      <span className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center">
        <Code2 size={17} className="text-white" strokeWidth={2.5} />
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight ${
          dark ? "text-white" : "text-[var(--color-ink)]"
        }`}
      >
        CodeHub
      </span>
    </Link>
  );
}
