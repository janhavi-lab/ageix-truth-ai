import { motion } from "framer-motion";

export const ConfidenceRing = ({
  value,
  tone,
}: {
  value: number;
  tone: "danger" | "success";
}) => {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = tone === "danger" ? "hsl(var(--destructive))" : "hsl(var(--success))";
  return (
    <div className="relative size-20 shrink-0">
      <svg viewBox="0 0 80 80" className="size-full -rotate-90">
        <circle cx="40" cy="40" r={r} stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg font-bold">{value}%</div>
        <div className="text-[9px] uppercase tracking-widest text-muted-foreground">conf.</div>
      </div>
    </div>
  );
};
