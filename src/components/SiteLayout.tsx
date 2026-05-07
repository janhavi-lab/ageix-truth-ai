import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, ShieldCheck, Home, Sparkles, X, LogIn } from "lucide-react";
import { Logo } from "./Logo";
import { CyberGrid } from "./CyberGrid";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/#features", label: "Features" },
  { to: "/#pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/#faq", label: "FAQ" },
];

export const SiteLayout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <CyberGrid />

      <header
        className={cn(
          "sticky top-0 z-40 transition-all",
          scrolled
            ? "backdrop-blur-xl bg-background/70 border-b border-border/60 shadow-[0_4px_30px_hsl(0_0%_0%/0.3)]"
            : "bg-transparent"
        )}
      >
        <div className="container flex items-center justify-between h-16">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-muted-foreground hover:text-foreground transition-colors story-link"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/"
              className="text-sm text-foreground/90 hover:text-white transition-colors hover:shadow-[0_0_12px_hsl(var(--neon-cyan)/0.35)]"
            >
              Sign In
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] shadow-[0_0_24px_hsl(var(--neon-purple)/0.45)] hover:scale-[1.03] active:scale-[0.98] transition-transform"
            >
              <Sparkles className="size-3.5" /> Try AGEIX
            </Link>
          </nav>
          <button
            className="md:hidden p-2 rounded-lg border border-border/60"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-border/60 bg-background/90 backdrop-blur-xl">
            <div className="container py-4 flex flex-col gap-3 text-sm">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="py-2 text-muted-foreground hover:text-foreground">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pb-20 md:pb-0"><Outlet /></main>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-[0_8px_30px_hsl(0_0%_0%/0.5)]"
      >
        <div className="grid grid-cols-3">
          {[
            { to: "/", label: "Detect", icon: Home },
            { to: "/about", label: "About", icon: ShieldCheck },
            { to: "/#pricing", label: "Pricing", icon: Sparkles },
          ].map(({ to, label, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[11px]",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <footer className="border-t border-border/50 py-10 mt-16">
        <div className="container grid sm:grid-cols-3 gap-8 text-sm">
          <div>
            <Logo />
            <p className="mt-3 text-xs text-muted-foreground max-w-xs">
              AI-powered scam, phishing and misinformation detection — built for everyday people.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Product</div>
            <ul className="space-y-2">
              <li><Link className="hover:text-foreground" to="/#features">Features</Link></li>
              <li><Link className="hover:text-foreground" to="/#pricing">Pricing</Link></li>
              <li><Link className="hover:text-foreground" to="/#faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Company</div>
            <ul className="space-y-2">
              <li><Link className="hover:text-foreground" to="/about">About</Link></li>
              <li><Link className="hover:text-foreground" to="/privacy">Privacy</Link></li>
              <li><Link className="hover:text-foreground" to="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ageix — One Click Truth Detector
        </div>
      </footer>
    </div>
  );
};
