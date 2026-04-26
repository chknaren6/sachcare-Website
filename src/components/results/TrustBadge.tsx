import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function CountUp({ value, duration = 800 }: { value: number; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{n.toLocaleString("en-IN")}</>;
}

interface Props {
  score: number;
  size?: "sm" | "md";
  animate?: boolean;
}

export function TrustBadge({ score, size = "md", animate = false }: Props) {
  const tier =
    score >= 70 ? "high" : score >= 40 ? "med" : "low";
  const styles =
    tier === "high"
      ? "bg-success/15 text-success border-success/40"
      : tier === "med"
        ? "bg-warning/15 text-warning border-warning/40"
        : "bg-danger/15 text-danger border-danger/40";
  const icon = tier === "high" ? "✓" : tier === "med" ? "!" : "⚠";
  const sizing =
    size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";

  return (
    <motion.span
      initial={animate ? { scale: 0.6, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: "spring", stiffness: 280, damping: 16 }}
      className={`inline-flex items-center gap-1 rounded-full border font-bold ${styles} ${sizing}`}
      aria-label={`Trust score: ${score} out of 100`}
    >
      <span aria-hidden="true">{icon}</span>
      {animate ? <CountUp value={score} /> : score}
      <span className="text-[10px] font-medium opacity-70">/100</span>
    </motion.span>
  );
}
