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
  Sparkles,
  Flame,
} from "lucide-react";

const tasks = [
  { id: "task-301", title: "Spring launch · Paid social hooks", project: "Northstar Outdoor · AP-2214", due: "Today · 4:00 PM", priority: "High", status: "In progress", progress: 68 },
  { id: "task-302", title: "Product carousel · 6 frames", project: "Lumen Product Launch · AP-2208", due: "Tomorrow", priority: "Normal", status: "Changes requested", progress: 42 },
  { id: "task-303", title: "Display variations · 3 sizes", project: "Fieldnote Campaign · AP-2197", due: "Oct 31", priority: "Normal", status: "Submitted for review", progress: 100 },
];

const counts = [
  { label: "Assigned tasks", value: "06", note: "Across 4 projects", icon: ClipboardCheck, color: "indigo" },
  { label: "Due soon", value: "02", note: "Next 48 hours", icon: CalendarClock, color: "amber" },
  { label: "Revisions requested", value: "01", note: "Feedback is ready", icon: CircleAlert, color: "rose" },
  { label: "Completed", value: "12", note: "This month", icon: CheckCircle2, color: "emerald" },
];

export default function CreatorDashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 backdrop-blur-md shadow-xs mb-3">
            <Sparkles size={13} className="text-[#4F46E5]" />
            <span>Creator Studio Workspace</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] sm:text-4xl">
            Your work, in focus.
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#5A5852]">
            Review your active sprint tasks, upcoming pod deadlines, and client iteration requests.
          </p>
        </div>
        <Link
          href="/creator/tasks"
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#141413] to-[#2B2927] px-5 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] hover:from-neutral-900 hover:to-neutral-800"
        >
          <ClipboardCheck size={16} />
          <span>Open my tasks</span>
        </Link>
      </section>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {counts.map((item) => {
          const Icon = item.icon;
          return (
            <article
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
                      : item.color === 'amber'
                      ? 'bg-[#FFFBEB] text-[#D97706]'
                      : item.color === 'rose'
                      ? 'bg-[#FFF1F2] text-[#E11D48]'
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
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(290px,.7fr)]">
        {/* Priority Tasks */}
        <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
          <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-6 py-4 bg-white/50 backdrop-blur-md">
            <div>
              <h3 className="text-base font-bold text-[#141413]">Priority tasks</h3>
              <p className="mt-0.5 text-xs text-[#5A5852]">Your nearest sprint deadlines and next deliverables.</p>
            </div>
            <Link
              href="/creator/tasks"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] hover:underline"
            >
              All tasks <ArrowRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-black/[0.05]">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/creator/tasks/${task.id}`}
                className="block p-5 sm:px-6 transition hover:bg-white/90"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-[#141413] hover:text-[#4F46E5] transition-colors">
                        {task.title}
                      </h4>
                      {task.priority === "High" && (
                        <span className="rounded-md border border-red-500/20 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          High priority
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#5A5852]">{task.project}</p>
                  </div>
                  <span
                    className={`inline-flex items-center self-start rounded-full px-2.5 py-1 text-[11px] font-bold shadow-xs ${
                      task.status === "Changes requested"
                        ? "border border-[#D9480F]/20 bg-[#D9480F]/10 text-[#D9480F]"
                        : task.status === "Submitted for review"
                        ? "border border-emerald-500/20 bg-emerald-50 text-emerald-800"
                        : "border border-black/[0.06] bg-black/[0.03] text-neutral-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#141413] to-[#4F46E5]"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="w-32 text-right text-xs font-semibold text-neutral-500">
                    Due {task.due}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Right Rail */}
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
            <div className="flex items-start gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F5E5D8] text-[#A43E13] shadow-xs">
                <MessageSquareText size={18} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#141413]">Latest client feedback</h3>
                <p className="mt-0.5 text-[11px] text-neutral-500">Lumen Product Launch · 30 min ago</p>
              </div>
            </div>
            <p className="mt-3.5 text-xs leading-relaxed text-neutral-700 bg-[#FAF9F5] p-3 rounded-xl border border-black/[0.04]">
              &ldquo;Please strengthen the first-frame product contrast and submit one alternate headline treatment.&rdquo;
            </p>
            <Link
              href="/creator/tasks/task-302"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#D9480F] hover:underline"
            >
              <span>Open task feedback</span>
              <ArrowUpRight size={13} />
            </Link>
          </section>

          <section className="rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
            <div className="flex items-center gap-2 border-b border-black/[0.06] pb-3.5">
              <Clock3 size={16} className="text-[#4F46E5]" />
              <h3 className="text-sm font-bold text-[#141413]">Upcoming pod deadlines</h3>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-neutral-800">Paid social hooks</span>
                <span className="font-bold text-[#D9480F]">Today, 4 PM</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-neutral-800">Product carousel</span>
                <span className="text-neutral-500">Tomorrow</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-neutral-800">Display variations</span>
                <span className="text-neutral-500">Oct 31</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
