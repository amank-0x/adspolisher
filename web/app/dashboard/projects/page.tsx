export default function CustomerProjectsListPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-4xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Route: /dashboard/projects
        </span>
        <h1 className="text-3xl font-bold mt-2">My Projects — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          List and track confirmed client projects and active production.
        </p>

        <div className="mt-6 space-y-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Features to build on this page:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Filter projects by status: All, Intake, In Progress, In Review, Waiting for Client, Completed</li>
            <li>Project cards showing project code, title, milestone progress bar, and estimated due date</li>
            <li>Alerts for items needing client review or feedback</li>
            <li>Links to individual project workspaces <code className="bg-neutral-200 px-1 py-0.5 rounded text-xs">/dashboard/projects/[id]</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
