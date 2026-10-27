export default function AdminProjectsPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-5xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Route: /admin/projects
        </span>
        <h1 className="text-3xl font-bold mt-2">Projects Management — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Admin console for managing active creative production, assignments, and QA.
        </p>

        <div className="mt-6 space-y-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Features to build on this page:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>List and filter projects by status: INTAKE, PLANNED, IN_PROGRESS, IN_REVIEW, WAITING_FOR_CLIENT, COMPLETED</li>
            <li>Set milestones, target launch dates, and creator deadlines</li>
            <li>Assign or reassign creators to projects and tasks</li>
            <li>Review creator-submitted draft files and version history</li>
            <li>Quality review actions: return work with feedback OR approve it for customer review</li>
            <li>Track revision rounds, customer feedback, and final deliverable sign-offs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
