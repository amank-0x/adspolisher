export default function AdminRequestsPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-5xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Route: /admin/requests
        </span>
        <h1 className="text-3xl font-bold mt-2">Quote Requests &amp; Proposals — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Admin portal for reviewing incoming project enquiries, sending proposals, and qualifying deals.
        </p>

        <div className="mt-6 space-y-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Features to build on this page:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Review business details, brand links, budget, and project briefs</li>
            <li>Status filters: NEW, IN_REVIEW, NEEDS_INFORMATION, ACCEPTED, DECLINED, CONVERTED</li>
            <li>Threaded follow-up questions to ask clients for more info</li>
            <li>Proposal composer: scope, deliverables, price, currency, deadline, revision limit, payment terms</li>
            <li>Accept or decline requests with an internal reason recorded</li>
            <li>&quot;Convert to Project&quot; action once a proposal is accepted</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
