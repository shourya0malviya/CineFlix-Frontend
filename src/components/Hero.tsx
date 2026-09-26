import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Info, Plus, Check, Star } from "lucide-react";
import PosterImage from "./PosterImage";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { formatYear, formatRating, formatRuntime } from "@/types";
import type { Movie } from "@/types";
import toast from "react-hot-toast";

interface Props {
  items: Movie[];
  onPlayTrailer: (m: Movie) => void;
}

export default function Hero({ items, onPlayTrailer }: Props) {
  const [index, setIndex] = useState(0);
  const { watchlistIds, toggleWatchlist } = useAppData();
  const { user } = useAuth();

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 9000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) {
    return (
      <div className="relative h-[78vh] w-full bg-cinePanel2 skeleton" aria-label="Loading hero" />
    );
  }

  const m = items[index];
  const inList = watchlistIds.includes(m.id);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to use your watchlist");
      return;
    }
    try {
      await toggleWatchlist(m.id);
      toast.success(inList ? "Removed from My List" : "Added to My List");
    } catch {
      toast.error("Could not update watchlist");
    }
  };

  return (
    <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={m.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <PosterImage src={m.backdrop} alt={m.title} variant="backdrop" className="w-full h-full" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 hero-fade pointer-events-none" />

      <div className="relative z-10 h-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 flex items-end pb-16 sm:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3 text-xs sm:text-sm text-white/80">
              {m.genres?.slice(0, 2).map((g) => (
                <span key={g.id} className="px-2 py-0.5 rounded bg-white/10 backdrop-blur">{g.name}</span>
              ))}
              <span className="text-white/60">{formatYear(m.releaseDate)}</span>
              {m.runtime ? <span className="text-white/60">{formatRuntime(m.runtime)}</span> : null}
              {m.voteAverage > 0 && (
                <span className="flex items-center gap-1 text-white/90">
                  <Star className="w-4 h-4 fill-cineRed text-cineRed" /> {formatRating(m.voteAverage)}
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide leading-none mb-3">
              {m.title}
            </h1>
            <p className="text-sm sm:text-base text-white/80 line-clamp-3 max-w-xl mb-6">
              {m.overview}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onPlayTrailer(m)}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-md bg-white text-black font-semibold hover:bg-white/90 transition"
              >
                <Play className="w-5 h-5 fill-black" /> Play Trailer
              </button>
              <Link
                to={`/movie/${m.id}`}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-md bg-white/15 backdrop-blur text-white font-semibold hover:bg-white/25 transition"
              >
                <Info className="w-5 h-5" /> More Info
              </Link>
              <button
                onClick={handleAdd}
                className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/20 transition"
                aria-label={inList ? "Remove from list" : "Add to list"}
              >
                {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-6 right-4 sm:right-10 z-10 flex gap-1.5">
          {items.map((it, i) => (
            <button
              key={it.id}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"}`}
              aria-label={`Show ${it.title}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
