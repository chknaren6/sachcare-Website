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
  onEmergency: () => void;
  pinCode: string;
  onPinChange: (pin: string) => void;
  onPinSubmit: () => void;
  placeholder: string;
  sosLabel: string;
  pinPlaceholder: string;
  loading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  onEmergency,
  pinCode,
  onPinChange,
  onPinSubmit,
  placeholder,
  sosLabel,
  pinPlaceholder,
  loading,
}: Props) {
  const { effectiveLanguage, setDetectedLanguage } = useApp();
  const detected = useLanguageDetection(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDetectedLanguage(detected);
  }, [detected, setDetectedLanguage]);

  const sr = useSpeechRecognition(effectiveLanguage, (text) => {
    onChange(text);
    onSubmit();
  });

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
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Describe your medical need"
          disabled={loading}
          rows={2}
          className="w-full resize-none rounded-2xl border-2 border-cyan-200 bg-surface py-4 pl-14 pr-20 text-base text-foreground shadow-sm transition-all placeholder:text-muted-foreground focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-300/40 disabled:opacity-60 dark:bg-slate-900 dark:border-slate-700 dark:focus:border-cyan-400 sm:text-lg"
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
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Search
        </button>
        <button
          type="button"
          onClick={onEmergency}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          {sosLabel}
        </button>
        <div className="flex items-center gap-2">
          <input
            value={pinCode}
            onChange={(e) => onPinChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder={pinPlaceholder}
            className="h-10 w-44 rounded-xl border px-3 text-sm"
          />
          <button
            type="button"
            onClick={onPinSubmit}
            className="h-10 rounded-xl border px-3 text-sm font-medium"
          >
            Search PIN
          </button>
        </div>
      </div>
    </form>
  );
}
