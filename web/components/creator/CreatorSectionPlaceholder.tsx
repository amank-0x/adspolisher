import Link from "next/link";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";

export default function CreatorSectionPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-white/80 bg-white/75 p-7 shadow-sm backdrop-blur-xl sm:p-10">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EEF2FF] text-[#4F46E5]"><Sparkles size={21} /></span>
      <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700"><Clock3 size={12} /> Preview section</p>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#141413] sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">{description}</p>
      <p className="mt-5 rounded-2xl border border-black/[0.06] bg-[#faf9f6] p-4 text-xs leading-5 text-neutral-500">This section is being prepared. Live creator data and actions will appear here when the workspace service is connected.</p>
      <Link href="/creator" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#4F46E5] hover:underline">Back to overview <ArrowRight size={14} /></Link>
    </section>
  );
}
