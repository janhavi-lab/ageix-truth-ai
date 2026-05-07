import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar, Brain, ShieldCheck, Sparkles } from "lucide-react";

const STAGES = [
  { icon: Radar, label: "Scanning input" },
  { icon: Brain, label: "Analyzing patterns" },
  { icon: ShieldCheck, label: "Verifying signals" },
  { icon: Sparkles, label: "Finalizing verdict" },
];

export const ScanLoader = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STAGES.length), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-card p-8 text-center" role="status" aria-live="polite">
      <div className="relative mx-auto size-24">
        <motion.div
          className="absolute inset-0 rounded-full border border-[hsl(var(--neon-cyan)/0.4)]"
          animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border border-[hsl(var(--neon-purple)/0.4)]"
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
        />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] flex items-center justify-center">
          <Radar className="size-7 text-white animate-spin" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const active = i <= step;
          return (
            <div
              key={s.label}
              className={`rounded-xl border px-3 py-2.5 text-xs flex flex-col items-center gap-1.5 transition-all ${
                active
                  ? "border-[hsl(var(--neon-cyan)/0.5)] bg-[hsl(var(--neon-cyan)/0.08)] text-foreground"
                  : "border-border/60 text-muted-foreground"
              }`}
            >
              <Icon className={`size-4 ${i === step ? "animate-pulse" : ""}`} />
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
