import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { moviesApi } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import TrailerModal from "@/components/TrailerModal";
import type { Movie } from "@/types";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function GenrePage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState<Movie | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancel = false;
    setLoading(true);
    (async () => {
      try {
        const gid = parseInt(id, 10);
        const [list, genres] = await Promise.all([
          moviesApi.byGenre(gid),
          moviesApi.genres(),
        ]);
        if (!cancel) {
          setItems(list);
          const g = genres.find((x) => x.id === gid);
          setTitle(g?.name || "Genre");
        }
      } catch {
        if (!cancel) setItems([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id]);

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 pb-10">
      <button
        onClick={() => nav(-1)}
        className="inline-flex items-center gap-2 text-sm text-cineMuted hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-display tracking-wide mb-2"
      >
        {title}
      </motion.h1>
      <p className="text-cineMuted text-sm mb-6">{items.length} titles</p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] skeleton rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <AlertCircle className="w-10 h-10 text-cineMuted mx-auto mb-2" />
          <h3 className="text-xl font-semibold">No titles in this genre yet</h3>
          <p className="text-cineMuted mt-1">Try another category or sync the catalogue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((m) => (
            <MovieCard key={m.id} movie={m} onOpenTrailer={setTrailer} onOpenInfo={(m) => nav(`/movie/${m.id}`)} />
          ))}
        </div>
      )}

      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
    </div>
  );
}
