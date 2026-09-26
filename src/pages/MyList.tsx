import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { useNavigate } from "react-router-dom";
import MovieCard from "@/components/MovieCard";
import ContentRail from "@/components/ContentRail";
import TrailerModal from "@/components/TrailerModal";
import type { Movie } from "@/types";

export default function MyList() {
  const { watchlist, continueWatching } = useAppData();
  const nav = useNavigate();
  const [trailer, setTrailer] = useState<Movie | null>(null);

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 pb-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display tracking-wide flex items-center gap-3">
            <Heart className="w-7 h-7 text-cineRed fill-cineRed" /> My List
          </h1>
          <p className="text-cineMuted text-sm mt-1">Titles you've saved to watch later.</p>
        </div>
      </motion.div>

      {continueWatching.length > 0 && (
        <ContentRail title="Continue Watching" subtitle="Pick up where you left off">
          {continueWatching.map((m) => (
            <MovieCard key={m.id} movie={m} progress={m.progress} onOpenTrailer={setTrailer} onOpenInfo={(m) => nav(`/movie/${m.id}`)} />
          ))}
        </ContentRail>
      )}

      {watchlist.length === 0 ? (
        <div className="mt-20 text-center">
          <Heart className="w-12 h-12 text-cineMuted mx-auto mb-3" />
          <h3 className="text-xl font-semibold">Your list is empty</h3>
          <p className="text-cineMuted mt-1 max-w-md mx-auto">
            Browse the catalogue and tap the + icon on any title to add it here.
          </p>
        </div>
      ) : (
        <ContentRail title="Saved Titles" subtitle={`${watchlist.length} item${watchlist.length === 1 ? "" : "s"}`}>
          {watchlist.map((m) => (
            <MovieCard key={m.id} movie={m} onOpenTrailer={setTrailer} onOpenInfo={(m) => nav(`/movie/${m.id}`)} />
          ))}
        </ContentRail>
      )}

      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
    </div>
  );
}
