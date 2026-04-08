import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { useRouter } from "@tanstack/react-router";
import { GraduationCap, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { createActor } from "../backend";

export default function LoginPage() {
  const { identity, login, loginStatus, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const router = useRouter();
  const { actor } = useActor(createActor);
  const initCalled = useRef(false);

  // Once identity is available, call _initializeAccessControl once (idempotent)
  // and navigate to dashboard.
  useEffect(() => {
    if (!identity || !actor || initCalled.current) return;
    initCalled.current = true;

    const init = async () => {
      try {
        // _initializeAccessControl sets the first caller as admin (idempotent)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (
          actor as unknown as Record<string, () => Promise<void>>
        )._initializeAccessControl?.();
      } catch {
        // Silently ignore — might not be exposed or already initialized
      }
      sessionStorage.setItem("ii_authenticated", "true");
      router.navigate({ to: "/dashboard" });
    };

    init();
  }, [identity, actor, router]);

  const isLoading = isInitializing || isLoggingIn;

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-4"
      data-ocid="login-page"
    >
      {/* Background decorative gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8 space-y-8">
          {/* Logo + app name */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-md">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
                EduFees
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                School Fee Management System
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Auth section */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sign in securely with Internet Identity — no passwords required.
                Your identity is cryptographically verified and never shared.
              </p>
            </div>

            <Button
              className="w-full h-11 font-medium"
              onClick={login}
              disabled={isLoading}
              data-ocid="login-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isInitializing ? "Initializing…" : "Connecting…"}
                </>
              ) : (
                "Sign in with Internet Identity"
              )}
            </Button>

            {loginStatus === "loginError" && (
              <p className="text-xs text-destructive text-center">
                Login failed. Please try again.
              </p>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
