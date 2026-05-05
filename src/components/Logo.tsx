import logo from "@/assets/ageix-logo.png";
import { Link } from "react-router-dom";

export const Logo = ({ size = 40 }: { size?: number }) => (
  <Link to="/" className="flex items-center gap-3 group">
    <img
      src={logo}
      alt="Ageix logo"
      width={size}
      height={size}
      className="drop-shadow-[0_0_12px_hsl(var(--neon-cyan)/0.5)] transition-transform group-hover:scale-105"
      style={{ filter: "invert(1) hue-rotate(180deg)" }}
    />
    <div className="leading-tight">
      <div className="text-lg font-bold tracking-tight text-gradient">Ageix</div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Truth Detector</div>
    </div>
  </Link>
);
