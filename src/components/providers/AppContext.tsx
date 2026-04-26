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
import type { UiLanguage } from "@/i18n";

interface AppState {
  detectedLanguage: string;
  uiLanguage: UiLanguage;
  effectiveLanguage: UiLanguage;
  setDetectedLanguage: (lang: string) => void;
  setUiLanguage: (lang: UiLanguage) => void;

  userLat: number | null;
  userLon: number | null;
  locationConsentGiven: boolean;
  locationGranted: boolean;
  setUserLocation: (lat: number, lon: number) => void;
  setLocationConsentGiven: (v: boolean) => void;

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
  const [uiLanguage, setUiLanguageState] = useState<UiLanguage>("en-IN");
  const [userLat, setLat] = useState<number | null>(null);
  const [userLon, setLon] = useState<number | null>(null);
  const [locationConsentGiven, setLocationConsentGiven] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [lastResults, setLastResults] = useState<Facility[]>([]);
  const [showAgentThinking, setShowAgentThinking] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Hydrate persisted bits from cookie / localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const loc = localStorage.getItem("sc_loc");
      if (loc) {
        const { lat, lon } = JSON.parse(loc);
        if (typeof lat === "number" && typeof lon === "number") {
          setLat(lat);
          setLon(lon);
        }
      }
      const consent = document.cookie.includes("sachcare_location_consent=1");
      setLocationConsentGiven(consent);
      if (sessionStorage.getItem("sc_banner_dismissed") === "1") setBannerDismissed(true);
      const savedUiLanguage = localStorage.getItem("sc_ui_lang") as UiLanguage | null;
      if (savedUiLanguage) setUiLanguageState(savedUiLanguage);
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
      localStorage.setItem("sc_loc", JSON.stringify({ lat, lon }));
    } catch {
      /* noop */
    }
  }, []);

  const setLocationConsent = useCallback((v: boolean) => {
    setLocationConsentGiven(v);
    try {
      document.cookie = `sachcare_location_consent=${v ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* noop */
    }
  }, []);

  const setUiLanguage = useCallback((lang: UiLanguage) => {
    setUiLanguageState(lang);
    try {
      localStorage.setItem("sc_ui_lang", lang);
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
      uiLanguage,
      effectiveLanguage: uiLanguage,
      setDetectedLanguage,
      setUiLanguage,
      userLat,
      userLon,
      locationConsentGiven,
      locationGranted: userLat !== null && userLon !== null,
      setUserLocation,
      setLocationConsentGiven: setLocationConsent,
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
      uiLanguage,
      userLat,
      userLon,
      locationConsentGiven,
      lastQuery,
      lastResults,
      showAgentThinking,
      bannerDismissed,
      theme,
      setUserLocation,
      setLocationConsent,
      setUiLanguage,
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
