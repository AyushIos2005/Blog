import { NavLink } from "react-router-dom";
import { Home, Compass, PlusSquare, Users, User } from "lucide-react";

const items = [
  { to: "/app/home", label: "Home", icon: Home },
  { to: "/app/explore", label: "Explore", icon: Compass },
  { to: "/app/create", label: "Create", icon: PlusSquare },
  { to: "/app/network", label: "Network", icon: Users },
  { to: "/app/profile", label: "Profile", icon: User },
];

export default function MobileTabBar() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-[var(--color-border)] flex items-center justify-around py-2">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium ${
              isActive ? "text-[var(--color-brand-600)]" : "text-[var(--color-muted)]"
            }`
          }
        >
          <Icon size={19} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
