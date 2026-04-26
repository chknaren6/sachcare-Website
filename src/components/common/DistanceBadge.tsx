interface Props {
  km: number;
}

export function DistanceBadge({ km }: Props) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-cyan-200/80 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-cyan-400/15 dark:text-cyan-300"
      aria-label={`Approximately ${km} kilometers away`}
    >
      📍 ≈ {km} km
    </span>
  );
}
