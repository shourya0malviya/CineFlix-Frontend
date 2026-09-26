import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import ContentRail from "@/components/ContentRail";
import RailSkeleton from "@/components/RailSkeleton";
import TrailerModal from "@/components/TrailerModal";
import { moviesApi } from "@/services/api";
import { CATEGORY_LABELS, type CategoryKey } from "@/types";
import type { Movie } from "@/types";

const CATS_MOVIE: CategoryKey[] = ["trending_movie_week", "popular_movie", "top_rated_movie", "now_playing_movie", "upcoming_movie"];
const CATS_TV: CategoryKey[] = ["trending_tv_week", "popular_tv", "top_rated_tv", "on_the_air_tv"];

export default function Browse() {
  const { type = "movie" } = useParams<{ type: string }>();
  const nav = useNavigate();
  const [items, setItems] = useState<Record<string, Movie[]>>({});
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState<Movie | null>(null);
  const cats = type === "tv" ? CATS_TV : CATS_MOVIE;

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    (async () => {
      try {
        const results: Record<string, Movie[]> = {};
        for (const c of cats) {
          results[c] = await moviesApi.category(c, 24);
        }
        if (!cancel) setItems(results);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [type]);

  const heading = useMemo(
    () => (type === "tv" ? "TV Shows" : "Movies"),
    [type],
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-4 sm:px-6 lg:px-10 pt-4 pb-6"
      >
        <h1 className="text-3xl sm:text-4xl font-display tracking-wide">{heading}</h1>
        <p className="text-cineMuted text-sm mt-1 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Browse the full catalogue
        </p>
      </motion.div>

      <div className="space-y-8">
        {loading
          ? cats.map((c) => <RailSkeleton key={c} title={CATEGORY_LABELS[c]} count={8} />)
          : cats.map((c) => (
              <ContentRail key={c} title={CATEGORY_LABELS[c]}>
                {(items[c] || []).map((m) => (
                  <MovieCard key={m.id} movie={m} onOpenTrailer={setTrailer} onOpenInfo={(m) => nav(`/movie/${m.id}`)} />
                ))}
              </ContentRail>
            ))}
      </div>
      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
    </div>
  );
}
