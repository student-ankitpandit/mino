import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { MinoLogo } from "@/components/common/MinoLogo";
import { authApi } from "@/lib/api";
import { Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isLogin = location.pathname !== "/signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, signup } = useAuth();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "oauth_failed") {
      setError("Google sign-in failed. Please try again or use email/password.");
    } else if (errorParam === "no_email") {
      setError("No email address was provided by Google. Please try again.");
    } else if (errorParam === "no_code") {
      setError("Google authorization cancelled or timed out.");
    } else {
      setError(null);
    }
  }, [location.pathname, searchParams]);

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    window.location.href = authApi.getGoogleAuthUrl();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Auth failed:", err);
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Authentication failed";

      if (err.message === "Network Error" || err.code === "ERR_NETWORK") {
        msg = "Network Error: Could not connect to backend. If the cloud server is waking up from sleep, please try again in a moment.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0b0f19] px-4 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <MinoLogo size={44} className="mb-4 inline-block shadow-lg shadow-blue-500/25" />
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {isLogin ? "Welcome back" : "Get started with Mino"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isLogin
              ? "Sign in to manage your workspaces, boards, and tasks."
              : "Create your free account to start organizing with your team."}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-white/[0.04] p-1 mb-6 border border-white/[0.06]">
            <button
              type="button"
              onClick={() => {
                setError(null);
                navigate("/login");
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                isLogin
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                navigate("/signup");
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                !isLogin
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-fade-in flex items-center gap-2">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-white/[0.08] hover:border-white/[0.2] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition disabled:opacity-50 group"
          >
            {googleLoading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>{isLogin ? "Continue with Google" : "Sign up with Google"}</span>
          </button>

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <span className="relative bg-[#0e1424] px-3 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "••••••••" : "Minimum 8 characters"}
                  minLength={isLogin ? 1 : 8}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
              {!isLogin && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Password must be at least 8 characters long.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? "Sign In" : "Get Started Free"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
