import { useEffect, useMemo, useState } from "react";
import type { MapFacility } from "@/types";

interface Props {
  facilities: MapFacility[];
  showDeserts: boolean;
}

function colorForTrust(t: number) {
  if (t >= 70) return "#26C6DA";
  if (t >= 40) return "#F59E0B";
  return "#EF4444";
}

export default function TrustMap({ facilities, showDeserts }: Props) {
  const [leafletLib, setLeafletLib] = useState<null | typeof import("leaflet")>(null);
  const [leafletUi, setLeafletUi] = useState<null | typeof import("react-leaflet")>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    void Promise.all([import("leaflet"), import("react-leaflet")]).then(([leaflet, ui]) => {
      delete (leaflet.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setLeafletLib(leaflet);
      setLeafletUi(ui);
    });
  }, []);

  const validFacilities = useMemo(
    () => facilities.filter((f) => Number.isFinite(f.lat) && Number.isFinite(f.lon)),
    [facilities],
  );

  const desertCenters = useMemo(() => {
    if (!showDeserts) return [];
    const byState: Record<string, MapFacility[]> = {};
    validFacilities.forEach((f) => {
      (byState[f.state] ??= []).push(f);
    });
    return Object.entries(byState)
      .map(([state, list]) => {
        const avg = list.reduce((a, b) => a + b.trustScore, 0) / list.length;
        if (avg >= 40) return null;
        const lat = list.reduce((a, b) => a + b.lat, 0) / list.length;
        const lon = list.reduce((a, b) => a + b.lon, 0) / list.length;
        return { state, lat, lon, avg };
      })
      .filter((x): x is { state: string; lat: number; lon: number; avg: number } => x !== null);
  }, [validFacilities, showDeserts]);

  if (!leafletLib || !leafletUi) {
    return <div className="h-full w-full bg-cyan-50 dark:bg-slate-900" />;
  }

  const { MapContainer, TileLayer, Marker, Popup, Circle } = leafletUi;
  const makeIcon = (score: number) =>
    leafletLib.divIcon({
      className: "",
      html: `<div class="sc-marker" style="background:${colorForTrust(score)}">${score}</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <div className="leaflet-bottom leaflet-left">
        <div className="leaflet-control rounded-xl bg-white/95 p-3 text-xs shadow-md">
          <p className="mb-2 font-bold text-slate-900">Trust Score</p>
          <p>
            <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#26C6DA]" /> 70+
            verified
          </p>
          <p>
            <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#F59E0B]" /> 40-69 needs
            review
          </p>
          <p>
            <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[#EF4444]" /> &lt;40 high
            risk
          </p>
        </div>
      </div>
      {validFacilities.map((f) => (
        <Marker
          key={f.id}
          position={[f.lat, f.lon]}
          icon={makeIcon(f.trustScore)}
          alt={`${f.name}, trust score ${f.trustScore}`}
        >
          <Popup>
            <div className="space-y-1">
              <p className="font-heading text-sm font-bold text-slate-900">{f.name}</p>
              <p className="text-xs text-slate-600">
                {f.state} · <span className="capitalize">{f.type}</span>
              </p>
              <p className="text-xs">
                Trust:{" "}
                <strong style={{ color: colorForTrust(f.trustScore) }}>{f.trustScore}/100</strong>
              </p>
              <a href={`tel:${f.phone}`} className="text-xs font-semibold text-cyan-600 underline">
                📞 {f.phone}
              </a>
              {f.contradictions > 0 && (
                <p className="text-xs text-red-600">
                  ⚠ {f.contradictions} contradiction{f.contradictions === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      {desertCenters.map((d) => (
        <Circle
          key={d.state}
          center={[d.lat, d.lon]}
          radius={120000}
          pathOptions={{ color: "#991B1B", fillColor: "#991B1B", fillOpacity: 0.15, weight: 1 }}
        />
      ))}
    </MapContainer>
  );
}
