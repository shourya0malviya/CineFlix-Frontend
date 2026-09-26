import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Sparkles } from "lucide-react";
import Hero from "@/components/Hero";
import ContentRail from "@/components/ContentRail";
import MovieCard from "@/components/MovieCard";
import RailSkeleton from "@/components/RailSkeleton";
import TrailerModal from "@/components/TrailerModal";
import { useAppData } from "@/context/AppDataContext";
import { useNavigate } from "react-router-dom";
import type { Movie } from "@/types";

export default function Home() {
  const { trending, popular, topRated, upcoming, popularTv, continueWatching, loading, isDemo } = useAppData();
  const [trailer, setTrailer] = useState<Movie | null>(null);
  const nav = useNavigate();

  const openInfo = (m: Movie) => nav(`/movie/${m.id}`);

  return (
    <div>
      {loading ? (
        <div className="h-[78vh] skeleton" />
      ) : (
        <Hero items={trending.slice(0, 6)} onPlayTrailer={setTrailer} />
      )}

      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 sm:mx-6 lg:mx-10 mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 px-4 py-3 text-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Demo mode is active — add your <code className="px-1 rounded bg-black/40">TMDB_API_KEY</code> in <code className="px-1 rounded bg-black/40">server/.env</code> and run <code className="px-1 rounded bg-black/40">npm run sync:movies</code> to load the full catalogue.
        </motion.div>
      )}

      <div className="space-y-8 sm:space-y-10 mt-8 sm:mt-10">
        {loading ? (
          <>
            <RailSkeleton title="Trending Now" count={8} />
            <RailSkeleton title="Popular Movies" count={8} />
          </>
        ) : (
          <>
            {continueWatching.length > 0 && (
              <ContentRail title="Continue Watching" subtitle="Pick up where you left off">
                {continueWatching.map((m) => (
                  <MovieCard key={m.id} movie={m} progress={m.progress} onOpenTrailer={setTrailer} onOpenInfo={openInfo} />
                ))}
              </ContentRail>
            )}
            <ContentRail title="Trending Now" subtitle="What everyone's watching this week">
              {trending.map((m) => (
                <MovieCard key={m.id} movie={m} onOpenTrailer={setTrailer} onOpenInfo={openInfo} />
              ))}
            </ContentRail>
            <ContentRail title="Popular Movies" subtitle="Blockbusters and crowd favourites">
              {popular.map((m) => (
                <MovieCard key={m.id} movie={m} onOpenTrailer={setTrailer} onOpenInfo={openInfo} />
              ))}
            </ContentRail>
            <ContentRail title="Top Rated" subtitle="All-time classics">
              {topRated.map((m) => (
                <MovieCard key={m.id} movie={m} onOpenTrailer={setTrailer} onOpenInfo={openInfo} />
              ))}
            </ContentRail>
            <ContentRail title="Upcoming" subtitle="Coming soon to a screen near you">
              {upcoming.map((m) => (
                <MovieCard key={m.id} movie={m} onOpenTrailer={setTrailer} onOpenInfo={openInfo} />
              ))}
            </ContentRail>
            <ContentRail title="Popular TV Shows" subtitle="Binge-worthy series">
              {popularTv.map((m) => (
                <MovieCard key={m.id} movie={m} onOpenTrailer={setTrailer} onOpenInfo={openInfo} />
              ))}
            </ContentRail>
          </>
        )}
      </div>

      <section className="mx-4 sm:mx-6 lg:mx-10 mt-12 mb-4 rounded-2xl glass p-6 sm:p-10 text-center">
        <Info className="w-6 h-6 text-cineRed mx-auto mb-2" />
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Ready to explore more?</h2>
        <p className="text-cineMuted max-w-xl mx-auto">
          Browse by genre, search for a specific title, or open your watchlist.
        </p>
      </section>

      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
    </div>
  );
}
