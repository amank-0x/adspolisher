export default function CreatorDashboardPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-5xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Route: /creator
        </span>
        <h1 className="text-3xl font-bold mt-2">Creator Dashboard — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Private creator workspace for assigned tasks, deadlines, and revisions.
        </p>

        <div className="mt-6 space-y-4 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Features to build on this page:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Role protection: accessible only to users with CREATOR role</li>
            <li>Summary counters: Assigned Tasks, In Review, Revisions Requested, Completed</li>
            <li>Tasks list with status pills (In Progress, Ready for Review, Changes Requested, Completed)</li>
            <li>Priority badges (Urgent, Normal, Low) and deadline countdowns</li>
            <li>Section for tasks needing creator updates or responding to admin feedback</li>
            <li>Direct links to individual task workspaces <code className="bg-neutral-200 px-1 py-0.5 rounded text-xs">/creator/tasks/[id]</code></li>
          </ul>

          <div className="mt-4 pt-4 border-t border-neutral-300 text-xs text-neutral-500 italic">
            Note: Creators can only see tasks assigned to them. They cannot set customer pricing, assign themselves work, or publish client work without approval.
          </div>
        </div>
      </div>
    </div>
  );
}
