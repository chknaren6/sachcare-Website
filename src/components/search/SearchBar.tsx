import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Siren } from "lucide-react";
import { useEffect, useRef } from "react";
import { MicButton } from "./MicButton";
import { LanguageMarquee } from "./LanguageMarquee";
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
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="w-full">
      {/* Infinite language strip just above the search bar */}
      <LanguageMarquee />

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
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-7 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20"
            >
              <span aria-hidden="true">{lang.flag}</span>
              {lang.name} detected
            </motion.div>
          )}
        </AnimatePresence>

        {/* Single-line input. Mic LEFT, Search submit RIGHT. */}
        <div className="group relative flex h-14 w-full items-center rounded-full border border-teal-200 bg-surface shadow-[0_4px_24px_-8px_rgba(13,148,136,0.18)] transition-all focus-within:border-primary focus-within:shadow-[0_8px_28px_-6px_rgba(13,148,136,0.28)] dark:border-slate-700 dark:bg-slate-900">
          <div className="pl-2">
            <MicButton
              isListening={sr.isListening}
              isSupported={sr.isSupported}
              onStart={sr.startListening}
              onStop={sr.stopListening}
            />
          </div>

          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-label="Describe your medical need"
            disabled={loading}
            type="text"
            className="h-full flex-1 bg-transparent px-3 text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60 sm:text-[15px]"
          />

          <button
            type="submit"
            disabled={loading || !value.trim()}
            aria-label="Search"
            className="mr-1.5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all hover:scale-105 hover:bg-teal-600 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Secondary action row — compact, balanced */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onEmergency}
            className="inline-flex items-center gap-1.5 rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md"
            style={{ backgroundColor: "#dc2626" }}
          >
            <Siren className="h-4 w-4" aria-hidden="true" />
            {sosLabel}
          </button>

          {/* Pin-code-only search — compact pill input */}
          <div className="ml-auto inline-flex h-10 items-center overflow-hidden rounded-full border border-teal-200 bg-surface pl-3 dark:border-slate-700 dark:bg-slate-900">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            <input
              value={pinCode}
              onChange={(e) =>
                onPinChange(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder={pinPlaceholder}
              inputMode="numeric"
              aria-label="Search by PIN code"
              className="h-full w-32 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={onPinSubmit}
              disabled={pinCode.length !== 6}
              className="h-full rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-teal-600 disabled:opacity-50"
            >
              Go
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
