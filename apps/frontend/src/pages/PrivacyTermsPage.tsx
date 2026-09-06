import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { MinoLogo } from "@/components/common/MinoLogo";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  FileText,
  Lock,
  Eye,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export function PrivacyTermsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "terms" ? "terms" : "privacy";
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">(initialTab);

  const switchTab = (tab: "privacy" | "terms") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-blue-600 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Grid & Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[50%] -left-[200px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
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

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 pt-16 pb-24">
        {/* Title and Subtitle */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md mb-6">
            <Shield className="h-3.5 w-3.5 text-blue-400" />
            <span>Legal & Privacy Center</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Privacy & Terms
          </h1>
          <p className="mt-3 text-sm text-slate-400 max-w-lg mx-auto">
            Clear, transparent policies designed to protect your team's privacy, data ownership, and
            collaborative workspaces.
          </p>
          <div className="mt-2 text-xs text-slate-500">Last updated: September 2026</div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-2xl bg-white/[0.04] p-1.5 border border-white/[0.08] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => switchTab("privacy")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "privacy"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button
              type="button"
              onClick={() => switchTab("terms")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "terms"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Terms of Service</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Privacy Policy */}
        {activeTab === "privacy" && (
          <div className="space-y-10 rounded-3xl border border-white/[0.08] bg-slate-900/50 backdrop-blur-xl p-6 sm:p-10">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="flex h-6 w-6 rounded-lg bg-blue-500/10 text-blue-400 items-center justify-center text-xs font-bold border border-blue-500/20">
                  1
                </span>
                Our Commitment to Your Privacy
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                At Mino, we believe your team's project plans, tasks, discussions, and roadmaps belong
                exclusively to you. We build our platform with privacy at its foundation, ensuring that
                your data is never sold, shared with advertisers, or leveraged without your explicit
                permission.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="flex h-6 w-6 rounded-lg bg-blue-500/10 text-blue-400 items-center justify-center text-xs font-bold border border-blue-500/20">
                  2
                </span>
                Information We Collect
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                We only collect information necessary to deliver and improve Mino:
              </p>
              <ul className="space-y-2 text-sm text-slate-300 ml-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Account Information:</strong> Your name, email address, and authentication
                    credentials when registering for an account.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Workspace & Project Data:</strong> Organization names, boards, lists, task
                    cards, labels, descriptions, and comments created by you and your team members.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Collaboration Indicators:</strong> Teammate activity and board presence
                    indicators to display who is currently viewing a board.
                  </span>
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="flex h-6 w-6 rounded-lg bg-blue-500/10 text-blue-400 items-center justify-center text-xs font-bold border border-blue-500/20">
                  3
                </span>
                How We Use Your Data
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your data is used solely to provide, maintain, and support the Mino workspace service.
                Specifically, we use it to synchronize changes across your team members, authenticate
                your identity, process workspace invitations, and prevent unauthorized access or abuse.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="flex h-6 w-6 rounded-lg bg-blue-500/10 text-blue-400 items-center justify-center text-xs font-bold border border-blue-500/20">
                  4
                </span>
                Data Isolation & Zero Third-Party Selling
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                We strictly isolate workspace data between different organizations. Only authenticated
                members who have been added to your organization or board can access your team's
                content. We will <strong>never</strong> sell your personal information or workspace
                data to third parties or brokers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="flex h-6 w-6 rounded-lg bg-blue-500/10 text-blue-400 items-center justify-center text-xs font-bold border border-blue-500/20">
                  5
                </span>
                Your Rights & Data Retention
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                You retain complete ownership of your data at all times. You have the right to request
                access, corrections, or permanent deletion of your account and associated workspaces.
                Upon deleting an organization or account, your data is securely purged from our active
                databases.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/[0.06]">
              <h2 className="text-lg font-bold text-white">Questions or Privacy Concerns?</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                If you have questions about how we handle privacy, feel free to contact our team
                anytime at <span className="text-blue-400">ankitpandit.codes@gmail.com</span>.
              </p>
            </section>
          </div>
        )}

        {/* Tab 2: Terms of Service */}
        {activeTab === "terms" && (
          <div className="space-y-10 rounded-3xl border border-white/[0.08] bg-slate-900/50 backdrop-blur-xl p-6 sm:p-10">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="flex h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-400 items-center justify-center text-xs font-bold border border-indigo-500/20">
                  1
                </span>
                Agreement to Terms
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                By creating an account, creating workspaces, or accessing Mino, you agree to comply with
                and be bound by these Terms of Service. If you are entering into these terms on behalf
                of an organization, company, or team, you represent that you have the authority to bind
                that entity.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="flex h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-400 items-center justify-center text-xs font-bold border border-indigo-500/20">
                  2
                </span>
                User Accounts & Responsibilities
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                You are responsible for maintaining the confidentiality of your login credentials and
                for all activities that occur under your account. You agree to notify us immediately of
                any unauthorized access or security breaches.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="flex h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-400 items-center justify-center text-xs font-bold border border-indigo-500/20">
                  3
                </span>
                Workspace Content & Ownership
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                You and your team retain full ownership and intellectual property rights over all boards,
                tasks, files, and comments you post on Mino. Mino claims no ownership over your content.
                You grant Mino only the limited license required to host, display, and synchronize your
                content for your designated team members.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="flex h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-400 items-center justify-center text-xs font-bold border border-indigo-500/20">
                  4
                </span>
                Acceptable Use Policy
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                You agree not to use Mino to distribute malicious code, engage in abusive behavior,
                infringe on intellectual property rights, or disrupt the operation and security of the
                platform. We reserve the right to suspend accounts that violate these principles.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <span className="flex h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-400 items-center justify-center text-xs font-bold border border-indigo-500/20">
                  5
                </span>
                Service Availability & Modifications
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                We strive to maintain continuous service availability and high performance. We may
                occasionally update, modify, or enhance features to improve the platform. We will
                provide advance notice for any significant changes impacting access.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-white/[0.06]">
              <h2 className="text-lg font-bold text-white">Contacting Legal</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                For questions regarding these Terms of Service or enterprise agreements, please reach
                out to <span className="text-blue-400">terms@mino.io</span>.
              </p>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-slate-950/80 py-10 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MinoLogo size={18} />
            <span className="font-semibold text-white">Mino</span>
            <span>•</span>
            <span>Privacy & Terms</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-slate-300 transition">
              Home
            </Link>
            <Link to="/changelog" className="hover:text-slate-300 transition">
              Changelog
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
