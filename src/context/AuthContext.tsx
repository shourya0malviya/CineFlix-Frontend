import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { authApi } from "@/services/api";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (body: { name?: string; avatar?: string | null }) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("cineflix_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      localStorage.removeItem("cineflix_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const r = await authApi.login({ email, password });
    localStorage.setItem("cineflix_token", r.token);
    setUser(r.user);
    return r.user;
  };

  const register = async (name: string, email: string, password: string) => {
    const r = await authApi.register({ name, email, password });
    localStorage.setItem("cineflix_token", r.token);
    setUser(r.user);
    return r.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem("cineflix_token");
    setUser(null);
  };

  const updateProfile = async (body: { name?: string; avatar?: string | null }) => {
    const u = await authApi.updateProfile(body);
    setUser(u);
    return u;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
