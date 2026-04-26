import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/search/SearchBar";
import { ExampleChips } from "@/components/search/ExampleChips";
import { AgentThinkingCard } from "@/components/common/AgentThinkingCard";
import { LocationBanner } from "@/components/common/LocationBanner";
import { AgentResponse } from "@/components/results/AgentResponse";
import { FacilityCard } from "@/components/results/FacilityCard";
import { ListenButton } from "@/components/results/ListenButton";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ask } from "@/lib/api";
import { useApp } from "@/components/providers/AppContext";
import { haversineKm } from "@/lib/distance";
import type { AskResponse } from "@/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "SachCare — Truth in Healthcare for 1.4 Billion Indians" },
      {
        name: "description",
        content:
          "AI-powered, multilingual healthcare facility trust platform. Find verified hospitals, clinics & pharmacies across India with trust scores and contradiction alerts.",
      },
      { property: "og:title", content: "SachCare — Truth in Healthcare" },
      {
        property: "og:description",
        content: "Verified Indian healthcare facility trust scores in 9 languages.",
      },
    ],
  }),
});

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function HomePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AskResponse | null>(null);
  const { effectiveLanguage, userLat, userLon, setSearchResults } = useApp();

  const handleSearch = async (override?: string) => {
    const q = (override ?? query).trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setData(null);
    try {
      const res = await ask({
        query: q,
        language: effectiveLanguage,
        lat: userLat,
        lon: userLon,
      });
      setData(res);
      setSearchResults(q, res.facilities);
    } finally {
      setLoading(false);
    }
  };

  const facilitiesWithDistance = useMemo(() => {
    if (!data) return [];
    if (userLat === null || userLon === null) return data.facilities;
    return data.facilities.map((f) => ({
      ...f,
      distance: haversineKm(userLat, userLon, f.lat, f.lon),
    }));
  }, [data, userLat, userLon]);

  useEffect(() => {
    // Smooth-scroll to results when they appear
    if (data) {
      const el = document.getElementById("results");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [data]);

  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16"
    >
      <LocationBanner />

      <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
        Truth in healthcare for{" "}
        <span className="text-cyan-400">1.4 Billion Indians</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground sm:text-lg">
        Ask in any Indian language. Get verified facilities, trust scores, and
        contradiction alerts — backed by Databricks, Tavily and government data.
      </p>

      <div className="mt-10">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => handleSearch()}
          loading={loading}
        />
        <ExampleChips onSelect={(q) => handleSearch(q)} />
        <AgentThinkingCard steps={data?.thinking ?? []} />
      </div>

      <section id="results" className="mt-10">
        {loading && <LoadingSkeleton />}

        {data && !loading && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <div className="rounded-2xl border border-cyan-200 bg-surface p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
              <AgentResponse markdown={data.response} />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Generated in {(data.searchTime / 1000).toFixed(2)}s · trace{" "}
                  <code className="rounded bg-cyan-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-800">
                    {data.traceId}
                  </code>
                </span>
                <ListenButton
                  text={data.response.replace(/[#*_>`]/g, "")}
                  lang={effectiveLanguage}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {facilitiesWithDistance.map((f) => (
                <FacilityCard key={f.id} facility={f} traceId={data.traceId} />
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </motion.main>
  );
}
