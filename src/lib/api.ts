import type { AskResponse, DesertAnalysisResponse, MapFacility } from "@/types";

async function safeJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function ask(input: {
  query: string;
  language: string;
  lat?: number | null;
  lon?: number | null;
}): Promise<AskResponse> {
  return safeJson<AskResponse>("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function fetchMapData(): Promise<MapFacility[]> {
  return safeJson<MapFacility[]>("/api/map-data");
}

export async function fetchDesertAnalysis(): Promise<DesertAnalysisResponse> {
  return safeJson<DesertAnalysisResponse>("/api/desert-analysis");
}
