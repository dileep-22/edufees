import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/fee-structures", label: "Fee Structures", icon: CreditCard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/payments", label: "Payments", icon: Receipt },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

const bottomItems = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help Center", icon: HelpCircle },
];

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}

function NavLink({ to, label, icon: Icon, active }: NavLinkProps) {
  const slug = label.toLowerCase().split(" ").join("-");
  return (
    <Link
      to={to}
      data-ocid={`nav-${slug}`}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (to: string) =>
    currentPath === to || currentPath.startsWith(`${to}/`);

  return (
    <aside
      className="w-[220px] shrink-0 flex flex-col h-full bg-card border-r border-border"
      data-ocid="sidebar-nav"
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-display font-semibold text-sm text-foreground truncate">
          EduAdmin
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            label={label}
            icon={icon}
            active={isActive(to)}
          />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-border space-y-0.5">
        {bottomItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            label={label}
            icon={icon}
            active={isActive(to)}
          />
        ))}
      </div>
    </aside>
  );
}
