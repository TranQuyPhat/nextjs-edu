// components/skeletons/DashboardSkeleton.tsx
export const StatCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-2/3 rounded bg-gradient-to-r from-white/10 to-white/5"></div>
        <div className="h-8 w-1/2 rounded bg-gradient-to-r from-white/10 to-white/5"></div>
        <div className="h-3 w-3/5 rounded bg-gradient-to-r from-white/10 to-white/5"></div>
      </div>
    </div>
  );
};

export const StatCardSkeletonRow = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 w-1/3 rounded bg-gradient-to-r from-white/10 to-white/5"></div>
        <div className="h-64 w-full rounded bg-gradient-to-r from-white/10 to-white/5"></div>
      </div>
    </div>
  );
};
