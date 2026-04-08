import { u as useInternetIdentity, a as useRouter, r as reactExports, j as jsxRuntimeExports } from "./index-JaIj-DYW.js";
import { B as Button } from "./button-BhNjEAR1.js";
import { c as createLucideIcon, u as useActor, a as createActor } from "./backend-BHrL9w1d.js";
import { L as LoaderCircle } from "./loader-circle-1QxjHQqJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
      key: "j76jl0"
    }
  ],
  ["path", { d: "M22 10v6", key: "1lu8f3" }],
  ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5", key: "1r8lef" }]
];
const GraduationCap = createLucideIcon("graduation-cap", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
function LoginPage() {
  const { identity, login, loginStatus, isInitializing, isLoggingIn } = useInternetIdentity();
  const router = useRouter();
  const { actor } = useActor(createActor);
  const initCalled = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!identity || !actor || initCalled.current) return;
    initCalled.current = true;
    const init = async () => {
      var _a;
      try {
        await ((_a = actor._initializeAccessControl) == null ? void 0 : _a.call(actor));
      } catch {
      }
      sessionStorage.setItem("ii_authenticated", "true");
      router.navigate({ to: "/dashboard" });
    };
    init();
  }, [identity, actor, router]);
  const isLoading = isInitializing || isLoggingIn;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex items-center justify-center p-4",
      "data-ocid": "login-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-lg p-8 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-7 h-7 text-primary-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground tracking-tight", children: "EduFees" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "School Fee Management System" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-secondary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Sign in securely with Internet Identity — no passwords required. Your identity is cryptographically verified and never shared." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full h-11 font-medium",
                onClick: login,
                disabled: isLoading,
                "data-ocid": "login-btn",
                children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                  isInitializing ? "Initializing…" : "Connecting…"
                ] }) : "Sign in with Internet Identity"
              }
            ),
            loginStatus === "loginError" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive text-center", children: "Login failed. Please try again." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            ". Built with love using",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "underline underline-offset-2 hover:text-foreground transition-colors",
                children: "caffeine.ai"
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
export {
  LoginPage as default
};
