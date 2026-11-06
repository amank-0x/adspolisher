"use client";

import { useMemo, useState } from "react";
import { Loader2, Mail, X } from "lucide-react";
import { backendFetch } from "@/lib/backend-api";

type ProposalRequest = {
  id: string;
  name: string;
  email: string;
  companyName?: string | null;
  attachments?: unknown;
};

type ProposalComposerProps = {
  request: ProposalRequest;
  onClose: () => void;
  onComplete: (message: string) => void;
};

function projectTitle(request: ProposalRequest) {
  const attachments = request.attachments as { projectTitle?: string; serviceNeeded?: string } | null;
  return attachments?.projectTitle || `${request.companyName || request.name} creative project`;
}

export default function ProposalComposer({ request, onClose, onComplete }: ProposalComposerProps) {
  const defaultExpiry = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().slice(0, 10);
  }, []);
  const [title, setTitle] = useState(projectTitle(request));
  const [summary, setSummary] = useState("We’ll turn your brief into a focused creative system designed for clear, consistent campaign execution.");
  const [deliverables, setDeliverables] = useState("Creative direction and campaign concept\nAd creative variations for agreed channels\nFinal export-ready files");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [timeline, setTimeline] = useState("2–3 weeks from kickoff");
  const [revisionLimit, setRevisionLimit] = useState("2");
  const [paymentTerms, setPaymentTerms] = useState("50% to begin, 50% on final delivery");
  const [expiresAt, setExpiresAt] = useState(defaultExpiry);
  const [saving, setSaving] = useState<"draft" | "send" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(mode: "draft" | "send") {
    setError(null);
    const numericPrice = Number(price);
    if (!title.trim() || !summary.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Add a title, summary, and a valid project fee before saving.");
      return;
    }

    setSaving(mode);
    try {
      const createResponse = await backendFetch("/api/v1/admin/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteRequestId: request.id,
          title: title.trim(),
          summary: summary.trim(),
          deliverables: deliverables.split("\n").map((item) => item.trim()).filter(Boolean),
          price: numericPrice,
          currency,
          timeline: timeline.trim() || null,
          revisionLimit: revisionLimit === "" ? null : Number(revisionLimit),
          paymentTerms: paymentTerms.trim() || null,
          expiresAt: expiresAt ? new Date(`${expiresAt}T23:59:59.000Z`).toISOString() : null,
        }),
      });
      const created = (await createResponse.json()) as { success?: boolean; message?: string; data?: { id: string } };
      if (!createResponse.ok || !created.success || !created.data?.id) {
        throw new Error(created.message || "Could not create proposal.");
      }

      if (mode === "send") {
        const sendResponse = await backendFetch(`/api/v1/admin/proposals/${created.data.id}/send`, { method: "POST" });
        const sent = (await sendResponse.json()) as { success?: boolean; message?: string };
        if (!sendResponse.ok || !sent.success) throw new Error(sent.message || "Could not send proposal email.");
        onComplete("Proposal saved and sent to the client.");
      } else {
        onComplete("Proposal draft saved.");
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#141413]/35 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="proposal-composer-title">
      <div className="flex max-h-[min(900px,calc(100vh-32px))] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/80 bg-[#FAF9F5] shadow-[0_28px_90px_rgba(20,20,19,0.24)]">
        <div className="flex items-start justify-between border-b border-black/[0.06] px-6 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#4F46E5]">Client communication</p>
            <h2 id="proposal-composer-title" className="mt-1 text-xl font-extrabold tracking-tight text-[#141413]">Build a proposal</h2>
            <p className="mt-1 text-xs text-neutral-500">Prepared for {request.name} · {request.email}</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-neutral-500 transition hover:bg-black/[0.05] hover:text-neutral-900" aria-label="Close proposal composer">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">{error}</div>}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="field-label">Proposal title</span><input value={title} onChange={(event) => setTitle(event.target.value)} className="field-input" /></label>
            <label className="sm:col-span-2"><span className="field-label">Summary</span><textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={4} className="field-input resize-y" /></label>
            <label><span className="field-label">Project fee</span><input required type="number" min="1" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="4500" className="field-input" /></label>
            <label><span className="field-label">Currency</span><select value={currency} onChange={(event) => setCurrency(event.target.value)} className="field-input"><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option></select></label>
            <label><span className="field-label">Timeline</span><input value={timeline} onChange={(event) => setTimeline(event.target.value)} className="field-input" /></label>
            <label><span className="field-label">Included revisions</span><input type="number" min="0" max="99" value={revisionLimit} onChange={(event) => setRevisionLimit(event.target.value)} className="field-input" /></label>
            <label><span className="field-label">Valid until</span><input type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} className="field-input" /></label>
            <label><span className="field-label">Payment terms</span><input value={paymentTerms} onChange={(event) => setPaymentTerms(event.target.value)} className="field-input" /></label>
            <label className="sm:col-span-2"><span className="field-label">Included deliverables <span className="font-normal normal-case tracking-normal text-neutral-400">(one per line)</span></span><textarea value={deliverables} onChange={(event) => setDeliverables(event.target.value)} rows={5} className="field-input resize-y" /></label>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-black/[0.06] bg-white/60 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
          <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-600 transition hover:bg-black/[0.04]">Cancel</button>
          <button disabled={saving !== null} onClick={() => save("draft")} className="rounded-xl border border-black/[0.1] bg-white px-4 py-2.5 text-xs font-bold text-neutral-800 shadow-xs transition hover:bg-neutral-50 disabled:opacity-50">{saving === "draft" ? <Loader2 size={14} className="mx-auto animate-spin" /> : "Save draft"}</button>
          <button disabled={saving !== null} onClick={() => save("send")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-50">{saving === "send" ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}Save &amp; send</button>
        </div>
      </div>
      <style jsx>{` .field-label { display:block; margin-bottom:.45rem; color:#5a5852; font-size:.68rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; } .field-input { width:100%; border:1px solid rgba(20,20,19,.1); border-radius:.75rem; background:rgba(255,255,255,.85); padding:.7rem .8rem; color:#141413; font-size:.8rem; outline:none; box-shadow:0 1px 2px rgba(20,20,19,.03); } .field-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); } `}</style>
    </div>
  );
}
