import React, { useState } from "react";
import { KanbanCard } from "./KanbanCard";
import { sectionApi, issueApi, type Section, type Issue } from "@/lib/api";
import { Plus, X, Trash2, Edit2, Check, MoreVertical } from "lucide-react";

interface KanbanColumnProps {
  section: Section;
  issues: Issue[];
  onCardClick: (issue: Issue) => void;
  onCardDrop: (issueId: string, targetSectionId: string) => void;
  onCardDragStart: (e: React.DragEvent, issueId: string) => void;
  onSectionDeleted: (sectionId: string) => void;
  onSectionRenamed: (sectionId: string, newTitle: string) => void;
  onIssueCreated: (newIssue: Issue) => void;
}

export function KanbanColumn({
  section,
  issues,
  onCardClick,
  onCardDrop,
  onCardDragStart,
  onSectionDeleted,
  onSectionRenamed,
  onIssueCreated,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  // Column renaming state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(section.title);

  // Add Card composer state
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDesc, setCardDesc] = useState("");
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);

  const handleSaveTitle = async () => {
    if (!title.trim() || title === section.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      await sectionApi.updateSection(section.id, title);
      onSectionRenamed(section.id, title);
      setIsEditingTitle(false);
    } catch (err) {
      alert("Failed to update section title");
    }
  };

  const handleDeleteSection = async () => {
    if (!confirm(`Delete section "${section.title}" and all its issues?`)) return;

    try {
      await sectionApi.deleteSection(section.id);
      onSectionDeleted(section.id);
    } catch (err) {
      alert("Failed to delete section");
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTitle.trim()) return;

    setIsSubmittingCard(true);
    try {
      const newIssue = await issueApi.createIssue(section.id, cardTitle.trim(), cardDesc.trim());
      onIssueCreated(newIssue);
      setCardTitle("");
      setCardDesc("");
      setIsAddingCard(false);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to create card");
    } finally {
      setIsSubmittingCard(false);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const issueId = e.dataTransfer.getData("text/plain");
        if (issueId) {
          onCardDrop(issueId, section.id);
        }
      }}
      className={`flex flex-col w-72 sm:w-80 flex-shrink-0 rounded-2xl border bg-slate-950/60 p-3 backdrop-blur-md transition-all duration-150 max-h-[calc(100vh-140px)] ${
        isDragOver
          ? "border-indigo-500/80 bg-indigo-950/20 ring-2 ring-indigo-500/20"
          : "border-white/[0.08]"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        {isEditingTitle ? (
          <div className="flex items-center gap-1.5 flex-1 mr-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
              autoFocus
              className="w-full rounded-lg border border-indigo-500 bg-white/[0.04] px-2.5 py-1 text-sm font-semibold text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveTitle}
              className="rounded p-1 text-white hover:bg-indigo-600"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center gap-2 cursor-pointer group flex-1 mr-2"
          >
            <h3 className="font-bold text-sm text-slate-200 group-hover:text-indigo-300 transition truncate">
              {section.title}
            </h3>
            <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[11px] font-semibold text-slate-400">
              {issues.length}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleDeleteSection}
          className="rounded-lg p-1 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition"
          title="Delete column"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Cards List Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1 min-h-[50px]">
        {issues.map((issue) => (
          <KanbanCard
            key={issue.id}
            issue={issue}
            onClick={() => onCardClick(issue)}
            onDragStart={onCardDragStart}
          />
        ))}

        {issues.length === 0 && !isAddingCard && (
          <div className="flex items-center justify-center h-20 rounded-xl border border-dashed border-white/[0.06] text-xs text-slate-500 select-none">
            Drop cards here
          </div>
        )}
      </div>

      {/* Column Footer: In-place "Add a card" composer */}
      <div className="mt-3 pt-2 border-t border-white/[0.04]">
        {isAddingCard ? (
          <form onSubmit={handleCreateCard} className="space-y-2 animate-fade-in">
            <input
              type="text"
              required
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              placeholder="Card title..."
              autoFocus
              className="w-full rounded-xl border border-white/[0.1] bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <textarea
              rows={2}
              value={cardDesc}
              onChange={(e) => setCardDesc(e.target.value)}
              placeholder="Description (optional)..."
              className="w-full rounded-xl border border-white/[0.1] bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmittingCard || !cardTitle.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
              >
                <span>Add card</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCard(false);
                  setCardTitle("");
                  setCardDesc("");
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCard(true)}
            className="flex w-full items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add a card</span>
          </button>
        )}
      </div>
    </div>
  );
}
