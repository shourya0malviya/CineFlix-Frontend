export default function RailSkeleton({ count = 8, title }: { count?: number; title?: string }) {
  return (
    <section className="px-4 sm:px-6 lg:px-10 mb-6">
      {title && <div className="h-5 w-40 skeleton rounded mb-3" />}
      <div className="flex gap-3 sm:gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="shrink-0 w-[150px] sm:w-[180px] md:w-[210px]">
            <div className="aspect-[2/3] skeleton rounded-lg" />
            <div className="h-3 mt-2 w-2/3 skeleton rounded" />
            <div className="h-3 mt-1 w-1/3 skeleton rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
