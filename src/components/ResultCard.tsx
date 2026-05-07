import { AnalyzeResult } from "@/lib/analyze";
import { CheckCircle2, ShieldAlert, Lightbulb, Info, Copy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ConfidenceRing } from "./ConfidenceRing";

const formatResult = (r: AnalyzeResult) =>
  `Ageix verdict: ${r.status} (${r.confidence}% confidence)\n\nWhy:\n- ${r.reason.join(
    "\n- "
  )}\n\nWhat to do:\n- ${r.suggestion.join("\n- ")}`;

export const ResultCard = ({ result, onReset }: { result: AnalyzeResult; onReset: () => void }) => {
  const isFake = result.status === "Fake";

  const copy = async () => {
    await navigator.clipboard.writeText(formatResult(result));
    toast.success("Result copied to clipboard");
  };

  const share = async () => {
    const text = formatResult(result);
    if (navigator.share) {
      try {
        await navigator.share({ title: "Ageix verdict", text });
      } catch {/* user cancelled */}
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Result copied — share it anywhere");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "glass-card p-6 sm:p-8 relative overflow-hidden",
        isFake ? "ring-1 ring-destructive/40" : "ring-1 ring-success/40"
      )}
      style={{
        boxShadow: isFake
          ? "0 0 60px hsl(var(--destructive) / 0.28)"
          : "0 0 60px hsl(var(--success) / 0.28)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: isFake
            ? "radial-gradient(circle at top right, hsl(var(--destructive)/0.25), transparent 60%)"
            : "radial-gradient(circle at top right, hsl(var(--success)/0.25), transparent 60%)",
        }}
      />
      <div className="relative flex items-center gap-5 mb-6">
        <div
          className={cn(
            "size-14 rounded-2xl flex items-center justify-center",
            isFake ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
          )}
        >
          {isFake ? <ShieldAlert className="size-7" /> : <CheckCircle2 className="size-7" />}
        </div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Verdict</div>
          <div className={cn("text-3xl font-bold", isFake ? "text-destructive" : "text-success")}>
            {result.status}
          </div>
        </div>
        <ConfidenceRing value={result.confidence} tone={isFake ? "danger" : "success"} />
      </div>

      <Section icon={<Info className="size-4" />} title="AI reasoning">
        <ul className="space-y-2">
          {result.reason.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/90">
              <span className="text-neon-cyan mt-1">›</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={<Lightbulb className="size-4" />} title="Suggested actions">
        <ul className="space-y-2">
          {result.suggestion.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/90">
              <span className="text-neon-purple mt-1">✓</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </Section>

      <div className="relative mt-6 flex flex-wrap items-center gap-2">
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-border hover:border-neon-cyan/60 transition-colors"
        >
          <Copy className="size-3.5" /> Copy
        </button>
        <button
          onClick={share}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-border hover:border-neon-purple/60 transition-colors"
        >
          <Share2 className="size-3.5" /> Share
        </button>
        <button
          onClick={onReset}
          className="ml-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Check something else
        </button>
      </div>
    </motion.div>
  );
};

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="relative mt-5">
    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
      {icon}
      {title}
    </div>
    {children}
  </div>
);
