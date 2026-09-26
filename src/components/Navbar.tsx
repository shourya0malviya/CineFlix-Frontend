import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, ChevronDown, LogOut, User as UserIcon, Settings, Film } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { initialsFromName, cn } from "@/utils";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/home", label: "Home" },
    { to: "/browse/movie", label: "Movies" },
    { to: "/browse/tv", label: "TV Shows" },
    { to: "/genres", label: "Genres" },
    { to: "/my-list", label: "My List" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled ? "bg-cinePanel/90 backdrop-blur-md border-b border-white/5" : "bg-gradient-to-b from-cineDark/95 via-cineDark/70 to-transparent",
      )}
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/home" className="flex items-center gap-2 group">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-cineRed text-white font-display text-xl">
              <Film className="w-5 h-5" />
            </span>
            <span className="font-display tracking-wider text-2xl text-white group-hover:text-cineRed transition-colors">
              CINEFLIX
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "transition-colors hover:text-white",
                    isActive ? "text-white font-semibold" : "text-cineMuted",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/search")}
            className="p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button className="hidden sm:inline-flex p-2 rounded-full hover:bg-white/10 transition" aria-label="Notifications">
            <Bell className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 group"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="w-8 h-8 rounded bg-gradient-to-br from-cineRed to-red-700 grid place-items-center text-white text-xs font-bold">
                {initialsFromName(user?.name)}
              </span>
              <ChevronDown className="w-4 h-4 text-cineMuted group-hover:text-white transition" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-56 glass rounded-lg py-2 shadow-xl"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-sm">
                    <UserIcon className="w-4 h-4" /> Profile
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-sm">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button
                    onClick={async () => {
                      setMenuOpen(false);
                      await logout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-sm text-left text-cineRed"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
