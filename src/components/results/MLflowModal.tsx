import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import type { Facility } from "@/types";

interface Props {
  facility: Facility;
  traceId: string;
}

export function MLflowModal({ facility, traceId }: Props) {
  const [open, setOpen] = useState(false);
  const trace = {
    traceId,
    facilityId: facility.id,
    name: facility.name,
    pipeline: "hybrid_search → trust_score → tavily_verify → llm_synthesize",
    spans: [
      { name: "embedding.generate", durationMs: 124, model: "intfloat/e5-large-v2" },
      { name: "vector.search", durationMs: 98, hits: 24 },
      { name: "bm25.rerank", durationMs: 41 },
      { name: "trust.compute", durationMs: 67, score: facility.trustScore },
      {
        name: "tavily.web_search",
        durationMs: 1280,
        sources: facility.sources.length,
      },
      { name: "llm.synthesize", durationMs: 1530, model: "databricks-dbrx-instruct" },
    ],
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
          aria-label={`View MLflow trace for ${facility.name}`}
        >
          View MLflow Trace <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>MLflow Trace</DialogTitle>
          <DialogDescription>
            Reasoning trace for <strong>{facility.name}</strong>. Trace ID:{" "}
            <code className="rounded bg-cyan-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-800">
              {traceId}
            </code>
          </DialogDescription>
        </DialogHeader>
        <pre className="max-h-[420px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-cyan-200">
          {JSON.stringify(trace, null, 2)}
        </pre>
      </DialogContent>
    </Dialog>
  );
}
