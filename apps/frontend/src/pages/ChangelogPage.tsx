import React from "react";
import { Link } from "react-router";
import { MinoLogo } from "@/components/common/MinoLogo";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Users,
  MessageSquare,
  Shield,
  Zap,
  Tag,
} from "lucide-react";

interface ReleaseItem {
  version: string;
  badge?: string;
  badgeColor?: string;
  date: string;
  title: string;
  description: string;
  highlights: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

const RELEASES: ReleaseItem[] = [
  {
    version: "v1.0",
    badge: "Current Release",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    date: "September 2026",
    title: "The Collaboration & Performance Upgrade",
    description:
      "A complete reimagining of the Mino experience. We rebuilt the board canvas from the ground up to bring hyper-responsive interactions, live team presence, and in-context task discussions.",
    highlights: [
      {
        icon: <Layers className="h-4 w-4 text-blue-400" />,
        title: "Fluid Visual Boards",
        description:
          "Zero-delay card movements, customizable column workflows, and dynamic list creation designed for high-velocity teams.",
      },
      {
        icon: <Users className="h-4 w-4 text-purple-400" />,
        title: "Live Teammate Presence",
        description:
          "Know who is viewing and collaborating on your boards in real time with active avatar pulses and status indicators.",
      },
      {
        icon: <MessageSquare className="h-4 w-4 text-cyan-400" />,
        title: "In-Context Task Discussions",
        description:
          "Attach conversations, feedback, and acceptance criteria directly to cards instead of scattering thoughts across chat apps.",
      },
      {
        icon: <Shield className="h-4 w-4 text-emerald-400" />,
        title: "Multi-Workspace Isolation",
        description:
          "Switch seamlessly between company hubs, client spaces, or personal to-dos with complete organization privacy.",
      },
      {
        icon: <Zap className="h-4 w-4 text-amber-400" />,
        title: "1-Click Team Invitations",
        description:
          "Onboard coworkers in seconds with direct email invites and simple workspace invitation codes.",
      },
    ],
  },
  {
    version: "v1.2",
    badge: "Major Update",
    badgeColor: "bg-slate-500/10 text-slate-400 border-white/[0.08]",
    date: "August 2026",
    title: "Organization Hubs & Workspace Controls",
    description:
      "Introduced organization-level team controls, flexible board permissions, and improved navigation across projects.",
    highlights: [
      {
        icon: <Shield className="h-4 w-4 text-slate-400" />,
        title: "Workspace Switcher",
        description:
          "Fast organization dropdown to pivot between different projects and team environments effortlessly.",
      },
      {
        icon: <Layers className="h-4 w-4 text-slate-400" />,
        title: "Dynamic List Creation",
        description:
          "Add and rearrange custom lists to reflect custom team stages like Backlog, In Review, and Shipped.",
      },
      {
        icon: <Users className="h-4 w-4 text-slate-400" />,
        title: "Member Roster & Roles",
        description:
          "View full team rosters and manage workspace access from a dedicated organization settings dashboard.",
      },
    ],
  },
  {
    version: "v1.0",
    badge: "Genesis",
    badgeColor: "bg-slate-500/10 text-slate-400 border-white/[0.08]",
    date: "July 2026",
    title: "Initial Launch of Mino",
    description:
      "The first public release of Mino, bringing a clean, distraction-free alternative to bloated legacy project management tools.",
    highlights: [
      {
        icon: <Layers className="h-4 w-4 text-slate-400" />,
        title: "Core Kanban Canvas",
        description:
          "Basic list management, task cards, and simple visual progress tracking.",
      },
      {
        icon: <Shield className="h-4 w-4 text-slate-400" />,
        title: "Secure Authentication",
        description:
          "Fast email sign up, token authentication, and personal board workspaces.",
      },
    ],
  },
];

export function ChangelogPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-blue-600 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Grid & Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[45%] -right-[200px] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <MinoLogo size={28} className="group-hover:scale-105 transition-transform" />
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-200 transition-colors">
              Mino
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition px-3 py-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition"
                >
                  <span>Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <UserAvatar email={user.email} id={user.id} size="sm" />
              </div>
            ) : (
              <Link
                to="/signup"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 transition"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 pt-16 pb-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md mb-6">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Product Changelog</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            What's new in Mino.
          </h1>
          <p className="mt-4 text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Follow along with the improvements, features, and design updates we ship to make
            managing your team's projects and to-dos faster and calmer.
          </p>
        </div>

        {/* Release Timeline */}
        <div className="space-y-12">
          {RELEASES.map((release, idx) => (
            <div
              key={release.version}
              className="rounded-3xl border border-white/[0.08] bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden transition hover:border-white/[0.14]"
            >
              {/* Version Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-white tracking-tight">
                    {release.version}
                  </span>
                  {release.badge && (
                    <span
                      className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${release.badgeColor}`}
                    >
                      {release.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>{release.date}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{release.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                  {release.description}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Highlights & Improvements
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {release.highlights.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="rounded-2xl border border-white/[0.05] bg-slate-950/60 p-4 flex items-start gap-3.5 hover:border-white/[0.1] transition"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06]">
                        {item.icon}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-white">{item.title}</h5>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-950 to-slate-950 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-white">Experience Mino v1.0</h4>
            <p className="text-xs text-slate-400 mt-1">
              Start organizing your tasks with fluid visual boards today.
            </p>
          </div>
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
          >
            {user ? "Open Workspace" : "Get Started Free"}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-slate-950/80 py-10 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MinoLogo size={18} />
            <span className="font-semibold text-white">Mino</span>
            <span>•</span>
            <span>Changelog</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-slate-300 transition">
              Home
            </Link>
            <Link to="/privacy-terms" className="hover:text-slate-300 transition">
              Privacy & Terms
            </Link>
            <Link to="/dashboard" className="hover:text-slate-300 transition">
              Workspace
            </Link>
            <a
              href="https://x.com/ankitpanditdev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition inline-flex items-center gap-1.5 text-slate-400"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @ankitpanditdev
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
