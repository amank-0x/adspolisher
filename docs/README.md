# Hign level overview of project

Yes—build a demo of the full request-to-delivery workflow. But treat it as a demo of the real workflow, not a set of disconnected screens with sample numbers. The role dashboards are a visual start; most of the operational flow still needs to be connected.

### Where the app stands

The project already has customer, admin, and creator dashboard shells and overview pages. However, some key pages are still placeholders, including the customer’s new request form and the admin’s request and project pages. The overview cards and creator tasks also contain static sample data.

The database has QuoteRequest, Project, Deliverable, and project messaging models, but it does not yet have the core Proposal and production Task models. The API also needs the business endpoints that connect these records. So the main remaining work is making the workflow functional, more than redesigning every dashboard page.

### Build one complete workflow

Use this as the first end-to-end scenario:

1. Customer submits a request with a brief, service, goal, budget range, and desired deadline.
2. Admin reviews it, asks for more information if needed, and sends a proposal with scope, price, deliverables, timeline, and revision terms.
3. Customer accepts the proposal. The system records the accepted terms and creates a project from them.
4. Admin creates and assigns tasks to a creator, with a brief and deadline.
5. Creator works on the assigned task, uploads a draft, and submits it for internal review.
6. Admin reviews the draft, either requesting changes or releasing it to the customer.
7. Customer reviews the released work, approves it or requests a revision, and downloads the final deliverables.

Keep a request, proposal, project, task, and deliverable as separate records with their own statuses. That will make it possible to show each role the same work at the right stage.

### Suggested implementation order

| Phase | Build | Ready when… |
|---|---|---|
| 1. Requests | Persist the customer request; show the customer’s own requests and the admin inbox; support status changes and request history. | A real customer request appears in the admin inbox and can be followed up. |
| 2. Proposals | Add proposals and admin proposal editing; let customers accept, decline, or ask questions. | Acceptance preserves the agreed scope and price. |
| 3. Projects and assignment | Create a project from an accepted proposal; add tasks and creator assignment. | The assigned task appears in the correct creator’s workspace. |
| 4. Production and review | Add private uploads, versions, creator submission, admin feedback, and resubmission. | Drafts stay private until an admin releases them. |
| 5. Customer delivery | Add customer review, approval or revision requests, final downloads, and completion history. | The project can reach completion through the dashboard. |
| 6. Demo and launch readiness | Add realistic seeded demo records, role-based walkthroughs, email notifications, and security checks. | You can demonstrate the full journey without using real customer data. |

This follows the sequencing in the project’s role workflow spec (docs/AdSpolisher_Role_Workflows_and_Feature_Spec.md:411) and architecture plan (docs/AdSpolisher_Architecture_and_Development_Plan.md:403).

### Should you add a demo?

Yes. A working demo will help prospective customers understand what happens after they submit a request, and it will help you confirm that the admin and creator workflows make sense.

Use a separate demo or staging environment with seeded customer, admin, and creator accounts and one sample project moving through the statuses. Keep demo data isolated from production, and don’t expose a real admin account as a public demo. If the full workflow isn’t built yet, use a clearly labelled guided walkthrough rather than implying the sample dashboard data is live.

### How to approach the dashboard work

Don’t try to finish every dashboard page at once. Work in vertical slices: for each phase, build the API and permission checks, connect the relevant pages to real records, then add loading, empty, and error states. Keep the layouts consistent, and hide unfinished actions or links until they work.

The best next step is Phase 1: make request submission and the admin inbox real. Then build the proposal-to-project flow before expanding the creator and customer delivery pages. Payment checkout can wait until your packages, pricing, and terms are settled.