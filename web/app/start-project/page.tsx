export default function StartProjectPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-4xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Route: /start-project</span>
        <h1 className="text-3xl font-bold mt-2">Start a Project (Intake) — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Collect information to understand a business and its needs before preparing a proposal.
        </p>

        <div className="mt-6 space-y-4 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Multi-step form flow to build:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-neutral-300 rounded-lg p-4 bg-white/70">
              <h3 className="font-bold text-neutral-900">Step 1 — Contact</h3>
              <ul className="list-disc pl-5 mt-1.5 space-y-1 text-xs">
                <li>Contact person&apos;s name</li>
                <li>Work email</li>
                <li>Business name</li>
                <li>Website or primary business/social link</li>
                <li>Country and time zone</li>
              </ul>
            </div>

            <div className="border border-neutral-300 rounded-lg p-4 bg-white/70">
              <h3 className="font-bold text-neutral-900">Step 2 — Business</h3>
              <ul className="list-disc pl-5 mt-1.5 space-y-1 text-xs">
                <li>Business type or industry</li>
                <li>Product/service being promoted</li>
                <li>Target audience and target locations</li>
                <li>Business stage (new, growing, established)</li>
                <li>Main differentiator or value proposition</li>
              </ul>
            </div>

            <div className="border border-neutral-300 rounded-lg p-4 bg-white/70">
              <h3 className="font-bold text-neutral-900">Step 3 — Marketing needs</h3>
              <ul className="list-disc pl-5 mt-1.5 space-y-1 text-xs">
                <li>Help needed (service selection or &quot;not sure yet&quot;)</li>
                <li>Main goal (awareness, leads, sales, creative)</li>
                <li>Platforms currently used or planned</li>
                <li>Current challenges</li>
                <li>Budget range and desired timeline</li>
              </ul>
            </div>

            <div className="border border-neutral-300 rounded-lg p-4 bg-white/70">
              <h3 className="font-bold text-neutral-900">Step 4 — Brief &amp; references</h3>
              <ul className="list-disc pl-5 mt-1.5 space-y-1 text-xs">
                <li>Additional context</li>
                <li>Links to existing ads, brand assets, or examples</li>
                <li>Optional file uploads</li>
                <li>Consent to be contacted and terms agreement</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-300 text-xs text-neutral-600">
            <span className="font-semibold text-neutral-900">Submission Result: </span>
            Show confirmation page/message, email receipt, notify admin team, create a QuoteRequest record.
          </div>
        </div>
      </div>
    </div>
  );
}
