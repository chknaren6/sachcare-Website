import { MapPin, X } from "lucide-react";
import { useApp } from "@/components/providers/AppContext";
import { useGeolocation } from "@/hooks/useGeolocation";

export function LocationBanner() {
  const { locationGranted, bannerDismissed, dismissBanner, setUserLocation, userLat, userLon } =
    useApp();
  const { requestLocation, loading } = useGeolocation();

  // Hide once we have coordinates OR the user dismissed the banner
  if (locationGranted || (userLat !== null && userLon !== null) || bannerDismissed) return null;

  const onShare = async () => {
    const c = await requestLocation();
    if (c) setUserLocation(c.lat, c.lon);
  };

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <MapPin className="h-4.5 w-4.5" aria-hidden="true" />
      </div>
      <p className="flex-1 text-sm text-foreground">
        Share your location to find the nearest facilities and see distance estimates.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onShare}
          disabled={loading}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Locating…" : "Share Location"}
        </button>
        <button
          type="button"
          onClick={dismissBanner}
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          aria-label="Dismiss location banner"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Later
        </button>
      </div>
    </div>
  );
}
