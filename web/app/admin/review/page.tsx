import Link from "next/link";
import { ArrowUpRight, Clock3, FileCheck2 } from "lucide-react";

const queue = [
  { title: "Display Retargeting · Banner set v2", creator: "Mina Patel", project: "AP-1988 · 6 assets", submitted: "4 hours ago", priority: "Due today" },
  { title: "Q4 Meta Campaign · Hook variation 03", creator: "Jordan Lee", project: "AP-2041 · 1 video", submitted: "Yesterday", priority: "On schedule" },
  { title: "Northstar Outdoor · Storyboard draft", creator: "Avery Chen", project: "AP-2214 · 1 concept", submitted: "Yesterday", priority: "Due tomorrow" },
];

export default function AdminCreativeReviewPage() {
  return <div className="space-y-6 pb-4">
    <div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#b34a20]">Quality control</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.045em]">Creative reviews</h2><p className="mt-2 text-sm text-neutral-500">Review creator submissions before releasing work for customer feedback.</p></div>
    <section className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
      <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 sm:px-6"><div className="flex items-center gap-2"><FileCheck2 size={17} className="text-neutral-400" /><h3 className="text-sm font-semibold">Waiting for internal review</h3></div><span className="rounded-full bg-[#f8e9de] px-2.5 py-1 text-[10px] font-semibold text-[#9d421b]">3 items</span></div>
      <div className="divide-y divide-black/[0.06]">{queue.map((item) => <article key={item.title} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6"><div className="min-w-0"><h4 className="text-sm font-semibold">{item.title}</h4><p className="mt-1 text-xs text-neutral-500">{item.project} · Submitted by {item.creator}</p><p className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-neutral-500"><Clock3 size={12} />Submitted {item.submitted} · {item.priority}</p></div><Link href="/admin/projects" className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-black/[0.1] px-3 text-xs font-semibold hover:bg-neutral-50 sm:self-auto">Open project<ArrowUpRight size={14} /></Link></article>)}</div>
    </section>
    <p className="text-[11px] text-neutral-400">Example review queue. Approve or return actions require connected review workflows.</p>
  </div>;
}
