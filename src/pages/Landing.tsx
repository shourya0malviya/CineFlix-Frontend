import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Tv, Heart, Sparkles, Shield, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-cineRed">
            <Film className="w-5 h-5" />
          </span>
          <span className="font-display tracking-wider text-2xl">CINEFLIX</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/login" className="px-4 py-2 text-sm hover:text-cineRed transition">Sign In</Link>
          <Link to="/register" className="px-4 py-2 text-sm rounded-md bg-cineRed hover:bg-red-700 transition">Sign Up</Link>
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-6 py-10">
        <div className="max-w-5xl w-full text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-wide"
          >
            Unlimited movies,
            <br />
            <span className="text-cineRed">shows</span>, and more.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
          >
            A premium streaming experience, reimagined for your local machine. Discover
            trending titles, curate your own watchlist, and pick up where you left off.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/register"
              className="px-7 py-3 rounded-md bg-cineRed text-white font-semibold hover:bg-red-700 transition shadow-lg shadow-red-900/40"
            >
              Get Started — Free
            </Link>
            <Link
              to="/login"
              className="px-7 py-3 rounded-md bg-white/10 backdrop-blur font-semibold hover:bg-white/20 transition ring-1 ring-white/10"
            >
              I already have an account
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left"
          >
            {[
              { icon: Sparkles, title: "Cinematic UI", desc: "Polished animations, glass effects, and a smooth modern interface." },
              { icon: Heart, title: "Your Watchlist", desc: "Save titles, track progress, and continue watching across sessions." },
              { icon: Shield, title: "Runs Locally", desc: "Your data stays on your laptop. Educational project, your terms." },
            ].map((f) => (
              <div key={f.title} className="glass rounded-2xl p-5">
                <f.icon className="w-6 h-6 text-cineRed mb-2" />
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-cineMuted">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
      <footer className="px-6 py-4 text-center text-xs text-cineMuted">
        CineFlix — educational, original implementation. Not affiliated with any streaming service.
      </footer>
    </div>
  );
}
