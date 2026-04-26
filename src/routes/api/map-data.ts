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
          if (!res.ok) return Response.json({ error: "Failed to fetch map data" }, { status: res.status });
          const json = (await res.json()) as Array<{
            facility_id?: string;
            facility_name?: string;
            state?: string;
            district?: string;
            lat: number;
            lon: number;
            trust_score?: number;
            contradictions_count?: number;
            phone?: string;
          }>;
          return Response.json(
            (json ?? []).map((item, idx) => ({
              id: item.facility_id ?? `${idx}-${item.lat}-${item.lon}`,
              name: item.facility_name ?? "Unknown Facility",
              state: item.state ?? "Unknown",
              lat: item.lat,
              lon: item.lon,
              trustScore: Math.round(item.trust_score ?? 0),
              contradictions: item.contradictions_count ?? 0,
              phone: item.phone ?? "N/A",
              type: "hospital",
            })),
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
