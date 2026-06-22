import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeonSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export function NeonSubmitButton({ loading, children, className, disabled, ...props }: NeonSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={cn(
        "w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm",
        "bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-cyan))] text-white",
        "transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        "shadow-[0_0_30px_hsl(var(--neon-purple)/0.45)]",
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}
