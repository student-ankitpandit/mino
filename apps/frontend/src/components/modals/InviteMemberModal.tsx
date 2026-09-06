import React, { useState } from "react";
import { orgApi } from "@/lib/api";
import { X, UserPlus, Check, Copy, AlertCircle } from "lucide-react";

interface InviteMemberModalProps {
  isOpen: boolean;
  orgId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InviteMemberModal({
  isOpen,
  orgId,
  onClose,
  onSuccess,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitedCode, setInvitedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Also support accepting an invite code directly
  const [acceptTab, setAcceptTab] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [acceptSuccess, setAcceptSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;

    setError(null);
    setLoading(true);
    try {
      const res = await orgApi.inviteMember(orgId, email);
      if (res.success) {
        setInvitedCode(res.invitationId);
        setEmail("");
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || "Failed to send invitation");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !inviteCodeInput) return;

    setError(null);
    setLoading(true);
    try {
      const res = await orgApi.acceptInvite(inviteCodeInput.trim(), orgId);
      if (res.success) {
        setAcceptSuccess("Successfully joined the workspace!");
        setInviteCodeInput("");
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || "Failed to accept invite");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to accept invite");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (invitedCode) {
      navigator.clipboard.writeText(invitedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <UserPlus className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-white">
              {acceptTab ? "Join with Invitation Code" : "Invite to Workspace"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/[0.08] hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-white/[0.04] p-1 mt-4 border border-white/[0.06]">
          <button
            type="button"
            onClick={() => {
              setAcceptTab(false);
              setError(null);
            }}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
              !acceptTab ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Send Invite
          </button>
          <button
            type="button"
            onClick={() => {
              setAcceptTab(true);
              setError(null);
            }}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
              acceptTab ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Redeem Code
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {acceptSuccess && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="h-4 w-4 flex-shrink-0" />
            <span>{acceptSuccess}</span>
          </div>
        )}

        {!acceptTab ? (
          <form onSubmit={handleSendInvite} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Member Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {invitedCode && (
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs text-slate-200">
                <p className="font-semibold text-indigo-300 mb-1">Invitation Created!</p>
                <p className="text-[11px] text-slate-400 mb-2">
                  Share this invitation code with your team member:
                </p>
                <div className="flex items-center justify-between rounded-lg bg-black/40 px-2.5 py-1.5 font-mono text-[11px]">
                  <span className="truncate mr-2 text-indigo-200">{invitedCode}</span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="flex items-center gap-1 rounded bg-indigo-600 px-2 py-0.5 text-[10px] text-white hover:bg-indigo-500 transition"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/[0.08] px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.06] transition"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAcceptInvite} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Invitation Code
              </label>
              <input
                type="text"
                required
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
                placeholder="Paste invitation code here"
                className="w-full font-mono rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/[0.08] px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.06] transition"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join Workspace"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
