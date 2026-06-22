import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Clock,
  Crown,
  FileSearch,
  Sparkles,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

const PLACEHOLDER_SCANS = [
  { title: "Bank OTP message", verdict: "Fake", time: "2 hours ago" },
  { title: "LinkedIn job offer", verdict: "Suspicious", time: "Yesterday" },
  { title: "News headline check", verdict: "Real", time: "3 days ago" },
];

const RECENT_ACTIVITY = [
  { action: "Completed text scan", detail: "Phishing link detected", time: "2h ago" },
  { action: "Plan limit reminder", detail: "42 scans remaining today", time: "5h ago" },
  { action: "Account created", detail: "Welcome to AGEIX", time: "1 week ago" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const email = user?.email ?? "user@ageix.app";
  const name =
    (user?.user_metadata?.full_name as string | undefined) ??
    email.split("@")[0];
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="container py-10 sm:py-14 space-y-10">
      <motion.section {...fade} className="glass-card neon-border p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 ring-2 ring-[hsl(var(--neon-purple)/0.5)]">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
              <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs uppercase tracking-widest text-neon-cyan mb-1">Dashboard</p>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome back, <span className="text-gradient">{name}</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{email}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="self-start sm:self-center px-4 py-1.5 text-sm border-[hsl(var(--neon-purple)/0.5)] bg-[hsl(var(--neon-purple)/0.1)]"
          >
            <Zap className="size-3.5 mr-1.5 text-neon-cyan" />
            Free plan
          </Badge>
        </div>
      </motion.section>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.section
          {...fade}
          transition={{ ...fade.transition, delay: 0.05 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileSearch className="size-5 text-neon-cyan" />
              Scan history
            </h2>
            <Link
              to="/"
              className="text-xs text-neon-cyan hover:underline flex items-center gap-1"
            >
              New scan <ArrowUpRight className="size-3" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLACEHOLDER_SCANS.map((scan) => (
              <div
                key={scan.title}
                className="glass-card p-5 hover:border-[hsl(var(--neon-cyan)/0.35)] transition-colors group"
              >
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" /> {scan.time}
                </div>
                <div className="mt-2 font-medium text-sm">{scan.title}</div>
                <div
                  className={cn(
                    "mt-2 text-xs font-medium inline-flex px-2 py-0.5 rounded-full",
                    scan.verdict === "Real"
                      ? "bg-success/20 text-success"
                      : scan.verdict === "Fake"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {scan.verdict}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Scan history will sync here once connected to your backend API.
          </p>
        </motion.section>

        <motion.section
          {...fade}
          transition={{ ...fade.transition, delay: 0.1 }}
          className="glass-card p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="size-5 text-neon-purple" />
            Recent activity
          </h2>
          <ul className="space-y-4">
            {RECENT_ACTIVITY.map((item) => (
              <li key={item.action} className="border-b border-border/40 pb-3 last:border-0 last:pb-0">
                <div className="text-sm font-medium">{item.action}</div>
                <div className="text-xs text-muted-foreground">{item.detail}</div>
                <div className="text-[10px] text-muted-foreground/80 mt-1">{item.time}</div>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>

      <motion.section
        {...fade}
        transition={{ ...fade.transition, delay: 0.15 }}
        className="glass-card p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--neon-purple)/0.15)] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 text-neon-purple mb-2">
              <Crown className="size-5" />
              <span className="text-xs uppercase tracking-widest">Upgrade</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Unlock AGEIX Pro</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Unlimited checks, audio analysis, priority AI models, and exportable reports.
            </p>
          </div>
          <Link
            to="/#pricing"
            className={cn(
              "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white shrink-0",
              "bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))]",
              "shadow-[0_0_30px_hsl(var(--neon-purple)/0.45)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
            )}
          >
            <Sparkles className="size-4" /> Upgrade to Pro
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;
