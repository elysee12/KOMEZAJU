import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Administrator Login — KOMEZAJU Organization" },
      {
        name: "description",
        content:
          "Secure administrator sign-in for managing the KOMEZAJU Organization platform.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <aside
        className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between"
        style={{ background: "var(--gradient-sunrise)" }}
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/15 blur-3xl" />

        <Link to="/" className="relative inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>

        <div className="relative max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" /> Administrator Area
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-5xl">
            Manage your KOMEZAJU platform.
          </h1>
          <p className="mt-4 text-base text-white/85">
            Sign in to oversee members, programs, donations and content for the organization.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-sm text-white/80">
          <img src={logo} alt="" className="h-9 w-9 rounded-full bg-white p-1" />
          <span>KOMEZAJU Organization · Bugesera, Rwanda</span>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-6 py-16 md:px-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>

          <div className="flex items-center gap-2.5">
            <img src={logo} alt="KOMEZAJU" className="h-10 w-10" />
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold">KOMEZAJU</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Admin Portal
              </p>
            </div>
          </div>

          <h2 className="mt-8 font-display text-3xl font-semibold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your administrator credentials to continue.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
            className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8"
          >
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@komezaju.org"
                  className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-11 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border-input accent-primary" />
              Keep me signed in
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Sign in
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Protected area · Authorized personnel only
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
