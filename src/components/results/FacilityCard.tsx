import { motion } from "framer-motion";
import { Phone, MapPin, Building2, Share2, Flag } from "lucide-react";
import { TrustBadge } from "./TrustBadge";
import { ContradictionAlert } from "./ContradictionAlert";
import { MLflowModal } from "./MLflowModal";
import { DistanceBadge } from "@/components/common/DistanceBadge";
import type { Facility } from "@/types";
import { t } from "@/i18n";
import { useApp } from "@/components/providers/AppContext";

interface Props {
  facility: Facility;
  traceId: string;
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

// The upstream `key_citation` sometimes contains JSON-ish fragments like
// `specialties: ["dentistry","familyMedicine"]`. We want to surface the
// human-readable bits without leaking raw JSON into the UI.
function cleanSource(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/[{}[\]]/g, " ")
    .replace(/"/g, "")
    .replace(/\s*:\s*/g, ": ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeSources(sources: string[]): string {
  const cleaned = sources.map(cleanSource).filter((s) => s && s.toLowerCase() !== "databricks");
  if (cleaned.length === 0) return "";
  const text = cleaned.slice(0, 2).join(" · ");
  return text.length > 140 ? `${text.slice(0, 140).trim()}…` : text;
}

function isUnknown(value: string | undefined | null) {
  if (!value) return true;
  const v = value.trim().toLowerCase();
  return v === "" || v === "unknown" || v === "n/a";
}

export function FacilityCard({ facility, traceId }: Props) {
  const { effectiveLanguage } = useApp();
  const copy = t(effectiveLanguage);
  const shareText = `${facility.name}, ${facility.city}. Phone: ${facility.phone}. Trust Score ${facility.trustScore}/100.`;
  const sourceText = summarizeSources(facility.sources);
  const cityKnown = !isUnknown(facility.city);
  const stateKnown = !isUnknown(facility.state);
  const phoneKnown = !isUnknown(facility.phone);
  const facilityTypeLabel =
    copy.facilityTypes[facility.type] ??
    facility.type.charAt(0).toUpperCase() + facility.type.slice(1);
  const locationLabel =
    cityKnown && stateKnown
      ? `${facility.city}, ${facility.state}`
      : cityKnown
        ? facility.city
        : stateKnown
          ? facility.state
          : copy.unknownLocation;

  return (
    <motion.article
      variants={item}
      className="flex h-full flex-col rounded-2xl border border-cyan-200 bg-cyan-100 p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-bold leading-snug text-foreground sm:text-lg">
            <Building2
              className="mr-1.5 inline h-4 w-4 -translate-y-px text-cyan-400"
              aria-hidden="true"
            />
            {facility.name}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{locationLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{facilityTypeLabel}</span>
          </p>
        </div>
        <TrustBadge score={facility.trustScore} animate />
      </header>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        {phoneKnown && (
          <a
            href={`tel:${facility.phone}`}
            className="inline-flex items-center gap-1 font-medium text-cyan-500 underline-offset-2 hover:underline"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="truncate">{facility.phone}</span>
          </a>
        )}
        {typeof facility.distance === "number" && <DistanceBadge km={facility.distance} />}
        <ContradictionAlert items={facility.contradictions} />
      </div>

      {sourceText && (
        <p className="mt-3 line-clamp-2 text-xs text-muted-foreground" title={sourceText}>
          <span className="font-semibold text-foreground/70">{copy.sourcesLabel}:</span>{" "}
          {sourceText}
        </p>
      )}

      <div className="mt-auto pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-cyan-200/70 pt-3 dark:border-slate-700">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                navigator.share?.({ text: shareText }) ??
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")
              }
              className="inline-flex items-center gap-1 rounded-md border border-cyan-200/80 bg-surface px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-cyan-200/40 dark:border-slate-700 dark:bg-slate-900/40"
              aria-label={copy.shareButton}
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{copy.shareButton}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const key = "sc_reports";
                const current = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
                localStorage.setItem(
                  key,
                  JSON.stringify([...current, { facility: facility.id, at: Date.now() }]),
                );
              }}
              className="inline-flex items-center gap-1 rounded-md border border-cyan-200/80 bg-surface px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-cyan-200/40 dark:border-slate-700 dark:bg-slate-900/40"
              aria-label={copy.reportButton}
            >
              <Flag className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{copy.reportButton}</span>
            </button>
          </div>
          <MLflowModal facility={facility} traceId={traceId} />
        </div>
      </div>
    </motion.article>
  );
}
