import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import { motion, AnimatePresence } from "framer-motion";

export default function AppLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-cineDark text-white">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="pt-16 pb-24 md:pb-10"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <MobileNav />
    </div>
  );
}
