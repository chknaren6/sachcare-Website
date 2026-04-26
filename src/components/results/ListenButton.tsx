import { Volume2, Square } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { getLangInfo } from "@/lib/languageMap";

interface Props {
  text: string;
  lang: string;
}

export function ListenButton({ text, lang }: Props) {
  const { speak, stop, isSpeaking, isSupported, error } = useSpeechSynthesis();
  const langName = getLangInfo(lang).name;
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={!isSupported}
        onClick={() => (isSpeaking ? stop() : speak(text, lang))}
        aria-label={isSpeaking ? "Stop reading" : `Listen in ${langName}`}
        title={!isSupported ? "Speech output is not supported in this browser." : undefined}
        className="inline-flex items-center gap-2 rounded-xl border border-cyan-300 bg-cyan-100 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-100"
      >
        {isSpeaking ? (
          <>
            <Square className="h-4 w-4 fill-current" aria-hidden="true" />
            Stop
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            {isSupported ? `Listen in ${langName}` : "Listen unavailable"}
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-destructive" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
