import React, { useState, useEffect } from "react";
import {
  issueApi,
  commentApi,
  type Issue,
  type Section,
  type Comment,
} from "@/lib/api";
import { UserAvatar } from "../common/UserAvatar";
import {
  X,
  AlignLeft,
  MessageSquare,
  Trash2,
  Send,
  Edit2,
  Check,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

interface CardDetailModalProps {
  isOpen: boolean;
  issue: Issue | null;
  sections: Section[];
  currentUserId?: string;
  onClose: () => void;
  onUpdate: (updatedIssue: Partial<Issue>) => void;
  onDelete: (issueId: string) => void;
  onMove: (issueId: string, targetSectionId: string) => void;
}

export function CardDetailModal({
  isOpen,
  issue,
  sections,
  currentUserId,
  onClose,
  onUpdate,
  onDelete,
  onMove,
}: CardDetailModalProps) {
  if (!isOpen || !issue) return null;

  // Title & description editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(issue.title);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(issue.description || "");

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Sync issue props
  useEffect(() => {
    setTitle(issue.title);
    setDescription(issue.description || "");
    fetchComments();
  }, [issue.id]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await commentApi.getComments(issue.id);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSaveTitle = async () => {
    if (!title.trim() || title === issue.title) {
      setIsEditingTitle(false);
      return;
    }
    try {
      await issueApi.updateIssue(issue.id, title, description);
      onUpdate({ title });
      setIsEditingTitle(false);
    } catch (err: any) {
      alert("Failed to update title");
    }
  };

  const handleSaveDescription = async () => {
    try {
      await issueApi.updateIssue(issue.id, title, description);
      onUpdate({ description });
      setIsEditingDesc(false);
    } catch (err: any) {
      alert("Failed to update description");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const newComment = await commentApi.createComment(issue.id, commentText);
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (err: any) {
      alert("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  const currentSection = sections.find((s) => s.id === issue.sectionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-slate-900 p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex-1">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                  autoFocus
                  className="w-full rounded-xl border border-indigo-500 bg-white/[0.04] px-3 py-1.5 text-lg font-bold text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-500"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="group flex items-center gap-2 cursor-pointer"
              >
                <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                  {title}
                </h2>
                <Edit2 className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition" />
              </div>
            )}

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                <span>In column:</span>
                <select
                  value={issue.sectionId}
                  onChange={(e) => onMove(issue.id, e.target.value)}
                  className="rounded-md border border-white/[0.08] bg-slate-800 px-2 py-0.5 text-xs text-indigo-300 focus:outline-none cursor-pointer"
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDelete(issue.id)}
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
              title="Delete issue"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.08] hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6">
          {/* Description Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <AlignLeft className="h-4 w-4 text-indigo-400" />
                <span>Description</span>
              </div>
              {!isEditingDesc && (
                <button
                  type="button"
                  onClick={() => setIsEditingDesc(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingDesc ? (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a more detailed description..."
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-y"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDescription}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDescription(issue.description || "");
                      setIsEditingDesc(false);
                    }}
                    className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-slate-300 hover:bg-white/[0.06] transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingDesc(true)}
                className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 text-sm text-slate-300 min-h-[80px] hover:bg-white/[0.04] transition cursor-pointer whitespace-pre-wrap"
              >
                {description || (
                  <span className="text-slate-500 italic">
                    No description provided. Click to add details...
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Assignees Pill */}
          {issue.issueMappings && issue.issueMappings.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">Members assigned</p>
              <div className="flex items-center gap-2 flex-wrap">
                {issue.issueMappings.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] pr-2.5 pl-1 py-1 text-xs text-slate-200"
                  >
                    <UserAvatar
                      email={m.user?.email}
                      id={m.userId}
                      name={m.user?.name}
                      profilePicture={m.user?.profilePicture}
                      size="sm"
                    />
                    <span>{m.user?.name || m.user?.email || "Member"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity / Comments Thread */}
          <div className="pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              <span>Activity & Comments ({comments.length})</span>
            </div>

            {/* In-place Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2.5 mb-5">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Post</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {loadingComments ? (
                <div className="text-center py-4 text-xs text-slate-500">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  No comments yet. Start the conversation!
                </div>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <UserAvatar
                        email={c.user?.email}
                        id={c.userId || undefined}
                        name={c.user?.name}
                        profilePicture={c.user?.profilePicture}
                        size="sm"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {c.user?.name || c.user?.email || "Team member"}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-1 whitespace-pre-wrap">{c.comment}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteComment(c.id)}
                      className="rounded p-1 text-slate-500 hover:text-rose-400 transition flex-shrink-0"
                      title="Delete comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
