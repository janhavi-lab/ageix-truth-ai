import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/AuthCard";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { NeonSubmitButton } from "@/components/auth/NeonSubmitButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { getRememberMe, setRememberMe } from "@/lib/auth-storage";

const Login = () => {
  const { signIn, signInWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMeState] = useState(getRememberMe);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [authLoading, user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Enter your email and password");
      return;
    }
    setSubmitting(true);
    setRememberMe(rememberMe);
    const { error } = await signIn({ email: email.trim(), password, rememberMe });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back to AGEIX");
    navigate(from, { replace: true });
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setGoogleLoading(false);
    if (error) toast.error(error.message);
  };

  if (authLoading) return null;

  return (
    <AuthCard
      title={
        <>
          Welcome back to <span className="text-gradient">AGEIX</span>
        </>
      }
      subtitle="Sign in to access your dashboard and scan history"
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="text-neon-cyan hover:underline font-medium">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground/90">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-input/80 border-border/80 rounded-xl h-11 focus-visible:ring-[hsl(var(--neon-cyan)/0.5)]"
            required
          />
        </div>
        <PasswordInput
          label="Password"
          id="login-password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(v) => setRememberMeState(v === true)}
            />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-muted-foreground">
              Remember me
            </Label>
          </div>
          <Link
            to="/login"
            className="text-xs text-neon-cyan hover:underline"
            onClick={(e) => {
              e.preventDefault();
              toast.info("Use Supabase dashboard → Auth → Email templates for password reset");
            }}
          >
            Forgot password?
          </Link>
        </div>
        <NeonSubmitButton loading={submitting}>Sign in</NeonSubmitButton>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-card/80 px-3 text-muted-foreground">or</span>
        </div>
      </div>

      <GoogleAuthButton onClick={handleGoogle} loading={googleLoading} />
    </AuthCard>
  );
};

export default Login;
