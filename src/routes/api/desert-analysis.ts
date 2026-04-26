import { createFileRoute } from "@tanstack/react-router";
import { buildDesertAnalysis } from "@/lib/mockData";

export const Route = createFileRoute("/api/desert-analysis")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(buildDesertAnalysis());
      },
    },
  },
});
