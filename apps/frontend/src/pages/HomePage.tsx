import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { MinoLogo } from "@/components/common/MinoLogo";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Shield,
  Layers,
  MessageSquare,
  KanbanSquare,
  CheckCircle2,
  Check,
  ChevronRight,
  MoveRight,
  Flame,
  Layout,
  MousePointerClick,
  Sliders,
  FolderGit2,
  Plus,
  HelpCircle,
  ChevronDown,
  Star,
  Compass,
} from "lucide-react";

interface DemoCard {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  assignee: string;
  comments: number;
  progress?: string;
}

type DemoPreset = "sprint" | "design" | "launch";

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active Demo Preset Tab
  const [activePreset, setActivePreset] = useState<DemoPreset>("sprint");

  // Interactive Kanban Boards for each preset
  const [demoColumnsByPreset, setDemoColumnsByPreset] = useState<
    Record<DemoPreset, Record<string, DemoCard[]>>
  >({
    sprint: {
      todo: [
        {
          id: "s1",
          title: "Streamline team onboarding flow",
          tag: "Product",
          tagColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          assignee: "alex@mino.io",
          comments: 4,
          progress: "2/4",
        },
        {
          id: "s2",
          title: "Redesign workspace settings layout",
          tag: "Design",
          tagColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          assignee: "sarah@mino.io",
          comments: 3,
        },
      ],
      inProgress: [
        {
          id: "s3",
          title: "Live teammate presence indicators",
          tag: "Feature",
          tagColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
          assignee: "david@mino.io",
          comments: 6,
          progress: "4/5",
        },
      ],
      done: [
        {
          id: "s4",
          title: "Dark mode palette & glass tokens",
          tag: "Design",
          tagColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          assignee: "elena@mino.io",
          comments: 8,
          progress: "Done",
        },
      ],
    },
    design: {
      todo: [
        {
          id: "d1",
          title: "Component library button states",
          tag: "Design System",
          tagColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
          assignee: "sarah@mino.io",
          comments: 5,
        },
      ],
      inProgress: [
        {
          id: "d2",
          title: "Mobile responsive navigation drawer",
          tag: "Mobile",
          tagColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
          assignee: "alex@mino.io",
          comments: 2,
          progress: "3/3",
        },
      ],
      done: [
        {
          id: "d3",
          title: "Modern typography & Inter font scale",
          tag: "Typography",
          tagColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          assignee: "elena@mino.io",
          comments: 9,
          progress: "Done",
        },
      ],
    },
    launch: {
      todo: [
        {
          id: "l1",
          title: "Publish interactive release notes",
          tag: "Marketing",
          tagColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          assignee: "david@mino.io",
          comments: 1,
        },
      ],
      inProgress: [
        {
          id: "l2",
          title: "Early access invitation codes batch",
          tag: "Growth",
          tagColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          assignee: "alex@mino.io",
          comments: 4,
          progress: "1/2",
        },
      ],
      done: [
        {
          id: "l3",
          title: "Community launch announcement",
          tag: "Community",
          tagColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          assignee: "sarah@mino.io",
          comments: 14,
          progress: "Shipped",
        },
      ],
    },
  });

  // Card mover for interactive demo
  const moveDemoCard = (cardId: string, fromCol: string, toCol: string) => {
    if (fromCol === toCol) return;
    const currentBoard = demoColumnsByPreset[activePreset];
    const card = currentBoard[fromCol]?.find((c) => c.id === cardId);
    if (!card) return;

    setDemoColumnsByPreset((prev) => ({
      ...prev,
      [activePreset]: {
        ...prev[activePreset],
        [fromCol]: prev[activePreset][fromCol].filter((c) => c.id !== cardId),
        [toCol]: [...prev[activePreset][toCol], card],
      },
    }));
  };

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const currentColumns = demoColumnsByPreset[activePreset];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white overflow-x-hidden font-sans relative transition-colors duration-300">
      {/* Background Ambient Lighting & Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-60" />

        {/* Ambient Gradient Glow Orbs */}
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-transparent dark:from-blue-600/20 dark:via-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] -left-[200px] w-[650px] h-[650px] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-[60%] -right-[200px] w-[650px] h-[650px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Modern Glass Topbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#07090e]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <MinoLogo size={28} className="group-hover:scale-105 transition-transform" />
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors">
              Mino
            </span>
            <span className="hidden sm:inline-block rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
              v1.0
            </span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Interactive Demo
            </a>
            <a href="#workflow" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Teams
            </a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition active:scale-95"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <UserAvatar
                  email={user.email}
                  id={user.id}
                  name={user.name}
                  profilePicture={user.profilePicture}
                  size="sm"
                />
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/35 transition active:scale-95"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto text-center">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-sm backdrop-blur-md mb-8 hover:border-blue-400/60 transition cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Introducing Mino • The better way to manage your to-dos.</span>
            <ChevronRight className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Organize anything.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent">
              Together, without friction.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Mino brings your team's projects, boards, and conversations into one fluid,
            visual workspace. Designed to keep everyone aligned, focused, and shipping faster.
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <span>{user ? "Open Your Workspace" : "Get Started Free"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-white/[0.12] bg-white/80 dark:bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white transition-all backdrop-blur-md hover:-translate-y-0.5 shadow-sm"
            >
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Explore Interactive Demo</span>
            </a>
          </div>

          {/* Trust / Value Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Setup in under 10 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Free for teams of any size</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Zero clutter, pure focus</span>
            </div>
          </div>

          {/* Interactive Live Demo Preview Section */}
          <div id="demo" className="mt-16 sm:mt-20 scroll-mt-24">
            <div className="relative rounded-3xl border border-slate-200/90 dark:border-white/[0.1] bg-white/90 dark:bg-slate-950/80 p-3 sm:p-6 shadow-xl dark:shadow-2xl backdrop-blur-2xl ring-1 ring-slate-900/5 dark:ring-white/[0.06]">
              {/* Fake Window Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 px-2 border-b border-slate-200/80 dark:border-white/[0.06] mb-5">
                {/* Window Controls + Board Title */}
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                    Engineering & Product Hub
                  </span>
                </div>

                {/* Preset Switcher Tabs */}
                <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] p-1 border border-slate-200/80 dark:border-white/[0.08] text-xs">
                  <button
                    type="button"
                    onClick={() => setActivePreset("sprint")}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      activePreset === "sprint"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    🚀 Sprint Board
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreset("design")}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      activePreset === "design"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    🎨 Design System
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreset("launch")}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      activePreset === "launch"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    📈 Product Launch
                  </button>
                </div>

                {/* Active Teammates Cluster */}
                <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] px-3 py-1 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px] hidden lg:inline">
                    collaborators on board:
                  </span>
                  <div className="flex -space-x-1.5 items-center">
                    <UserAvatar email="alex@mino.io" size="sm" />
                    <UserAvatar email="sarah@mino.io" size="sm" />
                    <UserAvatar email="david@mino.io" size="sm" />
                    <UserAvatar email="elena@mino.io" size="sm" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 ml-1">4 active</span>
                </div>
              </div>

              {/* Interactive Columns Container */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* Column 1: Backlog / Upcoming */}
                <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.06] bg-slate-50/90 dark:bg-slate-900/60 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80 dark:border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Backlog</span>
                      </div>
                      <span className="rounded-full bg-slate-200/70 dark:bg-white/[0.08] px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                        {currentColumns.todo.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {currentColumns.todo.map((card) => (
                        <div
                          key={card.id}
                          className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-slate-950 p-3.5 shadow-sm hover:border-blue-400 dark:hover:border-blue-500/40 transition group hover:shadow-md"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${card.tagColor}`}
                            >
                              {card.tag}
                            </span>
                            {card.progress && (
                              <span className="text-[10px] text-slate-500 font-mono">
                                {card.progress}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-200 transition">
                            {card.title}
                          </h4>
                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <UserAvatar email={card.assignee} size="sm" />
                              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                <MessageSquare className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                                {card.comments}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => moveDemoCard(card.id, "todo", "inProgress")}
                              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition"
                            >
                              <span>Move</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {currentColumns.todo.length === 0 && (
                        <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-white/[0.06] rounded-xl">
                          Column is empty
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="rounded-2xl border border-blue-300 dark:border-blue-500/30 bg-blue-50/50 dark:bg-slate-900/80 p-3.5 flex flex-col justify-between ring-1 ring-blue-500/10">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-blue-200/60 dark:border-white/[0.04]">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">In Progress</span>
                      </div>
                      <span className="rounded-full bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                        {currentColumns.inProgress.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {currentColumns.inProgress.map((card) => (
                        <div
                          key={card.id}
                          className="rounded-xl border border-blue-200 dark:border-blue-500/30 bg-white dark:bg-slate-950 p-3.5 shadow-sm hover:border-blue-400 dark:hover:border-blue-400/60 transition group hover:shadow-md"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${card.tagColor}`}
                            >
                              {card.tag}
                            </span>
                            {card.progress && (
                              <span className="text-[10px] text-blue-600 dark:text-blue-300 font-mono font-medium">
                                {card.progress}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-200 transition">
                            {card.title}
                          </h4>
                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <UserAvatar email={card.assignee} size="sm" />
                              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                <MessageSquare className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                                {card.comments}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => moveDemoCard(card.id, "inProgress", "todo")}
                                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition font-medium"
                              >
                                &larr; Back
                              </button>
                              <button
                                type="button"
                                onClick={() => moveDemoCard(card.id, "inProgress", "done")}
                                className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition"
                              >
                                <span>Done</span>
                                <Check className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {currentColumns.inProgress.length === 0 && (
                        <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-white/[0.06] rounded-xl">
                          Column is empty
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 3: Completed / Done */}
                <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.06] bg-slate-50/90 dark:bg-slate-900/60 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80 dark:border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Completed</span>
                      </div>
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        {currentColumns.done.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {currentColumns.done.map((card) => (
                        <div
                          key={card.id}
                          className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-slate-950 p-3.5 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500/40 transition group opacity-90"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${card.tagColor}`}
                            >
                              {card.tag}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              <Check className="h-3 w-3" />
                              Shipped
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-200 transition">
                            {card.title}
                          </h4>
                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <UserAvatar email={card.assignee} size="sm" />
                              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                <MessageSquare className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                                {card.comments}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => moveDemoCard(card.id, "done", "inProgress")}
                              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition font-medium"
                            >
                              &larr; Reopen
                            </button>
                          </div>
                        </div>
                      ))}
                      {currentColumns.done.length === 0 && (
                        <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-white/[0.06] rounded-xl">
                          Column is empty
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Interactive Footer Note */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 px-1">
                <span>
                  💡 Interactive preview — click <span className="text-blue-600 dark:text-blue-400 font-semibold">"Move"</span> or <span className="text-emerald-600 dark:text-emerald-400 font-semibold">"Done"</span> to see cards advance smoothly.
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Switch presets above to preview other team workflows
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section id="features" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Designed for Momentum
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
              Everything your team needs to ship faster.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
              Ditch cumbersome tools that slow your team down. Mino strips away the bloat and gives
              you pure speed, visual clarity, and seamless team alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 (Span 2): Fluid Visual Boards */}
            <div className="md:col-span-2 rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-8 shadow-sm hover:shadow-md dark:backdrop-blur-xl relative overflow-hidden group hover:border-blue-400 dark:hover:border-blue-500/40 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-6">
                <KanbanSquare className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Boards That Move at the Speed of Thought
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg leading-relaxed mb-6">
                Organize your sprints, customer requests, or project milestones with frictionless drag
                and drop. Every card movement feels instant, snappy, and satisfying.
              </p>

              {/* Decorative Visual Element */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-950/80 p-4 font-sans text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="font-semibold text-slate-900 dark:text-white">Sprint 4: Product Polish</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400">12 of 14 tasks completed</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                  85% On Track
                </span>
              </div>
            </div>

            {/* Bento Card 2: Live Teammate Presence */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-8 shadow-sm hover:shadow-md dark:backdrop-blur-xl hover:border-purple-400 dark:hover:border-purple-500/40 transition flex flex-col justify-between group">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Live Team Presence</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Always know who is active on your board. See teammates viewing cards, making
                  updates, and driving work forward together without conflicts.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="flex -space-x-2 items-center">
                  <UserAvatar email="sarah@mino.io" size="md" />
                  <UserAvatar email="alex@mino.io" size="md" />
                  <UserAvatar email="david@mino.io" size="md" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-950 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    +6
                  </div>
                </div>
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Active Collaborators</span>
              </div>
            </div>

            {/* Bento Card 3: Deep In-Context Conversations */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-8 shadow-sm hover:shadow-md dark:backdrop-blur-xl hover:border-cyan-400 dark:hover:border-cyan-500/40 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-6">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">In-Context Discussions</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Keep conversations directly attached to tasks instead of lost across messy chat
                channels. Clarify requirements, post feedback, and track decisions where they matter.
              </p>
            </div>

            {/* Bento Card 4: Multi-Workspace Isolation */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-8 shadow-sm hover:shadow-md dark:backdrop-blur-xl hover:border-emerald-400 dark:hover:border-emerald-500/40 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Organized Team Spaces</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Dedicated spaces for every department, venture, or client project. Switch contexts in
                one click with complete privacy and clean separation.
              </p>
            </div>

            {/* Bento Card 5: Infinite Custom Lists */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900/60 p-8 shadow-sm hover:shadow-md dark:backdrop-blur-xl hover:border-amber-400 dark:hover:border-amber-500/40 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-6">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Customizable Workflows</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Mino adapts to your team's rhythm, not the other way around. Create tailored stages,
                custom columns, and backlogs that reflect how you actually deliver results.
              </p>
            </div>
          </div>
        </section>

        {/* Intuitive 3-Step Workflow Section */}
        <section
          id="workflow"
          className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.06] scroll-mt-20"
        >
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Effortless Workflow
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
              From signup to momentum in 3 steps.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-4 text-sm sm:text-base">
              Start getting things done without spending days watching tutorials or configuring complex
              settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/[0.06] bg-white dark:bg-slate-900/40 p-8 shadow-sm hover:shadow-md relative overflow-hidden group hover:border-blue-400 dark:hover:border-blue-500/30 transition">
              <span className="text-5xl font-black text-blue-600/20 dark:text-blue-500/20 group-hover:text-blue-600/30 dark:group-hover:text-blue-500/30 transition">
                01
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">
                Create your Team Workspace
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Name your organization and invite colleagues with an effortless invitation code. Your
                collaborative hub is live in seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/[0.06] bg-white dark:bg-slate-900/40 p-8 shadow-sm hover:shadow-md relative overflow-hidden group hover:border-indigo-400 dark:hover:border-indigo-500/30 transition">
              <span className="text-5xl font-black text-indigo-600/20 dark:text-indigo-500/20 group-hover:text-indigo-600/30 dark:group-hover:text-indigo-500/30 transition">
                02
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">
                Set up Boards & Lists
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Create boards for your sprints, releases, or initiatives. Add custom columns like
                "Backlog", "In Review", and "Shipped".
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/[0.06] bg-white dark:bg-slate-900/40 p-8 shadow-sm hover:shadow-md relative overflow-hidden group hover:border-cyan-400 dark:hover:border-cyan-500/30 transition">
              <span className="text-5xl font-black text-cyan-600/20 dark:text-cyan-500/20 group-hover:text-cyan-600/30 dark:group-hover:text-cyan-500/30 transition">
                03
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">
                Move Fast & Ship Together
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Work alongside your teammates simultaneously. Watch tasks progress smoothly across
                stages with complete clarity and zero friction.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Loved by High-Impact Teams
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
              Built for teams who love shipping.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900/50 p-6 shadow-sm hover:shadow-md dark:backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "Mino is refreshing. We abandoned our old bloated project software in favor of
                  Mino's clean, lightning-fast boards. Our team actually enjoys updating tasks now."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-3">
                <UserAvatar email="marcus@startup.io" size="md" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Marcus Vance</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Head of Product, HyperScale</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900/50 p-6 shadow-sm hover:shadow-md dark:backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "The live presence feature is a game-changer for remote teams. You can feel the
                  momentum when everyone is working on the same board during planning sessions."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-3">
                <UserAvatar email="chloe@designhub.co" size="md" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Chloe Nguyen</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Design Director, Studio Aura</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900/50 p-6 shadow-sm hover:shadow-md dark:backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "Everything just clicks. Creating an organization, inviting members, and spinning
                  up sprint boards took less than two minutes. Mino is the new gold standard."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-3">
                <UserAvatar email="liam@devcraft.com" size="md" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Liam Patel</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Engineering Lead, DevCraft</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (FAQ) Section */}
        <section id="faq" className="py-24 px-4 sm:px-8 max-w-4xl mx-auto border-t border-slate-200/80 dark:border-white/[0.06] scroll-mt-20">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-4 text-sm sm:text-base">
              Everything you need to know about getting started with Mino.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is Mino really free for our team?",
                a: "Yes! Mino is free to use for teams of any size. You can create organizations, invite members, set up unlimited boards, and track tasks without hidden paywalls.",
              },
              {
                q: "How does team collaboration work?",
                a: "Mino is built for seamless teamwork. When you or your teammates move cards, update task details, or post comments, everyone on the board sees the updates immediately without needing to refresh.",
              },
              {
                q: "Can I manage multiple organizations or projects?",
                a: "Absolutely. You can create multiple workspaces for different companies, clients, or side projects, and switch between them effortlessly from your dashboard.",
              },
              {
                q: "How do I invite my coworkers to a workspace?",
                a: "Go to your organization settings page, enter your teammate's email or share the generated workspace invitation code. They will instantly gain access to your team's boards.",
              },
              {
                q: "Can I customize the lists on my boards?",
                a: "Yes. You can add as many lists as you need (e.g. Backlog, In Progress, In Review, Done) and rename them to match your team's unique development and shipping workflow.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900/50 shadow-sm dark:backdrop-blur-xl overflow-hidden transition hover:border-slate-300 dark:hover:border-white/[0.14]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/[0.04] pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* High-Conversion Closing Call to Action */}
        <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-900 via-slate-950 to-slate-950 text-white p-8 sm:p-16 text-center overflow-hidden shadow-2xl ring-1 ring-blue-500/20">
            {/* Soft Ambient Light Cone */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/20 rounded-full blur-[110px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <MinoLogo size={52} className="mx-auto mb-6 shadow-xl shadow-blue-500/30" />
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Stop juggling messy tools.
                <br />
                <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-white bg-clip-text text-transparent">
                  Start shipping with clarity.
                </span>
              </h2>
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                Join forward-thinking product teams building with Mino today. Free to start,
                effortless to love.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 transition active:scale-95"
                >
                  <span>{user ? "Go to Your Boards" : "Get Started Free — It's Fast"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
                <span>✓ No credit card</span>
                <span>✓ Instant team invites</span>
                <span>✓ Unlimited boards</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Sleek Footer */}
      <footer className="border-t border-slate-200 dark:border-white/[0.06] bg-slate-100/90 dark:bg-slate-950/80 pt-14 pb-10 px-4 sm:px-8 transition-colors">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            {/* Brand & Mission */}
            <div className="space-y-3 max-w-xs">
              <div className="flex items-center gap-2.5">
                <MinoLogo size={24} />
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Mino</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A simple, visual way to organize your to-dos and projects together.
              </p>
            </div>

            {/* Quick Links Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
              <div className="space-y-3">
                <h5 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Product</h5>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#demo" className="hover:text-slate-900 dark:hover:text-white transition">
                      Interactive Demo
                    </a>
                  </li>
                  <li>
                    <a href="#workflow" className="hover:text-slate-900 dark:hover:text-white transition">
                      Workflow
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Platform</h5>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition">
                      Workspace Hub
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="hover:text-slate-900 dark:hover:text-white transition">
                      Create Account
                    </Link>
                  </li>
                  <li>
                    <Link to="/create-org" className="hover:text-slate-900 dark:hover:text-white transition">
                      New Workspace
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 col-span-2 sm:col-span-1">
                <h5 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Community</h5>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <Link to="/changelog" className="hover:text-slate-900 dark:hover:text-white transition">
                      Changelog (v1.0)
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-terms" className="hover:text-slate-900 dark:hover:text-white transition">
                      Privacy & Terms
                    </Link>
                  </li>
                  <li>
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      All Systems Operational
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} Mino Inc. All rights reserved.</p>

            <a
              href="https://x.com/ankitpanditdev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
            >
              <span>Built by</span>
              <span className="font-medium text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @ankitpanditdev
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
