import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Upload, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { analyzeInput, AnalyzeResult } from "@/lib/analyze";
import { ResultCard } from "@/components/ResultCard";
import { cn } from "@/lib/utils";

const MAX_TEXT = 5000;
const MAX_AUDIO = 10 * 1024 * 1024;
const ACCEPTED_AUDIO = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav"];

const Index = () => {
  const [text, setText] = useState("");
  const [audio, setAudio] = useState<File | null>(null);

  const mutation = useMutation<AnalyzeResult, Error, void>({
    mutationFn: async () => {
      if (audio) return analyzeInput({ kind: "audio", file: audio });
      return analyzeInput({ kind: "text", value: text });
    },
    onError: (e) => toast.error(e.message || "Something went wrong. Try again."),
  });

  const handleAudio = (file: File | null) => {
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
  };

  const handleSubmit = () => {
    if (audio) return mutation.mutate();
    const t = text.trim();
    if (!t) return toast.error("Paste something to check");
    if (t.length > MAX_TEXT) return toast.error("Input is too long (max 5000 characters)");
    mutation.mutate();
  };

  const reset = () => {
    setText(""); setAudio(null); mutation.reset();
  };

  return (
    <>
      <section className="container pt-16 pb-8 sm:pt-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-card/60 backdrop-blur text-xs text-muted-foreground mb-6">
            <span className="size-1.5 rounded-full bg-neon-cyan animate-pulse" />
            AI-powered scam, spam & misinformation detection
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold leading-[1.05]">
            One click. <span className="text-gradient">The truth.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Paste a link, message, headline or upload a call recording. Ageix figures out
            the rest and tells you if it&apos;s safe — in plain language.
          </p>
        </div>
      </section>

      <section className="container pb-16">
        <div className="max-w-2xl mx-auto">
          {!mutation.data && (
            <div className="glass-card neon-border p-2 sm:p-3">
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => { setText(e.target.value); if (audio) setAudio(null); }}
                  placeholder="Paste anything suspicious..."
                  maxLength={MAX_TEXT}
                  disabled={mutation.isPending || !!audio}
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
                    <button onClick={() => setAudio(null)} className="text-muted-foreground hover:text-foreground p-1">
                      <X className="size-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 px-2 sm:px-3 pt-2 pb-1">
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
                      onChange={(e) => handleAudio(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {audio ? "audio · 10MB max" : `${text.length}/${MAX_TEXT}`}
                  </span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={mutation.isPending || (!text.trim() && !audio)}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-medium text-sm",
                    "bg-gradient-to-r from-neon-purple to-neon-cyan text-white",
                    "transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                    "shadow-[0_0_30px_hsl(var(--neon-purple)/0.45)]"
                  )}
                >
                  {mutation.isPending ? (
                    <><Loader2 className="size-4 animate-spin" /> Analyzing…</>
                  ) : (
                    <><Sparkles className="size-4" /> Check Now</>
                  )}
                </button>
              </div>
            </div>
          )}

          {mutation.isPending && (
            <div className="mt-6 glass-card p-8 text-center">
              <div className="mx-auto size-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan animate-pulse-ring flex items-center justify-center">
                <Loader2 className="size-7 text-white animate-spin" />
              </div>
              <div className="mt-4 text-sm text-muted-foreground">Analyzing… cross-checking signals</div>
              <div className="mt-4 space-y-2">
                <div className="h-2 rounded bg-muted/50 overflow-hidden"><div className="h-full w-2/3 bg-gradient-to-r from-neon-purple to-neon-cyan animate-pulse" /></div>
                <div className="h-2 rounded bg-muted/50 overflow-hidden"><div className="h-full w-1/2 bg-gradient-to-r from-neon-purple to-neon-cyan animate-pulse" /></div>
              </div>
            </div>
          )}

          {mutation.data && !mutation.isPending && (
            <div className="mt-6">
              <ResultCard result={mutation.data} onReset={reset} />
            </div>
          )}

          {mutation.isError && !mutation.isPending && (
            <div className="mt-6 glass-card p-6 text-center">
              <div className="text-destructive font-medium">Analysis failed</div>
              <button onClick={() => mutation.mutate()} className="mt-3 text-sm underline">Retry</button>
            </div>
          )}
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { t: "Scam links", d: "Detects shortened, spoofed and lookalike URLs." },
            { t: "Spam messages", d: "Spots OTP, prize and bank impersonation tactics." },
            { t: "Fake news", d: "Flags sensational and misleading article patterns." },
          ].map((f) => (
            <div key={f.t} className="glass-card p-5">
              <div className="text-sm font-semibold text-gradient">{f.t}</div>
              <div className="mt-1 text-xs text-muted-foreground">{f.d}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Index;
