import { u as useInternetIdentity, a as useRouter, r as reactExports, j as jsxRuntimeExports } from "./index-Bb6f_FCk.js";
import { c as createLucideIcon, u as useActor, G as GraduationCap, B as Button, a as createActor } from "./backend-CvGl-pMz.js";
import { C as CircleAlert } from "./circle-alert-Cp9yoInL.js";
import { L as LoaderCircle } from "./loader-circle-D_lEcbKH.js";
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
const features = [
  { icon: "📊", label: "Fee structure builder with late penalties" },
  { icon: "👥", label: "Student roster with bulk CSV import" },
  { icon: "💳", label: "Payment recording and receipt tracking" },
  { icon: "📈", label: "Collections dashboard with trends" }
];
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
  const hasError = loginStatus === "loginError";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex overflow-hidden", "data-ocid": "login-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex lg:w-1/2 relative bg-primary flex-col justify-between p-12 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            className: "absolute -bottom-16 -left-16 w-[480px] h-[480px] opacity-10",
            viewBox: "0 0 480 480",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "240", cy: "240", r: "220", stroke: "white", strokeWidth: "2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "240", cy: "240", r: "160", stroke: "white", strokeWidth: "2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "240", cy: "240", r: "100", stroke: "white", strokeWidth: "2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "240", cy: "240", r: "40", stroke: "white", strokeWidth: "2" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            className: "absolute -top-12 -right-12 w-[320px] h-[320px] opacity-[0.07]",
            viewBox: "0 0 320 320",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            "aria-hidden": "true",
            children: [40, 80, 120, 160].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "polygon",
              {
                points: `160,${160 - r} ${160 + r * 0.866},${160 + r * 0.5} ${160 - r * 0.866},${160 + r * 0.5}`,
                stroke: "white",
                strokeWidth: "1.5",
                fill: "none"
              },
              r
            ))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-5 h-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-display font-bold text-primary-foreground tracking-tight", children: "EduFees" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl font-display font-bold text-primary-foreground leading-snug", children: [
            "Fee management for",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "modern schools"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-primary-foreground/70 text-base leading-relaxed max-w-xs", children: "Streamline fee collection, track payments, and generate reports — all in one place." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: features.map(({ icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg leading-none", children: icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-primary-foreground/80", children: label })
        ] }, label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4 text-primary-foreground/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary-foreground/60", children: "Secured with Internet Identity — no passwords required" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:hidden flex items-center gap-2 px-6 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-4 h-4 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-display font-bold text-foreground", children: "EduFees" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-6 sm:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-institutional p-8 space-y-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground tracking-tight", children: "Sign in" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Access the EduFees admin dashboard" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 p-3 rounded-lg bg-secondary border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Your identity is cryptographically verified using Internet Identity — no username or password needed." })
          ] }),
          hasError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-2.5 p-3 rounded-lg bg-destructive/8 border border-destructive/20",
              role: "alert",
              "data-ocid": "login-error",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive leading-relaxed", children: "Authentication failed. Please try again or ensure your Internet Identity anchor is active." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full h-11 font-semibold text-sm",
                onClick: login,
                disabled: isLoading,
                "data-ocid": "login-btn",
                children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                  isInitializing ? "Initializing…" : "Connecting…"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4 mr-2" }),
                  "Sign in with Internet Identity"
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
              "Don't have access?",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "https://caffeine.ai/support",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-primary underline underline-offset-2 hover:text-primary/80 transition-colors",
                  children: "Contact your administrator"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Privacy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Terms" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://caffeine.ai/support",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "hover:text-foreground transition-colors",
                children: "Support"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground mt-6", children: [
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
    ] })
  ] });
}
export {
  LoginPage as default
};
