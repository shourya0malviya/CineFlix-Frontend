import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { moviesApi, userApi } from "@/services/api";
import { useAuth } from "./AuthContext";
import type { Movie, MovieGenre, WatchlistItem, ContinueWatchingItem } from "@/types";

interface AppDataContextValue {
  trending: Movie[];
  popular: Movie[];
  topRated: Movie[];
  upcoming: Movie[];
  popularTv: Movie[];
  continueWatching: ContinueWatchingItem[];
  watchlist: WatchlistItem[];
  watchlistIds: number[];
  genres: MovieGenre[];
  isDemo: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  toggleWatchlist: (movieId: number) => Promise<void>;
  setProgress: (movieId: number, progress: number) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [popularTv, setPopularTv] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const [genres, setGenres] = useState<MovieGenre[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshUserData = useCallback(async () => {
    if (!user) {
      setContinueWatching([]);
      setWatchlist([]);
      setWatchlistIds([]);
      return;
    }
    try {
      const cwR = await userApi.continueWatching();
      const wlR = await userApi.watchlist();
      const idsR = await userApi.watchlistIds();
      setContinueWatching(cwR);
      setWatchlist(wlR);
      setWatchlistIds(idsR.ids);
    } catch {
      // ignore - keep prior state
    }
  }, [user]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [tr, pop, top, up, ptv, g, stats] = await Promise.all([
        moviesApi.category("trending_movie_week", 18),
        moviesApi.category("popular_movie", 18),
        moviesApi.category("top_rated_movie", 18),
        moviesApi.category("upcoming_movie", 18),
        moviesApi.category("popular_tv", 18),
        moviesApi.genres(),
        moviesApi.stats(),
      ]);
      setTrending(tr);
      setPopular(pop);
      setTopRated(top);
      setUpcoming(up);
      setPopularTv(ptv);
      setGenres(g);
      setIsDemo(stats.demo);
    } catch (e) {
      // leave arrays as-is
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  const toggleWatchlist = useCallback(
    async (movieId: number) => {
      if (!user) throw new Error("Please sign in to use your watchlist");
      if (watchlistIds.includes(movieId)) {
        await userApi.removeWatchlist(movieId);
        setWatchlistIds((prev) => prev.filter((id) => id !== movieId));
        setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
      } else {
        await userApi.addWatchlist(movieId);
        setWatchlistIds((prev) => [...prev, movieId]);
        // re-fetch to get full item
        const wl = await userApi.watchlist().catch(() => []);
        setWatchlist(wl);
      }
    },
    [user, watchlistIds],
  );

  const setProgress = useCallback(
    async (movieId: number, progress: number) => {
      if (!user) return;
      try {
        await userApi.upsertProgress(movieId, progress);
        // optimistic update
        setContinueWatching((prev) => {
          const existing = prev.find((p) => p.id === movieId);
          if (existing) {
            return prev.map((p) => (p.id === movieId ? { ...p, progress, lastWatchedAt: new Date().toISOString() } : p));
          }
          return prev;
        });
      } catch {
        // ignore
      }
    },
    [user],
  );

  return (
    <AppDataContext.Provider
      value={{
        trending,
        popular,
        topRated,
        upcoming,
        popularTv,
        continueWatching,
        watchlist,
        watchlistIds,
        genres,
        isDemo,
        loading,
        refresh,
        refreshUserData,
        toggleWatchlist,
        setProgress,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
