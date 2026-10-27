export default function AdminServicesPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-5xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Route: /admin/services
        </span>
        <h1 className="text-3xl font-bold mt-2">Services &amp; Packages Manager — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Manage public service packages, indicative pricing, and deliverables published to the site.
        </p>

        <div className="mt-6 space-y-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Features to build on this page:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Create, update, and archive public service offerings</li>
            <li>Configure service packages: deliverables list, turnaround days, revision limits, and indicative prices</li>
            <li>Toggle public visibility and featured flags for the marketing site (<code className="bg-neutral-200 px-1 py-0.5 rounded text-xs">/services</code>)</li>
            <li>Manage sorting order across categories</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
