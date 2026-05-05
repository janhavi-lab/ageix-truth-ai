import { AnalyzeResult } from "@/lib/analyze";
import { CheckCircle2, ShieldAlert, Lightbulb, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const ResultCard = ({ result, onReset }: { result: AnalyzeResult; onReset: () => void }) => {
  const isFake = result.status === "Fake";
  return (
    <div
      className={cn(
        "glass-card p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500",
        isFake ? "ring-1 ring-destructive/40 glow-purple" : "ring-1 ring-success/40"
      )}
      style={{
        boxShadow: isFake
          ? "0 0 50px hsl(var(--destructive) / 0.25)"
          : "0 0 50px hsl(var(--success) / 0.25)",
      }}
    >
      <div className="flex items-center gap-4 mb-6">
        <div
          className={cn(
            "size-14 rounded-2xl flex items-center justify-center",
            isFake ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
          )}
        >
          {isFake ? <ShieldAlert className="size-7" /> : <CheckCircle2 className="size-7" />}
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Verdict</div>
          <div
            className={cn(
              "text-3xl font-bold",
              isFake ? "text-destructive" : "text-success"
            )}
          >
            {result.status}
          </div>
        </div>
      </div>

      <Section icon={<Info className="size-4" />} title="Why we think so">
        <ul className="space-y-2">
          {result.reason.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/90">
              <span className="text-neon-cyan mt-1">›</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={<Lightbulb className="size-4" />} title="What you should do">
        <ul className="space-y-2">
          {result.suggestion.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/90">
              <span className="text-neon-purple mt-1">✓</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </Section>

      <button
        onClick={onReset}
        className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
      >
        ← Check something else
      </button>
    </div>
  );
};

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="mt-5">
    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
      {icon}
      {title}
    </div>
    {children}
  </div>
);
