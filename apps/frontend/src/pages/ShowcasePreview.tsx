import React from "react";
import { MinoLogo } from "@/components/common/MinoLogo";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  Building2,
  Settings,
  Users,
  Plus,
  ArrowLeft,
  ArrowRight,
  Wifi,
  Sparkles,
  KanbanSquare,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Clock,
  Tag,
  Shield,
  UserPlus,
} from "lucide-react";

interface WindowWrapperProps {
  title: string;
  children: React.ReactNode;
}

export function WindowWrapper({ title, children }: WindowWrapperProps) {
  return (
    <div className="w-full bg-[#05070c] p-6 flex items-center justify-center">
      <div className="w-full max-w-6xl rounded-2xl border border-white/[0.12] bg-[#0b0f19] shadow-2xl overflow-hidden ring-1 ring-white/10">
        {/* macOS Window Titlebar with 3 dots */}
        <div className="flex items-center px-4 py-3 bg-[#0d121f] border-b border-white/[0.08] select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>
          <div className="flex-1 text-center text-xs font-semibold text-slate-400 font-sans tracking-wide">
            {title}
          </div>
          <div className="w-12" />
        </div>

        {/* Content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}

// 1. EXACT BOARD VIEW
export function ShowcaseBoard() {
  return (
    <WindowWrapper title="Mino — Project Phoenix Roadmap (Board View)">
      <div className="bg-[#0b0f19] text-slate-100 min-h-[640px] flex flex-col">
        {/* Top Navbar */}
        <header className="border-b border-white/[0.08] bg-[#0b0f19]/90 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 font-bold tracking-tight text-white">
              <MinoLogo size={24} />
              <span className="text-base tracking-tight font-extrabold">Mino</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Quantum Dynamics</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20">
              <Plus className="h-3.5 w-3.5" />
              <span>New Board</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-white/20">
              AP
            </div>
          </div>
        </header>

        {/* Board Sub-header */}
        <div className="border-b border-white/[0.06] bg-slate-900/40 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </div>
            <div className="h-4 w-px bg-white/[0.1]" />
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Project Phoenix - Q3 Roadmap</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Presence */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full bg-indigo-600 border-2 border-[#0b0f19] flex items-center justify-center text-[10px] font-bold text-white relative">
                  SJ
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0b0f19]" />
                </div>
                <div className="h-7 w-7 rounded-full bg-emerald-600 border-2 border-[#0b0f19] flex items-center justify-center text-[10px] font-bold text-white relative">
                  DK
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0b0f19]" />
                </div>
                <div className="h-7 w-7 rounded-full bg-purple-600 border-2 border-[#0b0f19] flex items-center justify-center text-[10px] font-bold text-white relative">
                  MT
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0b0f19]" />
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pl-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5">
              <Settings className="h-3.5 w-3.5 text-slate-400" />
              <span>Settings</span>
            </div>
          </div>
        </div>

        {/* Board Canvas */}
        <div className="flex-1 p-6 overflow-x-auto">
          <div className="flex items-start gap-4 h-full">
            {/* Column 1: Backlog */}
            <div className="w-72 shrink-0 rounded-2xl border border-white/[0.08] bg-slate-900/80 p-3 flex flex-col max-h-[500px]">
              <div className="flex items-center justify-between pb-3 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Backlog</h3>
                  <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                    2
                  </span>
                </div>
                <button className="text-slate-400 hover:text-white">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2.5 overflow-y-auto pr-1">
                <div className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-3.5 shadow-sm hover:border-white/[0.15] transition cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/20">
                      Frontend
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/20">
                      Medium
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    Implement Real-time Synchronization
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    Establish reliable WebSocket transport layer for live card movements.
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>4</span>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] font-bold text-white">
                      SJ
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-3.5 shadow-sm hover:border-white/[0.15] transition cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/20">
                      Design
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    Dark Mode Glassmorphic Design System
                  </h4>
                  <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>2</span>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-purple-600 flex items-center justify-center text-[9px] font-bold text-white">
                      AP
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="w-72 shrink-0 rounded-2xl border border-white/[0.08] bg-slate-900/80 p-3 flex flex-col max-h-[500px]">
              <div className="flex items-center justify-between pb-3 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">In Progress</h3>
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                    2
                  </span>
                </div>
                <button className="text-slate-400 hover:text-white">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2.5 overflow-y-auto pr-1">
                <div className="rounded-xl border border-blue-500/30 bg-slate-950/90 p-3.5 shadow-sm hover:border-blue-500/50 transition cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/20">
                      High Priority
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                      Backend
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    Refactor Express REST & WebSocket Bridge
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    Optimize route handlers and integrate HTTP health checks.
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>7</span>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] font-bold text-white">
                      DK
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-3.5 shadow-sm hover:border-white/[0.15] transition cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                      Database
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    PostgreSQL Neon DB Schema Migrations
                  </h4>
                  <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>3</span>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-amber-600 flex items-center justify-center text-[9px] font-bold text-white">
                      MT
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: In Review */}
            <div className="w-72 shrink-0 rounded-2xl border border-white/[0.08] bg-slate-900/80 p-3 flex flex-col max-h-[500px]">
              <div className="flex items-center justify-between pb-3 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">In Review</h3>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    1
                  </span>
                </div>
                <button className="text-slate-400 hover:text-white">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2.5 overflow-y-auto pr-1">
                <div className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-3.5 shadow-sm hover:border-white/[0.15] transition cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                      Security
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    JWT Authentication & Password Hashing
                  </h4>
                  <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>5</span>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white">
                      AP
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Done */}
            <div className="w-72 shrink-0 rounded-2xl border border-white/[0.08] bg-slate-900/80 p-3 flex flex-col max-h-[500px]">
              <div className="flex items-center justify-between pb-3 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Done</h3>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    2
                  </span>
                </div>
                <button className="text-slate-400 hover:text-white">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2.5 overflow-y-auto pr-1">
                <div className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-3.5 shadow-sm hover:border-white/[0.15] transition cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                      Released
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    Project Monorepo & Turborepo Setup
                  </h4>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-3.5 shadow-sm hover:border-white/[0.15] transition cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                      Released
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    Tailwind CSS v4 Design Tokens
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowWrapper>
  );
}

