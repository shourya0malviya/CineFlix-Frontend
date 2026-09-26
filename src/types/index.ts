export interface MovieGenre {
  id: number;
  name: string;
  type?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile?: string | null;
}

export interface Movie {
  id: number;
  type: "movie" | "tv";
  title: string;
  originalTitle?: string | null;
  overview?: string | null;
  poster?: string | null;
  backdrop?: string | null;
  releaseDate?: string | null;
  runtime?: number | null;
  language?: string | null;
  country?: string | null;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  trailerKey?: string | null;
  trailerSite?: string | null;
  cast: CastMember[];
  director?: string | null;
  production?: string[];
  isDemo?: boolean;
  genres: MovieGenre[];
}

export interface WatchlistItem extends Movie {
  addedAt?: string;
}

export interface ContinueWatchingItem extends Movie {
  progress: number;
  lastWatchedAt: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  createdAt?: string;
}

export type CategoryKey =
  | "trending_movie_week"
  | "popular_movie"
  | "top_rated_movie"
  | "upcoming_movie"
  | "now_playing_movie"
  | "popular_tv"
  | "trending_tv_week"
  | "top_rated_tv"
  | "on_the_air_tv";

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  trending_movie_week: "Trending Now",
  popular_movie: "Popular Movies",
  top_rated_movie: "Top Rated",
  upcoming_movie: "Upcoming",
  now_playing_movie: "Now Playing",
  popular_tv: "Popular TV Shows",
  trending_tv_week: "Trending TV",
  top_rated_tv: "Top Rated TV",
  on_the_air_tv: "On The Air",
};

export const GENRE_LABELS: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export function formatRuntime(mins?: number | null) {
  if (!mins) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatYear(date?: string | null) {
  if (!date) return "";
  return date.slice(0, 4);
}

export function formatRating(rating?: number) {
  if (!rating) return "N/A";
  return rating.toFixed(1);
}
