import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppData } from "@/context/AppDataContext";

export default function Genres() {
  const { genres } = useAppData();
  const nav = useNavigate();

  // group + de-dupe by name
  const unique = Array.from(
    genres.reduce((m, g) => {
      if (!m.has(g.name)) m.set(g.name, g);
      return m;
    }, new Map<string, (typeof genres)[number]>()).values(),
  );

  return (
    <div className="px-4 sm:px-6 lg:px-10 pt-4 pb-10">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl font-display tracking-wide mb-3"
      >
        Genres
      </motion.h1>
      <p className="text-cineMuted text-sm mb-6">Explore titles by category.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {unique.map((g, i) => (
          <motion.button
            key={`${g.id}-${g.type}-${i}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
            onClick={() => nav(`/genres/${g.id}`)}
            className="relative overflow-hidden rounded-xl p-6 text-left h-28 ring-1 ring-white/10 hover:ring-cineRed transition group"
            style={{
              background:
                "linear-gradient(135deg, rgba(229,9,20,0.3), rgba(0,0,0,0.6))",
            }}
          >
            <span className="font-display text-2xl tracking-wide relative z-10 group-hover:text-white">{g.name}</span>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5 group-hover:bg-white/10 transition" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
