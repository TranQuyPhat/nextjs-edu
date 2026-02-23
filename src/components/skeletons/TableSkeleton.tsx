// components/skeletons/TableSkeleton.tsx
export const TableSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
        >
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-white/10 to-white/5"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gradient-to-r from-white/10 to-white/5"></div>
            <div className="h-3 w-1/2 rounded bg-gradient-to-r from-white/10 to-white/5"></div>
          </div>
          <div className="h-8 w-20 rounded-lg bg-gradient-to-r from-white/10 to-white/5"></div>
        </div>
      ))}
    </div>
  );
};
