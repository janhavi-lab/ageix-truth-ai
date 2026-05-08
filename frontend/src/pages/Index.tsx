import { useCallback, useState, lazy, Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Upload, Sparkles, X, PlayCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { analyzeInput, AnalyzeResult } from "@/lib/analyze";
import { ResultCard } from "@/components/ResultCard";
import { ScanLoader } from "@/components/ScanLoader";
import { cn } from "@/lib/utils";

const LandingSections = lazy(() =>
  import("@/components/LandingSections").then((m) => ({ default: m.LandingSections }))
);

const MAX_TEXT = 5000;
const MAX_AUDIO = 10 * 1024 * 1024;
const ACCEPTED_AUDIO = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav"];

const Index = () => {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const mutation = useMutation<AnalyzeResult, Error, void>({
    mutationFn: async () =>
      audio ? analyzeInput({ kind: "audio", file: audio }) : analyzeInput({ kind: "text", value: text }),
    onError: (e) => toast.error(e.message || "Something went wrong. Try again."),
  });

  const acceptAudio = useCallback((file: File | null) => {
    if (!file) return setAudio(null);
    if (!ACCEPTED_AUDIO.includes(file.type) && !/\.(mp3|wav)$/i.test(file.name)) {
      toast.error("Only .mp3 or .wav files are supported");
      return;
    }
    if (file.size > MAX_AUDIO) {
      toast.error("Audio must be under 10MB");
      return;
    }
    setAudio(file);
    setText("");
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    acceptAudio(e.dataTransfer.files?.[0] ?? null);
  };

  const handleSubmit = () => {
    if (audio) return mutation.mutate();
    const t = text.trim();
    if (!t) return toast.error("Paste something to check");
    if (t.length > MAX_TEXT) return toast.error("Input is too long (max 5000 characters)");
    mutation.mutate();
  };

  const reset = () => {
    setText("");
    setAudio(null);
    mutation.reset();
  };

  return (
    <>
      <section className="container pt-14 pb-8 sm:pt-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-card/60 backdrop-blur text-xs text-muted-foreground mb-6">
            <span className="size-1.5 rounded-full bg-neon-cyan animate-pulse" />
            AI-powered scam, phishing & misinformation detection
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            One Click <span className="text-gradient">Truth Detector</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Detect scams, phishing links, fake news and suspicious messages instantly using AI —
            with reasoning you can actually understand.
          </p>
        </motion.div>
      </section>

      <section className="container pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
          className="max-w-2xl mx-auto"
        >
          {!mutation.data && !mutation.isPending && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "glass-card neon-border p-2 sm:p-3 transition-all",
                dragOver && "ring-2 ring-neon-cyan scale-[1.01]"
              )}
            >
              <div className="relative">
                <label htmlFor="ageix-input" className="sr-only">
                  Paste suspicious content
                </label>
                <textarea
                  id="ageix-input"
                  value={text}
                  onChange={(e) => { setText(e.target.value); if (audio) setAudio(null); }}
                  placeholder="Paste a link, message, headline — or drag in a call recording…"
                  maxLength={MAX_TEXT}
                  disabled={!!audio}
                  rows={6}
                  className={cn(
                    "w-full resize-none bg-transparent rounded-xl p-4 sm:p-5 text-base outline-none",
                    "placeholder:text-muted-foreground/70",
                    audio && "opacity-40"
                  )}
                />
                {audio && (
                  <div className="absolute inset-3 sm:inset-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/80 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white">
                        <Upload className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{audio.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(audio.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setAudio(null)} aria-label="Remove audio" className="text-muted-foreground hover:text-foreground p-1">
                      <X className="size-4" />
                    </button>
                  </div>
                )}
                {dragOver && !audio && (
                  <div className="absolute inset-0 rounded-xl bg-background/70 backdrop-blur-sm flex items-center justify-center text-sm text-neon-cyan pointer-events-none">
                    Drop your audio here
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 px-2 sm:px-3 pt-2 pb-1 flex-wrap">
                <div className="flex items-center gap-3">
                  <label className={cn(
                    "inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg cursor-pointer",
                    "border border-border hover:border-neon-cyan/60 hover:text-foreground text-muted-foreground transition-colors"
                  )}>
                    <Upload className="size-3.5" />
                    Upload audio
                    <input
                      type="file"
                      accept=".mp3,.wav,audio/mpeg,audio/wav"
                      className="hidden"
                      onChange={(e) => acceptAudio(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {audio ? "audio · 10MB max" : `${text.length}/${MAX_TEXT}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="#how"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-border hover:border-neon-cyan/60 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <PlayCircle className="size-3.5" /> Watch demo
                  </a>
                  <button
                    onClick={handleSubmit}
                    disabled={mutation.isPending || (!text.trim() && !audio)}
                    className={cn(
                      "inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-medium text-sm",
                      "bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] text-white",
                      "transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                      "shadow-[0_0_30px_hsl(var(--neon-purple)/0.45)]"
                    )}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" /> Check Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {mutation.isPending && <div className="mt-2"><ScanLoader /></div>}

          {mutation.data && !mutation.isPending && (
            <div className="mt-2">
              <ResultCard result={mutation.data} onReset={reset} />
            </div>
          )}

          {mutation.isError && !mutation.isPending && (
            <div className="mt-6 glass-card p-6 text-center">
              <div className="text-destructive font-medium">Analysis failed</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Please make sure the backend is running on <span className="font-medium">localhost:5001</span>, then try again.
              </div>
              <button onClick={() => mutation.mutate()} className="mt-3 text-sm underline">
                Retry
              </button>
            </div>
          )}

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-neon-cyan" />
            AGEIX securely processes scans to improve detection quality and user insights.
          </div>
        </motion.div>
      </section>

      <Suspense fallback={<div className="container py-20 text-center text-sm text-muted-foreground">Loading…</div>}>
        <LandingSections />
      </Suspense>
    </>
  );
};

export default Index;
