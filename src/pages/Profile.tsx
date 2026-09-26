import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { initialsFromName } from "@/utils";
import MovieCard from "@/components/MovieCard";
import TrailerModal from "@/components/TrailerModal";
import { Settings as SettingsIcon, LogOut, Edit3, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "@/types";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { watchlist, continueWatching } = useAppData();
  const nav = useNavigate();
  const [trailer, setTrailer] = useState<Movie | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    setBusy(true);
    try {
      await updateProfile({ name });
      toast.success("Profile updated");
      setEditing(false);
    } catch {
      toast.error("Could not update profile");
    } finally {
      setBusy(false);
    }
  };

  if (!user) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cineRed to-red-700 grid place-items-center text-3xl font-bold shrink-0">
          {initialsFromName(user.name)}
        </div>
        <div className="flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 rounded-md bg-black/40 ring-1 ring-white/10 text-xl font-semibold"
              />
              <button
                onClick={handleSave}
                disabled={busy}
                className="p-2 rounded-full bg-cineRed hover:bg-red-700 transition"
                aria-label="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setName(user.name);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                aria-label="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h1 className="text-3xl font-display tracking-wide flex items-center gap-3">
              {user.name}
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-full hover:bg-white/10"
                aria-label="Edit name"
              >
                <Edit3 className="w-4 h-4 text-cineMuted" />
              </button>
            </h1>
          )}
          <p className="text-cineMuted text-sm mt-1">{user.email}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-cineMuted">
            <span className="px-2 py-1 rounded bg-white/5 ring-1 ring-white/10">
              Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </span>
            <span className="px-2 py-1 rounded bg-white/5 ring-1 ring-white/10">
              {watchlist.length} in list
            </span>
            <span className="px-2 py-1 rounded bg-white/5 ring-1 ring-white/10">
              {continueWatching.length} in progress
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => nav("/settings")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
          >
            <SettingsIcon className="w-4 h-4" /> Settings
          </button>
          <button
            onClick={async () => {
              await logout();
              nav("/");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cineRed hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </motion.div>

      {continueWatching.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Continue Watching</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {continueWatching.map((m) => (
              <MovieCard key={m.id} movie={m} progress={m.progress} onOpenTrailer={setTrailer} onOpenInfo={(m) => nav(`/movie/${m.id}`)} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">My List</h2>
        {watchlist.length === 0 ? (
          <div className="text-cineMuted text-sm">You haven't saved any titles yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {watchlist.map((m) => (
              <MovieCard key={m.id} movie={m} onOpenTrailer={setTrailer} onOpenInfo={(m) => nav(`/movie/${m.id}`)} />
            ))}
          </div>
        )}
      </section>

      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
    </div>
  );
}
