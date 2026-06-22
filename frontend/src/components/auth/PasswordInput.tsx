import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> {
  label?: string;
}

export function PasswordInput({ className, label, id, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? "password";

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground/90">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "pr-10 bg-input/80 border-border/80 rounded-xl h-11",
            "focus-visible:ring-[hsl(var(--neon-cyan)/0.5)]",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
