import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function AuthLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen relative overflow-hidden bg-cineDark">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.9) 100%), url('https://image.tmdb.org/t/p/original/iNh3BivHyg7sCMuSGL4OF5h4SvQ.jpg')",
        }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
