import { motion } from "framer-motion";
import { Play, Plus, Check, Star, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import PosterImage from "./PosterImage";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import { formatYear, formatRating } from "@/types";
import type { Movie } from "@/types";
import toast from "react-hot-toast";

interface Props {
  movie: Movie;
  progress?: number;
  onOpenTrailer?: (m: Movie) => void;
  onOpenInfo?: (m: Movie) => void;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-[120px] sm:w-[140px] md:w-[160px]",
  md: "w-[150px] sm:w-[180px] md:w-[210px]",
  lg: "w-[180px] sm:w-[220px] md:w-[260px]",
};

export default function MovieCard({ movie, progress, onOpenTrailer, onOpenInfo, size = "md" }: Props) {
  const { watchlistIds, toggleWatchlist } = useAppData();
  const { user } = useAuth();
  const inList = watchlistIds.includes(movie.id);
  const [hover, setHover] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to use your watchlist");
      return;
    }
    try {
      await toggleWatchlist(movie.id);
      toast.success(inList ? "Removed from My List" : "Added to My List");
    } catch {
      toast.error("Could not update watchlist");
    }
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenTrailer?.(movie);
  };

  const handleInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenInfo?.(movie);
  };

  return (
    <motion.div
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className={`relative shrink-0 ${sizeMap[size]}`}
      whileHover={{ y: -6, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
    >
      <Link
        to={`/movie/${movie.id}`}
        className="block group relative"
        aria-label={`${movie.title} details`}
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden ring-1 ring-white/5 shadow-lg shadow-black/40">
          <PosterImage src={movie.poster} alt={movie.title} className="w-full h-full" />
          {typeof progress === "number" && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div className="h-full bg-cineRed" style={{ width: `${Math.min(100, Math.max(2, progress * 100))}%` }} />
            </div>
          )}
          {movie.voteAverage > 0 && (
            <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-black/70 backdrop-blur flex items-center gap-1">
              <Star className="w-3 h-3 fill-cineRed text-cineRed" /> {formatRating(movie.voteAverage)}
            </div>
          )}
        </div>
      </Link>

      {hover && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18 }}
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[300px] z-20 pointer-events-auto"
        >
          <Link to={`/movie/${movie.id}`} className="block rounded-xl overflow-hidden bg-cinePanel ring-1 ring-white/10 shadow-2xl">
            <div className="relative aspect-video">
              <PosterImage src={movie.backdrop || movie.poster} alt={movie.title} variant="backdrop" className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-cinePanel to-transparent" />
              <div className="absolute bottom-2 left-3 right-3">
                <h3 className="font-semibold text-sm line-clamp-1">{movie.title}</h3>
                <div className="text-[11px] text-cineMuted flex items-center gap-2 mt-0.5">
                  <span>{formatYear(movie.releaseDate)}</span>
                  {movie.voteAverage > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-cineRed text-cineRed" /> {formatRating(movie.voteAverage)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={handlePlay}
                  className="w-8 h-8 grid place-items-center rounded-full bg-white text-black hover:bg-white/80 transition"
                  aria-label="Play trailer"
                >
                  <Play className="w-4 h-4 fill-black" />
                </button>
                <button
                  onClick={handleAdd}
                  className="w-8 h-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition ring-1 ring-white/20"
                  aria-label={inList ? "Remove from list" : "Add to list"}
                >
                  {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleInfo}
                  className="ml-auto w-8 h-8 grid place-items-center rounded-full bg-white/5 hover:bg-white/15 transition ring-1 ring-white/15"
                  aria-label="More info"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[12px] text-cineMuted line-clamp-3">{movie.overview || "No description available."}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {movie.genres?.slice(0, 3).map((g) => (
                  <span key={g.id} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-cineMuted">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
