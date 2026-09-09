import React, { useEffect, useState } from "react";
import { orgApi, type Membership } from "@/lib/api";
import { UserAvatar } from "../common/UserAvatar";
import { ConfirmModal } from "./ConfirmModal";
import { X, Users, Trash2, Shield, AlertCircle } from "lucide-react";

interface MembersModalProps {
  isOpen: boolean;
  orgId?: string;
  isAdmin?: boolean;
  currentUserId?: string;
  onClose: () => void;
}

export function MembersModal({
  isOpen,
  orgId,
  isAdmin = false,
  currentUserId,
  onClose,
}: MembersModalProps) {
  const [members, setMembers] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    if (!orgId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await orgApi.getMembers(orgId);
      setMembers(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen, orgId]);

  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleConfirmRemove = async () => {
    if (!orgId || !memberToRemove) return;
    setIsRemoving(true);

    try {
      await orgApi.removeMember(orgId, memberToRemove);
      setMembers((prev) => prev.filter((m) => m.userId !== memberToRemove));
      setMemberToRemove(null);
    } catch (err: any) {
      console.error("Failed to remove member", err);
    } finally {
      setIsRemoving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Workspace Members</h2>
              <p className="text-xs text-slate-400">{members.length} team members</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/[0.08] hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4 max-h-72 overflow-y-auto space-y-2">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading members...</div>
          ) : members.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No members found</div>
          ) : (
            members.map((m) => {
              const isSelf = m.userId === currentUserId;
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      email={m.user?.email}
                      id={m.userId}
                      name={m.user?.name}
                      profilePicture={m.user?.profilePicture}
                      size="md"
                    />
                    <div>
                      <p className="text-sm font-medium text-white flex items-center gap-2">
                        <span>{m.user?.name || m.user?.email || "Team member"}</span>
                        {isSelf && (
                          <span className="text-[10px] text-indigo-400 font-medium px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                            You
                          </span>
                        )}
                      </p>
                      {m.user?.name && (
                        <p className="text-[11px] text-slate-400">{m.user.email}</p>
                      )}
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
                      onClick={() => setMemberToRemove(m.userId)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-white/[0.08] mt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/[0.08] px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.06] transition"
          >
            Done
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(memberToRemove)}
        title="Remove member?"
        message="Are you sure you want to remove this member from the organization? They will lose access to all its boards."
        confirmText="Remove member"
        cancelText="Cancel"
        variant="danger"
        loading={isRemoving}
        onConfirm={handleConfirmRemove}
        onClose={() => !isRemoving && setMemberToRemove(null)}
      />
    </div>
  );
}
