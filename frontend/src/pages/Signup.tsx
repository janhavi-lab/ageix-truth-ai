import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/AuthCard";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { NeonSubmitButton } from "@/components/auth/NeonSubmitButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAuth } from "@/hooks/useAuth";

const Signup = () => {
  const { signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate("/dashboard", { replace: true });
  }, [authLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setSubmitting(true);
    const { error } = await signUp({
      email: email.trim(),
      password,
      fullName: fullName.trim() || undefined,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check your email to confirm your account, or sign in if confirmation is disabled");
    navigate("/login");
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
          Join <span className="text-gradient">AGEIX</span>
        </>
      }
      subtitle="Create your account and start detecting scams in seconds"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-neon-cyan hover:underline font-medium">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground/90">
            Full name
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-input/80 border-border/80 rounded-xl h-11 focus-visible:ring-[hsl(var(--neon-cyan)/0.5)]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-foreground/90">
            Email
          </Label>
          <Input
            id="signup-email"
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
          id="signup-password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        <PasswordInput
          label="Confirm password"
          id="confirm-password"
          autoComplete="new-password"
          placeholder="Repeat password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <NeonSubmitButton loading={submitting}>Create account</NeonSubmitButton>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-card/80 px-3 text-muted-foreground">or</span>
        </div>
      </div>

      <GoogleAuthButton onClick={handleGoogle} loading={googleLoading} label="Sign up with Google" />
    </AuthCard>
  );
};

export default Signup;
