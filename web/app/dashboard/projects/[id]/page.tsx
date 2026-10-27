import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function ProjectDetailContent({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="border border-dashed border-neutral-400 rounded-xl p-8 bg-white/50 backdrop-blur-xs">
      <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
        Route: /dashboard/projects/{id}
      </span>
      <h1 className="text-3xl font-bold mt-2">Project Workspace — Blank Page</h1>
      <p className="text-neutral-600 mt-2">
        Customer workspace to track progress, review deliverables, and collaborate with AdsPolisher.
      </p>

      <div className="mt-6 space-y-4 text-sm text-neutral-700">
        <p className="font-semibold text-neutral-900">Features to build on this page:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li>Track project milestones &amp; live lifecycle status (Kickoff, In Progress, Review, Completed)</li>
          <li>Communicate with the team via client-visible project messages</li>
          <li>View approved creative drafts and final deliverables (images, video renders, banners)</li>
          <li>Approve work or submit structured revision requests within allocated revision rounds</li>
          <li>Download high-resolution delivered files &amp; production source assets</li>
        </ul>
      </div>
    </div>
  );
}

export default function CustomerProjectDetailPage(props: PageProps) {
  return (
    <div className="min-h-screen bg-[#eceae4] text-[#141413] px-6 py-16 max-w-4xl mx-auto">
      <Suspense fallback={<div className="p-8 text-sm text-neutral-500">Loading project workspace...</div>}>
        <ProjectDetailContent params={props.params} />
      </Suspense>
    </div>
  );
}
