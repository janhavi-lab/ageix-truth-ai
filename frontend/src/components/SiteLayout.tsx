import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, ShieldCheck, Home, Sparkles, X, LogOut, LayoutDashboard, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { CyberGrid } from "./CyberGrid";
import { NavScrollLink } from "./NavScrollLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useActiveSection } from "@/hooks/useActiveSection";
import { navigateToSection, scrollToSection } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const SECTION_NAV = [
  { section: "features" as const, label: "Features" },
  { section: "pricing" as const, label: "Pricing" },
  { to: "/about", label: "About" },
  { section: "faq" as const, label: "FAQ" },
];

export const SiteLayout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const activeSection = useActiveSection(pathname);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    if (hash) {
      scrollToSection(hash);
    }
  }, [pathname, hash]);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed out");
    navigate("/");
  };

  const userEmail = user?.email ?? "";
  const userName =
    (user?.user_metadata?.full_name as string | undefined) ?? userEmail.split("@")[0];
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isAboutActive = pathname === "/about";
  const isDashboardActive = pathname === "/dashboard";

  return (
    <div className="min-h-screen flex flex-col relative">
      <CyberGrid />

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "backdrop-blur-xl bg-background/70 border-b border-border/60 shadow-[0_4px_30px_hsl(0_0%_0%/0.3)]"
            : "bg-transparent"
        )}
      >
        <div className="container flex items-center justify-between h-16">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {SECTION_NAV.map((n) =>
              "section" in n ? (
                <NavScrollLink
                  key={n.label}
                  section={n.section}
                  label={n.label}
                  active={pathname === "/" && activeSection === n.section}
                />
              ) : (
                <NavScrollLink
                  key={n.label}
                  to={n.to}
                  label={n.label}
                  active={isAboutActive}
                />
              )
            )}

            {!loading && user ? (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "inline-flex items-center gap-1.5 transition-colors duration-300",
                    isDashboardActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutDashboard className="size-3.5" /> Dashboard
                </Link>
                <div className="flex items-center gap-2 pl-1 border-l border-border/50">
                  <Avatar className="size-8">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
                    <AvatarFallback className="text-xs bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground max-w-[120px] truncate hidden lg:inline">
                    {userEmail}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="size-3.5" /> Logout
                </button>
                <NavScrollLink
                  section="detector"
                  label="Try AGEIX"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] shadow-[0_0_24px_hsl(var(--neon-purple)/0.45)] hover:scale-[1.03] active:scale-[0.98] transition-transform !text-white after:hidden"
                />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="relative text-sm text-foreground/85 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_hsl(var(--neon-cyan)/0.6)]"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <UserPlus className="size-3.5" /> Signup
                </Link>
                <NavScrollLink
                  section="detector"
                  label="Try AGEIX"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] shadow-[0_0_24px_hsl(var(--neon-purple)/0.45)] hover:scale-[1.03] active:scale-[0.98] transition-transform !text-white after:hidden"
                />
              </>
            )}
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
          <div className="md:hidden border-t border-border/60 bg-background/90 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="container py-4 flex flex-col gap-3 text-sm">
              {SECTION_NAV.map((n) =>
                "section" in n ? (
                  <NavScrollLink
                    key={n.label}
                    section={n.section}
                    label={n.label}
                    active={pathname === "/" && activeSection === n.section}
                    onNavigate={closeMenu}
                    className="py-2"
                  />
                ) : (
                  <NavScrollLink
                    key={n.label}
                    to={n.to}
                    label={n.label}
                    active={isAboutActive}
                    onNavigate={closeMenu}
                    className="py-2"
                  />
                )
              )}
              {!loading && user ? (
                <>
                  <Link to="/dashboard" onClick={closeMenu} className="py-2 flex items-center gap-2">
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                  <div className="py-2 flex items-center gap-2 text-muted-foreground">
                    <Avatar className="size-7">
                      {avatarUrl && <AvatarImage src={avatarUrl} />}
                      <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{userEmail}</span>
                  </div>
                  <button type="button" onClick={() => { closeMenu(); handleLogout(); }} className="py-2 text-left flex items-center gap-2">
                    <LogOut className="size-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu} className="py-2">
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={closeMenu} className="py-2 flex items-center gap-2">
                    <UserPlus className="size-4" /> Signup
                  </Link>
                </>
              )}
              <NavScrollLink
                section="detector"
                label="Try AGEIX"
                onNavigate={closeMenu}
                className="py-2 text-neon-cyan font-medium"
              />
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-[0_8px_30px_hsl(0_0%_0%/0.5)]"
      >
        <div className="grid grid-cols-3">
          {[
            { section: "detector" as const, label: "Detect", icon: Home },
            { to: "/about", label: "About", icon: ShieldCheck },
            { section: "pricing" as const, label: "Pricing", icon: Sparkles },
          ].map(({ label, icon: Icon, ...item }) =>
            "section" in item ? (
              <button
                key={label}
                type="button"
                onClick={() => navigateToSection(item.section, navigate, pathname)}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[11px] transition-colors",
                  pathname === "/" && activeSection === item.section
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ) : (
              <NavLink
                key={label}
                to={item.to!}
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
            )
          )}
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
              <li>
                <NavScrollLink section="features" label="Features" className="hover:text-foreground" />
              </li>
              <li>
                <NavScrollLink section="pricing" label="Pricing" className="hover:text-foreground" />
              </li>
              <li>
                <NavScrollLink section="faq" label="FAQ" className="hover:text-foreground" />
              </li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Company</div>
            <ul className="space-y-2">
              <li>
                <Link className="hover:text-foreground" to="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" to="/privacy">
                  Privacy
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" to="/terms">
                  Terms
                </Link>
              </li>
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
