import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  PlusSquare,
  Users,
  Bookmark,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const items = [
  { to: "/app/home", label: "Home", icon: Home },
  { to: "/app/explore", label: "Explore", icon: Compass },
  { to: "/app/create", label: "Create Post", icon: PlusSquare },
  { to: "/app/network", label: "Network", icon: Users },
  { to: "/app/saved", label: "Saved", icon: Bookmark },
  { to: "/app/profile", label: "My Profile", icon: User },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-[var(--color-border)] h-screen sticky top-0 py-6 px-4">
      <div className="px-2 mb-8">
        <Logo />
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-[var(--color-brand-600)]"
                  : "text-[var(--color-ink-soft)] hover:bg-[var(--color-app)]"
              }`
            }
            style={({ isActive }) =>
              isActive ? { background: "var(--color-brand-50)" } : undefined
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-app)] transition-colors"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
