import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export function initialsFromName(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function placeholderPoster(title: string) {
  // SVG placeholder (data URL) used when no image is available.
  const safe = title.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 2) || "CF";
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#1a1a1a"/>
<stop offset="1" stop-color="#0a0a0a"/>
</linearGradient>
</defs>
<rect width="200" height="300" fill="url(#g)"/>
<text x="100" y="170" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="64" fill="#E50914">${safe}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function placeholderBackdrop(title: string) {
  const safe = title.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 2) || "CF";
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#2a0a0e"/>
<stop offset="0.5" stop-color="#0a0a0a"/>
<stop offset="1" stop-color="#0a0a0a"/>
</linearGradient>
</defs>
<rect width="800" height="450" fill="url(#g)"/>
<text x="400" y="245" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="140" fill="#E50914" opacity="0.85">${safe}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
