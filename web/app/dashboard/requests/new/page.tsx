export default function NewCustomerRequestPage() {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-4xl mx-auto">
      <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          Route: /dashboard/requests/new
        </span>
        <h1 className="text-3xl font-bold mt-2">New Project Request (Authenticated) — Blank Page</h1>
        <p className="text-neutral-600 mt-2">
          Signed-in customer submission form for creating a new quote request.
        </p>

        <div className="mt-6 space-y-3 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-900">Features to build on this page:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Pre-fills user name, email, and company details from authenticated profile</li>
            <li>Select service type, platforms, campaign objective, and budget range</li>
            <li>Provide project brief, deliverables requested, and desired completion date</li>
            <li>Upload reference materials, brand assets, and competitor links</li>
            <li>Creates a QuoteRequest record tied directly to the current user account</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
