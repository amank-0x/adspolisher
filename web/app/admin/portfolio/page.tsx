export default function AdminPortfolioPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-5xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Route: /admin/portfolio
        </span>
        <h1 className="text-3xl font-bold mt-2">Portfolio Management — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Manage showcase campaign examples, verified results, and publication permissions.
        </p>

        <div className="mt-6 space-y-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Features to build on this page:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Create and edit case study items (title, client industry, challenge, approach, outcomes)</li>
            <li>Upload and organize campaign media previews and deliverable galleries</li>
            <li>Record verified performance metrics only (CTR, ROAS, CPA improvements)</li>
            <li>Publish / unpublish toggles controlling display on the public portfolio (<code className="bg-neutral-200 px-1 py-0.5 rounded text-xs">/work</code>)</li>
            <li>Enforce client permission verification flag before publishing client work</li>
          </ul>

          <div className="mt-4 pt-4 border-t border-neutral-300 text-xs text-neutral-500 italic">
            Editorial rule: Only publish client work when AdsPolisher has verified permission. Mark speculative concepts explicitly as concept work.
          </div>
        </div>
      </div>
    </div>
  );
}
