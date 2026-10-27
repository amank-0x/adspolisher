import Link from 'next/link';

export default function CustomerRequestsListPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-4xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Route: /dashboard/requests
        </span>
        <h1 className="text-3xl font-bold mt-2">My Requests — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          List and filter customer quote requests and proposals.
        </p>

        <div className="mt-6 space-y-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Features to build on this page:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Filter requests by status: All, In Review, Needs Info, Proposal Sent, Accepted, Declined</li>
            <li>Summary cards with title, submitted date, service type, and current status badge</li>
            <li>Links to individual request detail pages <code className="bg-neutral-200 px-1 py-0.5 rounded text-xs">/dashboard/requests/[id]</code></li>
            <li>Direct action button to submit another request <code className="bg-neutral-200 px-1 py-0.5 rounded text-xs">/dashboard/requests/new</code></li>
          </ul>

          <div className="mt-4 pt-4 border-t border-neutral-300">
            <Link
              href="/dashboard/requests/new"
              className="inline-block py-2 px-4 bg-black text-white text-xs font-bold rounded-lg hover:bg-neutral-800"
            >
              Start New Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
