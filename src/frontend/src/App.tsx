import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ReportsPageComponent = lazy(() => import("./pages/ReportsPage"));
const PaymentsPageComponent = lazy(() => import("./pages/PaymentsPage"));
const StudentsPageComponent = lazy(() => import("./pages/StudentsPage"));
const StudentDetailPageComponent = lazy(
  () => import("./pages/StudentDetailPage"),
);
const FeeStructuresPageComponent = lazy(
  () => import("./pages/FeeStructuresPage"),
);
const FeeStructureFormPageComponent = lazy(
  () => import("./pages/FeeStructureFormPage"),
);
const FeeStructureDetailPageComponent = lazy(
  () => import("./pages/FeeStructureDetailPage"),
);

// Placeholder pages for routes not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-display font-semibold text-foreground">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        This page is coming soon.
      </p>
    </div>
  );
}

function PaymentsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <PaymentsPageComponent />
    </Suspense>
  );
}
function SettingsPage() {
  return <PlaceholderPage title="Settings" />;
}
function HelpPage() {
  return <PlaceholderPage title="Help Center" />;
}

function PageFallback() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-4 gap-4 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

// Auth guard — reads identity from the InternetIdentity context at route load time.
// Since hooks can't be called inside beforeLoad, we rely on a module-level getter
// that pages/layout can set. The guard is enforced by checking sessionStorage as a
// fast sync signal; the actual identity is owned by InternetIdentityProvider.
function getIsAuthenticated(): boolean {
  return sessionStorage.getItem("ii_authenticated") === "true";
}

function requireAuth() {
  if (!getIsAuthenticated()) {
    throw redirect({ to: "/login" });
  }
}

const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <LoginPage />
    </Suspense>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    if (!getIsAuthenticated()) {
      throw redirect({ to: "/login" });
    }
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: requireAuth,
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <DashboardPage />
    </Suspense>
  ),
});

const feeStructuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fee-structures",
  beforeLoad: requireAuth,
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <FeeStructuresPageComponent />
    </Suspense>
  ),
});

const feeStructureNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fee-structures/new",
  beforeLoad: requireAuth,
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <FeeStructureFormPageComponent />
    </Suspense>
  ),
});

const feeStructureEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fee-structures/$id/edit",
  beforeLoad: requireAuth,
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <FeeStructureFormPageComponent />
    </Suspense>
  ),
});

const feeStructureDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fee-structures/$id",
  beforeLoad: requireAuth,
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <FeeStructureDetailPageComponent />
    </Suspense>
  ),
});

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students",
  beforeLoad: requireAuth,
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <StudentsPageComponent />
    </Suspense>
  ),
});

const studentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students/$studentId",
  beforeLoad: requireAuth,
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <StudentDetailPageComponent />
    </Suspense>
  ),
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payments",
  beforeLoad: requireAuth,
  component: PaymentsPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  beforeLoad: requireAuth,
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ReportsPageComponent />
    </Suspense>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  beforeLoad: requireAuth,
  component: SettingsPage,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/help",
  beforeLoad: requireAuth,
  component: HelpPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  indexRoute,
  dashboardRoute,
  feeStructuresRoute,
  feeStructureNewRoute,
  feeStructureEditRoute,
  feeStructureDetailRoute,
  studentsRoute,
  studentDetailRoute,
  paymentsRoute,
  reportsRoute,
  settingsRoute,
  helpRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// AuthSync bridges the InternetIdentity context to sessionStorage so
// beforeLoad guards can read sync auth state on navigation.
function AuthSync() {
  const { identity, isInitializing } = useInternetIdentity();

  if (!isInitializing) {
    const authenticated = !!identity;
    const current = sessionStorage.getItem("ii_authenticated") === "true";
    if (authenticated !== current) {
      sessionStorage.setItem("ii_authenticated", String(authenticated));
      // Invalidate the router so guards re-evaluate after auth state change
      router.invalidate();
    }
  }

  return null;
}

export default function App() {
  return (
    <>
      <AuthSync />
      <RouterProvider router={router} />
    </>
  );
}
