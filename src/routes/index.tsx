import { Suspense, lazy, useEffect, useMemo, useState } from "react";
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

const SearchResultsMap = lazy(() =>
  import("@/components/map/SearchResultsMap").then((m) => ({ default: m.SearchResultsMap })),
);

function HomePage() {
  const [query, setQuery] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AskResponse | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [translatedResponse, setTranslatedResponse] = useState("");
  const [inputLanguage, setInputLanguage] = useState("en-IN");
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
      setInputLanguage(sourceLanguage);
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
    const pinQuery = `facility near PIN ${pinCode}`;
    setLoading(true);
    setData(null);
    setSearchError(null);
    ask({
      query: pinQuery,
      language: effectiveLanguage,
    })
      .then((res) => {
        setData(res);
        setSelectedFacilityId(res.facilities[0]?.id ?? null);
        setSearchResults(pinQuery, res.facilities);
        setInputLanguage("en-IN");
        setTranslatedResponse(res.response);
      })
      .catch((error) => {
        setSearchError(error instanceof Error ? error.message : "PIN search failed");
      })
      .finally(() => setLoading(false));
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
    <main className="mx-auto max-w-6xl overflow-x-hidden px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
      <LocationBanner />
      <LocationConsentModal />

      <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
        {copy.appTagline.includes(copy.heroHighlight)
          ? copy.appTagline.split(copy.heroHighlight)[0]
          : copy.appTagline}{" "}
        <span className="text-cyan-400">{copy.heroHighlight}</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground sm:text-lg">{copy.heroSubtitle}</p>

      <div className="mt-10">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
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
        {data && (
          <AgentThinkingCard
            steps={data.thinking ?? []}
            meta={{
              searchTimeMs: data.searchTime,
              traceId: data.traceId,
              model: data.model,
              totalTokens: data.usage?.total_tokens,
            }}
          />
        )}
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
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Suspense
                fallback={<div className="h-72 rounded-2xl border bg-slate-50 md:h-[480px]" />}
              >
                <SearchResultsMap
                  facilities={facilitiesWithDistance}
                  userLat={userLat}
                  userLon={userLon}
                  selectedId={selectedFacilityId}
                  onSelect={setSelectedFacilityId}
                />
              </Suspense>
              <div className="rounded-2xl border border-cyan-200 bg-surface p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                <AgentResponse
                  markdown={
                    showFullResponse ? translatedResponse || data.response : conciseResponse
                  }
                />
                <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                  <ListenButton
                    text={(translatedResponse || data.response).replace(/[#*_>`]/g, "")}
                    lang={inputLanguage}
                  />
                </div>
                {!showFullResponse &&
                  conciseResponse !== (translatedResponse || data.response).trim() && (
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

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {facilitiesWithDistance.map((f) => (
                <FacilityCard key={f.id} facility={f} traceId={data.traceId} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
