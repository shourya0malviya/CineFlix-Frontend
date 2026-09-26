import { NavLink } from "react-router-dom";
import { Home, Film, Tv, Search, Heart } from "lucide-react";
import { cn } from "@/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/browse/movie", label: "Movies", icon: Film },
  { to: "/browse/tv", label: "TV", icon: Tv },
  { to: "/search", label: "Search", icon: Search },
  { to: "/my-list", label: "My List", icon: Heart },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5">
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <NavLink
                to={it.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center py-2.5 text-[11px] gap-0.5 transition-colors",
                    isActive ? "text-cineRed" : "text-cineMuted",
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {it.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
