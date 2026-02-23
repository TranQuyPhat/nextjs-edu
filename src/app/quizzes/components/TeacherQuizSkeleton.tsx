import { Skeleton } from "@/components/ui/skeleton";

export function TeacherQuizSkeleton() {
  return (
    <div className="space-y-6">
      {/* Class Label Skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-48 rounded bg-slate-700/50" />
        <Skeleton className="h-7 w-32 rounded-full bg-slate-700/50" />
      </div>

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/10 bg-slate-800 shadow-sm"
          >
            <div className="p-6">
              {/* Title and Subject Section */}
              <div className="mb-4">
                <Skeleton className="h-7 w-4/5 mb-2 rounded bg-slate-700/50" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24 rounded bg-slate-700/50" />
                  <Skeleton className="h-7 w-24 rounded-full bg-slate-700/50" />
                </div>
              </div>

              {/* Info Section with Icons */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2 rounded bg-slate-700/50" />
                  <Skeleton className="h-4 w-36 rounded bg-slate-700/50" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2 rounded bg-slate-700/50" />
                  <Skeleton className="h-4 w-28 rounded bg-slate-700/50" />
                </div>
                <Skeleton className="h-4 w-48 rounded bg-slate-700/50" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1 rounded-xl bg-slate-700/50" />
                <Skeleton className="h-9 w-9 rounded-xl bg-slate-700/50" />
                <Skeleton className="h-9 w-9 rounded-xl bg-slate-700/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
