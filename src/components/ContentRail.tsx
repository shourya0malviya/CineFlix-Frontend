import { useRef, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

interface Props {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function ContentRail({ title, subtitle, children, className }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dx: number) => ref.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <section className={cn("relative", className)}>
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="px-4 sm:px-6 lg:px-10 mb-3 flex items-end justify-between"
        >
          <div>
            {title && <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>}
            {subtitle && <p className="text-sm text-cineMuted mt-0.5">{subtitle}</p>}
          </div>
        </motion.div>
      )}
      <div className="group relative">
        <button
          onClick={() => scrollBy(-600)}
          aria-label="Scroll left"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/70 hover:bg-black/90 opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scrollBy(600)}
          aria-label="Scroll right"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/70 hover:bg-black/90 opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div
          ref={ref}
          className="rail-scroll flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-10 py-2 no-scrollbar"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
