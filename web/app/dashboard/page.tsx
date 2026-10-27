"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Clock,
  Download,
  Plus,
  Eye,
  AlertCircle,
  FileCheck2,
  FolderKanban,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name ? session.user.name.split(" ")[0] : "there";

  const [proposalAccepted, setProposalAccepted] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Welcome Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/[0.08] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Welcome back, {userName}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Here is your live production overview, pending proposals, and creative deliverables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/services"
            className="rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
          >
            Explore Services
          </Link>
          <Link
            href="/dashboard/requests/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Start a Project</span>
          </Link>
        </div>
      </div>

      {/* 2. Priority Notice Banner (Proposals or Deliverables Awaiting Action) */}
      {!proposalAccepted ? (
        <div className="rounded-xl border border-neutral-300 bg-white p-5 shadow-xs">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900">
                    Proposal Ready for Review &bull; Q4 Meta Ad Campaign
                  </h3>
                  <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-700">
                    Quote #Q-104
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  10 static creatives, 4 video hook variations &bull; $2,400 USD &bull; 6 business days turnaround &bull; 2 revision rounds
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
              <Link
                href="/dashboard/requests/req-104"
                className="inline-flex items-center gap-1 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-black transition-colors"
              >
                <span>Review Terms</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <button
                type="button"
                onClick={() => setProposalAccepted(true)}
                className="rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                Accept Proposal
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-black" />
            <span>Proposal #Q-104 accepted. Project initialized into production queue.</span>
          </div>
          <Link href="/dashboard/projects" className="font-semibold text-black hover:underline">
            View Project Workspace &rarr;
          </Link>
        </div>
      )}

      {/* 3. Core Operational Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-black/[0.08] bg-white p-4">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Active Campaigns</span>
            <FolderKanban className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 mt-2">2</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Live creative production</p>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-white p-4">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Pending Proposals</span>
            <FileText className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 mt-2">
            {proposalAccepted ? "0" : "1"}
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Ready for client approval</p>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-white p-4">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Items Awaiting Review</span>
            <Eye className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 mt-2">3</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Drafts ready for sign-off</p>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-white p-4">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Delivered Creatives</span>
            <FileCheck2 className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-neutral-900 mt-2">18</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Production assets approved</p>
        </div>
      </div>

      {/* 4. Active Projects & Production Progress Section */}
      <div className="rounded-xl border border-black/[0.08] bg-white">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Active Projects &amp; Progress</h2>
            <p className="text-xs text-neutral-500">Live milestone tracking across contracted creative deliverables</p>
          </div>
          <Link
            href="/dashboard/projects"
            className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center gap-1"
          >
            <span>All Projects</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="divide-y divide-black/[0.06]">
          {/* Project 1 */}
          <div className="p-6 hover:bg-neutral-50/40 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-medium text-neutral-500">#AP-2041</span>
                  <h3 className="text-base font-bold text-neutral-900">
                    Q4 Meta Performance Ads
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                    In Production
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  Service: Paid Social Creatives &bull; Formats: 9:16 Reels/Stories, 1:1 Feed &bull; Target Delivery: Nov 8, 2026
                </p>
              </div>

              <Link
                href="/dashboard/projects/proj-2041"
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 self-start"
              >
                <span>Open Workspace</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500" />
              </Link>
            </div>

            {/* Milestones Flow */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Stage 3 of 5: Draft Production</span>
                <span className="font-semibold text-neutral-800">65% Complete</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-neutral-900 rounded-full" style={{ width: "65%" }} />
              </div>
              <div className="grid grid-cols-5 text-[10px] text-neutral-400 pt-1 text-center font-medium">
                <span className="text-neutral-700">1. Intake</span>
                <span className="text-neutral-700">2. Concepts</span>
                <span className="text-neutral-900 font-bold">3. Drafts</span>
                <span>4. Client Review</span>
                <span>5. Final Files</span>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="p-6 hover:bg-neutral-50/40 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-medium text-neutral-500">#AP-1988</span>
                  <h3 className="text-base font-bold text-neutral-900">
                    Display &amp; Retargeting Suite
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                    Drafts Ready for Sign-Off
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  Service: Display Ad Suite &bull; Formats: 6 Standard IAB Sizes &bull; Target Delivery: Nov 2, 2026
                </p>
              </div>

              <Link
                href="/dashboard/projects/proj-1988"
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 self-start"
              >
                <span>Open Workspace</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500" />
              </Link>
            </div>

            {/* Milestones Flow */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Stage 4 of 5: Client Review</span>
                <span className="font-semibold text-neutral-800">85% Complete</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-neutral-900 rounded-full" style={{ width: "85%" }} />
              </div>
              <div className="grid grid-cols-5 text-[10px] text-neutral-400 pt-1 text-center font-medium">
                <span className="text-neutral-700">1. Intake</span>
                <span className="text-neutral-700">2. Concepts</span>
                <span className="text-neutral-700">3. Drafts</span>
                <span className="text-neutral-900 font-bold">4. Client Review</span>
                <span>5. Final Files</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Deliverables Review Deck (Visual Grid of Assets Waiting for Sign-off) */}
      <div className="rounded-xl border border-black/[0.08] bg-white">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Creative Deliverables for Review</h2>
            <p className="text-xs text-neutral-500">
              Review and approve drafts or request revisions within your allocated rounds
            </p>
          </div>
          <span className="text-xs font-medium text-neutral-500">3 items pending</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/[0.06]">
          {/* Asset 1 */}
          <div className="p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-neutral-800">
                  DRAFT v1
                </span>
                <span className="text-neutral-500 text-[11px]">#AP-1988</span>
              </div>
              <div className="mt-3 aspect-video w-full rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 text-xs font-mono">
                300x250 Medium Rectangle
              </div>
              <h4 className="text-xs font-bold text-neutral-900 mt-3">
                Display Banner Set &bull; Concept A
              </h4>
              <p className="text-[11px] text-neutral-500 mt-1">
                Clean product spotlight banner with call-to-action button.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-black/[0.04]">
              <Link
                href="/dashboard/projects/proj-1988"
                className="flex-1 rounded-md bg-neutral-900 py-1.5 text-center text-xs font-semibold text-white hover:bg-black transition-colors"
              >
                Approve
              </Link>
              <Link
                href="/dashboard/projects/proj-1988"
                className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Edits
              </Link>
            </div>
          </div>

          {/* Asset 2 */}
          <div className="p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-neutral-800">
                  DRAFT v1
                </span>
                <span className="text-neutral-500 text-[11px]">#AP-1988</span>
              </div>
              <div className="mt-3 aspect-video w-full rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 text-xs font-mono">
                728x90 Leaderboard Banner
              </div>
              <h4 className="text-xs font-bold text-neutral-900 mt-3">
                Display Banner Set &bull; Concept B
              </h4>
              <p className="text-[11px] text-neutral-500 mt-1">
                Horizontal desktop banner formatted for retargeting inventory.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-black/[0.04]">
              <Link
                href="/dashboard/projects/proj-1988"
                className="flex-1 rounded-md bg-neutral-900 py-1.5 text-center text-xs font-semibold text-white hover:bg-black transition-colors"
              >
                Approve
              </Link>
              <Link
                href="/dashboard/projects/proj-1988"
                className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Edits
              </Link>
            </div>
          </div>

          {/* Asset 3 */}
          <div className="p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-neutral-800">
                  DRAFT v1
                </span>
                <span className="text-neutral-500 text-[11px]">#AP-2041</span>
              </div>
              <div className="mt-3 aspect-video w-full rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 text-xs font-mono">
                9:16 Video Hook Cut (15s)
              </div>
              <h4 className="text-xs font-bold text-neutral-900 mt-3">
                Meta Hook Variation 01
              </h4>
              <p className="text-[11px] text-neutral-500 mt-1">
                Fast-paced product demonstration hook with on-screen kinetic captions.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-black/[0.04]">
              <Link
                href="/dashboard/projects/proj-2041"
                className="flex-1 rounded-md bg-neutral-900 py-1.5 text-center text-xs font-semibold text-white hover:bg-black transition-colors"
              >
                Approve
              </Link>
              <Link
                href="/dashboard/projects/proj-2041"
                className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Edits
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Dual Column: Quote Requests Table + Production Feed */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Inbound Requests & Proposals History */}
        <div className="rounded-xl border border-black/[0.08] bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-4">
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Submitted Requests &amp; Proposals</h2>
              <p className="text-xs text-neutral-500">Commercial proposals and brief status tracking</p>
            </div>
            <Link
              href="/dashboard/requests"
              className="text-xs font-semibold text-neutral-700 hover:text-black"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-black/[0.06] text-xs">
            {/* Row 1 */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-neutral-500">#REQ-104</span>
                  <Link
                    href="/dashboard/requests/req-104"
                    className="font-bold text-neutral-900 hover:underline"
                  >
                    Q4 Meta Performance Ads
                  </Link>
                </div>
                <p className="text-neutral-500 text-[11px]">
                  Submitted Oct 25 &bull; Paid Social &bull; Budget: $2,000 - $3,000
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-800">
                  Proposal Sent ($2,400)
                </span>
                <Link
                  href="/dashboard/requests/req-104"
                  className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  View
                </Link>
              </div>
            </div>

            {/* Row 2 */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-neutral-500">#REQ-103</span>
                  <Link
                    href="/dashboard/requests/req-103"
                    className="font-bold text-neutral-900 hover:underline"
                  >
                    UGC &amp; Video Hooks Sprint
                  </Link>
                </div>
                <p className="text-neutral-500 text-[11px]">
                  Submitted Oct 22 &bull; UGC &amp; Video &bull; Budget: $1,500
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">
                  In Review by Admin
                </span>
                <Link
                  href="/dashboard/requests/req-103"
                  className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  View
                </Link>
              </div>
            </div>

            {/* Row 3 */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-neutral-500">#REQ-102</span>
                  <Link
                    href="/dashboard/requests/req-102"
                    className="font-bold text-neutral-900 hover:underline"
                  >
                    Display Retargeting Suite
                  </Link>
                </div>
                <p className="text-neutral-500 text-[11px]">
                  Submitted Oct 18 &bull; Display Ads &bull; Budget: $1,200
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-800">
                  Accepted &bull; Active
                </span>
                <Link
                  href="/dashboard/requests/req-102"
                  className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Production Activity & Support Card */}
        <div className="space-y-6">
          {/* Live Activity Feed */}
          <div className="rounded-xl border border-black/[0.08] bg-white">
            <div className="border-b border-black/[0.06] px-5 py-4">
              <h2 className="text-sm font-bold text-neutral-900">Project Timeline</h2>
              <p className="text-xs text-neutral-500">Recent events across campaigns</p>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900 shrink-0" />
                <div>
                  <p className="text-neutral-800 font-medium leading-relaxed">
                    Creative drafts uploaded for <span className="font-bold text-neutral-900">#AP-1988</span>
                  </p>
                  <span className="text-[11px] text-neutral-500">3 hours ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-neutral-400 shrink-0" />
                <div>
                  <p className="text-neutral-800 font-medium leading-relaxed">
                    Formal proposal generated for <span className="font-bold text-neutral-900">#REQ-104</span>
                  </p>
                  <span className="text-[11px] text-neutral-500">Yesterday at 4:15 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-neutral-400 shrink-0" />
                <div>
                  <p className="text-neutral-800 font-medium leading-relaxed">
                    Project <span className="font-bold text-neutral-900">#AP-2041</span> kicked off with creative team
                  </p>
                  <span className="text-[11px] text-neutral-500">Oct 25, 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Assistance Card */}
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-5 text-xs text-neutral-600 space-y-2">
            <h3 className="font-bold text-neutral-900">Dedicated Account Support</h3>
            <p className="text-[11px] leading-relaxed">
              Have questions regarding revision rounds, creative direction, or fast turnaround delivery?
            </p>
            <div className="pt-2">
              <a
                href="mailto:support@adspolisher.com"
                className="inline-flex items-center gap-1 font-semibold text-neutral-900 hover:underline"
              >
                <span>Contact Creative Producer</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
