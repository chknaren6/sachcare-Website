import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mic, Globe, Search, Shield, ExternalLink, Zap } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  component: HowPage,
  head: () => ({
    meta: [
      { title: "How It Works — SachCare" },
      {
        name: "description",
        content:
          "From multilingual voice input to LLM-synthesized trust scores: the SachCare pipeline explained.",
      },
    ],
  }),
});

const STEPS = [
  {
    icon: Mic,
    title: "Voice / Text Input",
    text: "Speak or type in any of 9 Indian languages. SachCare understands Devanagari, Bengali, Tamil, Telugu, and more.",
  },
  {
    icon: Globe,
    title: "Language Detection",
    text: "Automatic script-based detection identifies your language in real time. No manual selection needed.",
  },
  {
    icon: Search,
    title: "Hybrid Search",
    text: "Combines semantic vector search with keyword BM25 matching across our database of 12,000+ Indian healthcare facilities.",
  },
  {
    icon: Shield,
    title: "Trust Scoring",
    text: "Each facility receives a trust score (0–100) computed from NABH accreditation, user reports, government data, and media mentions.",
  },
  {
    icon: ExternalLink,
    title: "External Verification (Tavily)",
    text: "Live web search via Tavily API cross-references facility claims against recent news, official government portals, and medical directories.",
  },
  {
    icon: Zap,
    title: "Response Generation",
    text: "Databricks-hosted LLM synthesizes all signals into a clear, cited, Markdown-formatted response — readable or listenable.",
  },
];

const SPONSORS = ["Databricks", "Tavily", "Vercel", "Next.js", "Leaflet", "shadcn/ui"];

function StepCard({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const left = index % 2 === 0;
  const Icon = step.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: left ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative flex flex-col gap-4 md:flex-row md:items-center ${
        left ? "" : "md:flex-row-reverse"
      }`}
    >
      <div className="flex-1">
        <div
          className={`rounded-2xl border border-cyan-200 bg-surface p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 ${
            left ? "md:text-right" : ""
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Step {index + 1}
          </p>
          <h3 className="mt-1 font-heading text-xl font-bold">{step.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
        </div>
      </div>
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-white shadow-lg md:h-16 md:w-16">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="hidden flex-1 md:block" aria-hidden="true" />
    </motion.div>
  );
}

function HowPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6"
    >
      <header className="text-center">
        <h1 className="font-heading text-3xl font-bold sm:text-5xl">
          How <span className="text-cyan-400">SachCare</span> Works
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Six steps from your voice to a verified, trustable healthcare answer.
        </p>
      </header>

      <div className="relative mt-14">
        <div
          className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-300 via-cyan-400 to-cyan-300 md:block"
          aria-hidden="true"
        />
        <div className="space-y-10">
          {STEPS.map((s, i) => (
            <StepCard key={s.title} step={s} index={i} />
          ))}
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Built With
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {SPONSORS.map((s) => (
            <span
              key={s}
              className="rounded-full border border-cyan-200 bg-surface px-6 py-3 font-heading text-sm font-semibold text-foreground transition-all hover:border-cyan-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60"
            >
              {s}
            </span>
          ))}
        </div>
      </section>
    </motion.main>
  );
}
