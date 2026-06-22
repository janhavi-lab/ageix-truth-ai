import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { CyberGrid } from "@/components/CyberGrid";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const finish = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        toast.error(error.message);
        navigate("/login", { replace: true });
        return;
      }
      toast.success("Signed in successfully");
      navigate("/dashboard", { replace: true });
    };
    finish();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 relative">
      <CyberGrid />
      <Loader2 className="size-8 animate-spin text-neon-cyan" />
      <p className="text-sm text-muted-foreground">Completing sign in…</p>
    </div>
  );
};

export default AuthCallback;
