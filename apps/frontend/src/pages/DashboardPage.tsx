import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { CreateOrgModal } from "@/components/modals/CreateOrgModal";
import { CreateBoardModal } from "@/components/modals/CreateBoardModal";
import { InviteMemberModal } from "@/components/modals/InviteMemberModal";
import { MembersModal } from "@/components/modals/MembersModal";
import {
  orgApi,
  boardApi,
  type Membership,
  type Board,
} from "@/lib/api";
import {
  KanbanSquare,
  Plus,
  Trash2,
  Users,
  Building2,
  ArrowRight,
  FolderPlus,
  Sparkles,
  LayoutGrid,
  Settings,
} from "lucide-react";

const BOARD_GRADIENTS = [
  "from-blue-600 via-indigo-600 to-violet-700",
  "from-emerald-600 via-teal-600 to-cyan-700",
  "from-purple-600 via-pink-600 to-rose-700",
  "from-amber-600 via-orange-600 to-red-700",
  "from-fuchsia-600 via-violet-600 to-indigo-800",
];

export function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState<Membership[]>([]);
  const [currentOrgId, setCurrentOrgId] = useState<string>("");
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  const fetchOrganizations = async () => {
    try {
      const orgs = await orgApi.getOrganizations();
      setOrganizations(orgs);
      if (orgs.length > 0) {
        // Keep current org if still valid, else select first
        const selectedId =
          currentOrgId && orgs.some((m) => m.org?.id === currentOrgId)
            ? currentOrgId
            : orgs[0].org?.id || "";
        setCurrentOrgId(selectedId);
      } else {
        navigate("/create-org");
      }
    } catch (err) {
      console.error("Failed to load organizations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBoards = async (orgId: string) => {
    if (!orgId) {
      setBoards([]);
      return;
    }
    try {
      const data = await boardApi.getBoards(orgId);
      setBoards(data);
    } catch (err) {
      console.error("Failed to load boards:", err);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrganizations();
    }
  }, [user]);

  useEffect(() => {
    if (currentOrgId) {
      fetchBoards(currentOrgId);
    }
  }, [currentOrgId]);

  const currentMembership = organizations.find((m) => m.org?.id === currentOrgId);
  const isAdmin = currentMembership?.role === "admin";

  const handleDeleteBoard = async (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this board?")) return;

    try {
      await boardApi.deleteBoard(boardId);
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete board");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar
        currentOrgId={currentOrgId}
        organizations={organizations}
        onSelectOrg={(id) => setCurrentOrgId(id)}
        onOpenCreateOrg={() => setIsCreateOrgOpen(true)}
        onOpenInviteModal={() => setIsInviteOpen(true)}
        onOpenMembersModal={() => setIsMembersOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {organizations.length === 0 ? (
          /* Empty State: Prompt to create first Workspace */
          <div className="max-w-md mx-auto my-16 text-center animate-fade-in">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
              <FolderPlus className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Create Your First Workspace</h2>
            <p className="text-sm text-slate-400 mb-6">
              Workspaces bring your team, boards, and tasks together. Start by creating a workspace or
              redeem an invite code.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOrgOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Create Workspace</span>
              </button>
              <button
                type="button"
                onClick={() => setIsInviteOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.08] transition"
              >
                <span>Redeem Invite Code</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Workspace Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl font-bold text-white">
                      {currentMembership?.org?.name || "Workspace"}
                    </h1>
                    {isAdmin && (
                      <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                    {currentMembership?.org?.description || "Collaborative workspace for your team."}
                  </p>
                </div>
              </div>

              {/* Workspace Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => navigate(`/settings?orgId=${currentOrgId}`)}
                  className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.08] transition"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsMembersOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.08] transition"
                >
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span>Team Members</span>
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Invite</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsCreateBoardOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create</span>
                </button>
              </div>
            </div>

            {/* Boards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <LayoutGrid className="h-4 w-4 text-indigo-400" />
                  <span>Your Boards ({boards.length})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Board Cards */}
                {boards.map((board, idx) => {
                  const gradient = BOARD_GRADIENTS[idx % BOARD_GRADIENTS.length];
                  return (
                    <div
                      key={board.id}
                      onClick={() => navigate(`/board/${board.id}`)}
                      className="group relative flex flex-col justify-between h-36 rounded-2xl p-4 border border-white/[0.08] bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                    >
                      {/* Top Gradient Ribbon */}
                      <div
                        className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${gradient}`}
                      />

                      <div className="flex items-start justify-between gap-2 mt-1">
                        <div className="flex items-center gap-2">
                          <KanbanSquare className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                          <h3 className="font-semibold text-white group-hover:text-indigo-200 transition line-clamp-2 text-sm">
                            {board.title}
                          </h3>
                        </div>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteBoard(e, board.id)}
                            className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                            title="Delete board"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.04]">
                        <span className="text-[11px]">Click to open</span>
                        <div className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-1 transition">
                          <span>View</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Create Board Prompt Card */}
                <button
                  type="button"
                  onClick={() => setIsCreateBoardOpen(true)}
                  className="flex flex-col items-center justify-center h-36 rounded-2xl border-2 border-dashed border-white/[0.1] bg-white/[0.01] hover:bg-white/[0.03] hover:border-indigo-500/40 p-4 transition group text-slate-400 hover:text-white"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] group-hover:bg-indigo-500/10 group-hover:text-indigo-400 mb-2 transition">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold">Create new board</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateOrgModal
        isOpen={isCreateOrgOpen}
        onClose={() => setIsCreateOrgOpen(false)}
        onSuccess={(newId) => {
          fetchOrganizations();
          setCurrentOrgId(newId);
        }}
      />

      <CreateBoardModal
        isOpen={isCreateBoardOpen}
        orgId={currentOrgId}
        onClose={() => setIsCreateBoardOpen(false)}
        onSuccess={() => {
          if (currentOrgId) fetchBoards(currentOrgId);
        }}
      />

      <InviteMemberModal
        isOpen={isInviteOpen}
        orgId={currentOrgId}
        onClose={() => setIsInviteOpen(false)}
        onSuccess={() => {
          fetchOrganizations();
        }}
      />

      <MembersModal
        isOpen={isMembersOpen}
        orgId={currentOrgId}
        isAdmin={isAdmin}
        currentUserId={user?.id}
        onClose={() => setIsMembersOpen(false)}
      />
    </div>
  );
}
