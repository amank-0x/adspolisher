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
  Sparkles,
  Flame,
} from "lucide-react";

const pipeline = [
  { label: "New requests", value: "05", note: "Need initial review", icon: FileText, href: "/admin/requests", color: "indigo" },
  { label: "Need more info", value: "02", note: "Waiting on customers", icon: MessageSquareText, href: "/admin/requests", color: "cyan" },
  { label: "Proposals pending", value: "03", note: "Awaiting decisions", icon: FileClock, href: "/admin/requests", color: "amber" },
  { label: "Active projects", value: "08", note: "Confirmed scope", icon: FolderKanban, href: "/admin/projects", color: "emerald" },
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
    <div className="space-y-8 pb-12">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 backdrop-blur-md shadow-xs mb-3">
            <Sparkles size={13} className="text-[#4F46E5]" />
            <span>Studio Operations Command</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] sm:text-4xl">
            Good morning, team.
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#5A5852]">
            Studio workflow at a glance. Review creator submissions, clear customer blockers, and assign new briefs.
          </p>
        </div>
        <Link
          href="/admin/requests"
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#141413] to-[#2B2927] px-5 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] hover:from-neutral-900 hover:to-neutral-800"
        >
          <FileText size={16} />
          <span>Open request inbox</span>
        </Link>
      </section>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {pipeline.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              href={item.href}
              key={item.label}
              className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/75 backdrop-blur-xl p-5 shadow-[0_4px_20px_rgba(20,20,19,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  {item.label}
                </p>
                <span
                  className={`grid h-8 w-8 place-items-center rounded-xl shadow-xs ${
                    item.color === 'indigo'
                      ? 'bg-[#EEF2FF] text-[#4F46E5]'
                      : item.color === 'cyan'
                      ? 'bg-[#ECFEFF] text-[#0891B2]'
                      : item.color === 'amber'
                      ? 'bg-[#FFFBEB] text-[#D97706]'
                      : 'bg-[#ECFDF5] text-[#059669]'
                  }`}
                >
                  <Icon size={16} />
                </span>
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-tight tabular-nums text-[#141413]">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-[#5A5852]">{item.note}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)]">
        {/* Needs Attention */}
        <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
          <div className="border-b border-black/[0.06] px-6 py-4 bg-white/50 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#141413]">Needs attention</h3>
                <p className="mt-0.5 text-xs text-[#5A5852]">Prioritized queue for the studio ops team.</p>
              </div>
              <span className="rounded-full border border-[#D9480F]/20 bg-[#D9480F]/10 px-3 py-1 text-xs font-bold text-[#D9480F]">
                7 items
              </span>
            </div>
          </div>
          <div className="divide-y divide-black/[0.05]">
            {attention.map((item) => (
              <div
                key={item.label}
                className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:px-6 transition hover:bg-white/90"
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full shadow-xs ${
                      item.tone === "red"
                        ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                        : item.tone === "orange"
                        ? "bg-[#D9480F] shadow-[0_0_8px_rgba(217,72,15,0.6)]"
                        : "bg-neutral-400"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-bold text-[#141413]">{item.label}</p>
                    <p className="mt-0.5 text-xs text-[#5A5852]">{item.context}</p>
                  </div>
                </div>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 self-start rounded-xl border border-black/[0.08] bg-white px-3.5 py-1.5 text-xs font-bold text-[#141413] shadow-xs transition hover:border-[#4F46E5]/40 hover:bg-neutral-50 sm:self-center"
                >
                  <span>{item.action}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Creator Recruitment & Recent Feed */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
            <div className="flex items-start justify-between border-b border-black/[0.06] pb-3.5">
              <div>
                <h3 className="text-sm font-bold text-[#141413]">Creator Recruitment</h3>
                <p className="mt-0.5 text-[11px] text-neutral-500">Talent pipeline</p>
              </div>
              <UserRoundPlus size={18} className="text-[#4F46E5]" />
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x divide-black/[0.07] rounded-2xl border border-black/[0.06] bg-white/60 py-3 shadow-xs">
              {[
                ["02", "New"],
                ["03", "Shortlisted"],
                ["01", "Onboarding"],
              ].map(([value, label]) => (
                <div key={label} className="px-2 text-center">
                  <p className="text-xl font-extrabold tracking-tight tabular-nums text-[#141413]">
                    {value}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/admin/creator-applications"
              className="mt-4 flex items-center justify-between rounded-xl border border-black/[0.06] bg-white/80 px-4 py-2.5 text-xs font-bold text-[#4F46E5] shadow-xs backdrop-blur-md transition hover:bg-white hover:underline"
            >
              <span className="flex items-center gap-2">
                <BriefcaseBusiness size={15} /> Review applications
              </span>
              <ArrowUpRight size={14} />
            </Link>
          </section>

          <section className="rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
            <div className="flex items-center gap-2 border-b border-black/[0.06] pb-3.5">
              <Clock3 size={16} className="text-[#4F46E5]" />
              <h3 className="text-sm font-bold text-[#141413]">Recent ops events</h3>
            </div>
            <div className="mt-4 space-y-3">
              {recent.map(([title, subtitle]) => (
                <div key={title} className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-neutral-800 truncate">{title}</span>
                  <span className="text-neutral-500 shrink-0 text-[11px]">{subtitle}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
