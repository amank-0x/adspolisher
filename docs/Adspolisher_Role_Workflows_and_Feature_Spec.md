# AdSpolisher — Roles, Features, and Business Workflow

> **Document purpose:** Define what customers, creators, and admins can do in AdSpolisher, how a request becomes a completed ad project, which pages each role needs, and what to build first.
>
> **Product model:** Service-led advertising agency with a customer portal. Start with quote requests and project management. Add direct package checkout and online payments after the service scope, pricing, and payment rules are clear.

---

## 1. Product Overview

AdSpolisher helps businesses request advertising services, agree on a scope of work, and track the production and review of ad creatives. The application has three roles:

| Role | Purpose | Primary responsibility |
|---|---|---|
| `USER` | Customer/client | Submit requests, review proposals, track projects, and approve deliverables |
| `CREATOR` | Creative production team member | Work on assigned tasks, upload drafts, respond to feedback, and submit revisions |
| `ADMIN` | Agency operator | Manage requests, proposals, projects, team assignments, quality review, services, and operations |

Authentication is handled by **Better Auth**. PostgreSQL and Prisma store identity-related records and AdSpolisher's business data. The Express + TypeScript backend owns business logic and authorization. Resend delivers transactional emails.

### Core principle

The dashboards are different role-specific views of the same business workflow. A customer, creator, and admin should not maintain separate versions of a project. They should see the same underlying request/project records, with access limited to their role and relationship to the work.

---

## 2. Request, Proposal, and Project Are Different Things

Keep these concepts separate in both the UI and database.

### 2.1 Service request

A customer explains what they need. A request is not yet a confirmed order and does not imply that the customer has paid.

Example: “I need five product ads for Instagram.”

### 2.2 Proposal / quote

AdSpolisher reviews the brief and defines the commercial offer, including:

- Price and currency
- Deliverables and quantities
- Platforms or formats covered
- Deadline or expected turnaround
- Included revision rounds
- Payment timing and other relevant terms
- Expiry date, if applicable

The customer can accept, decline, or ask a question about the proposal.

### 2.3 Project

A project is the agreed piece of work created after proposal acceptance, according to AdSpolisher's business rules. It records the confirmed scope and provides the place for tasks, files, messages, reviews, and completion.

### Recommended launch approach

Start with **Request a Quote** as the main conversion path. Service and package pages can display indicative pricing, but the CTA can open a prefilled quote form. Add direct purchase/checkout later when fixed packages, terms, payment handling, refunds, and cancellation rules are well defined.

---

## 3. Customer (`USER`) Experience

### 3.1 Customer goals

The customer should be able to answer these questions from the dashboard:

1. What have I requested?
2. Is AdSpolisher waiting for anything from me?
3. What has been agreed, and what will it cost?
4. What is happening with my project?
5. Are my creatives ready for review?
6. Where can I download my final assets?

### 3.2 Customer pages

| Page | Suggested route | Purpose |
|---|---|---|
| Dashboard overview | `/dashboard` | Show pending actions, recent activity, active projects, and requests awaiting a response |
| Browse services | `/services` | Explore service offerings and available packages |
| New request | `/dashboard/requests/new` | Submit a brief and reference material |
| My requests | `/dashboard/requests` | List and filter the customer's own requests |
| Request details | `/dashboard/requests/[id]` | View the brief, status, questions, proposal, and request history |
| My projects | `/dashboard/projects` | List confirmed projects and their progress |
| Project details | `/dashboard/projects/[id]` | Show scope, timeline, task progress, messages, and deliverables |
| Deliverables | `/dashboard/projects/[id]/deliverables` | Preview/download released assets and approve/request changes |
| Messages | `/dashboard/messages` | Optional unified view of conversations; messages should still be linked to requests/projects |
| Profile | `/dashboard/profile` | Manage name, company, and contact details |
| Settings | `/dashboard/settings` | Account and security preferences |

