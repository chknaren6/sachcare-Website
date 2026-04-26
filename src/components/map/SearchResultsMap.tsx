import { useEffect, useMemo, useState } from "react";
import type { Facility } from "@/types";

function trustColor(score: number): string {
  if (score >= 70) return "#16A34A";
  if (score >= 40) return "#F59E0B";
  return "#DC2626";
}

interface Props {
  facilities: Facility[];
  userLat: number | null;
  userLon: number | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SearchResultsMap({ facilities, userLat, userLon, selectedId, onSelect }: Props) {
  const [leafletLib, setLeafletLib] = useState<null | typeof import("leaflet")>(null);
  const [leafletUi, setLeafletUi] = useState<null | typeof import("react-leaflet")>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    void Promise.all([import("leaflet"), import("react-leaflet")]).then(([leaflet, ui]) => {
      setLeafletLib(leaflet);
      setLeafletUi(ui);
    });
  }, []);

  const validFacilities = useMemo(
    () => facilities.filter((f) => Number.isFinite(f.lat) && Number.isFinite(f.lon)),
    [facilities],
  );
  const selected = useMemo(
    () => validFacilities.find((f) => f.id === selectedId) ?? null,
    [validFacilities, selectedId],
  );
  const center: [number, number] = selected
    ? [selected.lat, selected.lon]
    : userLat !== null && userLon !== null
      ? [userLat, userLon]
      : validFacilities[0]
        ? [validFacilities[0].lat, validFacilities[0].lon]
        : [20.5937, 78.9629];

  if (!leafletLib || !leafletUi) {
    return <div className="h-72 rounded-2xl border bg-slate-50 md:h-[480px]" />;
  }

  const { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } = leafletUi;

  const markerIcon = (score: number) =>
    leafletLib.divIcon({
      className: "",
      html: `<div style="width:16px;height:16px;border-radius:9999px;border:2px solid #fff;background:${trustColor(score)}"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

  const userIcon = () =>
    leafletLib.divIcon({
      className: "",
      html: `<div style="width:14px;height:14px;border-radius:9999px;background:#2563EB;border:2px solid #fff"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

  function Recenter({ lat, lon }: { lat: number; lon: number }) {
    const map = useMap();
    map.flyTo([lat, lon], Math.max(map.getZoom(), 10), { duration: 0.6 });
    return null;
  }

  return (
    <div className="relative z-0 h-72 w-full min-w-0 overflow-hidden rounded-2xl border md:h-[480px]">
      <MapContainer center={center} zoom={10} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selected && <Recenter lat={selected.lat} lon={selected.lon} />}
        {userLat !== null && userLon !== null && (
          <Marker position={[userLat, userLon]} icon={userIcon()}>
            <Tooltip permanent direction="top" offset={[0, -12]}>
              You are here
            </Tooltip>
          </Marker>
        )}
        {validFacilities.map((f) => (
          <Marker
            key={f.id}
            position={[f.lat, f.lon]}
            icon={markerIcon(f.trustScore)}
            eventHandlers={{ click: () => onSelect(f.id) }}
          >
            <Tooltip direction="top">
              <div className="text-xs">
                <p className="font-semibold">{f.name}</p>
                <p>{f.phone}</p>
                <p>Trust: {f.trustScore}/100</p>
              </div>
            </Tooltip>
            <Popup>
              <p className="text-sm font-semibold">{f.name}</p>
              <a href={`tel:${f.phone}`} className="text-xs underline">
                {f.phone}
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
