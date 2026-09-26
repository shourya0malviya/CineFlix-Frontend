import { Link } from "react-router-dom";
import { Film, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cineDark grid place-items-center px-4 text-center">
      <div>
        <Film className="w-12 h-12 text-cineRed mx-auto mb-3" />
        <h1 className="text-5xl font-display tracking-wide mb-2">404</h1>
        <p className="text-cineMuted mb-4">This page wandered off into the void.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition">
          <Home className="w-4 h-4" /> Go home
        </Link>
      </div>
    </div>
  );
}