// 2. EXACT DASHBOARD VIEW
export function ShowcaseDashboard() {
  return (
    <WindowWrapper title="Mino — Workspaces & Dashboard">
      <div className="bg-[#0b0f19] text-slate-100 min-h-[600px] flex flex-col">
        {/* Top Navbar */}
        <header className="border-b border-white/[0.08] bg-[#0b0f19]/90 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 font-bold tracking-tight text-white">
              <MinoLogo size={24} />
              <span className="text-base tracking-tight font-extrabold">Mino</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Quantum Dynamics</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20">
              <Plus className="h-3.5 w-3.5" />
              <span>New Board</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-white/20">
              AP
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
          {/* Workspace Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-bold text-white">Quantum Dynamics</h1>
                  <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Primary collaborative engineering and design organization.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.08]">
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                <span>Settings</span>
              </button>
              <button className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.08]">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span>Members (4)</span>
              </button>
              <button className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold text-indigo-300">
                <UserPlus className="h-3.5 w-3.5" />
                <span>Invite</span>
              </button>
            </div>
          </div>

          {/* Boards Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KanbanSquare className="h-4 w-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Boards</h2>
              </div>
              <button className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
                <Plus className="h-3.5 w-3.5" />
                <span>New Board</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {/* Board Card 1 */}
              <div className="group rounded-2xl border border-white/[0.08] bg-slate-900/60 overflow-hidden hover:border-white/[0.2] transition cursor-pointer shadow-lg shadow-black/40">
                <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/40 text-white backdrop-blur-md">
                      Active Sprint
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white drop-shadow-sm">
                    Project Phoenix - Q3
                  </h3>
                </div>
                <div className="p-4 flex items-center justify-between text-xs text-slate-400">
                  <span>14 Tasks</span>
                  <span className="text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Open Board →
                  </span>
                </div>
              </div>

              {/* Board Card 2 */}
              <div className="group rounded-2xl border border-white/[0.08] bg-slate-900/60 overflow-hidden hover:border-white/[0.2] transition cursor-pointer shadow-lg shadow-black/40">
                <div className="h-28 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/40 text-white backdrop-blur-md">
                      Design System
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white drop-shadow-sm">
                    UI Components 2.0
                  </h3>
                </div>
                <div className="p-4 flex items-center justify-between text-xs text-slate-400">
                  <span>8 Tasks</span>
                  <span className="text-teal-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Open Board →
                  </span>
                </div>
              </div>

              {/* Board Card 3 */}
              <div className="group rounded-2xl border border-white/[0.08] bg-slate-900/60 overflow-hidden hover:border-white/[0.2] transition cursor-pointer shadow-lg shadow-black/40">
                <div className="h-28 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-700 p-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/40 text-white backdrop-blur-md">
                      Marketing
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white drop-shadow-sm">
                    Q4 Launch Campaign
                  </h3>
                </div>
                <div className="p-4 flex items-center justify-between text-xs text-slate-400">
                  <span>6 Tasks</span>
                  <span className="text-pink-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Open Board →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowWrapper>
  );
}

