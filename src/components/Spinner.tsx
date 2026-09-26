import { Loader2 } from "lucide-react";
import { cn } from "@/utils";

export function Spinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sz = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-10 h-10" : "w-6 h-6";
  return <Loader2 className={cn("animate-spin text-cineRed", sz, className)} />;
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen grid place-items-center bg-cineDark">
      <Spinner size="lg" />
    </div>
  );
}
