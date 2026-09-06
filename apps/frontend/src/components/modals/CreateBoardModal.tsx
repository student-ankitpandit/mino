import React, { useState } from "react";
import { boardApi } from "@/lib/api";
import { X, KanbanSquare } from "lucide-react";

interface CreateBoardModalProps {
  isOpen: boolean;
  orgId?: string;
  onClose: () => void;
  onSuccess: (newBoardId: string) => void;
}

export function CreateBoardModal({
  isOpen,
  orgId,
  onClose,
  onSuccess,
}: CreateBoardModalProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) {
      setError("No workspace selected");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await boardApi.createBoard(orgId, title);
      if (res.success && res.data) {
        setTitle("");
        onSuccess(res.data);
        onClose();
      } else {
        setError(res.error || "Failed to create board");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <KanbanSquare className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-white">Create New Board</h2>
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
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Board Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Roadmap, Sprint Backlog"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/[0.08] px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.06] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Board"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
