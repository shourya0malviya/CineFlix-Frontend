import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Film, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const redirect = (loc.state as any)?.from || "/home";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome back");
      nav(redirect, { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Invalid email or password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass rounded-2xl p-8"
      >
        <Link to="/" className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-cineRed">
            <Film className="w-5 h-5" />
          </span>
          <span className="font-display tracking-wider text-2xl">CINEFLIX</span>
        </Link>
        <h1 className="text-2xl font-semibold mb-1">Sign In</h1>
        <p className="text-sm text-cineMuted mb-6">Welcome back. Enter your details to continue.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-cineMuted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-md bg-black/40 ring-1 ring-white/10 focus:ring-cineRed outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-cineMuted">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-md bg-black/40 ring-1 ring-white/10 focus:ring-cineRed outline-none"
            />
          </div>
          {err && <p className="text-sm text-cineRed">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 rounded-md bg-cineRed hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>
        <p className="text-sm text-cineMuted mt-6 text-center">
          New to CineFlix?{" "}
          <Link to="/register" className="text-white hover:text-cineRed">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
