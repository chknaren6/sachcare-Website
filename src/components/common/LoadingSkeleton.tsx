export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-xl bg-cyan-100/70 p-4 dark:bg-slate-800/60">
        {[80, 95, 70, 60].map((w, i) => (
          <div
            key={i}
            className="h-3 animate-pulse rounded bg-cyan-200/80 dark:bg-slate-700"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-cyan-200 bg-cyan-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-5 w-2/3 animate-pulse rounded bg-cyan-200/80 dark:bg-slate-700" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-cyan-200/60 dark:bg-slate-700/60" />
            </div>
            <div className="h-7 w-20 animate-pulse rounded-full bg-cyan-200/80 dark:bg-slate-700" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-5 w-32 animate-pulse rounded bg-cyan-200/60 dark:bg-slate-700/60" />
            <div className="h-5 w-20 animate-pulse rounded bg-cyan-200/60 dark:bg-slate-700/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
