import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function RequestDetailContent({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
      <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
        Route: /dashboard/requests/{id}
      </span>
      <h1 className="text-3xl font-bold mt-2">Request &amp; Proposal Details — Blank Page</h1>
      <p className="text-neutral-600 mt-2">
        Customer workspace for viewing brief, answering follow-up questions, and reviewing proposals.
      </p>

      <div className="mt-6 space-y-4 text-sm text-neutral-700">
        <p className="font-semibold text-neutral-900">Features to build on this page:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>Review the submitted business brief (industry, platforms, goals, timeline, assets)</li>
          <li>Answer admin follow-up questions in a thread</li>
          <li>
            View formal proposal:
            <ul className="list-circle pl-5 mt-1 space-y-0.5">
              <li>Scope &amp; deliverables</li>
              <li>Price &amp; currency</li>
              <li>Timeline &amp; estimated delivery date</li>
              <li>Revision limits &amp; turnaround terms</li>
              <li>Payment terms</li>
            </ul>
          </li>
          <li>Customer decision actions: Accept Proposal or Decline Proposal</li>
        </ul>
      </div>
    </div>
  );
}

export default function CustomerRequestDetailPage(props: PageProps) {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-4xl mx-auto">
      <Suspense fallback={<div className="p-8 text-sm text-neutral-500">Loading request details...</div>}>
        <RequestDetailContent params={props.params} />
      </Suspense>
    </div>
  );
}
