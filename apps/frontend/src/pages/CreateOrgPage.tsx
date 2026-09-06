import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { orgApi } from "@/lib/api";
import { MinoLogo } from "@/components/common/MinoLogo";
import { ArrowRight, Sparkles } from "lucide-react";

export function CreateOrgPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const res = await orgApi.createOrganization(name.trim(), description.trim() || name.trim());
      if (res.success && res.orgId) {
        navigate("/dashboard");
      } else {
        setError(res.error || "Failed to create organization");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0b0f19] px-4 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <MinoLogo size={44} className="mb-4 inline-block shadow-lg shadow-blue-500/25" />
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Create organization
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Set up your organization to start creating boards and collaborating
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Organization Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Zepto, Acme Corp"
                autoFocus
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Description <span className="text-slate-500">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this organization do?"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Submit</span>
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
