import { Mic, MicOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  isListening: boolean;
  isSupported: boolean;
  error?: string | null;
  onStart: () => void;
  onStop: () => void;
}

export function MicButton({ isListening, isSupported, error, onStart, onStop }: Props) {
  const tooltip = error ?? "Voice input not supported in this browser. Try Chrome.";
  const button = (
    <button
      type="button"
      disabled={!isSupported}
      onClick={isListening ? onStop : onStart}
      aria-label={isListening ? "Stop recording" : "Start voice input"}
      title={isSupported ? (error ?? undefined) : tooltip}
      className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 ${
        isListening ? "bg-destructive animate-pulse-ring" : "bg-primary hover:brightness-110"
      }`}
    >
      {isListening ? (
        <MicOff className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Mic className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
  if (isSupported) return button;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">{button}</span>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
