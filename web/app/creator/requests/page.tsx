"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { backendFetch } from "@/lib/backend-api";
import { ArrowRight, Check, Clock3, LoaderCircle, X } from "lucide-react";

type CreatorOffer = {
  id: string; offerCode: string; roleTitle: string; scopeSummary: string; currency: string;
  currentAmount: string; status: string; proposedDueDate: string | null; expiresAt: string | null;
  project: { id: string; projectCode: string; title: string; status: string };
};

export default function CreatorRequestsPage() {
  const [offers, setOffers] = useState<CreatorOffer[]>([]);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOffers = useCallback(async () => {
    try {
      const response = await backendFetch("/api/v1/creator/offers");
      const payload = await response.json();
      if (payload.success) setOffers(payload.data || []);
      else setNotice(payload.message || "Could not load project offers.");
    } catch { setNotice("Could not load project offers."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadOffers(); }, [loadOffers]);

  const respond = async (offer: CreatorOffer, action: "ACCEPT" | "DECLINE" | "COUNTER") => {
    setBusyId(offer.id); setNotice("");
    try {
      const response = await backendFetch(`/api/v1/creator/offers/${offer.id}/respond`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...(action === "COUNTER" ? { amount: Number(amounts[offer.id]), message: messages[offer.id] || "Requesting an adjustment to the creator fee." } : {}) }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Could not send your response.");
      setNotice(payload.message); await loadOffers();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not send your response."); }
    finally { setBusyId(null); }
  };

  return <div className="space-y-6 pb-12">
    <header><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#4F46E5]">Offers inbox</p><h1 className="mt-2 text-3xl font-extrabold">Project requests</h1><p className="mt-2 text-sm text-neutral-600">Review the project scope and proposed creator fee. Accept, decline, or counter the offer.</p></header>
    {notice && <p role="status" className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-800">{notice}</p>}
    {loading ? <div className="flex items-center gap-2 rounded-2xl bg-white/70 p-8 text-sm text-neutral-500"><LoaderCircle className="animate-spin" size={16}/> Loading your offers…</div> : offers.length === 0 ? <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 p-10 text-center text-sm text-neutral-600">No project offers yet. New offers from the AdsPolisher team will appear here.</div> : <div className="grid gap-4 xl:grid-cols-2">{offers.map((offer) => {
      const canRespond = ["SENT", "COUNTERED_BY_ADMIN"].includes(offer.status);
      return <article key={offer.id} className="rounded-2xl border border-black/[0.07] bg-white/85 p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-[11px] text-neutral-500">{offer.offerCode} · {offer.project.projectCode}</p><h2 className="mt-1 text-lg font-bold">{offer.project.title}</h2></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-800">{offer.status.replaceAll("_", " ")}</span></div>
        <p className="mt-4 text-sm leading-6 text-neutral-600">{offer.scopeSummary}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#f7f6f2] p-3 text-xs"><div><p className="text-neutral-500">Your proposed fee</p><p className="mt-1 text-base font-extrabold">{offer.currency} {Number(offer.currentAmount).toLocaleString()}</p></div><div><p className="text-neutral-500">Role · Deadline</p><p className="mt-1 font-semibold text-neutral-800">{offer.roleTitle}<br/>{offer.proposedDueDate ? new Date(offer.proposedDueDate).toLocaleDateString() : "To be agreed"}</p></div></div>
        {offer.expiresAt && <p className="mt-3 flex items-center gap-1.5 text-[11px] text-neutral-500"><Clock3 size={13}/>Respond by {new Date(offer.expiresAt).toLocaleString()}</p>}
        {canRespond ? <div className="mt-4 space-y-2 border-t border-black/[0.06] pt-4"><textarea value={messages[offer.id] || ""} onChange={(event) => setMessages((prev) => ({ ...prev, [offer.id]: event.target.value }))} rows={2} placeholder="Note for your counter-offer (optional for accept/decline)" className="w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-[#4F46E5]"/><div className="flex flex-wrap gap-2"><button disabled={busyId === offer.id} onClick={() => void respond(offer,"ACCEPT")} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white disabled:opacity-50"><Check size={14}/>Accept</button><button disabled={busyId === offer.id} onClick={() => void respond(offer,"DECLINE")} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 disabled:opacity-50"><X size={14}/>Decline</button></div><div className="flex flex-wrap gap-2"><input type="number" min="1" step="0.01" value={amounts[offer.id] || ""} onChange={(event) => setAmounts((prev) => ({ ...prev, [offer.id]: event.target.value }))} placeholder={`Counter fee (${offer.currency})`} className="min-w-0 flex-1 rounded-xl border border-black/10 px-3 py-2 text-xs"/><button disabled={busyId === offer.id || !Number(amounts[offer.id])} onClick={() => void respond(offer,"COUNTER")} className="rounded-xl bg-[#4F46E5] px-3.5 py-2 text-xs font-bold text-white disabled:opacity-50">Request higher fee</button></div></div> : offer.status === "ACCEPTED" ? <Link href={`/creator/projects/${offer.project.id}`} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#4F46E5]">Open project <ArrowRight size={14}/></Link> : null}
      </article>;
    })}</div>}
  </div>;
}