Pages may be combined in the first version. For example, proposal details can appear inside the request details page rather than having a separate proposal page.

### 3.3 Submit an ad request

The request form should collect only the information needed to understand and scope the job. Suggested fields:

- Service or request type
- Project title
- Business/brand name
- Product or business website URL
- Campaign objective
- Advertising platform(s), such as Instagram, Facebook, TikTok, or Google
- Target audience
- Description / creative brief
- Number and types of deliverables requested
- Budget range and currency, if the customer knows it
- Desired deadline
- Reference links and files (logo, product imagery, brand guidelines, examples)
- Customer email and name (from the authenticated account where appropriate)

The backend must validate all submitted fields. The frontend is not a security boundary.

### 3.4 Review a proposal

The customer should be able to:

- View the offered scope, price, deliverables, dates, revision terms, and payment terms
- Accept the proposal
- Decline it
- Ask a question or request clarification

Once accepted, the agreed terms should be preserved. Don't silently change the accepted price or scope when an admin edits a service package later.

### 3.5 Track work and review creatives

The customer should be able to:

- View current project status and approved timeline
- See updates intended for the customer
- View deliverables released for client review
- Download files they are authorized to access
- Approve deliverables or request changes
- See a history of prior versions and decisions where appropriate

Only work released for customer review should be visible in the customer portal. Internal drafts and internal notes must remain private.

### 3.6 Customer permissions

A customer may read or update only records they own, and only fields that are editable at that stage. Customers must not be able to:

- Read another customer's requests, projects, messages, or assets
- Assign creators or change internal project ownership
- Change their own role
- Change proposal prices or payment status
- Mark an invoice or payment as paid
- Read internal messages/notes
- Access unpublished drafts or private storage files

---

## 4. Creator (`CREATOR`) Experience

### 4.1 Creator goals

The creator needs a focused production workspace, not a business-wide admin dashboard. Their primary questions are:

- What work has been assigned to me?
- What exactly do I need to deliver?
- What is the deadline?
- Are there questions or revision notes?
- Has my work passed internal review?

### 4.2 Creator pages

| Page | Suggested route | Purpose |
|---|---|---|
| Creator overview | `/creator` | Assigned work, deadlines, pending reviews, and task counts |
| My tasks | `/creator/tasks` | List/filter tasks assigned to the current creator |
| Task details | `/creator/tasks/[id]` | Approved brief, instructions, deadline, references, and deliverables required |
| Revision queue | `/creator/revisions` | Tasks sent back with changes requested |
| Messages | `/creator/messages` | Project-related communication with authorized people |
| Profile | `/creator/profile` | Creator bio, specialties, and availability (where permitted) |

### 4.3 Creator workflow

1. Open an assigned task.
2. Review the approved brief, reference assets, requirements, formats, quantities, and deadline.
3. Mark the task as in progress.
4. Ask questions or flag missing information through the task conversation.
5. Upload creative drafts or copy as new asset versions.
6. Submit work for internal review.
7. If returned, review the admin's feedback and resubmit the updated version.
8. After approval, wait for any customer feedback or final completion instructions.

### 4.4 Creator permissions

A creator may:

- View projects/tasks they are assigned or explicitly authorized to access
- Access source materials required for assigned work
- Update permitted task statuses
- Upload new creative assets and versions
- Respond to feedback and ask project-related questions
- View the review state of their submitted work

A creator must not be able to:

- Assign work to themselves or other creators unless explicitly granted permission
- View the entire customer list or unrelated client work
- Change prices, proposals, payments, or agreed scope
- Promote themselves or another person to admin
- Publish portfolio work without approval and permission to use it
- Read internal business records outside their authorized scope

---

## 5. Admin (`ADMIN`) Experience

### 5.1 Admin goals

The admin manages the commercial and delivery process. The dashboard should prioritize work needing attention rather than being a collection of decorative metrics.

### 5.2 Admin pages

