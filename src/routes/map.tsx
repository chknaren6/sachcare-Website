import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchMapData } from "@/lib/api";
import type { MapFacility } from "@/types";

export const Route = createFileRoute("/map")({
  component: MapPage,
  head: () => ({
    meta: [
      { title: "Trust Map — SachCare" },
      {
        name: "description",
        content:
          "Interactive map of Indian healthcare facilities with trust scores and medical desert overlays.",
      },
    ],
  }),
});

const TrustMap = lazy(() => import("@/components/map/TrustMap"));

function MapPage() {
  const [data, setData] = useState<MapFacility[]>([]);
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [minTrust, setMinTrust] = useState(0);
  const [showDeserts, setShowDeserts] = useState(false);

  useEffect(() => {
    fetchMapData()
      .then(setData)
      .catch(() => setData([]));
  }, []);

  const states = useMemo(
    () => Array.from(new Set(data.map((d) => d.state))).sort(),
    [data],
  );
  const filtered = useMemo(
    () =>
      data.filter(
        (f) =>
          f.trustScore >= minTrust &&
          (stateFilter === "all" || f.state === stateFilter),
      ),
    [data, minTrust, stateFilter],
  );

  const desertCount = useMemo(() => {
    const byState: Record<string, number[]> = {};
    filtered.forEach((f) => {
      (byState[f.state] ??= []).push(f.trustScore);
    });
    return Object.values(byState).filter(
      (arr) => arr.reduce((a, b) => a + b, 0) / arr.length < 40,
    ).length;
  }, [filtered]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-[calc(100vh-4rem)] flex-col md:flex-row"
    >
      <aside className="w-full shrink-0 border-b border-cyan-200 bg-surface/90 p-5 backdrop-blur-md md:w-72 md:border-b-0 md:border-r dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="font-heading text-xl font-bold text-foreground">Trust Map</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Filter facilities across India.
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-foreground">
              State
            </label>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="bg-cyan-50 dark:bg-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                {states.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Min Trust
              </label>
              <span className="text-xs font-bold text-cyan-400">{minTrust}</span>
            </div>
            <Slider
              value={[minTrust]}
              onValueChange={(v) => setMinTrust(v[0])}
              min={0}
              max={100}
              step={5}
              className="mt-3"
            />
          </div>

          <label className="flex items-center justify-between rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800">
            <span className="text-sm font-medium text-foreground">
              Show Medical Deserts
            </span>
            <Switch checked={showDeserts} onCheckedChange={setShowDeserts} />
          </label>

          <div className="space-y-2 rounded-xl bg-cyan-100 p-3 text-xs dark:bg-slate-800">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Facilities shown</span>
              <strong className="text-foreground">{filtered.length}</strong>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Deserts detected</span>
              <strong className="text-danger">{desertCount}</strong>
            </p>
          </div>
        </div>
      </aside>

      <div className="relative flex-1">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center bg-cyan-50 dark:bg-slate-900">
              <div className="text-sm text-muted-foreground">Loading map…</div>
            </div>
          }
        >
          <TrustMap facilities={filtered} showDeserts={showDeserts} />
        </Suspense>
      </div>
    </motion.div>
  );
}
