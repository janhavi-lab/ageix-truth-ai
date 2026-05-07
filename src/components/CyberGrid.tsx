/**
 * Animated cyber grid + floating orbs background.
 * Pure CSS / SVG so it stays cheap on the main thread.
 */
export const CyberGrid = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div
      className="absolute inset-0 opacity-[0.18]"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--neon-cyan) / 0.35) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-cyan) / 0.35) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 75%)",
      }}
    />
    <div className="absolute -top-40 -left-32 size-[520px] rounded-full bg-[hsl(var(--neon-purple))] opacity-20 blur-[120px] animate-float" />
    <div
      className="absolute -bottom-40 -right-32 size-[520px] rounded-full bg-[hsl(var(--neon-cyan))] opacity-20 blur-[120px] animate-float"
      style={{ animationDelay: "1.5s" }}
    />
    <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-[hsl(var(--neon-cyan)/0.4)] to-transparent" />
  </div>
);
