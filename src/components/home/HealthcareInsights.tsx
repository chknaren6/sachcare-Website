import { Phone, ShieldCheck, Activity, Hospital, Sparkles, AlertTriangle } from "lucide-react";

const HELPLINES = [
  { label: "National Emergency", number: "112", tone: "destructive" },
  { label: "Ambulance", number: "108", tone: "destructive" },
  { label: "COVID Helpline", number: "1075", tone: "primary" },
  { label: "Mental Health (KIRAN)", number: "1800-599-0019", tone: "primary" },
  { label: "Women Helpline", number: "1091", tone: "primary" },
  { label: "Blood Bank (eRaktKosh)", number: "104", tone: "primary" },
];

const TOP_TRUSTED = [
  { name: "AIIMS New Delhi", city: "Delhi", score: 94 },
  { name: "CMC Vellore", city: "Tamil Nadu", score: 92 },
  { name: "PGIMER Chandigarh", city: "Chandigarh", score: 91 },
  { name: "Tata Memorial", city: "Mumbai", score: 90 },
  { name: "NIMHANS", city: "Bengaluru", score: 89 },
  { name: "AIIMS Patna", city: "Bihar", score: 87 },
];

const TIPS = [
  "Mention your city or PIN code for accurate nearby results.",
  "Ask in your own language — Hindi, Tamil, Telugu, Bengali and 6 more supported.",
  "Tap the speaker on any answer to hear it read aloud.",
  "Trust scores combine NABH accreditation, audits, news & user reports.",
];

export function HealthcareInsights() {
  return (
    <section
      aria-label="Healthcare insights and emergency information"
      className="mt-12 grid gap-5 lg:grid-cols-3"
    >
      {/* Emergency helplines */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50/60 p-5 shadow-sm dark:border-red-900/40 dark:from-red-950/30 dark:to-orange-950/20">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">India Helplines</h2>
            <p className="text-xs text-muted-foreground">Tap to call · 24×7 toll-free</p>
          </div>
        </div>
        <ul className="space-y-2">
          {HELPLINES.map((h) => (
            <li key={h.label}>
              <a
                href={`tel:${h.number.replace(/[^0-9]/g, "")}`}
                className="group flex items-center justify-between rounded-xl border border-red-100 bg-white/80 px-3 py-2 text-sm transition-all hover:border-red-300 hover:bg-white hover:shadow-sm dark:border-red-900/40 dark:bg-slate-900/60 dark:hover:bg-slate-900"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <Phone
                    className={`h-3.5 w-3.5 ${
                      h.tone === "destructive" ? "text-red-500" : "text-primary"
                    }`}
                    aria-hidden="true"
                  />
                  {h.label}
                </span>
                <span
                  className={`font-mono text-sm font-bold ${
                    h.tone === "destructive" ? "text-red-600" : "text-primary"
                  }`}
                >
                  {h.number}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Live trust stats + top hospitals */}
      <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50/60 p-5 shadow-sm dark:border-slate-700 dark:from-slate-900/60 dark:to-slate-900/40">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">Top Verified</h2>
            <p className="text-xs text-muted-foreground">Highest trust scores in India</p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <Stat icon={<Hospital className="h-4 w-4" />} value="12,847" label="Facilities" />
          <Stat icon={<Activity className="h-4 w-4" />} value="98.2%" label="Uptime" />
          <Stat icon={<Sparkles className="h-4 w-4" />} value="9" label="Languages" />
        </div>

        <ul className="space-y-1.5">
          {TOP_TRUSTED.map((h, i) => (
            <li
              key={h.name}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-white/70 dark:hover:bg-slate-800/60"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[11px] font-bold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                  {i + 1}
                </span>
                <span className="truncate text-foreground">{h.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">· {h.city}</span>
              </span>
              <span className="ml-2 shrink-0 rounded-md bg-emerald-100 px-1.5 py-0.5 font-mono text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                {h.score}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* How to use + tips */}
      <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-5 shadow-sm dark:border-slate-700 dark:from-slate-900/60 dark:to-slate-900/40">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-white">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold text-foreground">Get Better Results</h2>
            <p className="text-xs text-muted-foreground">Quick tips before you search</p>
          </div>
        </div>
        <ol className="space-y-3">
          {TIPS.map((tip, i) => (
            <li key={tip} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                {i + 1}
              </span>
              <span className="text-foreground/90">{tip}</span>
            </li>
          ))}
        </ol>

        <div className="mt-4 rounded-xl border border-dashed border-cyan-300 bg-white/70 p-3 text-xs text-muted-foreground dark:border-cyan-900/40 dark:bg-slate-900/50">
          <strong className="text-foreground">Privacy:</strong> location is used only to compute
          distance to nearby hospitals. We never store it.
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl border border-teal-100 bg-white/80 px-2 py-2 dark:border-slate-700 dark:bg-slate-900/60">
      <div className="flex items-center justify-center text-primary">{icon}</div>
      <div className="mt-1 font-heading text-sm font-bold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
