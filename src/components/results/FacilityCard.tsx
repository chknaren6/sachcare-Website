import { motion } from "framer-motion";
import { Phone, MapPin, Building2 } from "lucide-react";
import { TrustBadge } from "./TrustBadge";
import { ContradictionAlert } from "./ContradictionAlert";
import { MLflowModal } from "./MLflowModal";
import { DistanceBadge } from "@/components/common/DistanceBadge";
import type { Facility } from "@/types";

interface Props {
  facility: Facility;
  traceId: string;
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export function FacilityCard({ facility, traceId }: Props) {
  return (
    <motion.article
      variants={item}
      className="rounded-2xl border border-cyan-200 bg-cyan-100 p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-lg font-bold text-foreground">
            <Building2 className="mr-1.5 inline h-4 w-4 text-cyan-400" aria-hidden="true" />
            {facility.name}
          </h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {facility.city}, {facility.state}
            <span aria-hidden="true">·</span>
            <span className="capitalize">{facility.type}</span>
          </p>
        </div>
        <TrustBadge score={facility.trustScore} animate />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <a
          href={`tel:${facility.phone}`}
          className="inline-flex items-center gap-1 font-medium text-cyan-400 underline-offset-2 hover:underline"
        >
          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
          {facility.phone}
        </a>
        {typeof facility.distance === "number" && <DistanceBadge km={facility.distance} />}
        <ContradictionAlert items={facility.contradictions} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-cyan-200/70 pt-3 text-xs dark:border-slate-700">
        <span className="text-muted-foreground">
          Sources: {facility.sources.slice(0, 2).join(", ")}
          {facility.sources.length > 2 ? "…" : ""}
        </span>
        <MLflowModal facility={facility} traceId={traceId} />
      </div>
    </motion.article>
  );
}
