import axios from "axios";
import type { Movie, WatchlistItem, ContinueWatchingItem, AuthUser, MovieGenre } from "@/types";

const baseURL = (import.meta as any).env.VITE_API_URL || "/api";

export const api = axios.create({ baseURL, timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cineflix_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // ignore for now, callers handle
    }
    return Promise.reject(err);
  },
);

// -------- Auth --------
export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    api.post<{ token: string; user: AuthUser }>("/auth/register", body).then((r) => r.data),
  login: (body: { email: string; password: string }) =>
    api.post<{ token: string; user: AuthUser }>("/auth/login", body).then((r) => r.data),
  me: () => api.get<{ user: AuthUser }>("/auth/me").then((r) => r.data.user),
  updateProfile: (body: { name?: string; avatar?: string | null }) =>
    api.put<{ user: AuthUser }>("/auth/profile", body).then((r) => r.data.user),
  logout: () => api.post("/auth/logout").then((r) => r.data),
};

// -------- Movies --------
export const moviesApi = {
  list: () => api.get<{ results: Movie[] }>("/movies").then((r) => r.data.results),
  get: (id: number) => api.get<Movie>(`/movies/${id}`).then((r) => r.data),
  similar: (id: number) => api.get<{ results: Movie[] }>(`/movies/${id}/similar`).then((r) => r.data.results),
  category: (cat: string, limit = 24) =>
    api.get<{ results: Movie[] }>(`/movies/category/${cat}`, { params: { limit } }).then((r) => r.data.results),
  search: (q: string) => api.get<{ results: Movie[] }>("/movies/search", { params: { q } }).then((r) => r.data.results),
  genres: () => api.get<{ results: MovieGenre[] }>("/movies/genres").then((r) => r.data.results),
  byGenre: (id: number) => api.get<{ results: Movie[] }>(`/movies/genre/${id}`).then((r) => r.data.results),
  stats: () => api.get<{ movies: number; tv: number; users: number; genres: number; demo: boolean }>("/movies/stats").then((r) => r.data),
  triggerSync: () => api.post<{ message: string }>("/movies/sync").then((r) => r.data),
};

// -------- User data --------
export const userApi = {
  watchlist: () => api.get<{ results: WatchlistItem[] }>("/watchlist").then((r) => r.data.results),
  watchlistIds: () => api.get<{ ids: number[] }>("/watchlist/ids").then((r) => r.data),
  addWatchlist: (movieId: number) => api.post(`/watchlist/${movieId}`).then((r) => r.data),
  removeWatchlist: (movieId: number) => api.delete(`/watchlist/${movieId}`).then((r) => r.data),
  continueWatching: () => api.get<{ results: ContinueWatchingItem[] }>("/continue-watching").then((r) => r.data.results),
  upsertProgress: (movieId: number, progress: number) =>
    api.post(`/continue-watching/${movieId}`, { progress }).then((r) => r.data),
  removeContinue: (movieId: number) => api.delete(`/continue-watching/${movieId}`).then((r) => r.data),
  history: () => api.get<{ results: WatchlistItem[] }>("/history").then((r) => r.data.results),
};
