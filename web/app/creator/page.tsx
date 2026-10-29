import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  MessageSquareText,
} from "lucide-react";

const tasks = [
  { id: "task-301", title: "Spring launch · Paid social hooks", project: "Northstar Outdoor · AP-2214", due: "Today · 4:00 PM", priority: "High", status: "In progress", progress: 68 },
  { id: "task-302", title: "Product carousel · 6 frames", project: "Lumen Product Launch · AP-2208", due: "Tomorrow", priority: "Normal", status: "Changes requested", progress: 42 },
  { id: "task-303", title: "Display variations · 3 sizes", project: "Fieldnote Campaign · AP-2197", due: "Oct 31", priority: "Normal", status: "Submitted for review", progress: 100 },
];

const counts = [
  { label: "Assigned tasks", value: "06", note: "Across 4 projects", icon: ClipboardCheck },
  { label: "Due soon", value: "02", note: "Next 48 hours", icon: CalendarClock },
  { label: "Revisions requested", value: "01", note: "Feedback is ready", icon: CircleAlert },
  { label: "Completed", value: "12", note: "This month", icon: CheckCircle2 },
];

export default function CreatorDashboardPage() {
  return (
    <div className="space-y-6 pb-2">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#b34a20]">Creator workspace</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.045em] sm:text-[36px]">Your work, in focus.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">See your priorities, deadlines, and the feedback needed for your next submission.</p></div>
        <Link href="/creator/tasks" className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#141413] px-4 text-sm font-semibold text-white hover:bg-neutral-700"><ClipboardCheck size={16} />Open my tasks</Link>
      </section>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {counts.map((item) => { const Icon = item.icon; return <article key={item.label} className="rounded-2xl border border-black/[0.07] bg-white p-4 sm:p-5"><div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-neutral-500">{item.label}</p><Icon size={17} className="text-neutral-400" /></div><p className="mt-4 text-3xl font-semibold tracking-[-.05em]">{item.value}</p><p className="mt-1 text-[11px] text-neutral-500">{item.note}</p></article>; })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(290px,.7fr)]">
        <section className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-4 sm:px-6"><div><h3 className="text-sm font-semibold">Priority tasks</h3><p className="mt-1 text-xs text-neutral-500">Your nearest deadlines and next actions.</p></div><Link href="/creator/tasks" className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-black">All tasks<ArrowRight size={13} /></Link></div>
          <div className="divide-y divide-black/[0.06]">
            {tasks.map((task) => <Link key={task.id} href={`/creator/tasks/${task.id}`} className="block p-5 transition hover:bg-[#faf9f6] sm:px-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h4 className="text-sm font-semibold">{task.title}</h4>{task.priority === "High" && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">High priority</span>}</div><p className="mt-1 text-xs text-neutral-500">{task.project}</p></div><span className={`inline-flex items-center self-start rounded-full px-2.5 py-1 text-[10px] font-semibold ${task.status === "Changes requested" ? "bg-[#fff2e7] text-[#a3481c]" : task.status === "Submitted for review" ? "bg-emerald-50 text-emerald-800" : "bg-neutral-100 text-neutral-700"}`}>{task.status}</span></div><div className="mt-4 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-[#141413]" style={{ width: `${task.progress}%` }} /></div><span className="w-28 text-right text-[10px] text-neutral-500">Due {task.due}</span></div></Link>)}
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-[#d9480f]/20 bg-[#fffaf5] p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f5e5d8] text-[#a43e13]"><MessageSquareText size={17} /></span><div><h3 className="text-sm font-semibold">Latest feedback</h3><p className="mt-1 text-[11px] text-neutral-500">Lumen Product Launch · 30 min ago</p></div></div><p className="mt-4 text-xs leading-5 text-neutral-700">“Please strengthen the first-frame product contrast and submit one alternate headline treatment.”</p><Link href="/creator/tasks/task-302" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#9d421b] hover:underline">Open task feedback<ArrowUpRight size={13} /></Link></section>
          <section className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-6"><div className="flex items-center gap-2"><Clock3 size={17} className="text-neutral-400" /><h3 className="text-sm font-semibold">Upcoming deadlines</h3></div><div className="mt-4 space-y-3"><div className="flex items-center justify-between gap-3 text-xs"><span className="truncate text-neutral-700">Paid social hooks</span><span className="shrink-0 font-medium text-[#a3481c]">Today, 4 PM</span></div><div className="flex items-center justify-between gap-3 text-xs"><span className="truncate text-neutral-700">Product carousel</span><span className="shrink-0 text-neutral-500">Tomorrow</span></div><div className="flex items-center justify-between gap-3 text-xs"><span className="truncate text-neutral-700">Display variations</span><span className="shrink-0 text-neutral-500">Oct 31</span></div></div></section>
        </div>
      </div>
      <p className="text-[11px] text-neutral-400">Task names, feedback, and dates shown here are sample workspace data.</p>
    </div>
  );
}
