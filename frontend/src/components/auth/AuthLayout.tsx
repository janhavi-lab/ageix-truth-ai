import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { CyberGrid } from "@/components/CyberGrid";
import { Logo } from "@/components/Logo";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <CyberGrid />
      <header className="container h-16 flex items-center justify-between">
        <Logo />
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors story-link"
        >
          ← Back to home
        </Link>
      </header>
      <main className="flex-1 container flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
