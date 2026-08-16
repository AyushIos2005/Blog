import { Link } from "react-router-dom";
import { Search, PenSquare, Users2, BookOpen, Code2 } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const tags = ["#JavaScript", "#React", "#Node.js", "#Python", "#WebDev"];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen hero-gradient text-white">
      <header className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <Logo dark />
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/app/explore" className="hover:text-white transition-colors">Explore</Link>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/app/home"
              className="px-4 py-2 rounded-lg brand-gradient text-sm font-semibold"
            >
              Go to feed
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-sm text-white/80 hover:text-white">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg brand-gradient text-sm font-semibold"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Write. Share.{" "}
            <span className="bg-clip-text text-transparent brand-gradient">Inspire.</span>
          </h1>
          <p className="mt-5 text-white/70 text-lg max-w-md">
            The modern blogging & social platform for{" "}
            <span className="text-white font-medium">developers.</span> Share your
            knowledge, learn from others, grow together.
          </p>

          <div className="mt-7 flex items-center gap-2 bg-white/10 border border-white/10 rounded-full p-1.5 max-w-md">
            <Search size={16} className="ml-3 text-white/50" />
            <input
              placeholder="Search for blogs, topics, or people..."
              className="flex-1 bg-transparent text-sm px-2 py-2 outline-none placeholder:text-white/40"
            />
            <Link
              to={user ? "/app/explore" : "/register"}
              className="w-9 h-9 rounded-full brand-gradient flex items-center justify-center shrink-0"
            >
              <Search size={15} />
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/70"
              >
                {t}
              </span>
            ))}
          </div>

          <div id="features" className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
            {[
              { icon: PenSquare, title: "Create & Share", desc: "Write beautiful blogs" },
              { icon: Users2, title: "Connect", desc: "Follow and grow your network" },
              { icon: BookOpen, title: "Learn", desc: "From real developers" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <Icon size={18} className="text-[var(--color-brand-400)] mb-2" />
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-white/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur">
            <div className="rounded-2xl brand-gradient p-8 flex flex-col items-center text-center">
              <span className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Code2 size={30} />
              </span>
              <p className="font-bold text-lg">Join thousands of developers</p>
              <p className="text-sm text-white/80 mt-1">
                writing, sharing, and learning together every day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
