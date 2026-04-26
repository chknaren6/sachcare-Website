import { useEffect, useState } from "react";
import { detectLanguage } from "@/lib/languageMap";

export function useLanguageDetection(text: string, debounceMs = 300) {
  const [lang, setLang] = useState("en-IN");
  useEffect(() => {
    const id = setTimeout(() => setLang(detectLanguage(text)), debounceMs);
    return () => clearTimeout(id);
  }, [text, debounceMs]);
  return lang;
}
