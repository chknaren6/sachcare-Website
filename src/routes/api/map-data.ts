import { createFileRoute } from "@tanstack/react-router";
import { getDatabricksAccessToken, getEnv } from "@/lib/server/databricks";

export const Route = createFileRoute("/api/map-data")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const token = await getDatabricksAccessToken();
          const apiUrl = getEnv("SACHCARE_API_URL").replace(/\/+$/, "");
          const res = await fetch(`${apiUrl}/api/map-data`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok)
            return Response.json({ error: "Failed to fetch map data" }, { status: res.status });
          const toFiniteNumber = (value: unknown): number | null => {
            if (typeof value === "number" && Number.isFinite(value)) return value;
            if (typeof value === "string") {
              const n = Number(value);
              return Number.isFinite(n) ? n : null;
            }
            return null;
          };
          const json = (await res.json()) as Array<{
            facility_id?: string;
            facility_name?: string;
            id?: string;
            name?: string;
            state?: string;
            district?: string;
            lat?: number | string;
            lon?: number | string;
            latitude?: number | string;
            longitude?: number | string;
            trust_score?: number;
            trustScore?: number;
            contradictions_count?: number;
            contradictions?: number;
            phone?: string;
          }>;
          return Response.json(
            (json ?? [])
              .map((item, idx) => {
                const lat = toFiniteNumber(item.lat ?? item.latitude);
                const lon = toFiniteNumber(item.lon ?? item.longitude);
                if (lat === null || lon === null) return null;
                return {
                  id: item.facility_id ?? item.id ?? `${idx}-${lat}-${lon}`,
                  name: item.facility_name ?? item.name ?? "Unknown Facility",
                  state: item.state ?? item.district ?? "Unknown",
                  lat,
                  lon,
                  trustScore: Math.round(item.trustScore ?? item.trust_score ?? 0),
                  contradictions: item.contradictions ?? item.contradictions_count ?? 0,
                  phone: item.phone ?? "N/A",
                  type: "hospital",
                };
              })
              .filter((item) => item !== null),
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
