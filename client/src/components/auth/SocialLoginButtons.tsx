import { Button } from "@/components/ui/button";
import { Mail, Github } from "lucide-react";
import { useState } from "react";

interface SocialLoginButtonsProps {
  disabled?: boolean;
  className?: string;
}

export default function SocialLoginButtons({ disabled = false, className = "" }: SocialLoginButtonsProps) {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);

  const handleGoogleLogin = () => {
    setLoading("google");
    // Redirect to backend OAuth endpoint
    window.location.href = "/api/oauth/google/login";
  };

  const handleGithubLogin = () => {
    setLoading("github");
    // Redirect to backend OAuth endpoint
    window.location.href = "/api/oauth/github/login";
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Button
        onClick={handleGoogleLogin}
        disabled={disabled || loading !== null}
        variant="outline"
        className="w-full border-border hover:bg-muted flex items-center justify-center gap-2 py-6"
      >
        <Mail className="w-5 h-5" />
        <span>{loading === "google" ? "Redirecting..." : "Continue with Google"}</span>
      </Button>

      <Button
        onClick={handleGithubLogin}
        disabled={disabled || loading !== null}
        variant="outline"
        className="w-full border-border hover:bg-muted flex items-center justify-center gap-2 py-6"
      >
        <Github className="w-5 h-5" />
        <span>{loading === "github" ? "Redirecting..." : "Continue with GitHub"}</span>
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or</span>
        </div>
      </div>
    </div>
  );
}
