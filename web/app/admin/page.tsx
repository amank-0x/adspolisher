import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  ClipboardCheck,
  Clock3,
  FileClock,
  FileText,
  FolderKanban,
  MessageSquareText,
  UserRoundPlus,
} from "lucide-react";

const pipeline = [
  { label: "New requests", value: "05", note: "Need initial review", icon: FileText, href: "/admin/requests" },
  { label: "Need more info", value: "02", note: "Waiting on customers", icon: MessageSquareText, href: "/admin/requests" },
  { label: "Proposals pending", value: "03", note: "Awaiting decisions", icon: FileClock, href: "/admin/requests" },
  { label: "Active projects", value: "08", note: "Confirmed scope", icon: FolderKanban, href: "/admin/projects" },
];

const attention = [
  { label: "Creator submissions need review", context: "3 drafts · Oldest submitted 4h ago", action: "Open review queue", href: "/admin/review", tone: "orange" },
  { label: "Tasks are past their due date", context: "2 tasks · Across 2 projects", action: "View projects", href: "/admin/projects", tone: "red" },
  { label: "Customer revisions requested", context: "2 projects · Scope check needed", action: "Review requests", href: "/admin/requests", tone: "neutral" },
];

const recent = [
  ["New request received", "Northstar Outdoor · 1 hour ago"],
  ["Proposal accepted", "Q4 Meta Campaign · Yesterday"],
  ["Creator submitted work", "Display Retargeting · Yesterday"],
  ["Project marked complete", "Lumen Product Launch · Oct 24"],
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6 pb-2">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#b34a20]">Operations overview</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.045em] sm:text-[36px]">Good morning, team.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">Your workflow at a glance. Start with the items that need a decision.</p></div>
        <Link href="/admin/requests" className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#141413] px-4 text-sm font-semibold text-white hover:bg-neutral-700"><FileText size={16} />Open request inbox</Link>
      </section>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {pipeline.map((item) => { const Icon = item.icon; return <Link href={item.href} key={item.label} className="rounded-2xl border border-black/[0.07] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm sm:p-5"><div className="flex items-center justify-between"><p className="text-xs font-medium text-neutral-500">{item.label}</p><Icon size={17} className="text-neutral-400" /></div><p className="mt-4 text-3xl font-semibold tracking-[-.05em]">{item.value}</p><p className="mt-1 text-[11px] text-neutral-500">{item.note}</p></Link>; })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)]">
        <section className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
          <div className="border-b border-black/[0.06] px-5 py-4 sm:px-6"><div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">Needs attention</h3><p className="mt-1 text-xs text-neutral-500">Prioritized work for the operations team.</p></div><span className="rounded-full bg-[#f8e9de] px-2.5 py-1 text-[10px] font-semibold text-[#9d421b]">7 items</span></div></div>
          <div className="divide-y divide-black/[0.06]">
            {attention.map((item) => <div key={item.label} className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:px-6"><div className="flex items-start gap-3"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.tone === "red" ? "bg-red-500" : item.tone === "orange" ? "bg-[#d9480f]" : "bg-neutral-400"}`} /><div><p className="text-sm font-semibold">{item.label}</p><p className="mt-1 text-xs text-neutral-500">{item.context}</p></div></div><Link href={item.href} className="inline-flex items-center gap-1 self-start text-xs font-semibold text-neutral-600 hover:text-black sm:self-center">{item.action}<ArrowRight size={14} /></Link></div>)}
          </div>
        </section>

        <section className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between"><div><h3 className="text-sm font-semibold">Creator recruitment</h3><p className="mt-1 text-xs text-neutral-500">Application pipeline</p></div><UserRoundPlus size={18} className="text-neutral-400" /></div>
          <div className="mt-5 grid grid-cols-3 divide-x divide-black/[0.07] rounded-xl bg-[#f8f7f3] py-3">
            {[ ["02", "New"], ["03", "Shortlisted"], ["01", "Onboarding"] ].map(([value, label]) => <div key={label} className="px-2 text-center"><p className="text-xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-[10px] text-neutral-500">{label}</p></div>)}
          </div>
          <Link href="/admin/creator-applications" className="mt-4 flex items-center justify-between rounded-xl border border-black/[0.07] px-3.5 py-3 text-xs font-semibold transition hover:bg-neutral-50"><span className="flex items-center gap-2"><BriefcaseBusiness size={15} className="text-neutral-500" />Review applications</span><ArrowUpRight size={15} className="text-neutral-400" /></Link>
          <Link href="/admin/team" className="mt-2 flex items-center justify-between rounded-xl border border-black/[0.07] px-3.5 py-3 text-xs font-semibold transition hover:bg-neutral-50"><span className="flex items-center gap-2"><UserRoundPlus size={15} className="text-neutral-500" />Manage team access</span><ArrowUpRight size={15} className="text-neutral-400" /></Link>
        </section>
      </div>

      <section className="rounded-2xl border border-black/[0.07] bg-white">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 sm:px-6"><div><h3 className="text-sm font-semibold">Recent activity</h3><p className="mt-1 text-xs text-neutral-500">Recent changes across requests, projects, and recruiting.</p></div><Clock3 size={17} className="text-neutral-400" /></div>
        <div className="grid divide-y divide-black/[0.06] sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
          {recent.map(([title, detail]) => <div key={title} className="flex items-start gap-3 px-5 py-4 sm:px-6"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-neutral-300" /><div><p className="text-xs font-medium">{title}</p><p className="mt-1 text-[11px] text-neutral-500">{detail}</p></div></div>)}
        </div>
      </section>
      <p className="text-[11px] text-neutral-400">Pipeline numbers are sample figures for this dashboard preview.</p>
    </div>
  );
}
