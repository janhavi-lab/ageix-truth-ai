/**
 * Ambient premium background — subtle grid + slow drifting glow orbs +
 * soft floating neon particles. Pure CSS / SVG, GPU-friendly.
 */
export const CyberGrid = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    {/* Faint grid */}
    <div
      className="absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--neon-cyan) / 0.22) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-cyan) / 0.22) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage:
          "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        filter: "blur(0.4px)",
      }}
    />

    {/* Slow drifting glow orbs */}
    <div className="absolute -top-48 -left-40 size-[620px] rounded-full bg-[hsl(var(--neon-purple))] opacity-[0.10] blur-[140px] animate-drift-slow" />
    <div
      className="absolute -bottom-48 -right-40 size-[620px] rounded-full bg-[hsl(var(--neon-cyan))] opacity-[0.10] blur-[140px] animate-drift-slow"
      style={{ animationDelay: "2s" }}
    />
    <div
      className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[420px] rounded-full bg-[hsl(var(--neon-purple))] opacity-[0.05] blur-[120px] animate-pulse-soft"
    />

    {/* Floating neon particles */}
    <div className="absolute inset-0">
      {[
        { l: "10%", t: "20%", d: "0s",   c: "cyan"   },
        { l: "82%", t: "30%", d: "1.2s", c: "purple" },
        { l: "25%", t: "70%", d: "2.4s", c: "purple" },
        { l: "70%", t: "78%", d: "3.1s", c: "cyan"   },
        { l: "50%", t: "12%", d: "1.8s", c: "cyan"   },
        { l: "92%", t: "60%", d: "0.6s", c: "purple" },
        { l: "5%",  t: "50%", d: "2.1s", c: "cyan"   },
      ].map((p, i) => (
        <span
          key={i}
          className="absolute size-1 rounded-full animate-float-particle"
          style={{
            left: p.l,
            top: p.t,
            animationDelay: p.d,
            background: `hsl(var(--neon-${p.c}))`,
            boxShadow: `0 0 10px hsl(var(--neon-${p.c}) / 0.7)`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  </div>
);
