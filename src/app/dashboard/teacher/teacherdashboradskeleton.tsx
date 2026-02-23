import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/navigation";

export function TeacherDashboardSkeleton() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-600/40 via-slate-900 to-slate-950 blur-3xl" />
        <div className="absolute -right-20 top-32 h-64 w-64 rounded-full bg-blue-500/30 blur-[120px]" />
        <div className="absolute -left-10 bottom-0 h-72 w-72 rounded-full bg-violet-500/30 blur-[140px]" />
      </div>

      <Navigation />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        {/* Hero Section Skeleton */}
        <section className="grid gap-8">
          <div className="rounded-[32px] border border-white/5 bg-white/5 p-6 shadow-2xl backdrop-blur-3xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-64 rounded bg-slate-700/50" />
              </div>
              <Skeleton className="h-10 w-32 rounded bg-slate-700/50" />
            </div>

            {/* Quick Actions Grid */}
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <Skeleton className="h-11 w-11 rounded-2xl bg-slate-700/50 mb-4" />
                  <Skeleton className="h-6 w-3/4 rounded bg-slate-700/50 mb-2" />
                  <Skeleton className="h-4 w-full rounded bg-slate-700/50" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="mt-4 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Recent Activities */}
            <div className="rounded-[28px] border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-2xl">
              <div className="border-b border-white/5 pb-4 mb-4">
                <Skeleton className="h-6 w-48 rounded bg-slate-700/50 mb-2" />
                <Skeleton className="h-4 w-64 rounded bg-slate-700/50" />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-white/5 p-4"
                  >
                    <Skeleton className="h-10 w-10 rounded-2xl bg-slate-700/50" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 rounded bg-slate-700/50" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-20 rounded-full bg-slate-700/50" />
                        <Skeleton className="h-4 w-16 rounded bg-slate-700/50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="rounded-[28px] border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-2xl">
              <div className="border-b border-white/5 pb-4 mb-4">
                <Skeleton className="h-6 w-40 rounded bg-slate-700/50 mb-2" />
                <Skeleton className="h-4 w-56 rounded bg-slate-700/50" />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/5 p-5 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-48 rounded bg-slate-700/50" />
                        <Skeleton className="h-5 w-24 rounded-full bg-slate-700/50" />
                      </div>
                      <Skeleton className="h-4 w-20 rounded bg-slate-700/50" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32 rounded bg-slate-700/50" />
                        <Skeleton className="h-4 w-12 rounded bg-slate-700/50" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full bg-slate-700/50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Grade Distribution */}
            <div className="rounded-[28px] border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-2xl">
              <div className="border-b border-white/5 pb-4 mb-4">
                <Skeleton className="h-6 w-40 rounded bg-slate-700/50 mb-2" />
                <Skeleton className="h-4 w-48 rounded bg-slate-700/50" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32 rounded bg-slate-700/50" />
                    <Skeleton className="h-4 w-12 rounded bg-slate-700/50" />
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="rounded-[28px] border border-white/5 bg-slate-900/60 p-6 shadow-xl backdrop-blur-2xl">
              <div className="border-b border-white/5 pb-4 mb-4">
                <Skeleton className="h-6 w-40 rounded bg-slate-700/50 mb-2" />
                <Skeleton className="h-4 w-32 rounded bg-slate-700/50" />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-2xl border border-white/5 p-4"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 rounded bg-slate-700/50" />
                      <Skeleton className="h-3 w-24 rounded bg-slate-700/50" />
                    </div>
                    <Skeleton className="h-7 w-16 rounded-full bg-slate-700/50" />
                  </div>
                ))}
                <Skeleton className="h-9 w-full rounded bg-slate-700/50 mt-2" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
