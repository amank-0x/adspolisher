export default function AdminCreatorApplicationsPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-5xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Route: /admin/creator-applications
        </span>
        <h1 className="text-3xl font-bold mt-2">Creator Applications — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Admin workflow for vetting creative talent and reviewing inbound creator applications.
        </p>

        <div className="mt-6 space-y-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Features to build on this page:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Review applicant profiles, portfolio links, tools, experience, and weekly availability</li>
            <li>Status pipeline: PENDING, UNDER_REVIEW, SHORTLISTED, REJECTED, APPROVED</li>
            <li>Internal evaluation notes textarea for team review</li>
            <li>Approve applicant action: triggers a formal creator onboarding invitation email</li>
            <li>Decline action with standard or customized feedback message</li>
            <li>Separation of concerns: reviewing applications remains distinct from assigning system roles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
