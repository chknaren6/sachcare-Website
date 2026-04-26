import { AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Contradiction } from "@/types";

export function ContradictionAlert({ items }: { items: Contradiction[] }) {
  if (!items || items.length === 0) return null;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-danger/40 bg-danger/10 px-2.5 py-0.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/20"
            aria-label={`${items.length} contradictions detected`}
          >
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {items.length} contradiction{items.length === 1 ? "" : "s"}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-sm border border-danger/30 bg-popover p-0 text-popover-foreground shadow-lg"
        >
          <div className="space-y-3 p-3">
            {items.map((c, idx) => (
              <div key={idx} className="text-xs">
                <div className="mb-1 inline-block rounded bg-danger/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-danger">
                  {c.severity}
                </div>
                <p className="leading-snug">{c.text}</p>
                <p className="mt-1 text-muted-foreground">— {c.source}</p>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
