import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/components/providers/AppContext";
import { t } from "@/i18n";

export function LocationConsentModal() {
  const {
    locationConsentGiven,
    setLocationConsentGiven,
    setUserLocation,
    effectiveLanguage,
  } = useApp();
  const [open, setOpen] = useState(false);
  const copy = t(effectiveLanguage);

  useEffect(() => {
    if (!locationConsentGiven) setOpen(true);
  }, [locationConsentGiven]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationConsentGiven(true);
      setOpen(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation(pos.coords.latitude, pos.coords.longitude);
        setLocationConsentGiven(true);
        setOpen(false);
      },
      () => {
        setLocationConsentGiven(true);
        setOpen(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.locationPromptTitle}</DialogTitle>
          <DialogDescription>{copy.locationPromptBody}</DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            className="rounded-md bg-cyan-500 px-3 py-2 text-sm font-medium text-white"
            onClick={requestLocation}
          >
            {copy.allowLocation}
          </button>
          <button
            type="button"
            className="rounded-md border px-3 py-2 text-sm font-medium"
            onClick={() => {
              setLocationConsentGiven(true);
              setOpen(false);
            }}
          >
            {copy.skip}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
