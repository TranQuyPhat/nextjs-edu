// components/skeletons/CardSkeleton.tsx
export const CardSkeleton = () => {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 animate-pulse">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-6 w-3/4 rounded-lg bg-gradient-to-r from-white/10 to-white/5"></div>
            <div className="h-4 w-1/2 rounded-lg bg-gradient-to-r from-white/10 to-white/5"></div>
          </div>
          <div className="h-8 w-16 rounded-full bg-gradient-to-r from-white/10 to-white/5"></div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded-lg bg-gradient-to-r from-white/10 to-white/5"></div>
          <div className="h-4 w-5/6 rounded-lg bg-gradient-to-r from-white/10 to-white/5"></div>
        </div>

        {/* Info box */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="h-4 w-1/3 rounded-lg bg-gradient-to-r from-white/10 to-white/5"></div>
        </div>

        {/* Button */}
        <div className="h-10 w-full rounded-xl bg-gradient-to-r from-white/10 to-white/5"></div>
      </div>
    </div>
  );
};

export const CardSkeletonGrid = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};
