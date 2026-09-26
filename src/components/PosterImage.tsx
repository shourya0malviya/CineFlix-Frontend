import { useState } from "react";
import { cn, placeholderPoster, placeholderBackdrop } from "@/utils";

interface Props {
  src?: string | null;
  alt: string;
  className?: string;
  variant?: "poster" | "backdrop";
  onClick?: () => void;
}

export default function PosterImage({ src, alt, className, variant = "poster", onClick }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const fallback = variant === "backdrop" ? placeholderBackdrop(alt) : placeholderPoster(alt);
  const finalSrc = errored || !src ? fallback : src;

  return (
    <div className={cn("relative overflow-hidden bg-cinePanel2", className)} onClick={onClick}>
      {!loaded && !errored && <div className="absolute inset-0 skeleton" />}
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
