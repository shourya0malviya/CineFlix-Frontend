import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Film, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
      toast.success("Welcome to CineFlix");
      nav("/home", { replace: true });
    } catch (e: any) {
      const issues = e?.response?.data?.issues;
      if (Array.isArray(issues) && issues.length) {
        setErr(issues.map((i: any) => i.message).join(", "));
      } else {
        setErr(e?.response?.data?.message || "Could not create account");
      }
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
        <h1 className="text-2xl font-semibold mb-1">Create your account</h1>
        <p className="text-sm text-cineMuted mb-6">Start exploring unlimited titles today.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-cineMuted">Name</label>
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-md bg-black/40 ring-1 ring-white/10 focus:ring-cineRed outline-none"
            />
          </div>
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 rounded-md bg-black/40 ring-1 ring-white/10 focus:ring-cineRed outline-none"
            />
            <p className="text-[11px] text-cineMuted mt-1">At least 6 characters.</p>
          </div>
          {err && <p className="text-sm text-cineRed">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 rounded-md bg-cineRed hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Account
          </button>
        </form>
        <p className="text-sm text-cineMuted mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:text-cineRed">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
