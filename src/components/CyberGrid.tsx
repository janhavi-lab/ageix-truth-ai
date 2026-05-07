/**
 * Subtle ambient background with faint grid and soft glow orbs.
 * Pure CSS / SVG so it stays cheap on the main thread.
 */
export const CyberGrid = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--neon-cyan) / 0.18) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-cyan) / 0.18) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage:
          "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        filter: "blur(0.5px)",
      }}
    />
    <div className="absolute -top-48 -left-40 size-[600px] rounded-full bg-[hsl(var(--neon-purple))] opacity-[0.08] blur-[140px] animate-float" />
    <div
      className="absolute -bottom-48 -right-40 size-[600px] rounded-full bg-[hsl(var(--neon-cyan))] opacity-[0.08] blur-[140px] animate-float"
      style={{ animationDelay: "1.5s" }}
    />
  </div>
);
