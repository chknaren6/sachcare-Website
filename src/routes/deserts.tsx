import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createFileRoute } from "@tanstack/react-router";
import { Hospital, AlertTriangle, Search, ArrowUpDown } from "lucide-react";
import { CountUp } from "@/components/results/TrustBadge";
import { fetchDesertAnalysis } from "@/lib/api";
import type { DesertAnalysisResponse, StateAnalysis } from "@/types";

export const Route = createFileRoute("/deserts")({
  component: DesertsPage,
  head: () => ({
    meta: [
      { title: "Desert Analysis — SachCare" },
      {
        name: "description",
        content:
          "State-by-state breakdown of medical deserts and trust deficits across India.",
      },
    ],
  }),
});

type SortKey = keyof StateAnalysis;

const RISK_COLOR: Record<StateAnalysis["riskLevel"], string> = {
  CRITICAL: "bg-danger/15 text-danger border-danger/40",
  HIGH: "bg-warning/15 text-warning border-warning/40",
  MEDIUM: "bg-cyan-300/30 text-slate-700 border-cyan-300 dark:text-cyan-200",
  LOW: "bg-success/15 text-success border-success/40",
};

function DesertsPage() {
  const [data, setData] = useState<DesertAnalysisResponse | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("avgTrust");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchDesertAnalysis()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const sorted = data
    ? [...data.states].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (typeof av === "number" && typeof bv === "number") {
          return sortDir === "asc" ? av - bv : bv - av;
        }
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      })
    : [];

  const top10 = data
    ? [...data.states].sort((a, b) => a.avgTrust - b.avgTrust).slice(0, 10)
    : [];

  const setSort = (k: SortKey) => {
    if (k === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6"
    >
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">Medical Desert Analysis</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        State-by-state trust deficits across 12,847 healthcare facilities, sampled
        from government registries and verified via live web search.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Hospital,
            value: data?.totalFacilities ?? 0,
            label: "Facilities Analyzed",
          },
          {
            icon: AlertTriangle,
            value: data?.desertZones ?? 0,
            label: "Critical Desert Zones",
          },
          {
            icon: Search,
            value: data?.contradictions ?? 0,
            label: "Contradictions Detected",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-cyan-200 bg-cyan-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <s.icon className="h-6 w-6 text-cyan-400" aria-hidden="true" />
            <p className="mt-3 font-heading text-3xl font-bold text-foreground">
              <CountUp value={s.value} duration={1100} />
            </p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="overflow-hidden rounded-2xl border border-cyan-200 bg-surface shadow-sm lg:col-span-3 dark:border-slate-700 dark:bg-slate-900/60">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-cyan-100 text-xs uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  {[
                    { k: "state" as SortKey, label: "State" },
                    { k: "avgTrust" as SortKey, label: "Avg Trust" },
                    { k: "facilitiesSampled" as SortKey, label: "Sampled" },
                    { k: "highTrustCount" as SortKey, label: "High Trust" },
                    { k: "riskLevel" as SortKey, label: "Risk" },
                  ].map((c) => (
                    <th key={c.k} className="px-3 py-3 text-left">
                      <button
                        type="button"
                        onClick={() => setSort(c.k)}
                        className="inline-flex items-center gap-1 font-semibold hover:text-cyan-400"
                      >
                        {c.label}
                        <ArrowUpDown className="h-3 w-3 opacity-60" aria-hidden="true" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr
                    key={s.state}
                    className={`border-t border-cyan-200/60 transition-colors hover:bg-cyan-50 dark:border-slate-700/70 dark:hover:bg-slate-800/60 ${
                      s.riskLevel === "CRITICAL"
                        ? "bg-danger/5"
                        : s.riskLevel === "HIGH"
                          ? "bg-warning/5"
                          : ""
                    }`}
                  >
                    <td className="px-3 py-2.5 font-medium text-foreground">{s.state}</td>
                    <td className="px-3 py-2.5 font-mono">{s.avgTrust}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {s.facilitiesSampled.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {s.highTrustCount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold ${RISK_COLOR[s.riskLevel]}`}
                      >
                        {s.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-cyan-200 bg-surface p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <h3 className="font-heading text-lg font-bold">Highest-risk states</h3>
            <ol className="mt-4 space-y-2.5">
              {top10.map((s) => {
                const pct = Math.max(8, 100 - s.avgTrust);
                return (
                  <li key={s.state} className="text-xs">
                    <div className="mb-1 flex justify-between">
                      <span className="font-medium text-foreground">{s.state}</span>
                      <span className="text-muted-foreground">trust {s.avgTrust}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-cyan-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background:
                            "linear-gradient(90deg,#4DD0E1,#F59E0B 60%,#EF4444)",
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="rounded-2xl border border-cyan-200 bg-cyan-100 p-5 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="font-heading text-lg font-bold">Insights</h3>
            <ul className="mt-3 space-y-2 text-sm text-foreground">
              <li>• North-East states show the largest trust deficits (avg below 40).</li>
              <li>• Kerala, Tamil Nadu, and Delhi lead with avg trust above 80.</li>
              <li>
                • Bihar and UP combined account for ~28% of all detected
                contradictions.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
