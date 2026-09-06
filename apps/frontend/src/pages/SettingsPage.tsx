import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { orgApi, type Membership } from "@/lib/api";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  ArrowLeft,
  UserPlus,
  Trash2,
  Shield,
  Check,
  Copy,
  AlertCircle,
  Building2,
  Sparkles,
} from "lucide-react";

export function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orgIdParam = searchParams.get("orgId");

  const [organizations, setOrganizations] = useState<Membership[]>([]);
  const [currentOrgId, setCurrentOrgId] = useState<string>(orgIdParam || "");
  const [members, setMembers] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  // Add member form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [inviteSuccessCode, setInviteSuccessCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const loadOrganizations = async () => {
    try {
      const orgs = await orgApi.getOrganizations();
      setOrganizations(orgs);
      if (orgs.length > 0) {
        const activeId =
          currentOrgId && orgs.some((m) => m.org?.id === currentOrgId)
            ? currentOrgId
            : orgs[0].org?.id || "";
        setCurrentOrgId(activeId);
      } else {
        navigate("/create-org");
      }
    } catch (err) {
      console.error("Failed to load orgs:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async (orgId: string) => {
    if (!orgId) return;
    try {
      const data = await orgApi.getMembers(orgId);
      setMembers(data);
    } catch (err) {
      console.error("Failed to load members:", err);
    }
  };

  useEffect(() => {
    if (user) {
      loadOrganizations();
    }
  }, [user]);

  useEffect(() => {
    if (currentOrgId) {
      loadMembers(currentOrgId);
    }
  }, [currentOrgId]);

  const currentMembership = organizations.find((m) => m.org?.id === currentOrgId);
  const currentOrg = currentMembership?.org;
  const isAdmin = currentMembership?.role === "admin";

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId || !inviteEmail.trim()) return;

    setIsSubmittingInvite(true);
    setInviteError(null);
    setInviteSuccessCode(null);

    try {
      const res = await orgApi.inviteMember(currentOrgId, inviteEmail.trim());
      if (res.success) {
        setInviteSuccessCode(res.invitationId);
        setInviteEmail("");
        loadMembers(currentOrgId);
      } else {
        setInviteError(res.error || "Failed to add member");
      }
    } catch (err: any) {
      setInviteError(err.response?.data?.error || err.message || "Failed to add member");
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!currentOrgId) return;
    if (!confirm("Are you sure you want to remove this member from the organization?")) return;

    try {
      await orgApi.removeMember(currentOrgId, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to remove member");
    }
  };

  const handleCopyCode = () => {
    if (inviteSuccessCode) {
      navigator.clipboard.writeText(inviteSuccessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-white/[0.08] bg-slate-950/80 px-4 sm:px-6 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </button>
          <div className="h-4 w-px bg-white/[0.08]" />
          <h1 className="text-base font-bold text-white flex items-center gap-2">
            <span>Settings:</span>
            <span className="text-indigo-400">{currentOrg?.name || "Workspace"}</span>
          </h1>
        </div>

        {/* Org Switcher if user has multiple orgs */}
        {organizations.length > 1 && (
          <select
            value={currentOrgId}
            onChange={(e) => setCurrentOrgId(e.target.value)}
            className="rounded-lg border border-white/[0.08] bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            {organizations.map((m) => (
              <option key={m.id} value={m.org?.id}>
                {m.org?.name}
              </option>
            ))}
          </select>
        )}
      </header>

      {/* Main Settings Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
        {/* Settings Box: Add member */}
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Member</h2>
              <p className="text-xs text-slate-400">
                Invite a new team member by email to {currentOrg?.name}
              </p>
            </div>
          </div>

          {inviteError && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{inviteError}</span>
            </div>
          )}

          {inviteSuccessCode && (
            <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-xs">
              <p className="font-semibold text-indigo-300 mb-1">Invitation created!</p>
              <p className="text-slate-400 mb-2">
                Share this invitation code with your colleague to join immediately:
              </p>
              <div className="flex items-center justify-between rounded-lg bg-black/40 px-3 py-2 font-mono">
                <span className="truncate mr-2 text-indigo-200">{inviteSuccessCode}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 rounded bg-indigo-600 px-2.5 py-1 text-[11px] text-white hover:bg-indigo-500 transition"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copied" : "Copy Code"}</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleAddMember} className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="e.g. harkirat@gmail.com"
              className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={isSubmittingInvite || !inviteEmail.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50 flex-shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSubmittingInvite ? "Adding..." : "Add member"}</span>
            </button>
          </form>
        </div>

        {/* Members List */}
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-base font-bold text-white">Current Members</h2>
              <p className="text-xs text-slate-400">{members.length} team members</p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-white/[0.04]">
            {members.map((m) => {
              const isSelf = m.userId === user?.id;
              return (
                <div key={m.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar email={m.user?.email} id={m.userId} size="md" />
                    <div>
                      <p className="text-sm font-medium text-white flex items-center gap-2">
                        <span>{m.user?.email || "Member"}</span>
                        {isSelf && (
                          <span className="text-[10px] text-slate-400 font-normal">(You)</span>
                        )}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 capitalize">
                        {m.role === "admin" ? (
                          <>
                            <Shield className="h-3 w-3 text-amber-400" />
                            <span className="text-amber-300 font-medium">Admin</span>
                          </>
                        ) : (
                          "Member"
                        )}
                      </span>
                    </div>
                  </div>

                  {isAdmin && !isSelf && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.userId)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
