import { createFileRoute } from "@tanstack/react-router";
import { buildAskMock } from "@/lib/mockData";

export const Route = createFileRoute("/api/ask")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { query?: string; language?: string; lat?: number; lon?: number } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          /* ignore */
        }
        const query = (body.query ?? "").toString();
        const language = (body.language ?? "en-IN").toString();
        return Response.json(buildAskMock(query, language));
      },
    },
  },
});
