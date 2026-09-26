import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { moviesApi } from "@/services/api";
import toast from "react-hot-toast";
import { RefreshCw, Database, Users, Film, Tv, Shield } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  const { refresh, isDemo, genres } = useAppData();
  const [stats, setStats] = useState<{ movies: number; tv: number; users: number; genres: number; demo: boolean } | null>(null);
  const [syncing, setSyncing] = useState(false);

  const loadStats = async () => {
    try {
      const s = await moviesApi.stats();
      setStats(s);
    } catch {
      toast.error("Could not load stats");
    }
  };

  const triggerSync = async () => {
    setSyncing(true);
    try {
      await moviesApi.triggerSync();
      toast.success("Sync started — refreshing catalogue");
      await refresh();
      await loadStats();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Sync failed. Check your TMDB API key.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 pb-10 max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-display tracking-wide mb-3"
      >
        Settings
      </motion.h1>
      <p className="text-cineMuted text-sm mb-6">Manage your account and the local catalogue.</p>

      <section className="glass rounded-2xl p-5 sm:p-6 mb-4">
        <h2 className="font-semibold mb-1">Account</h2>
        <p className="text-sm text-cineMuted mb-3">Signed in as {user?.email}</p>
        <button
          onClick={async () => {
            await logout();
            window.location.href = "/";
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cineRed hover:bg-red-700 transition text-sm"
        >
          Sign out
        </button>
      </section>

      <section className="glass rounded-2xl p-5 sm:p-6 mb-4">
        <h2 className="font-semibold mb-1 flex items-center gap-2">
          <Database className="w-4 h-4 text-cineRed" /> Local Catalogue
        </h2>
        <p className="text-sm text-cineMuted mb-3">
          {isDemo
            ? "Demo mode is active. Add a TMDB API key in server/.env to fetch the full catalogue."
            : "Live mode is active. The catalogue is populated from TMDB."}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={loadStats}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 ring-1 ring-white/10 hover:bg-white/10 text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh stats
          </button>
          <button
            onClick={triggerSync}
            disabled={syncing || isDemo}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-cineRed hover:bg-red-700 transition text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Sync from TMDB"}
          </button>
        </div>
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon={Film} label="Movies" value={stats.movies} />
            <Stat icon={Tv} label="TV Shows" value={stats.tv} />
            <Stat icon={Users} label="Users" value={stats.users} />
            <Stat icon={Database} label="Genres" value={stats.genres} />
          </div>
        )}
      </section>

      <section className="glass rounded-2xl p-5 sm:p-6">
        <h2 className="font-semibold mb-1 flex items-center gap-2">
          <Shield className="w-4 h-4 text-cineRed" /> About
        </h2>
        <p className="text-sm text-cineMuted">
          CineFlix is an educational project. All data is fetched from the public TMDB API under
          its terms of use. No copyrighted media is stored or redistributed by this app.
        </p>
        <p className="text-xs text-cineMuted mt-2">Available genres: {genres.length}</p>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
      <div className="flex items-center gap-2 text-cineMuted text-xs">
        <Icon className="w-4 h-4" /> {label}
      </div>
      <div className="text-2xl font-display mt-1">{value}</div>
    </div>
  );
}
