import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import TrailerModal from "@/components/TrailerModal";
import { moviesApi } from "@/services/api";
import { useAppData } from "@/context/AppDataContext";
import { useNavigate } from "react-router-dom";
import type { Movie } from "@/types";
import { formatYear, formatRating } from "@/types";
import PosterImage from "@/components/PosterImage";
import { debounce } from "@/utils";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [results, setResults] = useState<Movie[]>([]);
  const [trailer, setTrailer] = useState<Movie | null>(null);
  const [busy, setBusy] = useState(false);
  const { trending, popular } = useAppData();
  const nav = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [type, setType] = useState<"all" | "movie" | "tv">("all");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<"popularity" | "rating" | "year">("popularity");

  const runSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        if (!term.trim()) {
          setResults([]);
          setBusy(false);
          return;
        }
        try {
          const r = await moviesApi.search(term.trim());
          setResults(r);
        } catch {
          setResults([]);
        } finally {
          setBusy(false);
        }
      }, 280),
    [],
  );

  useEffect(() => {
    setBusy(true);
    runSearch(q);
  }, [q, runSearch]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (q) setParams({ q }, { replace: true });
      else setParams({}, { replace: true });
    }, 200);
    return () => clearTimeout(t);
  }, [q, setParams]);

  const filtered = useMemo(() => {
    let list = results;
    if (type !== "all") list = list.filter((m) => m.type === type);
    if (minRating > 0) list = list.filter((m) => m.voteAverage >= minRating);
    if (sort === "rating") list = [...list].sort((a, b) => b.voteAverage - a.voteAverage);
    if (sort === "year") list = [...list].sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || ""));
    if (sort === "popularity") list = [...list].sort((a, b) => b.popularity - a.popularity);
    return list;
  }, [results, type, minRating, sort]);

  const suggestions = (q.trim() ? filtered : trending).slice(0, 8);

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl"
      >
        <h1 className="text-3xl sm:text-4xl font-display tracking-wide mb-3">Search</h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cineMuted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for movies, shows, people…"
            className="w-full pl-12 pr-12 py-3.5 rounded-full bg-cinePanel ring-1 ring-white/10 focus:ring-cineRed outline-none"
            autoFocus
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          {(["all", "movie", "tv"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-full text-sm ring-1 transition ${type === t ? "bg-cineRed ring-cineRed text-white" : "bg-white/5 ring-white/10 hover:bg-white/10"}`}
            >
              {t === "all" ? "All" : t === "movie" ? "Movies" : "TV"}
            </button>
          ))}
        </div>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 grid sm:grid-cols-2 gap-3 p-4 glass rounded-xl"
          >
            <div>
              <label className="text-xs text-cineMuted">Minimum rating: {minRating.toFixed(1)}</label>
              <input
                type="range"
                min={0}
                max={9}
                step={0.5}
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <label className="text-xs text-cineMuted">Sort by</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="w-full mt-2 px-3 py-2 rounded-md bg-black/40 ring-1 ring-white/10"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="year">Newest</option>
              </select>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-8">
        {q.trim() === "" ? (
          <>
            <h2 className="text-lg font-semibold mb-3">Trending suggestions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {suggestions.map((m) => (
                <SuggestionCard key={m.id} movie={m} onClick={() => nav(`/movie/${m.id}`)} />
              ))}
            </div>
          </>
        ) : busy ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] skeleton rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <SearchIcon className="w-10 h-10 text-cineMuted mx-auto mb-2" />
            <h3 className="text-xl font-semibold">No results found</h3>
            <p className="text-cineMuted mt-1">Try a different keyword or remove the filters.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-cineMuted mb-3">{filtered.length} results</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filtered.map((m) => (
                <MovieCard key={m.id} movie={m} onOpenTrailer={setTrailer} onOpenInfo={(m) => nav(`/movie/${m.id}`)} />
              ))}
            </div>
          </>
        )}
      </div>

      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
    </div>
  );
}

function SuggestionCard({ movie, onClick }: { movie: Movie; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left group">
      <div className="aspect-[2/3] rounded-lg overflow-hidden ring-1 ring-white/5">
        <PosterImage src={movie.poster} alt={movie.title} className="w-full h-full" />
      </div>
      <p className="mt-2 text-sm line-clamp-1 group-hover:text-cineRed transition">{movie.title}</p>
      <p className="text-[11px] text-cineMuted">
        {formatYear(movie.releaseDate)} • ★ {formatRating(movie.voteAverage)}
      </p>
    </button>
  );
}
