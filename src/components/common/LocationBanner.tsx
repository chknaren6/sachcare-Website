import { MapPin, X } from "lucide-react";
import { useApp } from "@/components/providers/AppContext";
import { useGeolocation } from "@/hooks/useGeolocation";

export function LocationBanner() {
  const { locationGranted, bannerDismissed, dismissBanner, setUserLocation } = useApp();
  const { requestLocation, loading } = useGeolocation();

  if (locationGranted || bannerDismissed) return null;

  const onShare = async () => {
    const c = await requestLocation();
    if (c) setUserLocation(c.lat, c.lon);
  };

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-cyan-400 bg-cyan-300/60 p-4 sm:flex-row sm:items-center dark:border-cyan-400/40 dark:bg-cyan-400/10">
      <MapPin className="h-5 w-5 text-cyan-400" aria-hidden="true" />
      <p className="flex-1 text-sm text-slate-800 dark:text-slate-100">
        Share your location to find the nearest facilities and see distance estimates.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onShare}
          disabled={loading}
          className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-300 disabled:opacity-60"
        >
          {loading ? "Locating…" : "Share Location"}
        </button>
        <button
          type="button"
          onClick={dismissBanner}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-slate-700 dark:hover:text-slate-200"
          aria-label="Dismiss location banner"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Maybe later
        </button>
      </div>
    </div>
  );
}
