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
