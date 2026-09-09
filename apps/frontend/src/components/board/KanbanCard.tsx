import React from "react";
import { type Issue } from "@/lib/api";
import { UserAvatar } from "../common/UserAvatar";
import { MessageSquare, AlignLeft, GripVertical } from "lucide-react";

interface KanbanCardProps {
  issue: Issue;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, issueId: string) => void;
}

export function KanbanCard({ issue, onClick, onDragStart }: KanbanCardProps) {
  const commentCount = issue.comments?.length || 0;
  const hasDesc = Boolean(issue.description && issue.description.trim().length > 0);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, issue.id)}
      onClick={onClick}
      className="group relative rounded-xl border border-white/[0.08] bg-slate-900/90 p-3 shadow-sm hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <GripVertical className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-400 mt-0.5 flex-shrink-0 transition" />
          <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-200 transition leading-snug break-words flex-1 min-w-0">
            {issue.title}
          </h4>
        </div>
      </div>

      {/* Snippet / Indicators */}
      <div className="flex items-center justify-between mt-3 text-xs text-slate-400 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          {hasDesc && (
            <span title="This card has a description" className="flex items-center text-slate-500">
              <AlignLeft className="h-3.5 w-3.5" />
            </span>
          )}

          {commentCount > 0 && (
            <span
              title={`${commentCount} comments`}
              className="flex items-center gap-1 text-[11px] text-slate-400 font-medium"
            >
              <MessageSquare className="h-3 w-3 text-slate-500" />
              <span>{commentCount}</span>
            </span>
          )}
        </div>

        {/* Assignee Avatars */}
        {issue.issueMappings && issue.issueMappings.length > 0 && (
          <div className="flex -space-x-1.5 items-center">
            {issue.issueMappings.slice(0, 3).map((m) => (
              <UserAvatar
                key={m.id}
                email={m.user?.email}
                id={m.userId}
                name={m.user?.name}
                profilePicture={m.user?.profilePicture}
                size="sm"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
