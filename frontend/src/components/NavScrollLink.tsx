import { Link, useNavigate, useLocation } from "react-router-dom";
import { navigateToSection, type HomeSection } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface NavScrollLinkProps {
  section?: HomeSection;
  to?: string;
  label: string;
  className?: string;
  active?: boolean;
  onNavigate?: () => void;
}

const activeClass =
  "text-foreground font-medium relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[hsl(var(--neon-purple))] after:to-[hsl(var(--neon-cyan))] after:rounded-full";

const idleClass = "text-muted-foreground hover:text-foreground story-link transition-colors duration-300";

export function NavScrollLink({ section, to, label, className, active, onNavigate }: NavScrollLinkProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (section) {
    const hash = section === "detector" ? "#detector" : `#${section}`;
    return (
      <a
        href={`/${hash}`}
        onClick={(e) => {
          e.preventDefault();
          navigateToSection(section, navigate, pathname);
          onNavigate?.();
        }}
        className={cn(active ? activeClass : idleClass, className)}
      >
        {label}
      </a>
    );
  }

  if (to) {
    return (
      <Link
        to={to}
        onClick={() => onNavigate?.()}
        className={cn(active ? activeClass : idleClass, className)}
      >
        {label}
      </Link>
    );
  }

  return null;
}
