export default function BecomeACreatorPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-4xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Route: /become-a-creator</span>
        <h1 className="text-3xl font-bold mt-2">Become a Creator (Public Application) — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Public application form to apply to join the AdsPolisher creative team.
        </p>

        <div className="mt-6 space-y-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Application fields to build:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Name and email</li>
            <li>Location and time zone</li>
            <li>Skills and service specialties (Meta Ads, Motion Graphics, UGC, 3D, Copywriting)</li>
            <li>Portfolio links and selected work</li>
            <li>Tools/platforms used (Figma, After Effects, Premiere, Photoshop, Midjourney)</li>
            <li>Experience level &amp; background</li>
            <li>Availability and preferred workload (hours/week)</li>
            <li>Short application message / why AdsPolisher</li>
            <li>Agreement that submitted portfolio material may be reviewed</li>
          </ul>

          <div className="mt-4 pt-4 border-t border-neutral-300 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-900">Post-submission Workflow: </span>
            Create a CreatorApplication record with status PENDING, send receipt email, notify admins. (Access is not granted automatically).
          </div>
        </div>
      </div>
    </div>
  );
}
