import { Skeleton } from "@/components/ui/skeleton";

export function TeacherDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 w-full bg-white shadow-sm mb-6" />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-1/3 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 border rounded-xl bg-white shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-7 w-1/4 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-4 border rounded-xl bg-white shadow-sm">
              <Skeleton className="h-5 w-1/4 mb-4 rounded" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-md" />
                ))}
              </div>
            </div>

            <div className="p-4 border rounded-xl bg-white shadow-sm">
              <Skeleton className="h-5 w-1/3 mb-4 rounded" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-2/3 rounded" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-16 rounded-full" />
                        <Skeleton className="h-4 w-12 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="p-4 border rounded-xl bg-white shadow-sm">
              <Skeleton className="h-5 w-1/3 mb-4 rounded" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/3 rounded" />
                      <Skeleton className="h-4 w-16 rounded" />
                    </div>
                    <Skeleton className="h-4 w-1/4 rounded-full" />
                    <Skeleton className="h-2 w-full rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 border rounded-xl bg-white shadow-sm space-y-4">
              <Skeleton className="h-5 w-1/2 rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-1/3 rounded" />
                  <Skeleton className="h-4 w-8 rounded" />
                </div>
              ))}
            </div>

            {/* Top Performers */}
            <div className="p-4 border rounded-xl bg-white shadow-sm space-y-3">
              <Skeleton className="h-5 w-1/2 rounded" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                  <Skeleton className="h-6 w-10 rounded-full" />
                </div>
              ))}
              <Skeleton className="h-8 w-full mt-2 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