| Page | Suggested route | Purpose |
|---|---|---|
| Operations overview | `/admin` | New requests, proposals requiring follow-up, active projects, overdue tasks, and review queue |
| Requests inbox | `/admin/requests` | Search/filter incoming requests and update workflow status |
| Request details | `/admin/requests/[id]` | Review brief, ask questions, record internal notes, and prepare a proposal |
| Proposals | `/admin/proposals` | Create/send offers and manage draft, sent, accepted, declined, or expired states |
| Projects | `/admin/projects` | Manage confirmed jobs, statuses, deadlines, and assignments |
| Project details | `/admin/projects/[id]` | Manage scope, tasks, conversations, assets, review, and completion |
| Creative review | `/admin/review` | Review submitted assets and approve or return them to the creator |
| Customers | `/admin/customers` | View customers and authorized request/project history |
| Creators | `/admin/creators` | View creator specialties, availability, and workload |
| Team | `/admin/team` | Invite admins/creators, manage roles, and revoke access |
| Services | `/admin/services` | Create, update, publish, or archive services |
| Packages | `/admin/packages` | Manage fixed-price package templates and their inclusions |
| Portfolio | `/admin/portfolio` | Manage case studies and published project examples |
| Testimonials | `/admin/testimonials` | Review and publish genuine customer testimonials |
| Enquiries | `/admin/enquiries` | Manage general contact form submissions |
| Audit log | `/admin/audit-log` | Review sensitive administrative actions |
| Settings | `/admin/settings` | Manage operational settings and notification preferences |

Several routes may be combined in an MVP. Keep the authorization and data model clear even if the interface uses tabs.

### 5.3 Admin workflow

**Request handling**

- Review new request and submitted materials
- Decide whether the agency can fulfil the work
- Ask for more information or decline with an appropriate explanation
- Prepare a quote/proposal

**Proposal management**

- Define scope and deliverables
- Set price, currency, deadline, revisions, and terms
- Send the offer to the customer
- Track acceptance, decline, expiry, and follow-up

**Project management**

- Convert an accepted proposal into a project
- Preserve the accepted scope and price
- Create production tasks
- Assign a creator and deadlines
- Monitor progress and manage customer communication

**Quality control**

- Review creator submissions
- Approve or return work with specific feedback
- Release approved deliverables for customer review
- Coordinate customer-requested revisions
- Mark work complete when required approvals and deliverables are satisfied

**Business operations**

- Manage services, packages, public portfolio entries, and testimonials
- Invite and manage team members
- Review audit logs and administrative activity

### 5.4 Admin invitations

An authorized admin should be able to invite another `ADMIN` or `CREATOR` through the team page:

1. Enter the teammate's email and intended role.
2. Backend validates that the inviter is allowed to invite that role.
3. Generate a cryptographically random, single-use invitation token.
4. Store only a hash of the token, along with role, inviter, expiry, and acceptance state.
5. Send the invitation link through Resend.
6. On acceptance, verify the token, expiration, unused state, and that the authenticated, verified email matches the invitation.
7. In a database transaction, assign the role, mark the invitation as accepted, and create an audit event.

Do not allow public sign-up to choose `ADMIN` or `CREATOR`. New public accounts should default to `USER`. Role changes must be performed by trusted server-side operations and logged. Consider reserving ownership-level changes for a designated owner account.

---

## 6. End-to-End Business Workflow

The standard workflow is:

1. **Customer submits a request.** Save the brief and notify the agency.
2. **Admin reviews the request.** The admin can proceed, ask for information, or decline.
3. **Admin sends a proposal.** Include scope, price, currency, deliverables, timeline, revision terms, and payment terms.
4. **Customer accepts the proposal.** Record acceptance and preserve the terms that were accepted.
5. **Project is created or activated.** Create production tasks and assign a creator.
6. **Creator produces the work.** Upload drafts and submit them for internal review.
7. **Admin reviews the work.** Approve it for customer review or return it to the creator for changes.
8. **Customer reviews the work.** Approve it or request a revision within the agreed scope.
9. **Creator completes revisions.** New versions are submitted and reviewed as required.
10. **Project is completed.** Final assets are accessible to the customer, relevant history is retained, and feedback can be requested.