// 3. EXACT ORG VIEW
export function ShowcaseOrg() {
  return (
    <WindowWrapper title="Mino — Create Organization Workspace">
      <div className="relative min-h-[580px] w-full flex items-center justify-center bg-[#0b0f19] px-4 py-12 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md z-10">
          <div className="text-center mb-8">
            <MinoLogo size={44} className="mb-4 inline-block shadow-lg shadow-blue-500/25" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Create organization
            </h1>
            <p className="mt-2 text-xs text-slate-400">
              Set up your organization to start creating boards and collaborating
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-7 backdrop-blur-xl shadow-2xl">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Organization Name
                </label>
                <div className="w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3.5 py-2.5 text-xs text-white">
                  Acme Global Dynamics
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Description <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <div className="w-full rounded-xl border border-white/[0.08] bg-slate-950/60 px-3.5 py-2 text-xs text-slate-300">
                  Cross-functional engineering and design workspace.
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition"
                >
                  <span>Create Organization</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowWrapper>
  );
}

// 4. EXACT SETTINGS VIEW
export function ShowcaseSettings() {
  return (
    <WindowWrapper title="Mino — Organization Settings & Members">
      <div className="bg-[#0b0f19] text-slate-100 min-h-[600px] flex flex-col">
        {/* Top Navbar */}
        <header className="border-b border-white/[0.08] bg-[#0b0f19]/90 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 font-bold tracking-tight text-white">
              <MinoLogo size={24} />
              <span className="text-base tracking-tight font-extrabold">Mino</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Quantum Dynamics</span>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-white/20">
            AP
          </div>
        </header>

        {/* Settings Body */}
        <div className="p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Workspace</span>
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">Organization Settings</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage organization workspace details and team member permissions.
            </p>
          </div>

          {/* Org Profile Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Quantum Dynamics</h3>
                <p className="text-xs text-slate-400 mt-0.5">Primary collaborative workspace</p>
              </div>
              <span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                Admin
              </span>
            </div>
          </div>

          {/* Invite Section */}
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-indigo-400" />
              <span>Invite New Member</span>
            </h3>
            <div className="flex gap-2">
              <div className="flex-1 rounded-xl border border-white/[0.08] bg-slate-950/60 px-3.5 py-2 text-xs text-slate-400">
                colleague@company.com
              </div>
              <button className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20">
                Send Invitation
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span>Workspace Members (4)</span>
            </h3>

            <div className="divide-y divide-white/[0.06]">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                    AP
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Ankit Pandit (You)</div>
                    <div className="text-[10px] text-slate-400">ankit@mino.io</div>
                  </div>
                </div>
                <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                  Admin
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    SJ
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Sarah Jenkins</div>
                    <div className="text-[10px] text-slate-400">sarah@acme.com</div>
                  </div>
                </div>
                <span className="rounded-md bg-white/[0.08] px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  Member
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                    DK
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">David Kim</div>
                    <div className="text-[10px] text-slate-400">david@acme.com</div>
                  </div>
                </div>
                <span className="rounded-md bg-white/[0.08] px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                  Member
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowWrapper>
  );
}
