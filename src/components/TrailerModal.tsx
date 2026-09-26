import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import type { Movie } from "@/types";

interface Props {
  movie: Movie | null;
  onClose: () => void;
}

export default function TrailerModal({ movie, onClose }: Props) {
  useEffect(() => {
    if (!movie) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [movie, onClose]);

  return (
    <AnimatePresence>
      {movie && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 grid place-items-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Trailer for ${movie.title}`}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="relative w-full max-w-4xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold truncate pr-4">
                {movie.title} <span className="text-cineMuted text-sm font-normal">— Trailer</span>
              </h3>
              <button
                onClick={onClose}
                className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
              {movie.trailerKey ? (
                <iframe
                  title={`${movie.title} trailer`}
                  src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <AlertCircle className="w-10 h-10 text-cineMuted mb-2" />
                  <p className="text-cineMuted max-w-md">
                    Trailer not available for this title. The metadata catalogue contains factual
                    information about the film but not always an embeddable trailer.
                  </p>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-cineMuted text-center">
              Trailers are embedded from public sources. CineFlix is an educational project; no
              copyrighted media is hosted by this app.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
