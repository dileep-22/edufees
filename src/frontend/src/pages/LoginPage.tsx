import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, GraduationCap, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { createActor } from "../backend";

const features = [
  { icon: "📊", label: "Fee structure builder with late penalties" },
  { icon: "👥", label: "Student roster with bulk CSV import" },
  { icon: "💳", label: "Payment recording and receipt tracking" },
  { icon: "📈", label: "Collections dashboard with trends" },
];

export default function LoginPage() {
  const { identity, login, loginStatus, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const router = useRouter();
  const { actor } = useActor(createActor);
  const initCalled = useRef(false);

  useEffect(() => {
    if (!identity || !actor || initCalled.current) return;
    initCalled.current = true;

    const init = async () => {
      try {
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
  const hasError = loginStatus === "loginError";

  return (
    <div className="min-h-screen flex overflow-hidden" data-ocid="login-page">
      {/* Left panel — hero / branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary flex-col justify-between p-12 overflow-hidden">
        {/* Geometric decorative pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="absolute -bottom-16 -left-16 w-[480px] h-[480px] opacity-10"
            viewBox="0 0 480 480"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="240" cy="240" r="220" stroke="white" strokeWidth="2" />
            <circle cx="240" cy="240" r="160" stroke="white" strokeWidth="2" />
            <circle cx="240" cy="240" r="100" stroke="white" strokeWidth="2" />
            <circle cx="240" cy="240" r="40" stroke="white" strokeWidth="2" />
          </svg>
          <svg
            className="absolute -top-12 -right-12 w-[320px] h-[320px] opacity-[0.07]"
            viewBox="0 0 320 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {[40, 80, 120, 160].map((r) => (
              <polygon
                key={r}
                points={`160,${160 - r} ${160 + r * 0.866},${160 + r * 0.5} ${160 - r * 0.866},${160 + r * 0.5}`}
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
            ))}
          </svg>
        </div>

        {/* Top — logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-primary-foreground tracking-tight">
              EduFees
            </span>
          </div>
        </div>

        {/* Middle — headline */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-3xl font-display font-bold text-primary-foreground leading-snug">
              Fee management for
              <br />
              modern schools
            </h2>
            <p className="mt-3 text-primary-foreground/70 text-base leading-relaxed max-w-xs">
              Streamline fee collection, track payments, and generate reports —
              all in one place.
            </p>
          </div>

          <ul className="space-y-3">
            {features.map(({ icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="text-lg leading-none">{icon}</span>
                <span className="text-sm text-primary-foreground/80">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom — trust badge */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-foreground/60" />
            <span className="text-xs text-primary-foreground/60">
              Secured with Internet Identity — no passwords required
            </span>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Mobile logo strip */}
        <div className="lg:hidden flex items-center gap-2 px-6 pt-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-display font-bold text-foreground">
            EduFees
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-sm">
            {/* Card */}
            <div className="card-institutional p-8 space-y-7">
              {/* Heading */}
              <div className="space-y-1.5">
                <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
                  Sign in
                </h1>
                <p className="text-sm text-muted-foreground">
                  Access the EduFees admin dashboard
                </p>
              </div>

              {/* Info strip */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-secondary border border-border">
                <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your identity is cryptographically verified using Internet
                  Identity — no username or password needed.
                </p>
              </div>

              {/* Error state */}
              {hasError && (
                <div
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/8 border border-destructive/20"
                  role="alert"
                  data-ocid="login-error"
                >
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs text-destructive leading-relaxed">
                    Authentication failed. Please try again or ensure your
                    Internet Identity anchor is active.
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="space-y-3">
                <Button
                  className="w-full h-11 font-semibold text-sm"
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
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Sign in with Internet Identity
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Don't have access?{" "}
                  <a
                    href="https://caffeine.ai/support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                  >
                    Contact your administrator
                  </a>
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Footer links */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="text-muted-foreground">Privacy</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-muted-foreground">Terms</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <a
                  href="https://caffeine.ai/support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Support
                </a>
              </div>
            </div>

            {/* Branding */}
            <p className="text-center text-xs text-muted-foreground mt-6">
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
    </div>
  );
}
