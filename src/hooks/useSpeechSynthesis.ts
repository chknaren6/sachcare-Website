import { useCallback, useEffect, useRef, useState } from "react";

function getSpeechSynthesis() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

function splitForSpeech(text: string) {
  const sentences = text.match(/[^.!?\n]+[.!?]?/g) ?? [text];
  const chunks: string[] = [];
  for (const sentence of sentences) {
    const clean = sentence.trim();
    if (!clean) continue;
    for (let i = 0; i < clean.length; i += 180) {
      chunks.push(clean.slice(i, i + 180));
    }
  }
  return chunks.length > 0 ? chunks : [text];
}

function getSpeechLanguages(langCode: string) {
  const base = langCode.split("-")[0] || "en";
  const variants: Record<string, string[]> = {
    en: ["en-IN", "en-US", "en-GB"],
    hi: ["hi-IN", "hi", "en-IN", "en-US"],
    bn: ["bn-IN", "bn", "en-IN"],
    te: ["te-IN", "te", "en-IN"],
    ta: ["ta-IN", "ta", "en-IN"],
    mr: ["mr-IN", "mr", "hi-IN", "hi", "en-IN"],
    gu: ["gu-IN", "gu", "hi-IN", "hi", "en-IN"],
    kn: ["kn-IN", "kn", "en-IN"],
    ml: ["ml-IN", "ml", "en-IN"],
  };
  return Array.from(new Set([langCode, ...(variants[base] ?? []), "en-IN", "en-US"]));
}

function waitForVoices(synth: SpeechSynthesis, timeoutMs = 1200) {
  const current = synth.getVoices();
  if (current.length > 0) return Promise.resolve(current);

  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    let settled = false;
    const previousHandler = synth.onvoiceschanged;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      synth.removeEventListener?.("voiceschanged", finish);
      synth.onvoiceschanged = previousHandler;
      resolve(synth.getVoices());
    };
    const timer = window.setTimeout(finish, timeoutMs);
    synth.addEventListener?.("voiceschanged", finish);
    synth.onvoiceschanged = finish;
  });
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const speakingRunRef = useRef(0);

  useEffect(() => {
    const synth = getSpeechSynthesis();
    if (!synth) return;
    setIsSupported(true);
    const load = () => setVoices(synth.getVoices());
    load();
    const retry = window.setTimeout(load, 250);
    synth.addEventListener?.("voiceschanged", load);
    synth.onvoiceschanged = load;
    return () => {
      window.clearTimeout(retry);
      synth.removeEventListener?.("voiceschanged", load);
      synth.onvoiceschanged = null;
      synth.cancel();
    };
  }, []);

  const speak = useCallback(
    async (text: string, langCode: string) => {
      const synth = getSpeechSynthesis();
      if (!synth) {
        setError("Speech output is not supported in this browser.");
        return;
      }
      const runId = speakingRunRef.current + 1;
      speakingRunRef.current = runId;
      synth.cancel();
      const cleaned = text.trim();
      if (!cleaned) return;
      setError(null);

      // Chrome/Edge bug: speak() called too soon after cancel() silently drops
      // the utterance. Wait one tick for the engine to flush.
      await new Promise((r) => window.setTimeout(r, 60));
      if (speakingRunRef.current !== runId) return;

      const availableVoices = await waitForVoices(synth);
      if (availableVoices.length > 0 && voices.length === 0) setVoices(availableVoices);
      const speechLanguages = getSpeechLanguages(langCode);
      const langPrefix = speechLanguages[0].split("-")[0];
      const match =
        speechLanguages
          .map((speechLang) => availableVoices.find((v) => v.lang === speechLang))
          .find(Boolean) ??
        availableVoices.find((v) => v.lang.startsWith(langPrefix)) ??
        speechLanguages
          .map((speechLang) => voices.find((v) => v.lang === speechLang))
          .find(Boolean) ??
        voices.find((v) => v.lang.startsWith(langPrefix)) ??
        availableVoices[0] ??
        voices[0];

      const chunks = splitForSpeech(cleaned);
      let idx = 0;

      const speakNext = () => {
        if (speakingRunRef.current !== runId) return;
        if (idx >= chunks.length) {
          setIsSpeaking(false);
          return;
        }
        const u = new SpeechSynthesisUtterance(chunks[idx].trim());
        if (match) {
          u.voice = match;
          u.lang = match.lang;
        } else {
          u.lang = speechLanguages[0];
        }
        u.rate = 0.95;
        u.pitch = 1;
        u.volume = 1;
        u.onend = () => {
          idx += 1;
          speakNext();
        };
        u.onerror = (ev) => {
          if (ev.error === "interrupted" || ev.error === "canceled") return;
          // "not-allowed" happens when speak() is called before any user
          // gesture on Safari — surface a clearer message.
          if (ev.error === "not-allowed") {
            setError("Tap the Listen button again to enable audio.");
          } else {
            setError("Speech output failed. Please try again.");
          }
          setIsSpeaking(false);
        };
        synth.resume();
        synth.speak(u);
      };

      setIsSpeaking(true);
      speakNext();
    },
    [voices],
  );

  const stop = useCallback(() => {
    const synth = getSpeechSynthesis();
    if (!synth) return;
    speakingRunRef.current += 1;
    synth.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, voices, isSupported, error };
}
