import { motion } from "framer-motion";
import { Search, Database, Shield, Star, Zap, ChevronDown, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/components/providers/AppContext";
import type { ThinkingStep } from "@/types";
import { t } from "@/i18n";

const ICONS = [Search, Globe, Database, Shield, Star, Zap];

interface Props {
  steps: ThinkingStep[];
}

export function AgentThinkingCard({ steps }: Props) {
  const { showAgentThinking, setShowAgentThinking, effectiveLanguage } = useApp();
  const copy = t(effectiveLanguage);

  return (
    <div className="mt-4">
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground">
        <Switch
          checked={showAgentThinking}
          onCheckedChange={setShowAgentThinking}
          aria-label="Show agent thinking"
        />
        <span>{copy.thinkingToggle}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
            showAgentThinking ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </label>

      {showAgentThinking && steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25 }}
          className="mt-3 overflow-hidden rounded-2xl border border-cyan-200 bg-cyan-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50"
        >
          <ol className="space-y-3">
            {steps.map((s, idx) => {
              const Icon = ICONS[idx % ICONS.length];
              return (
                <motion.li
                  key={s.step}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.4, duration: 0.3 }}
                  className="flex gap-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-white shadow-sm">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        Step {s.step}: {s.title}
                      </p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {s.duration}ms
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </motion.div>
      )}
      {showAgentThinking && steps.length === 0 && (
        <div className="mt-3 rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
          Thinking trace coming soon.
        </div>
      )}
    </div>
  );
}
