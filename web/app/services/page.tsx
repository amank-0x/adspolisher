export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-4xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Route: /services</span>
        <h1 className="text-3xl font-bold mt-2">Services — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Explain what customers can hire AdsPolisher to do.
        </p>

        <div className="mt-6 space-y-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">To build on this page:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Service categories (Paid Social, Display Suites, UGC & Video Hooks, Creative Refresh Audit)</li>
            <li>For each service: who it is for, business problem addressed, deliverables</li>
            <li>What information the customer must provide</li>
            <li>Typical turnaround or timeline</li>
            <li>Indicative price or &quot;Request a Quote&quot; option</li>
            <li>CTA linking to <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-xs">/start-project</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
