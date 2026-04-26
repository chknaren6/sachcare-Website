import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Facility } from "@/types";

interface AppState {
  detectedLanguage: string;
  userLanguageOverride: string | null;
  effectiveLanguage: string;
  setDetectedLanguage: (lang: string) => void;
  setLanguageOverride: (lang: string | null) => void;

  userLat: number | null;
  userLon: number | null;
  locationGranted: boolean;
  setUserLocation: (lat: number, lon: number) => void;

  lastQuery: string;
  lastResults: Facility[];
  setSearchResults: (query: string, results: Facility[]) => void;

  showAgentThinking: boolean;
  setShowAgentThinking: (v: boolean) => void;

  bannerDismissed: boolean;
  dismissBanner: () => void;

  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [detectedLanguage, setDetectedLanguage] = useState("en-IN");
  const [userLanguageOverride, setLanguageOverride] = useState<string | null>(null);
  const [userLat, setLat] = useState<number | null>(null);
  const [userLon, setLon] = useState<number | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [lastResults, setLastResults] = useState<Facility[]>([]);
  const [showAgentThinking, setShowAgentThinking] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Hydrate persisted bits from sessionStorage / localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const loc = sessionStorage.getItem("sc_loc");
      if (loc) {
        const { lat, lon } = JSON.parse(loc);
        if (typeof lat === "number" && typeof lon === "number") {
          setLat(lat);
          setLon(lon);
        }
      }
      if (sessionStorage.getItem("sc_banner_dismissed") === "1") setBannerDismissed(true);
      const t = (localStorage.getItem("sc_theme") as "light" | "dark" | null) ?? "light";
      setTheme(t);
      document.documentElement.classList.toggle("dark", t === "dark");
    } catch {
      /* noop */
    }
  }, []);

  const setUserLocation = useCallback((lat: number, lon: number) => {
    setLat(lat);
    setLon(lon);
    try {
      sessionStorage.setItem("sc_loc", JSON.stringify({ lat, lon }));
    } catch {
      /* noop */
    }
  }, []);

  const setSearchResults = useCallback((query: string, results: Facility[]) => {
    setLastQuery(query);
    setLastResults(results);
  }, []);

  const dismissBanner = useCallback(() => {
    setBannerDismissed(true);
    try {
      sessionStorage.setItem("sc_banner_dismissed", "1");
    } catch {
      /* noop */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("sc_theme", next);
      } catch {
        /* noop */
      }
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  const value = useMemo<AppState>(
    () => ({
      detectedLanguage,
      userLanguageOverride,
      effectiveLanguage: userLanguageOverride ?? detectedLanguage ?? "en-IN",
      setDetectedLanguage,
      setLanguageOverride,
      userLat,
      userLon,
      locationGranted: userLat !== null && userLon !== null,
      setUserLocation,
      lastQuery,
      lastResults,
      setSearchResults,
      showAgentThinking,
      setShowAgentThinking,
      bannerDismissed,
      dismissBanner,
      theme,
      toggleTheme,
    }),
    [
      detectedLanguage,
      userLanguageOverride,
      userLat,
      userLon,
      lastQuery,
      lastResults,
      showAgentThinking,
      bannerDismissed,
      theme,
      setUserLocation,
      setSearchResults,
      dismissBanner,
      toggleTheme,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppProvider>");
  return v;
}
