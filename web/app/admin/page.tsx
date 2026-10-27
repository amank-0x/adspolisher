import Link from 'next/link';

export default function AdminOverviewPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-5xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Route: /admin</span>
        <h1 className="text-3xl font-bold mt-2">Admin Overview — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Agency operations dashboard for reviewing requests, active projects, and quality control.
        </p>

        <div className="mt-6 space-y-4 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Key metrics &amp; queues to build on this page:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="border border-neutral-300 rounded p-3 bg-white/60">
              <span className="font-bold text-neutral-900">1. New Quote Requests</span>
              <p className="text-neutral-500 mt-0.5">Incoming leads needing initial qualification.</p>
            </div>
            <div className="border border-neutral-300 rounded p-3 bg-white/60">
              <span className="font-bold text-neutral-900">2. Requests Needing More Info</span>
              <p className="text-neutral-500 mt-0.5">Awaiting customer answer or brief clarification.</p>
            </div>
            <div className="border border-neutral-300 rounded p-3 bg-white/60">
              <span className="font-bold text-neutral-900">3. Proposals Awaiting Decisions</span>
              <p className="text-neutral-500 mt-0.5">Commercial quotes sent and pending customer acceptance.</p>
            </div>
            <div className="border border-neutral-300 rounded p-3 bg-white/60">
              <span className="font-bold text-neutral-900">4. Active Confirmed Projects</span>
              <p className="text-neutral-500 mt-0.5">Live creative production currently in progress.</p>
            </div>
            <div className="border border-neutral-300 rounded p-3 bg-white/60">
              <span className="font-bold text-neutral-900">5. Overdue Creator Tasks</span>
              <p className="text-neutral-500 mt-0.5">Tasks past due date needing operational intervention.</p>
            </div>
            <div className="border border-neutral-300 rounded p-3 bg-white/60">
              <span className="font-bold text-neutral-900">6. Creative Work Waiting Review</span>
              <p className="text-neutral-500 mt-0.5">Drafts uploaded by creators pending QA before client release.</p>
            </div>
            <div className="border border-neutral-300 rounded p-3 bg-white/60 md:col-span-2">
              <span className="font-bold text-neutral-900">7. New Creator Applications</span>
              <p className="text-neutral-500 mt-0.5">Applicants awaiting review and portfolio vetting.</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-300">
            <p className="font-semibold text-xs text-neutral-900 mb-2">Admin Workspace Navigation:</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href="/admin/requests" className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded">
                Requests (/admin/requests)
              </Link>
              <Link href="/admin/projects" className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded">
                Projects (/admin/projects)
              </Link>
              <Link href="/admin/creator-applications" className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded">
                Creator Applications (/admin/creator-applications)
              </Link>
              <Link href="/admin/team" className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded">
                Team (/admin/team)
              </Link>
              <Link href="/admin/services" className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded">
                Services (/admin/services)
              </Link>
              <Link href="/admin/portfolio" className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded">
                Portfolio (/admin/portfolio)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
