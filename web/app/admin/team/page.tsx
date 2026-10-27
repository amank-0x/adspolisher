export default function AdminTeamPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-5xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Route: /admin/team
        </span>
        <h1 className="text-3xl font-bold mt-2">Team &amp; Access Management — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Directory of agency creators and administrators with invitation controls.
        </p>

        <div className="mt-6 space-y-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Features to build on this page:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>View all active Creators and Admins with current workloads and assigned tasks</li>
            <li>Send invitations to approved creators or administrators using expiring single-use tokens</li>
            <li>Role-based access management with server-side validation</li>
            <li>Deactivate or suspend access when needed</li>
            <li>Immutable audit logging for all permission grants and team status modifications</li>
          </ul>

          <div className="mt-4 pt-4 border-t border-neutral-300 text-xs text-neutral-500 italic">
            Security rule: Admin invitations use cryptographically random, single-use tokens sent to verified email addresses. Client-side self-promotion is strictly disallowed.
          </div>
        </div>
      </div>
    </div>
  );
}
