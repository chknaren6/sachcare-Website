// Infinite horizontally-sliding strip of supported Indian languages,
// each shown in its own native script.

const LANGS = [
  { name: "English", native: "English" },
  { name: "Hindi", native: "हिन्दी" },
  { name: "Bengali", native: "বাংলা" },
  { name: "Telugu", native: "తెలుగు" },
  { name: "Tamil", native: "தமிழ்" },
  { name: "Marathi", native: "मराठी" },
  { name: "Gujarati", native: "ગુજરાતી" },
  { name: "Kannada", native: "ಕನ್ನಡ" },
  { name: "Malayalam", native: "മലയാളം" },
  { name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { name: "Odia", native: "ଓଡ଼ିଆ" },
  { name: "Urdu", native: "اُردُو" },
];

export function LanguageMarquee() {
  // Duplicate the list so the keyframe can translate -50% seamlessly
  const items = [...LANGS, ...LANGS];

  return (
    <div
      className="relative mb-3 overflow-hidden rounded-full border border-teal-200/60 bg-white/60 py-2 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/40"
      aria-label="Supported languages"
    >
      {/* edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />

      <div className="marquee-track gap-8 px-4 will-change-transform">
        {items.map((l, i) => (
          <span
            key={`${l.name}-${i}`}
            className="flex shrink-0 items-center gap-2 text-sm"
          >
            <span className="font-medium text-foreground">{l.native}</span>
            <span className="text-xs text-muted-foreground">· {l.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