The workflow can loop from customer review back to revision. Define how many revisions are included in the accepted proposal and how out-of-scope changes are handled.

### Separate status fields by business entity

Do not use one status enum for requests, proposals, projects, tasks, assets, and payments. Each has a different lifecycle.

| Entity | Example states |
|---|---|
| Quote request | `SUBMITTED`, `UNDER_REVIEW`, `NEEDS_INFORMATION`, `PROPOSAL_SENT`, `ACCEPTED`, `DECLINED`, `CANCELLED` |
| Proposal | `DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`, `EXPIRED`, `WITHDRAWN` |
| Project | `CONFIRMED`, `IN_PROGRESS`, `INTERNAL_REVIEW`, `CLIENT_REVIEW`, `REVISION_REQUESTED`, `COMPLETED`, `CANCELLED` |
| Creator task | `TODO`, `IN_PROGRESS`, `SUBMITTED_FOR_REVIEW`, `APPROVED`, `CHANGES_REQUESTED`, `COMPLETED` |
| Deliverable asset | `DRAFT`, `IN_REVIEW`, `APPROVED`, `CHANGES_REQUESTED`, `RELEASED` |
| Payment (later, if implemented) | `PENDING`, `PROCESSING`, `PAID`, `FAILED`, `REFUNDED` (refunds may need their own record/history) |

These values are examples. Final enum names should match the actual workflow and transition rules implemented in the API.

---

## 7. Recommended Business Data Models

Keep the Better Auth models (`User`, `Account`, `Session`, and `Verification`) compatible with the schema generated for the installed Better Auth version. Add domain models for AdSpolisher's operations rather than putting every workflow field on `User` or a single request model.

| Model | Responsibility |
|---|---|
| `User` | Authentication identity, email, profile, and server-controlled role |
| `CreatorProfile` | Creator-specific specialties and availability |
| `Service` | Service catalogue entries shown on the website |
| `ServicePackage` | Package template, price, currency, inclusions, and revision/turnaround rules |
| `QuoteRequest` | Initial customer brief and lead/request lifecycle |
| `Proposal` | Commercial offer sent to a customer, including accepted terms |
| `Project` | Confirmed work, owner, agreed scope snapshot, timeline, and project status |
| `CreatorTask` | A unit of work assigned to a creator, with status and due date |
| `AdAsset` | Reference files, drafts, versions, and released deliverables; store file metadata and storage keys, not large file bytes in PostgreSQL |
| `RevisionRequest` | Requested changes, feedback, actor, and completion state |
| `ProjectMessage` | Customer-facing or internal project conversation, with visibility enforced server-side |
| `StaffInvitation` | Secure, expiring team invitations |
| `AuditLog` | Record sensitive operations such as role changes, assignments, and approval actions |
| `ContactMessage` | General contact-form enquiries, including guest email submissions |
| `Payment` / `Invoice` | Add when online payment and invoicing are actually implemented |

### Request ownership and guest submissions

If customers must sign in before submitting a request, `QuoteRequest.userId` can be required. If you want a low-friction public quote form, make the user relation optional and save the submitted name/email on the request itself. This lets a guest submit a brief without creating an account. When they later sign up, link the request to the verified account only through a deliberate, secure matching flow.

The authenticated user's email should come from the server-verified session, not from an arbitrary email value submitted by the browser. For guest requests, validate and store the email supplied in the form.

### Preserve accepted proposal terms

Service package prices can change over time. A proposal and the project created from an accepted proposal should retain a snapshot of the agreed price, deliverables, revision rules, deadline, and terms. Editing the current service package must not silently change an existing customer agreement.

