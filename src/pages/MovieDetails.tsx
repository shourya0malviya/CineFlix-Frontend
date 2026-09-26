import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Play, Plus, Check, Star, Share2, Clock, Calendar, Heart, AlertCircle } from "lucide-react";
import { moviesApi } from "@/services/api";
import { useAppData } from "@/context/AppDataContext";
import { useAuth } from "@/context/AuthContext";
import type { Movie } from "@/types";
import { formatRating, formatRuntime, formatYear, GENRE_LABELS } from "@/types";
import PosterImage from "@/components/PosterImage";
import ContentRail from "@/components/ContentRail";
import MovieCard from "@/components/MovieCard";
import TrailerModal from "@/components/TrailerModal";
import RailSkeleton from "@/components/RailSkeleton";
import toast from "react-hot-toast";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState<Movie | null>(null);
  const [progress, setLocalProgress] = useState<number>(0);
  const { watchlistIds, toggleWatchlist, setProgress: saveProgress, continueWatching } = useAppData();
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 60]);

  useEffect(() => {
    if (!id) return;
    let cancel = false;
    setLoading(true);
    (async () => {
      try {
        const [m, sim] = await Promise.all([
          moviesApi.get(parseInt(id, 10)),
          moviesApi.similar(parseInt(id, 10)).catch(() => []),
        ]);
        if (!cancel) {
          setMovie(m);
          setSimilar(sim);
          // Resume progress if present
          const cw = continueWatching.find((c) => c.id === m.id);
          if (cw) setLocalProgress(cw.progress);
        }
      } catch {
        if (!cancel) setMovie(null);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id, continueWatching]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-6">
        <div className="h-[40vh] skeleton rounded-xl" />
        <div className="h-6 w-1/2 mt-6 skeleton rounded" />
        <div className="h-4 w-1/3 mt-3 skeleton rounded" />
        <div className="h-24 mt-6 skeleton rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] skeleton rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-cineRed mx-auto mb-3" />
          <h2 className="text-2xl font-semibold mb-2">Title not found</h2>
          <p className="text-cineMuted mb-4">
            We couldn't find that title in the catalogue. It may have been removed, or the
            database is still being seeded.
          </p>
          <button
            onClick={() => nav(-1)}
            className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 transition"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const inList = watchlistIds.includes(movie.id);

  const handleAdd = async () => {
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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const startDemo = () => {
    // Open trailer in modal and simulate progress
    setTrailer(movie);
    let p = progress;
    const t = setInterval(() => {
      p = Math.min(1, p + 0.05);
      setLocalProgress(p);
      saveProgress(movie.id, p).catch(() => {});
      if (p >= 1) clearInterval(t);
    }, 1500);
  };

  return (
    <div>
      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <PosterImage src={movie.backdrop || movie.poster} alt={movie.title} variant="backdrop" className="w-full h-full" />
        <div className="absolute inset-0 hero-fade" />
        <div className="absolute top-6 left-4 sm:left-6 z-10">
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 transition backdrop-blur"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </motion.div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 -mt-40 sm:-mt-48 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-[260px_1fr] gap-8"
        >
          <div className="hidden md:block">
            <div className="rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl aspect-[2/3]">
              <PosterImage src={movie.poster} alt={movie.title} className="w-full h-full" />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/80 mb-3">
              {movie.genres?.map((g) => (
                <span key={g.id} className="px-2 py-0.5 rounded bg-white/10 backdrop-blur">
                  {g.name}
                </span>
              ))}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide leading-none mb-3">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/80 mb-5">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {formatYear(movie.releaseDate)}
              </span>
              {movie.runtime ? (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {formatRuntime(movie.runtime)}
                </span>
              ) : null}
              {movie.voteAverage > 0 && (
                <span className="flex items-center gap-1 text-white">
                  <Star className="w-4 h-4 fill-cineRed text-cineRed" /> {formatRating(movie.voteAverage)} ({movie.voteCount.toLocaleString()})
                </span>
              )}
            </div>
            <p className="text-base text-white/80 max-w-3xl mb-6">{movie.overview}</p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setTrailer(movie)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-black font-semibold hover:bg-white/90 transition"
              >
                <Play className="w-5 h-5 fill-black" /> Play Trailer
              </button>
              <button
                onClick={startDemo}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white/10 backdrop-blur font-semibold hover:bg-white/20 transition ring-1 ring-white/10"
              >
                <Heart className="w-5 h-5 text-cineRed" /> Watch Demo
              </button>
              <button
                onClick={handleAdd}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/20 transition"
                aria-label={inList ? "Remove from list" : "Add to list"}
              >
                {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/20 transition"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {progress > 0 && (
              <div className="mt-4">
                <div className="h-1.5 w-72 max-w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cineRed" style={{ width: `${progress * 100}%` }} />
                </div>
                <p className="text-[11px] text-cineMuted mt-1">Continue from {Math.round(progress * 100)}%</p>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-3">About this {movie.type === "tv" ? "series" : "title"}</h2>
            <p className="text-sm text-white/80 leading-relaxed">{movie.overview}</p>
          </div>
          <div>
            <dl className="text-sm space-y-2">
              {movie.director && (
                <div className="flex gap-2">
                  <dt className="w-24 text-cineMuted">Director</dt>
                  <dd>{movie.director}</dd>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div className="flex gap-2">
                  <dt className="w-24 text-cineMuted shrink-0">Cast</dt>
                  <dd className="text-white/80">{movie.cast.slice(0, 6).map((c) => c.name).join(", ")}</dd>
                </div>
              )}
              {movie.production && movie.production.length > 0 && (
                <div className="flex gap-2">
                  <dt className="w-24 text-cineMuted shrink-0">Studio</dt>
                  <dd className="text-white/80">{movie.production.slice(0, 3).join(", ")}</dd>
                </div>
              )}
              {movie.language && (
                <div className="flex gap-2">
                  <dt className="w-24 text-cineMuted">Language</dt>
                  <dd>{movie.language.toUpperCase()}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {movie.cast && movie.cast.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-3">Top Billed Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {movie.cast.slice(0, 12).map((c) => (
                <div key={c.id} className="text-center">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden ring-1 ring-white/10 bg-cinePanel2">
                    <PosterImage src={c.profile || undefined} alt={c.name} className="w-full h-full" />
                  </div>
                  <p className="text-sm mt-2 line-clamp-1">{c.name}</p>
                  {c.character && <p className="text-[11px] text-cineMuted line-clamp-1">{c.character}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          {similar.length > 0 ? (
            <ContentRail title="More like this">
              {similar.map((m) => (
                <MovieCard key={m.id} movie={m} onOpenTrailer={setTrailer} onOpenInfo={() => nav(`/movie/${m.id}`)} />
              ))}
            </ContentRail>
          ) : (
            <RailSkeleton title="More like this" count={6} />
          )}
        </section>
      </div>

      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
    </div>
  );
}
