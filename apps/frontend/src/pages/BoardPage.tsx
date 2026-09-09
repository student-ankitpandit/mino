import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useBoardSocket } from "@/hooks/useBoardSocket";
import { KanbanColumn } from "@/components/board/KanbanColumn";
import { CardDetailModal } from "@/components/board/CardDetailModal";
import { InviteMemberModal } from "@/components/modals/InviteMemberModal";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  boardApi,
  sectionApi,
  issueApi,
  type Board,
  type Section,
  type Issue,
} from "@/lib/api";
import {
  ArrowLeft,
  Plus,
  X,
  Radio,
  Edit2,
  Check,
  KanbanSquare,
  Sparkles,
  Users,
  Wifi,
  WifiOff,
  Settings,
} from "lucide-react";

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [board, setBoard] = useState<Board | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  // Board title editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");

  // Add Column composer state
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isSubmittingColumn, setIsSubmittingColumn] = useState(false);

  // Card Detail Modal state
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Invite modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Fetch complete board data
  const fetchBoardData = useCallback(async () => {
    if (!boardId) return;
    try {
      const data = await boardApi.getBoard(boardId);
      setBoard(data);
      setBoardTitle(data.title);

      const secList = data.section || [];
      setSections(secList);

      // Collect all issues from sections or directly
      const allIssues: Issue[] = [];
      secList.forEach((s) => {
        if (s.issues) {
          allIssues.push(...s.issues);
        }
      });
      setIssues(allIssues);
    } catch (err) {
      console.error("Failed to load board data:", err);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (boardId) {
      fetchBoardData();
    }
  }, [boardId, fetchBoardData]);

  // Real-time WebSocket hook
  const { connected, activeUserIds, sendIssueMoved, sendBoardChanged } = useBoardSocket({
    boardId,
    token,
    onIssueMoved: (movedIssueId, newSectionId) => {
      setIssues((prev) =>
        prev.map((item) =>
          item.id === movedIssueId ? { ...item, sectionId: newSectionId } : item
        )
      );
      if (selectedIssue && selectedIssue.id === movedIssueId) {
        setSelectedIssue((prev) => (prev ? { ...prev, sectionId: newSectionId } : null));
      }
    },
    onBoardChanged: () => {
      fetchBoardData();
    },
  });

  // Handle board rename
  const handleSaveBoardTitle = async () => {
    if (!board || !boardTitle.trim() || boardTitle === board.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      await boardApi.updateBoard(board.id, boardTitle.trim());
      setBoard((prev) => (prev ? { ...prev, title: boardTitle.trim() } : null));
      setIsEditingTitle(false);
      sendBoardChanged();
    } catch (err) {
      alert("Failed to update board title");
    }
  };

  // Add Column
  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardId || !newColumnTitle.trim()) return;

    setIsSubmittingColumn(true);
    try {
      const created = await sectionApi.createSection(boardId, newColumnTitle.trim());
      setSections((prev) => [...prev, { ...created, issues: [] }]);
      setNewColumnTitle("");
      setIsAddingColumn(false);
      sendBoardChanged();
    } catch (err) {
      alert("Failed to create column");
    } finally {
      setIsSubmittingColumn(false);
    }
  };

  // Delete Section
  const handleSectionDeleted = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setIssues((prev) => prev.filter((i) => i.sectionId !== sectionId));
    sendBoardChanged();
  };

  // Rename Section
  const handleSectionRenamed = (sectionId: string, newTitle: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s))
    );
    sendBoardChanged();
  };

  // Drag & drop card move
  const handleCardDrop = async (issueId: string, targetSectionId: string) => {
    const current = issues.find((i) => i.id === issueId);
    if (!current || current.sectionId === targetSectionId) return;

    // Optimistic update
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, sectionId: targetSectionId } : i))
    );

    try {
      await issueApi.moveIssue(issueId, targetSectionId);
      sendIssueMoved(issueId, targetSectionId);
    } catch (err) {
      console.error("Failed to move issue:", err);
      // Rollback
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, sectionId: current.sectionId } : i))
      );
    }
  };

  const handleCardDragStart = (e: React.DragEvent, issueId: string) => {
    e.dataTransfer.setData("text/plain", issueId);
  };

  const handleOpenCard = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsCardModalOpen(true);
  };

  const handleIssueCreated = (newIssue: Issue) => {
    setIssues((prev) => [...prev, newIssue]);
    sendBoardChanged();
  };

  const handleIssueUpdated = (updatedPartial: Partial<Issue>) => {
    if (!selectedIssue) return;
    const updated = { ...selectedIssue, ...updatedPartial };
    setSelectedIssue(updated);
    setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    sendBoardChanged();
  };

  const [issueToDelete, setIssueToDelete] = useState<string | null>(null);
  const [isDeletingIssue, setIsDeletingIssue] = useState(false);

  const handleIssueDeleted = (issueId: string) => {
    setIssueToDelete(issueId);
  };

  const handleConfirmDeleteIssue = async () => {
    if (!issueToDelete) return;
    setIsDeletingIssue(true);
    try {
      await issueApi.deleteIssue(issueToDelete);
      setIssues((prev) => prev.filter((i) => i.id !== issueToDelete));
      setIsCardModalOpen(false);
      setSelectedIssue(null);
      setIssueToDelete(null);
      sendBoardChanged();
    } catch (err) {
      console.error("Failed to delete issue", err);
    } finally {
      setIsDeletingIssue(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium">Loading board canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col h-screen overflow-hidden">
      {/* Top Board Header Bar */}
      <header className="h-14 border-b border-white/[0.08] bg-slate-950/80 px-4 sm:px-6 flex items-center justify-between backdrop-blur-md flex-shrink-0 z-30">
        {/* Left: Back button & Board Title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-4 w-px bg-white/[0.08] hidden sm:block" />

          {isEditingTitle ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                onBlur={handleSaveBoardTitle}
                onKeyDown={(e) => e.key === "Enter" && handleSaveBoardTitle()}
                autoFocus
                className="rounded-lg border border-indigo-500 bg-white/[0.04] px-2.5 py-1 text-base font-bold text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveBoardTitle}
                className="rounded p-1 text-white hover:bg-indigo-600"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <h1 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition flex items-center gap-2">
                <span>{board?.title}</span>
                <span className="text-xs font-normal text-slate-500 hidden md:inline">
                  in {board?.org?.name || "Workspace"}
                </span>
              </h1>
              <Edit2 className="h-3.5 w-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition" />
            </div>
          )}
        </div>

        {/* Right: Live Active Users & Shortcuts */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Who is on this board indicator */}
          <div
            title="Who is on this board (Real-time active users)"
            className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                connected
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
                  : "bg-amber-400"
              }`}
            />
            <span className="text-slate-400 text-[11px] font-medium hidden md:inline">
              who is on this board:
            </span>

            {/* Active Users Avatar Group */}
            <div className="flex -space-x-1.5 items-center pl-1 border-l border-white/[0.08]">
              {/* Current user */}
              <UserAvatar
                email={user?.email}
                id={user?.id}
                name={user?.name}
                profilePicture={user?.profilePicture}
                size="sm"
                showTooltip
              />
              {/* Other active socket users */}
              {activeUserIds.map((uid) => (
                <UserAvatar key={uid} id={uid} size="sm" showTooltip />
              ))}
            </div>
            <span className="text-[11px] text-indigo-300 font-semibold ml-1">
              {activeUserIds.length + 1}
            </span>
          </div>

          {/* Settings shortcut */}
          {board?.orgId && (
            <button
              type="button"
              onClick={() => navigate(`/settings?orgId=${board.orgId}`)}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] transition"
            >
              <Settings className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          )}

          {/* Quick Invite Button */}
          {board?.orgId && (
            <button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add member</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Kanban Horizontal Canvas */}
      <main className="flex-1 overflow-x-auto p-4 sm:p-6 flex items-start gap-4">
        {/* Render Columns */}
        {sections.map((section) => {
          const columnIssues = issues.filter((i) => i.sectionId === section.id);
          return (
            <KanbanColumn
              key={section.id}
              section={section}
              issues={columnIssues}
              onCardClick={handleOpenCard}
              onCardDrop={handleCardDrop}
              onCardDragStart={handleCardDragStart}
              onSectionDeleted={handleSectionDeleted}
              onSectionRenamed={handleSectionRenamed}
              onIssueCreated={handleIssueCreated}
            />
          );
        })}

        {/* Add Another List Column Placeholder */}
        <div className="w-72 sm:w-80 flex-shrink-0">
          {isAddingColumn ? (
            <div className="rounded-2xl border border-indigo-500/50 bg-slate-900 p-3 shadow-xl animate-fade-in">
              <form onSubmit={handleAddColumn} className="space-y-2">
                <input
                  type="text"
                  required
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Column title (e.g. In Review)..."
                  autoFocus
                  className="w-full rounded-xl border border-white/[0.1] bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isSubmittingColumn || !newColumnTitle.trim()}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
                  >
                    {sections.length === 0 ? "Add list" : "Add Column"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumnTitle("");
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingColumn(true)}
              className="flex w-full items-center gap-2 rounded-2xl border-2 border-dashed border-white/[0.1] bg-white/[0.01] hover:bg-white/[0.04] hover:border-indigo-500/40 p-3.5 text-xs font-semibold text-slate-400 hover:text-white transition group"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.04] group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition">
                <Plus className="h-4 w-4" />
              </div>
              <span>{sections.length === 0 ? "Add list" : "Add another list"}</span>
            </button>
          )}
        </div>
      </main>

      {/* Card Detail Modal */}
      <CardDetailModal
        isOpen={isCardModalOpen}
        issue={selectedIssue}
        sections={sections}
        currentUserId={user?.id}
        onClose={() => {
          setIsCardModalOpen(false);
          setSelectedIssue(null);
        }}
        onUpdate={handleIssueUpdated}
        onDelete={handleIssueDeleted}
        onMove={(issueId, targetSectionId) => {
          handleCardDrop(issueId, targetSectionId);
          if (selectedIssue) {
            setSelectedIssue({ ...selectedIssue, sectionId: targetSectionId });
          }
        }}
      />

      {/* Invite Modal */}
      {board?.orgId && (
        <InviteMemberModal
          isOpen={isInviteOpen}
          orgId={board.orgId}
          onClose={() => setIsInviteOpen(false)}
        />
      )}

      {/* Delete Issue Confirmation Dialog */}
      <ConfirmModal
        isOpen={Boolean(issueToDelete)}
        title="Delete card?"
        message="Are you sure you want to permanently delete this card? This action cannot be undone."
        confirmText="Delete card"
        cancelText="Keep card"
        variant="danger"
        loading={isDeletingIssue}
        onConfirm={handleConfirmDeleteIssue}
        onClose={() => !isDeletingIssue && setIssueToDelete(null)}
      />
    </div>
  );
}
