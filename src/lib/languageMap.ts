export interface LangInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LangInfo[] = [
  { code: "en-IN", name: "English", nativeName: "English", flag: "🇮🇳" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn-IN", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te-IN", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr-IN", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu-IN", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml-IN", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
];

export const LANG_BY_CODE = Object.fromEntries(LANGUAGES.map((l) => [l.code, l]));

export function getLangInfo(code: string): LangInfo {
  return LANG_BY_CODE[code] ?? LANGUAGES[0];
}

/**
 * Detect language from a string using Unicode script ranges.
 * Falls back to en-IN.
 */
export function detectLanguage(text: string): string {
  if (!text || !text.trim()) return "en-IN";
  // Devanagari — could be Hindi or Marathi. Default to Hindi.
  if (/[\u0900-\u097F]/.test(text)) return "hi-IN";
  if (/[\u0980-\u09FF]/.test(text)) return "bn-IN";
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN";
  if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN";
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu-IN";
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn-IN";
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml-IN";
  return "en-IN";
}
