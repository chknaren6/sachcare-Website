import type { AskResponse } from "@/types";

const GOOGLE_TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2";
const GOOGLE_DETECT_URL = "https://translation.googleapis.com/language/translate/v2/detect";

type TranslateResponse = {
  data?: {
    translations?: Array<{ translatedText: string }>;
  };
};

type DetectResponse = {
  data?: {
    detections?: Array<Array<{ language?: string }>>;
  };
};

export async function translateText(
  text: string,
  target: string,
  source?: string,
): Promise<string> {
  const apiKey = import.meta.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_KEY;
  if (!apiKey || !text.trim()) return text;

  const body = new URLSearchParams();
  body.set("q", text);
  body.set("target", target);
  if (source) body.set("source", source);
  body.set("format", "text");

  const res = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
  });
  if (!res.ok) return text;
  const json = (await res.json()) as TranslateResponse;
  return json.data?.translations?.[0]?.translatedText ?? text;
}

// Batch-translate up to ~128 strings in a single API call. Empty entries are
// echoed back unchanged so the caller can keep array indexes stable.
export async function translateBatch(
  texts: string[],
  target: string,
  source?: string,
): Promise<string[]> {
  const apiKey = import.meta.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_KEY;
  if (!apiKey || texts.length === 0) return texts;

  const indices: number[] = [];
  const body = new URLSearchParams();
  body.set("target", target);
  if (source) body.set("source", source);
  body.set("format", "text");
  texts.forEach((text, idx) => {
    if (typeof text === "string" && text.trim()) {
      body.append("q", text);
      indices.push(idx);
    }
  });
  if (indices.length === 0) return texts;

  const res = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
  });
  if (!res.ok) return texts;
  const json = (await res.json()) as TranslateResponse;
  const out = json.data?.translations ?? [];
  const merged = [...texts];
  indices.forEach((originalIdx, i) => {
    const translated = out[i]?.translatedText;
    if (typeof translated === "string" && translated) merged[originalIdx] = translated;
  });
  return merged;
}

export async function detectLanguageByGoogle(text: string): Promise<string | null> {
  const apiKey = import.meta.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_KEY;
  if (!apiKey || !text.trim()) return null;

  const res = await fetch(`${GOOGLE_DETECT_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text }),
  });
  if (!res.ok) return null;

  const json = (await res.json()) as DetectResponse;
  return json.data?.detections?.[0]?.[0]?.language ?? null;
}

export async function translateToEnglish(text: string, sourceLang: string): Promise<string> {
  if (!text.trim()) return text;
  if (sourceLang.startsWith("en")) return text;
  return translateText(text, "en", sourceLang.split("-")[0]);
}

export async function translateFromEnglish(text: string, targetLang: string): Promise<string> {
  if (!text.trim()) return text;
  if (targetLang.startsWith("en")) return text;
  return translateText(text, targetLang.split("-")[0], "en");
}

// Translates every human-readable field of an AskResponse so the entire UI
// (agent narrative, thinking trace, facility names, locations, sources and
// contradictions) can be displayed in the user's selected language.
export async function translateAskResponse(
  data: AskResponse,
  targetLang: string,
): Promise<AskResponse> {
  if (!data) return data;
  if (targetLang.startsWith("en")) return data;
  const target = targetLang.split("-")[0];

  const segments: string[] = [];
  segments.push(data.response ?? "");
  const thinking = data.thinking ?? [];
  thinking.forEach((step) => {
    segments.push(step.title ?? "");
    segments.push(step.detail ?? "");
  });
  const facilities = data.facilities ?? [];
  const facilityShape = facilities.map((f) => ({
    sources: (f.sources ?? []).length,
    contradictions: (f.contradictions ?? []).length,
  }));
  facilities.forEach((f) => {
    segments.push(f.name ?? "");
    segments.push(f.city ?? "");
    segments.push(f.state ?? "");
    (f.sources ?? []).forEach((s) => segments.push(s ?? ""));
    (f.contradictions ?? []).forEach((c) => {
      segments.push(c.text ?? "");
      segments.push(c.source ?? "");
    });
  });

  let translated: string[];
  try {
    translated = await translateBatch(segments, target, "en");
  } catch {
    return data;
  }

  let cursor = 0;
  const next = () => translated[cursor++] ?? segments[cursor - 1] ?? "";

  const translatedResponse = next();
  const translatedThinking = thinking.map((step) => ({
    ...step,
    title: next(),
    detail: next(),
  }));
  const translatedFacilities = facilities.map((f, i) => {
    const name = next();
    const city = next();
    const state = next();
    const sources: string[] = [];
    for (let s = 0; s < facilityShape[i].sources; s += 1) sources.push(next());
    const contradictions = (f.contradictions ?? []).map((c) => ({
      ...c,
      text: next(),
      source: next(),
    }));
    return { ...f, name, city, state, sources, contradictions };
  });

  return {
    ...data,
    response: translatedResponse,
    thinking: translatedThinking,
    facilities: translatedFacilities,
  };
}
