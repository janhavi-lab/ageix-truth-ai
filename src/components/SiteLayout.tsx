import { Link, Outlet } from "react-router-dom";
import { Logo } from "./Logo";

export const SiteLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Logo />
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-foreground text-muted-foreground transition-colors">Detect</Link>
            <Link to="/about" className="hover:text-foreground text-muted-foreground transition-colors">About</Link>
            <Link to="/privacy" className="hover:text-foreground text-muted-foreground transition-colors hidden sm:inline">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground text-muted-foreground transition-colors hidden sm:inline">Terms</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Ageix — One Click Truth Detector</div>
          <div className="flex gap-5">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
