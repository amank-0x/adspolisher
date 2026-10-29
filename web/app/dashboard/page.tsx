"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileClock,
  FileText,
  FolderKanban,
  MessageSquareText,
  Plus,
} from "lucide-react";

const summary = [
  { label: "Active projects", value: "02", note: "Both moving to plan", icon: FolderKanban },
  { label: "Requests in review", value: "02", note: "One needs a reply", icon: FileText },
  { label: "Proposals to decide", value: "01", note: "Review scope and price", icon: FileClock },
  { label: "Approvals needed", value: "02", note: "Drafts ready for feedback", icon: CheckCircle2 },
];

const projects = [
  { id: "proj-2041", code: "AP-2041", name: "Q4 Meta Performance Ads", service: "Paid social · 10 creatives", status: "In production", progress: 62, due: "Due Nov 08" },
  { id: "proj-1988", code: "AP-1988", name: "Display Retargeting Suite", service: "Display · 6 formats", status: "Your review", progress: 84, due: "2 drafts ready" },
];

const activity = [
  { text: "New drafts are ready for your review", detail: "Display Retargeting Suite · 3 hours ago", color: "bg-[#d9480f]" },
  { text: "Your campaign brief was reviewed", detail: "Q4 Meta Performance Ads · Yesterday", color: "bg-[#141413]" },
  { text: "Proposal sent for your decision", detail: "Q4 Meta Performance Ads · Oct 25", color: "bg-neutral-300" },
];

export default function CustomerDashboardPage() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.trim().split(/\s+/)[0] || "there";

  return (
    <div className="space-y-6 pb-2">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#b34a20]">Your workspace</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-.045em] sm:text-[36px]">Welcome back, {firstName}.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">Here’s what needs your attention and where your creative work stands.</p>
        </div>
        <Link href="/dashboard/requests/new" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#141413] px-4 text-sm font-semibold text-white transition hover:bg-neutral-700"><Plus size={17} />Start a project</Link>
      </section>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;
          return <article key={item.label} className="rounded-2xl border border-black/[0.07] bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-neutral-500">{item.label}</p><Icon size={17} className="text-neutral-400" /></div>
            <p className="mt-4 text-3xl font-semibold tracking-[-.05em]">{item.value}</p>
            <p className="mt-1 text-[11px] text-neutral-500">{item.note}</p>
          </article>;
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#d9480f]/20 bg-[#fffaf5]">
        <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f5e5d8] text-[#a43e13]"><FileClock size={19} /></span>
            <div><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-semibold">A proposal is ready for your decision</h3><span className="rounded-full bg-[#f2e0d2] px-2 py-1 text-[10px] font-semibold text-[#8e3a16]">Q-104</span></div><p className="mt-1 text-xs leading-5 text-neutral-600">Q4 Meta Campaign · 10 static ads + 4 video hooks · $2,400 USD</p></div>
          </div>
          <Link href="/dashboard/requests/req-104" className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg bg-[#141413] px-3.5 text-xs font-semibold text-white hover:bg-neutral-700 sm:self-auto">Review proposal<ArrowRight size={14} /></Link>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.8fr)]">
        <section className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-4 sm:px-6">
            <div><h3 className="text-sm font-semibold">Projects in progress</h3><p className="mt-1 text-xs text-neutral-500">Follow the latest production stage.</p></div>
            <Link href="/dashboard/projects" className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-black">All projects<ArrowRight size={13} /></Link>
          </div>
          <div className="divide-y divide-black/[0.06]">
            {projects.map((project) => <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="block p-5 transition hover:bg-[#faf9f6] sm:px-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[10px] text-neutral-400">{project.code}</span><h4 className="text-sm font-semibold">{project.name}</h4></div><p className="mt-1 text-xs text-neutral-500">{project.service}</p></div><span className={`inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[10px] font-semibold ${project.status === "Your review" ? "bg-[#f9eee6] text-[#a54820]" : "bg-neutral-100 text-neutral-700"}`}><span className={`h-1.5 w-1.5 rounded-full ${project.status === "Your review" ? "bg-[#d9480f]" : "bg-neutral-500"}`} />{project.status}</span></div>
              <div className="mt-4 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-[#141413]" style={{ width: `${project.progress}%` }} /></div><span className="w-24 text-right text-[10px] text-neutral-500">{project.due}</span></div>
            </Link>)}
          </div>
        </section>

        <section className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">Recent activity</h3><p className="mt-1 text-xs text-neutral-500">Updates across your work.</p></div><MessageSquareText size={17} className="text-neutral-400" /></div>
          <div className="mt-5 space-y-5">
            {activity.map((item) => <div key={item.text} className="flex gap-3"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.color}`} /><div><p className="text-xs font-medium leading-5">{item.text}</p><p className="mt-1 text-[10px] leading-4 text-neutral-500">{item.detail}</p></div></div>)}
          </div>
          <Link href="/dashboard/requests" className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-4 text-xs font-semibold text-neutral-600 hover:text-black">View requests and updates<ArrowUpRight size={15} /></Link>
        </section>
      </div>

      <p className="flex items-center gap-2 text-[11px] text-neutral-400"><Clock3 size={13} />Example workspace activity for layout preview.</p>
    </div>
  );
}
