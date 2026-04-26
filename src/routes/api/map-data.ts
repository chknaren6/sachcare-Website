import { createFileRoute } from "@tanstack/react-router";
import { buildMapFacilities } from "@/lib/mockData";

export const Route = createFileRoute("/api/map-data")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(buildMapFacilities());
      },
    },
  },
});
