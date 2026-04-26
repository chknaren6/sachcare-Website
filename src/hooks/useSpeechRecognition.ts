import { useEffect, useRef, useState } from "react";

type SRConstructor = new () => SpeechRecognition;

interface SpeechRecognitionEventLike extends Event {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function getCtor(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition(lang: string) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setIsSupported(!!getCtor());
  }, []);

  const startListening = () => {
    const Ctor = getCtor();
    if (!Ctor) {
      setError("Speech recognition not supported");
      return;
    }
    try {
      const rec = new Ctor();
      rec.lang = lang;
      rec.continuous = false;
      rec.interimResults = true;
      rec.onresult = (ev) => {
        const last = ev.results[ev.results.length - 1];
        const text = last[0].transcript;
        setTranscript(text);
      };
      rec.onerror = () => {
        setError("Recognition error");
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);
      recRef.current = rec;
      setError(null);
      setTranscript("");
      setIsListening(true);
      rec.start();
    } catch {
      setError("Could not start recognition");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    recRef.current?.stop();
    setIsListening(false);
  };

  return { isListening, transcript, startListening, stopListening, isSupported, error };
}
