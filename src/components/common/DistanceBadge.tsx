import { Navigation } from "lucide-react";

interface Props {
  km: number;
}

function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function DistanceBadge({ km }: Props) {
  const label = formatKm(km);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-cyan-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-cyan-400/15 dark:text-cyan-300"
      aria-label={`Approximately ${label} away`}
    >
      <Navigation className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}
