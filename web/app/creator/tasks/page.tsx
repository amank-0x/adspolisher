import Link from "next/link";
import { ArrowUpRight, CalendarClock, ClipboardCheck } from "lucide-react";

const tasks = [
  { id: "task-301", title: "Spring launch · Paid social hooks", project: "Northstar Outdoor · AP-2214", due: "Today · 4:00 PM", status: "In progress", priority: "High" },
  { id: "task-302", title: "Product carousel · 6 frames", project: "Lumen Product Launch · AP-2208", due: "Tomorrow", status: "Changes requested", priority: "Normal" },
  { id: "task-303", title: "Display variations · 3 sizes", project: "Fieldnote Campaign · AP-2197", due: "Oct 31", status: "Submitted for review", priority: "Normal" },
  { id: "task-304", title: "UGC opening hooks · 4 options", project: "Morrow Wellness · AP-2191", due: "Nov 02", status: "To do", priority: "Normal" },
];

export default function CreatorTasksPage() {
  return <div className="space-y-6 pb-4">
    <div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#b34a20]">Production queue</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.045em]">My tasks</h2><p className="mt-2 text-sm text-neutral-500">Work assigned to you, with brief, priority, status, and deadline.</p></div>
    <section className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
      <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 sm:px-6"><div className="flex items-center gap-2"><ClipboardCheck size={17} className="text-neutral-400" /><h3 className="text-sm font-semibold">Assigned work</h3></div><span className="text-xs text-neutral-500">4 sample tasks</span></div>
      <div className="divide-y divide-black/[0.06]">{tasks.map((task) => <Link key={task.id} href={`/creator/tasks/${task.id}`} className="flex flex-col justify-between gap-3 p-5 transition hover:bg-[#faf9f6] sm:flex-row sm:items-center sm:px-6"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h4 className="text-sm font-semibold">{task.title}</h4>{task.priority === "High" && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">High</span>}</div><p className="mt-1 text-xs text-neutral-500">{task.project}</p></div><div className="flex flex-wrap items-center gap-3 sm:justify-end"><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-medium text-neutral-700">{task.status}</span><span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500"><CalendarClock size={13} />{task.due}</span><ArrowUpRight size={15} className="text-neutral-400" /></div></Link>)}</div>
    </section>
    <p className="text-[11px] text-neutral-400">This preview contains sample task data; only assigned work should appear in the live creator workspace.</p>
  </div>;
}