### Asset storage

Store actual image/video/document files in suitable object storage. PostgreSQL should hold metadata such as `storageKey`, filename, MIME type, size, version, status, and associated request/project/task. Generate short-lived authorized download URLs when the user has permission to access the asset. Never trust a browser-provided storage key without checking authorization.

---

## 8. Transactional Emails with Resend

Send email for events where someone needs to know or act. Record delivery attempts and handle failures reliably; do not rely exclusively on the browser to send important business emails.

| Event | Recipient | Purpose |
|---|---|---|
| New quote request | Admin/team inbox | Alert the agency that a new lead needs review |
| Request received | Customer | Confirm receipt and provide a reference/link |
| More information requested | Customer | Explain what information is needed and link to the request |
| Proposal sent | Customer | Notify that a proposal is available to review |
| Proposal accepted | Admin | Notify that the customer accepted the offer |
| Creator assigned | Creator | Provide a link to the assigned task and deadline |
| Draft submitted | Admin | Add the asset to the quality-review queue |
| Work released for customer review | Customer | Tell the customer that review is needed |
| Changes requested | Creator/admin as appropriate | Communicate feedback and the next action |
| Deliverables approved / project completed | Relevant team and customer | Confirm approval or completion |
| Staff invitation | Invitee | Provide the secure invitation link |
| Authentication verification/reset | User | Deliver Better Auth verification or reset code as configured |

Avoid emailing large private asset attachments. Send authorized links that require the user to authenticate where appropriate.

---

## 9. Security and Authorization Requirements

Authorization must be enforced in the Express backend for every protected operation. Hiding buttons or pages in Next.js is not sufficient.

### Required rules

- Public signup always creates `USER` accounts.
- Only trusted server logic can grant `CREATOR` or `ADMIN` roles.
- The backend checks the current user's role and relationship to the request/project/task on every read and write.
- Customer API responses never include internal notes or unreleased drafts.
- Creator endpoints return only assigned/authorized work.
- Only authorized staff can assign creators, change proposal terms, approve internal creative work, or manage team roles.
- Validate all request bodies and path parameters with Zod (or equivalent server-side validation).
- Apply rate limits to public forms, authentication-related actions, and sensitive operations.
- Protect uploaded files with file type/size checks, private storage, and authorization checks.
- Use single-use, expiring, unguessable invitation tokens; store their hashes rather than the original token.
- Log sensitive administrative actions and role changes.
- Treat payment webhooks (if added later) as the source of truth for payment status, not browser redirect parameters.
- Do not expose secrets, OAuth tokens, OTPs, or private storage credentials to the frontend or logs.

### Admin OTP

If admin email OTP is used as an additional factor, maintain a distinct admin MFA challenge flow, separate from password-reset OTPs. The backend should require an authenticated admin, validate a short-lived single-use code, limit attempts/resends, and mark only the relevant active session as MFA-verified after successful verification. Every admin API must check the verified state. OAuth sign-in by itself must not be treated as completion of the extra factor.

---

## 10. MVP Implementation Plan

Build the business workflow in increments. Do not build every dashboard page before the first request can be processed end to end.

### Phase 1 — Requests and admin inbox

Build:

- Public service catalogue (basic version)
- Customer request form
- `QuoteRequest` model and migration
- Customer request list/details
- Admin requests inbox and request details
- Status changes and request history
- Request-received and new-request emails via Resend
- Authorization checks for customer ownership and admin access

**Completion criterion:** A customer submits a request; it is saved in PostgreSQL, appears in the admin inbox, and the relevant emails are sent.

### Phase 2 — Proposals and projects

Build:

- Proposal model and admin editor
- Proposal email and customer review page
- Accept/decline flow
- Conversion from accepted proposal to project
- Project scope snapshot
- Creator assignment and notification

**Completion criterion:** Admin sends an offer; customer accepts; a project is created with the agreed terms; admin assigns a creator.

