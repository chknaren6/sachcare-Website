import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { MicButton } from "./MicButton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useLanguageDetection } from "@/hooks/useLanguageDetection";
import { getLangInfo } from "@/lib/languageMap";
import { useApp } from "@/components/providers/AppContext";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function SearchBar({ value, onChange, onSubmit, loading }: Props) {
  const { effectiveLanguage, setDetectedLanguage } = useApp();
  const detected = useLanguageDetection(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDetectedLanguage(detected);
  }, [detected, setDetectedLanguage]);

  const sr = useSpeechRecognition(effectiveLanguage);

  // pipe live transcript into the input
  useEffect(() => {
    if (sr.transcript) onChange(sr.transcript);
  }, [sr.transcript, onChange]);

  const lang = getLangInfo(effectiveLanguage);
  const showBadge = value.trim().length >= 2;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="relative"
    >
      <AnimatePresence>
        {showBadge && (
          <motion.div
            key={lang.code}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-7 left-2 inline-flex items-center gap-1 rounded-full bg-cyan-300 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm"
          >
            <span aria-hidden="true">{lang.flag}</span>
            {lang.name} detected
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your medical need… ICU in Bihar, dialysis near me, blood bank Delhi"
          aria-label="Describe your medical need"
          disabled={loading}
          className="w-full rounded-2xl border-2 border-cyan-200 bg-surface py-4 pl-14 pr-20 text-base text-foreground shadow-sm transition-all placeholder:text-muted-foreground focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-300/40 disabled:opacity-60 dark:bg-slate-900 dark:border-slate-700 dark:focus:border-cyan-400 sm:text-lg"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <MicButton
            isListening={sr.isListening}
            isSupported={sr.isSupported}
            onStart={sr.startListening}
            onStop={sr.stopListening}
          />
        </div>
      </div>
    </form>
  );
}
