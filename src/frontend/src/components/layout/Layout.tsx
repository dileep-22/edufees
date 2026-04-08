import { Toaster } from "@/components/ui/sonner";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useRouter } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

function truncatePrincipal(principal: string): string {
  if (principal.length <= 16) return principal;
  return `${principal.slice(0, 8)}…${principal.slice(-5)}`;
}

export function Layout({ children }: LayoutProps) {
  const { identity, clear } = useInternetIdentity();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const principalText = identity
    ? truncatePrincipal(identity.getPrincipal().toText())
    : "Admin";

  function handleLogout() {
    setMenuOpen(false);
    clear();
    sessionStorage.removeItem("ii_authenticated");
    router.navigate({ to: "/login" });
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="h-14 shrink-0 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm"
          data-ocid="app-header"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Westfield Academy
            </span>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Notifications"
              data-ocid="header-notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full" />
            </button>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-secondary transition-colors text-sm"
                data-ocid="header-user-menu"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <UserCircle className="w-6 h-6 text-muted-foreground" />
                <span
                  className="font-medium text-foreground text-sm hidden sm:block max-w-[120px] truncate"
                  title={identity?.getPrincipal().toText()}
                >
                  {principalText}
                </span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {menuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    role="presentation"
                    onClick={() => setMenuOpen(false)}
                    onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
                  />
                  {/* Dropdown */}
                  <div
                    className="absolute right-0 top-full mt-1.5 z-20 w-56 bg-card border border-border rounded-xl shadow-lg py-1 overflow-hidden"
                    role="menu"
                    data-ocid="user-menu-dropdown"
                  >
                    {/* Principal display */}
                    <div className="px-3 py-2.5 border-b border-border">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Principal ID
                      </p>
                      <p
                        className="text-xs font-mono text-foreground truncate"
                        title={identity?.getPrincipal().toText()}
                      >
                        {identity?.getPrincipal().toText() ?? "—"}
                      </p>
                    </div>

                    {/* Logout */}
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={handleLogout}
                      data-ocid="logout-btn"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto bg-background"
          data-ocid="main-content"
        >
          {children}
          <footer className="px-6 py-4 border-t border-border bg-muted/40 flex items-center justify-center">
            <p className="text-xs text-muted-foreground">
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
          </footer>
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
