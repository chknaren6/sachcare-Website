import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/search/SearchBar";
import { ExampleChips } from "@/components/search/ExampleChips";
import { AgentThinkingCard } from "@/components/common/AgentThinkingCard";
import { LocationBanner } from "@/components/common/LocationBanner";
import { LocationConsentModal } from "@/components/common/LocationConsentModal";
import { AgentResponse } from "@/components/results/AgentResponse";
import { FacilityCard } from "@/components/results/FacilityCard";
import { ListenButton } from "@/components/results/ListenButton";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ask } from "@/lib/api";
import { useApp } from "@/components/providers/AppContext";
import { haversineKm } from "@/lib/distance";
import type { AskResponse } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { detectLanguage } from "@/lib/languageMap";
import { t } from "@/i18n";
import { detectLanguageByGoogle, translateFromEnglish, translateToEnglish } from "@/lib/translate";

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
const SearchResultsMap = lazy(() => import("@/components/map/SearchResultsMap").then((m) => ({ default: m.SearchResultsMap })));

function HomePage() {
  const [query, setQuery] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AskResponse | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [translatedResponse, setTranslatedResponse] = useState("");
  const [showFullResponse, setShowFullResponse] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { effectiveLanguage, userLat, userLon, setSearchResults } = useApp();
  const copy = t(effectiveLanguage);

  const pipeline = [
    "Detecting language...",
    "Translating...",
    "Searching 10,000+ facilities...",
    "Scoring trust...",
    "Verifying externally...",
    "Preparing response...",
  ];

  const runPipeline = () => {
    setPipelineStep(0);
    pipeline.forEach((_, idx) => {
      setTimeout(() => setPipelineStep(idx), idx * 450);
    });
  };

  const pinCenters: Record<string, { lat: number; lon: number }> = {
    "800001": { lat: 25.5941, lon: 85.1376 },
    "110001": { lat: 28.6139, lon: 77.209 },
    "560001": { lat: 12.9716, lon: 77.5946 },
    "400001": { lat: 18.9388, lon: 72.8354 },
  };

  const handleSearch = async (override?: string) => {
    const q = (override ?? query).trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setData(null);
    setShowFullResponse(false);
    setSearchError(null);
    runPipeline();
    try {
      const googleDetected = await detectLanguageByGoogle(q);
      const sourceLanguage = googleDetected ? `${googleDetected}-IN` : detectLanguage(q);
      const queryInEnglish = await translateToEnglish(q, sourceLanguage);
      const res = await ask({
        query: queryInEnglish,
        language: effectiveLanguage,
        lat: userLat,
        lon: userLon,
      });
      setData(res);
      setSelectedFacilityId(res.facilities[0]?.id ?? null);
      setSearchResults(q, res.facilities);
      const translated = await translateFromEnglish(res.response, sourceLanguage);
      setTranslatedResponse(translated);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Search failed");
    } finally {
      setPipelineStep(-1);
      setLoading(false);
    }
  };

  const handleEmergency = () => {
    handleSearch("emergency ICU trauma near me");
  };

  const handlePinSearch = () => {
    if (pinCode.length !== 6) return;
    const center = pinCenters[pinCode];
    if (center) {
      ask({
        query: `facility near PIN ${pinCode}`,
        language: effectiveLanguage,
        lat: center.lat,
        lon: center.lon,
      }).then((res) => {
        setData(res);
        setSelectedFacilityId(res.facilities[0]?.id ?? null);
      });
      return;
    }
    handleSearch(`facility near PIN ${pinCode}`);
  };

  const facilitiesWithDistance = useMemo(() => {
    if (!data) return [];
    if (userLat === null || userLon === null) return data.facilities;
    return data.facilities.map((f) => ({
      ...f,
      distance: haversineKm(userLat, userLon, f.lat, f.lon),
    }));
  }, [data, userLat, userLon]);

  const conciseResponse = useMemo(() => {
    const full = (translatedResponse || data?.response || "").trim();
    if (!full) return "";
    const clean = full.replace(/\n{3,}/g, "\n\n");
    const parts = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (parts.length <= 5) return clean;
    return `${parts.slice(0, 5).join(" ")}\n\n...`;
  }, [translatedResponse, data]);

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
      className="mx-auto max-w-6xl overflow-x-hidden px-4 pb-16 pt-10 sm:px-6 sm:pt-16"
    >
      <LocationBanner />
      <LocationConsentModal />

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
          onEmergency={handleEmergency}
          pinCode={pinCode}
          onPinChange={setPinCode}
          onPinSubmit={handlePinSearch}
          placeholder={copy.searchPlaceholder}
          sosLabel={copy.sosButton}
          pinPlaceholder={copy.pinPlaceholder}
          loading={loading}
        />
        <ExampleChips onSelect={(q) => handleSearch(q)} />
        {data && <AgentThinkingCard steps={data.thinking ?? []} />}
      </div>

      <section id="results" className="mt-10">
        {loading && <LoadingSkeleton />}
        {pipelineStep >= 0 && (
          <div className="mb-5 rounded-xl border bg-surface p-4">
            <ol className="space-y-2 text-sm">
              {pipeline.slice(0, pipelineStep + 1).map((step) => (
                <li key={step} className="text-muted-foreground">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
        {searchError && (
          <div className="mb-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
            {searchError}
          </div>
        )}

        {data && !loading && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Suspense fallback={<div className="h-72 rounded-2xl border bg-slate-50 md:h-[480px]" />}>
                <SearchResultsMap
                  facilities={facilitiesWithDistance}
                  userLat={userLat}
                  userLon={userLon}
                  selectedId={selectedFacilityId}
                  onSelect={setSelectedFacilityId}
                />
              </Suspense>
              <div className="rounded-2xl border border-cyan-200 bg-surface p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                <AgentResponse markdown={showFullResponse ? translatedResponse || data.response : conciseResponse} />
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Generated in {(data.searchTime / 1000).toFixed(2)}s · trace{" "}
                    <code className="rounded bg-cyan-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-800">
                      {data.traceId}
                    </code>
                    {data.model ? ` · ${data.model}` : ""}
                    {data.usage?.total_tokens ? ` · ${data.usage.total_tokens} tokens` : ""}
                  </span>
                  <ListenButton
                    text={(translatedResponse || data.response).replace(/[#*_>`]/g, "")}
                    lang={effectiveLanguage}
                  />
                </div>
                {!showFullResponse && conciseResponse !== (translatedResponse || data.response).trim() && (
                  <button
                    type="button"
                    onClick={() => setShowFullResponse(true)}
                    className="mt-3 text-sm font-medium text-cyan-500 underline"
                  >
                    Show full response
                  </button>
                )}
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
