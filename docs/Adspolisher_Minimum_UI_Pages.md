# AdSpolisher — Minimum UI Pages

## Goal
Build the smallest useful website for AdSpolisher: a marketing service where customers request work, admins manage projects, and creators complete assigned creative tasks.

## 1. Public Website
These pages are visible without logging in.

- `/` — **Landing page**: explain what AdSpolisher does, show key services, selected work, how it works, testimonials/FAQs, and a clear “Start a Project” CTA.
- `/work` — **Portfolio**: show examples of previous work. Use real work and obtain permission before publishing client materials.
- `/services` — **Services**: explain service packages, deliverables, and indicative pricing or “Request a quote.”
- `/start-project` — **Project request form**: collect contact details, business goals, requested service, budget range, deadline, brief, and reference files.

For the first version, contact, FAQs, testimonials, and “how it works” can be sections on the landing page instead of separate pages.

## 2. Authentication
- `/login` — Sign in.
- `/signup` — Create a customer account.
- `/forgot-password` and `/reset-password` — Recover account access.
- Email verification can be a step in the authentication flow.

Protect dashboards so users can only access the areas allowed for their role.

## 3. Customer Area
- `/dashboard` — Overview of active projects, pending actions, and recent requests.
- `/dashboard/requests/[id]` — View a request, answer follow-up questions, and review its proposal.
- `/dashboard/projects/[id]` — View project status, messages, drafts/final files, and approve work or request revisions.
- `/dashboard/requests/new` — Submit a new request while signed in. Guests can use `/start-project`.

## 4. Creator Area
- `/creator` — List assigned tasks, deadlines, and task statuses.
- `/creator/tasks/[id]` — Read the brief, view references, update progress, upload drafts, and respond to admin feedback.

Creators should only access tasks assigned to them. They should not set prices, assign themselves tasks, or publish work without admin approval.

## 5. Admin Area
Use one shared admin layout with a sidebar. Each main function gets its own route.

- `/admin` — Overview: new requests, proposals to follow up, active projects, overdue tasks, and work awaiting review.
- `/admin/requests` — Review incoming requests and ask for missing information.
- `/admin/projects` — Manage projects, assign creators, review creative work, and track deadlines.
- `/admin/team` — Invite/manage creators and admins, and change team access where authorized.
- `/admin/services` — Manage service descriptions, packages, and displayed pricing.
- `/admin/portfolio` — Manage public portfolio items, with permission checks before publishing client work.

Add detail routes such as `/admin/requests/[id]` and `/admin/projects/[id]` when needed; they are not separate top-level sections.

## 6. Main Workflow
1. Customer submits a project request.
2. Admin reviews it and asks questions if needed.
3. Admin sends a proposal with scope, price, deliverables, deadline, revisions, and payment terms.
4. Customer accepts the proposal.
5. Admin creates/confirms the project and assigns a creator.
6. Creator prepares drafts and submits them for admin review.
7. Admin approves the drafts for customer review.
8. Customer approves the work or requests revisions.
9. Final files are delivered and the project is marked complete.

Keep **request**, **proposal**, **project**, **task**, and **payment** statuses separate. A request is not automatically a confirmed project.

## 7. Recommended Build Order
Build in this order to keep the first release small:

1. Public pages: `/`, `/work`, `/services`, `/start-project`
2. Authentication: login, signup, password recovery
3. Customer: `/dashboard` and request/project detail pages
4. Admin: `/admin`, `/admin/requests`, `/admin/projects`
5. Creator: `/creator` and task detail
6. Team, services, and portfolio management
7. Email notifications, payments, and other improvements as the workflow stabilizes

## 8. Layouts
Use four layouts rather than designing every page independently:

- **Public layout:** header, footer, marketing navigation.
- **Customer layout:** simple dashboard navigation and project-focused content.
- **Creator layout:** task list and focused task workspace.
- **Admin layout:** sidebar, tables, filters, and management forms.

## MVP Principle
Start with request → proposal → project → delivery. Do not build a large SaaS-style control panel or automated checkout before the service workflow is validated.
