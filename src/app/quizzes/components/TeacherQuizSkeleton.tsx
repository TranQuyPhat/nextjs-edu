import { Skeleton } from "@/components/ui/skeleton";

export function TeacherQuizSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="p-5 rounded-xl shadow-sm bg-white border
                     hover:shadow-lg transition duration-200"
        >
          {/* Title & subject */}
          <Skeleton className="h-6 w-3/4 mb-2 rounded" />
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          {/* Info lines */}
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-10 rounded-md" />
            <Skeleton className="h-8 w-10 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
