import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { orgApi, type Membership } from "@/lib/api";
import { UserAvatar } from "@/components/common/UserAvatar";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
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
  Camera,
  Upload,
  User as UserIcon,
  Save,
  CheckCircle2,
  X,
} from "lucide-react";

export function SettingsPage() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orgIdParam = searchParams.get("orgId");

  const [organizations, setOrganizations] = useState<Membership[]>([]);
  const [currentOrgId, setCurrentOrgId] = useState<string>(orgIdParam || "");
  const [members, setMembers] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile editing state
  const [displayName, setDisplayName] = useState("");
  const [previewPicture, setPreviewPicture] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || "");
      setPreviewPicture(user.profilePicture || null);
    }
  }, [user]);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError("Image size should be under 5MB.");
      return;
    }

    setProfileError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress & scale to max 400x400 for crisp avatars and efficient storage
        const canvas = document.createElement("canvas");
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPreviewPicture(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      await updateProfile({
        profilePicture: previewPicture,
        name: displayName.trim() || null,
      });
      setProfileSuccess("Profile updated successfully!");
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err: any) {
      console.error("Profile update failed:", err);
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleRemovePhoto = () => {
    setProfileSuccess(null);
    if (user?.googleId) {
      setProfileError("Can't remove the default picture which is associated with Google.");
      return;
    }
    setProfileError(null);
    setPreviewPicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
      } else {
        setInviteError(res.error || res.message || "Failed to send invite");
      }
    } catch (err: any) {
      setInviteError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to invite member"
      );
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const handleCopyCode = () => {
    if (!inviteSuccessCode) return;
    navigator.clipboard.writeText(inviteSuccessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [isRemovingMember, setIsRemovingMember] = useState(false);

  const handleConfirmRemoveMember = async () => {
    if (!currentOrgId || !memberToRemove) return;
    setIsRemovingMember(true);

    try {
      await orgApi.removeMember(currentOrgId, memberToRemove);
      setMembers((prev) => prev.filter((m) => m.userId !== memberToRemove));
      setMemberToRemove(null);
    } catch (err: any) {
      console.error("Failed to remove member", err);
    } finally {
      setIsRemovingMember(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasUnsavedProfileChanges =
    previewPicture !== (user?.profilePicture || null) ||
    displayName.trim() !== (user?.name || "");

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
            <span className="text-indigo-400">{currentOrg?.name || "Account & Workspace"}</span>
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
        {/* Profile & Avatar Settings Section */}
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <UserIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Your Profile & Avatar</h2>
              <p className="text-xs text-slate-400">
                Manage your profile picture and personal info displayed across boards and comments.
              </p>
            </div>
          </div>

          {profileError && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center justify-between gap-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
              <button
                type="button"
                onClick={() => setProfileError(null)}
                className="text-rose-400 hover:text-white p-1 rounded transition"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {profileSuccess && (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar Preview */}
              <div className="relative group">
                <UserAvatar
                  email={user?.email}
                  name={displayName || user?.name}
                  profilePicture={previewPicture}
                  size="2xl"
                  showTooltip={false}
                  className="ring-4 ring-indigo-500/20 shadow-xl"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition transform hover:scale-105"
                  title="Upload new picture"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Upload & Remove Controls */}
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-medium text-white hover:bg-white/[0.08] hover:border-white/[0.2] transition shadow-sm"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload new image</span>
                  </button>
                  {previewPicture && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove photo</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Recommended: Square JPG, PNG, or WebP. Images are optimized automatically.
                </p>

                {user?.googleId && (
                  <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Connected with Google Account</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingProfile || !hasUnsavedProfileChanges}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-40 disabled:hover:bg-indigo-600 shadow-lg shadow-indigo-600/20"
              >
                {isSavingProfile ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

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
              placeholder="e.g. teammate@company.com"
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
                    <UserAvatar
                      email={m.user?.email}
                      id={m.userId}
                      name={m.user?.name}
                      profilePicture={m.user?.profilePicture}
                      size="md"
                    />
                    <div>
                      <p className="text-sm font-medium text-white flex items-center gap-2">
                        <span>{m.user?.name || m.user?.email || "Member"}</span>
                        {m.user?.name && (
                          <span className="text-xs text-slate-400 font-normal">
                            ({m.user?.email})
                          </span>
                        )}
                        {isSelf && (
                          <span className="text-[10px] text-indigo-400 font-medium px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                            You
                          </span>
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
                      onClick={() => setMemberToRemove(m.userId)}
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

      <ConfirmModal
        isOpen={Boolean(memberToRemove)}
        title="Remove team member?"
        message="Are you sure you want to remove this member from the organization? They will immediately lose access to all workspaces and boards."
        confirmText="Remove member"
        cancelText="Cancel"
        variant="danger"
        loading={isRemovingMember}
        onConfirm={handleConfirmRemoveMember}
        onClose={() => !isRemovingMember && setMemberToRemove(null)}
      />
    </div>
  );
}
