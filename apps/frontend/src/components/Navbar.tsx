import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "./common/UserAvatar";
import { MinoLogo } from "./common/MinoLogo";
import {
  Layout,
  ChevronDown,
  Plus,
  Users,
  LogOut,
  Building2,
  Sparkles,
} from "lucide-react";
import type { Membership } from "@/lib/api";

interface NavbarProps {
  currentOrgId?: string;
  organizations?: Membership[];
  onSelectOrg?: (orgId: string) => void;
  onOpenCreateOrg?: () => void;
  onOpenInviteModal?: () => void;
  onOpenMembersModal?: () => void;
}

export function Navbar({
  currentOrgId,
  organizations = [],
  onSelectOrg,
  onOpenCreateOrg,
  onOpenInviteModal,
  onOpenMembersModal,
}: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const currentMembership = organizations.find((m) => m.org?.id === currentOrgId);
  const currentOrg = currentMembership?.org;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0b0f19]/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Org Switcher */}
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 font-bold tracking-tight text-white hover:opacity-90 transition"
          >
            <MinoLogo size={26} />
            <span className="text-lg font-bold tracking-tight text-white">
              Mino
            </span>
          </Link>

          {/* Org Selector Dropdown */}
          {organizations.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-white/[0.08] transition"
              >
                <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                <span className="max-w-[140px] truncate">
                  {currentOrg?.name || "Select Workspace"}
                </span>
                {currentMembership?.role === "admin" && (
                  <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                    Admin
                  </span>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {orgDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 rounded-xl border border-white/[0.08] bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-fade-in"
                  onClick={() => setOrgDropdownOpen(false)}
                >
                  <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Your Workspaces
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-0.5">
                    {organizations.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          if (m.org?.id && onSelectOrg) {
                            onSelectOrg(m.org.id);
                          }
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition ${
                          m.org?.id === currentOrgId
                            ? "bg-indigo-600 text-white font-medium"
                            : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <span className="truncate">{m.org?.name}</span>
                        <span className="text-[10px] uppercase opacity-75">{m.role}</span>
                      </button>
                    ))}
                  </div>

                  {onOpenCreateOrg && (
                    <div className="border-t border-white/[0.08] mt-1.5 pt-1.5">
                      <button
                        type="button"
                        onClick={onOpenCreateOrg}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-indigo-400 hover:bg-indigo-500/10 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Create Workspace</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions & User Profile */}
        <div className="flex items-center gap-3">
          {currentOrgId && (
            <>
              {onOpenMembersModal && (
                <button
                  type="button"
                  onClick={onOpenMembersModal}
                  className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] transition"
                >
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span>Members</span>
                </button>
              )}

              {onOpenInviteModal && currentMembership?.role === "admin" && (
                <button
                  type="button"
                  onClick={onOpenInviteModal}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Invite</span>
                </button>
              )}
            </>
          )}

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-indigo-500/40 transition"
            >
              <UserAvatar email={user?.email} id={user?.id} size="sm" showTooltip={false} />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border border-white/[0.08] bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-fade-in"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-white/[0.08]">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                </div>

                <div className="mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