### Phase 3 — Creator production workflow

Build:

- Creator dashboard and assigned task list
- Creator task detail page
- Private asset upload and versioning
- Task state transitions
- Admin internal review queue
- Change requests and resubmission

**Completion criterion:** Creator submits work, admin can approve or return it, and draft files are not exposed to the customer before release.

### Phase 4 — Customer review and completion

Build:

- Customer project overview and details
- Released deliverable viewer/download
- Customer approval and revision request actions
- Revision history and relevant messages
- Completion workflow and completion email

**Completion criterion:** Customer reviews released assets, requests changes or approves them, and the project can be completed with its history retained.

### Phase 5 — Commercial and operational expansion

Add after the core workflow is stable:

- Direct purchase of defined packages
- Payment gateway and verified payment webhooks
- Invoices/receipts and refund records
- Creator workload/availability dashboard
- More advanced analytics and reporting
- Improved notifications and automation
- More extensive service/package management

**Completion criterion:** The system supports the intended business and payment rules reliably; payment status is verified on the backend.

---

## 11. Recommended Build Order

1. Confirm the domain data models and workflow/status transitions.
2. Implement the `QuoteRequest` schema and migration.
3. Implement request creation and customer-owned request retrieval in Express.
4. Implement the public request form in Next.js.
5. Implement the admin inbox and authorized status changes.
6. Add Resend notifications and delivery-failure handling.
7. Implement Proposal and Project models and the acceptance workflow.
8. Add CreatorTask, private asset storage, and review states.
9. Build the creator and customer project screens.
10. Add audit logs, invitations, production monitoring, and hardening.

Build backend behavior and authorization before relying on the UI. For each feature, test valid access, unauthorized access, invalid input, and state transitions.

---

## 12. MVP Acceptance Checklist

### Customer

- [ ] Can submit a quote request with validated brief details.
- [ ] Can view only their own requests and projects.
- [ ] Can see whether more information is needed.
- [ ] Can review and accept/decline a proposal.
- [ ] Can track project status and agreed scope.
- [ ] Can only see deliverables released for customer review.
- [ ] Can download authorized final assets.
- [ ] Can approve or request changes to released work.

### Creator

- [ ] Can view assigned tasks only.
- [ ] Can access approved brief and reference assets for assigned work.
- [ ] Can update allowed task statuses.
- [ ] Can upload and version creative assets.
- [ ] Can submit work for internal review.
- [ ] Can see feedback and resubmit revised work.
- [ ] Cannot change price, payment status, team roles, or unrelated assignments.

### Admin

- [ ] Can review, filter, and update incoming requests.
- [ ] Can ask for information and prepare proposals.
- [ ] Can send proposals and track customer decisions.
- [ ] Can convert accepted proposals into projects.
- [ ] Can assign creators and deadlines.
- [ ] Can approve or return creator submissions.
- [ ] Can manage services and packages.
- [ ] Can invite admins/creators with expiry and email verification checks.
- [ ] Sensitive actions create audit records.

### Platform and security

- [ ] Public signup cannot choose a privileged role.
- [ ] Authorization is enforced in backend endpoints.
- [ ] Customer records and private files are isolated by ownership/assignment.
- [ ] Internal notes are never returned to customer APIs.
- [ ] Input schemas are validated server-side.
- [ ] Email failures are observable/retryable.
- [ ] Secrets and OTPs are not logged or exposed to the browser.
- [ ] Every key workflow state transition is tested.

---

## Final Recommendation

Treat the first release as a **service website + quote-management system + production workflow + customer review portal**. The most valuable first path is:

**Customer request → Admin review and proposal → Customer acceptance → Creator assignment → Internal quality review → Customer approval → Project completion.**

Get this path working reliably before adding a full marketplace, automatic checkout, invoices, or advanced analytics. It will give AdSpolisher a usable operational system without introducing unnecessary complexity too early.
