import { useCallback, useEffect, useRef, useState } from "react";

type SRConstructor = new () => SpeechRecognition;
type RecognitionErrorCode =
  | "aborted"
  | "audio-capture"
  | "bad-grammar"
  | "language-not-supported"
  | "network"
  | "no-speech"
  | "not-allowed"
  | "service-not-allowed"
  | string;

interface SpeechRecognitionResultLike extends ArrayLike<{ transcript?: string }> {
  isFinal?: boolean;
}

interface SpeechRecognitionEventLike extends Event {
  results: ArrayLike<SpeechRecognitionResultLike>;
  resultIndex?: number;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error?: RecognitionErrorCode;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives?: number;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
}

function getCtor(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function getRecognitionLanguages(lang: string) {
  const base = lang.split("-")[0] || "en";
  const variants: Record<string, string[]> = {
    en: ["en-IN", "en-US", "en-GB"],
    hi: ["hi-IN", "hi", "en-IN", "en-US"],
    bn: ["bn-IN", "bn", "en-IN", "en-US"],
    te: ["te-IN", "te", "en-IN", "en-US"],
    ta: ["ta-IN", "ta", "en-IN", "en-US"],
    mr: ["mr-IN", "mr", "hi-IN", "hi", "en-IN"],
    gu: ["gu-IN", "gu", "hi-IN", "hi", "en-IN"],
    kn: ["kn-IN", "kn", "en-IN", "en-US"],
    ml: ["ml-IN", "ml", "en-IN", "en-US"],
  };
  return Array.from(new Set([lang, ...(variants[base] ?? []), "en-IN", "en-US"]));
}

function shouldRetryRecognition(error?: RecognitionErrorCode) {
  return error === "network" || error === "language-not-supported";
}

function recognitionErrorMessage(error?: RecognitionErrorCode, message?: string) {
  if (message) return message;
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone permission is blocked. Allow mic access and try again.";
    case "no-speech":
      return "No speech detected. Try again closer to the mic.";
    case "audio-capture":
      return "No microphone was found by the browser.";
    case "network":
      return "Browser speech recognition could not connect. Try Chrome/Edge, allow mic access, and keep this page on HTTPS or localhost.";
    case "language-not-supported":
      return "Voice input is not available for this language in this browser.";
    default:
      return "Speech recognition failed. Please try again.";
  }
}

export function useSpeechRecognition(lang: string, onFinalTranscript?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recRef = useRef<SpeechRecognition | null>(null);
  const onFinalTranscriptRef = useRef(onFinalTranscript);
  const latestTranscriptRef = useRef("");
  const submittedTranscriptRef = useRef(false);
  const lastErrorRef = useRef<RecognitionErrorCode | null>(null);
  const retryTimerRef = useRef<number | null>(null);

  useEffect(() => {
    onFinalTranscriptRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    setIsSupported(!!getCtor());
  }, []);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
      recRef.current?.abort?.();
      recRef.current = null;
    };
  }, []);

  const startListening = useCallback(
    (attempt = 0) => {
      const Ctor = getCtor();
      if (!Ctor) {
        setError("Speech recognition not supported");
        return;
      }
      const languages = getRecognitionLanguages(lang || "en-IN");
      const recognitionLang = languages[Math.min(attempt, languages.length - 1)];
      try {
        recRef.current?.abort?.();
        const rec = new Ctor();
        rec.lang = recognitionLang;
        rec.continuous = false;
        rec.interimResults = true;
        rec.maxAlternatives = 1;
        rec.onresult = (ev) => {
          let interimText = "";
          let finalText = "";
          const startIndex = ev.resultIndex ?? 0;
          for (let i = startIndex; i < ev.results.length; i += 1) {
            const result = ev.results[i];
            const text = (result[0]?.transcript ?? "").trim();
            if (!text) continue;
            if (result.isFinal) finalText += `${text} `;
            else interimText += `${text} `;
          }

          const visibleText = (finalText || interimText).trim();
          if (visibleText) {
            latestTranscriptRef.current = visibleText;
            setTranscript(visibleText);
          }
          const cleanFinal = finalText.trim();
          if (cleanFinal) {
            submittedTranscriptRef.current = true;
            lastErrorRef.current = null;
            onFinalTranscriptRef.current?.(cleanFinal);
          }
        };
        rec.onerror = (ev) => {
          lastErrorRef.current = ev.error ?? "unknown";
          if (shouldRetryRecognition(ev.error) && attempt < languages.length - 1) {
            setError(`Retrying voice input with ${languages[attempt + 1]}...`);
          } else {
            setError(recognitionErrorMessage(ev.error, ev.message));
          }
          setIsListening(false);
        };
        rec.onend = () => {
          if (!submittedTranscriptRef.current && latestTranscriptRef.current) {
            submittedTranscriptRef.current = true;
            onFinalTranscriptRef.current?.(latestTranscriptRef.current);
          }
          setIsListening(false);
          recRef.current = null;
          if (
            !submittedTranscriptRef.current &&
            shouldRetryRecognition(lastErrorRef.current ?? undefined) &&
            attempt < languages.length - 1
          ) {
            retryTimerRef.current = window.setTimeout(() => startListening(attempt + 1), 150);
          }
        };
        recRef.current = rec;
        setError(null);
        setTranscript("");
        latestTranscriptRef.current = "";
        submittedTranscriptRef.current = false;
        lastErrorRef.current = null;
        rec.start();
        setIsListening(true);
      } catch {
        if (attempt < languages.length - 1) {
          setError(`Retrying voice input with ${languages[attempt + 1]}...`);
          retryTimerRef.current = window.setTimeout(() => startListening(attempt + 1), 150);
        } else {
          setError("Could not start recognition in this browser.");
          setIsListening(false);
        }
      }
    },
    [lang],
  );

  const stopListening = useCallback(() => {
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    try {
      recRef.current?.stop();
    } catch {
      recRef.current?.abort?.();
    }
    setIsListening(false);
  }, []);

  return { isListening, transcript, startListening, stopListening, isSupported, error };
}
