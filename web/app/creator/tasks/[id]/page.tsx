import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function CreatorTaskContent({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
      <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
        Route: /creator/tasks/{id}
      </span>
      <h1 className="text-3xl font-bold mt-2">Creator Task Workspace — Blank Page</h1>
      <p className="text-neutral-600 mt-2">
        Focused production workspace for the assigned creator to produce deliverables and respond to feedback.
      </p>

      <div className="mt-6 space-y-4 text-sm text-neutral-700">
        <p className="font-semibold text-neutral-900">Features to build on this page:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>Read the client brief, format specifications, and internal task instructions</li>
          <li>Access permitted reference files, brand assets, and creative guidelines</li>
          <li>Update task status (e.g. In Progress, Draft Uploaded)</li>
          <li>Upload draft files, preview links, and supporting design source files with version numbers (v1, v2)</li>
          <li>&quot;Submit for Admin Review&quot; action button</li>
          <li>Respond to internal admin review feedback and submit revised drafts</li>
        </ul>

        <div className="mt-4 pt-4 border-t border-neutral-300 text-xs text-neutral-500 italic">
          Security rule: Creator can only access tasks explicitly assigned to their user ID.
        </div>
      </div>
    </div>
  );
}

export default function CreatorTaskWorkspacePage(props: PageProps) {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-4xl mx-auto">
      <Suspense fallback={<div className="p-8 text-sm text-neutral-500">Loading creator task...</div>}>
        <CreatorTaskContent params={props.params} />
      </Suspense>
    </div>
  );
}
