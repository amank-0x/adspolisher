# AdSpolisher — Product, Page, Admin, and Database Blueprint

This blueprint assumes AdSpolisher launches as a service-led advertising/creative agency with AI-assisted production and human review. It is **not** a full self-service marketplace in v1. The stack is Next.js frontend, Express + TypeScript API, PostgreSQL + Prisma, Better Auth, Google sign-in, Zod validation, and a transactional email provider.

## 1. Product decisions

1. Visitors can browse services and request a quote without creating an account.
2. Better Auth owns authentication: users, email, OAuth accounts, sessions, and verification records. Do not build a parallel password or Google-account system.
3. An authenticated user gets a client dashboard. Internal staff get an admin dashboard according to a server-checked role.
4. An initial `OWNER` account is promoted through a one-time seed/script. New staff/admins are invited, never allowed to self-select an elevated role at signup.
5. A quote request is a business record, separate from the auth user. It must store the submitted email even if the visitor never signs up.
6. Store project deliverables in object/file storage and store their URLs/metadata in PostgreSQL. Do not store large file blobs in relational rows.
7. Start without a payment portal, real-time chat, or multi-vendor marketplace. Add those only after the service workflow is validated.

## 2. Page map

### Public website — shared `PublicLayout`

| Route | Purpose | Main layout/content | CTA |
|---|---|---|---|
| `/` | Explain the value proposition | Header, hero, trust proof, services, portfolio, process, why us, pricing preview, testimonials when real, FAQ, final CTA, footer | Start a project |
| `/services` | Service catalogue | Intro, service cards, deliverables, starting prices, process | View service / Get a quote |
| `/services/[slug]` | Explain an individual service | Who it's for, problem, deliverables, examples, timeline, revisions, price/quote, FAQs | Request this service |
| `/work` | Portfolio index | Filterable case studies / creative examples | Discuss a similar project |
| `/work/[slug]` | Case study | Challenge, approach, examples, deliverables, verified outcomes if available | Start a similar project |
| `/pricing` | Help customers understand cost | Packages, inclusions, exclusions, revisions, turnaround, custom work | Choose package / Request quote |
| `/about` | Establish credibility | Team, approach, values, AI + human workflow | Start a project |
| `/contact` | General enquiry | Contact details, contact form, expected response time | Send message |
| `/request-quote` | Main lead conversion | Multi-step or concise brief form; guest submission allowed | Submit request |
| `/privacy` | Privacy notice | Data collected, purposes, retention/contact | — |
| `/terms` | Terms of service | Scope, payments, revisions, cancellations, IP, limitations | — |
| `/cookies` | Cookie notice/settings if relevant | Explain actual cookies/analytics used | — |

**Don't publish fake reviews, client logos, case-study metrics, or guarantees.** Early on, use clearly labelled concept work and a strong process explanation instead of fabricated social proof.

### Authentication — shared `AuthLayout`

| Route | Purpose | Notes |
|---|---|---|
| `/login` | Sign in | Google button first if desired; email/password only if enabled in Better Auth |
| `/signup` | Register | Optional separate page; Google can create a first-time account. Never show a role selector. |
| `/forgot-password` | Request reset link | Only if email/password login is enabled |
| `/reset-password` | Set a new password | Token flow handled through Better Auth |
| `/verify-email` | Explain/check email verification | Configure with Better Auth and an email provider |
| `/accept-invitation/[token]` | Accept staff invitation | Validate token, expiry, matching email, and target role on the API |
| `/auth/error` | User-friendly auth errors | Avoid showing secrets/provider internals |

Keep public marketing routes accessible without login. Requiring signup before someone can ask for a quote creates unnecessary friction.

### Client portal — `ClientDashboardLayout`

Use a left sidebar on desktop, a compact mobile nav, and a top bar with page title, notifications, and profile menu.

| Route | Purpose | MVP behaviour |
|---|---|---|
| `/dashboard` | Overview | Active projects, latest updates, pending approvals, primary “Request a project” CTA |
| `/dashboard/projects` | Project list | Status, service, dates, last update |
| `/dashboard/projects/[id]` | Project workspace | Brief, milestones/status, client-visible conversation, deliverables, revision/approval actions |
| `/dashboard/projects/[id]/deliverables` | Files and versions | Preview/download links, version, date, approve/request changes |
| `/dashboard/requests` | Requests/quotes | Submitted, under review, needs information, accepted/declined; can be combined into dashboard v1 |
| `/dashboard/profile` | Profile | Display name, company, website, country/time zone (only what is needed) |
| `/dashboard/settings` | Account settings | Security, sessions where supported, email/preferences; auth-sensitive changes via Better Auth |
| `/dashboard/notifications` | Updates | Optional; can be a dropdown at first |

Clients should only be able to see projects where they are the client. Never trust a project ID from the browser without checking ownership in the API.

### Internal admin portal — `AdminDashboardLayout`

A different layout from the client portal: persistent sidebar, top bar, search/notifications, breadcrumbs, current admin profile, clear status labels, and confirmation dialogs for destructive actions.

| Route | Purpose | Main capabilities |
|---|---|---|
| `/admin` | Operations overview | New leads, leads awaiting response, active projects, work needing approval, recent activity |
| `/admin/quotes` | Sales inbox | Search/filter/sort, status, service, budget, source, submission date |
| `/admin/quotes/[id]` | Quote detail | Read brief, contact by email, internal notes, assign owner, status changes, convert to project |
| `/admin/projects` | Project operations | Filter by status, due date, assignee, client |
| `/admin/projects/[id]` | Project management | Update status/dates, assign staff, add client-visible update or internal note, upload deliverables, manage versions/approval |
| `/admin/clients` | Customer directory | Search clients, view account and project history; do not expose authentication secrets |
| `/admin/clients/[id]` | Customer detail | Contact info, projects, quote history, account state |
| `/admin/services` | Service catalogue | Create/edit/hide service pages, descriptions, images, active/published state |
| `/admin/packages` | Pricing | Manage package inclusions, base price, currency, turnaround, revision limits |
| `/admin/portfolio` | Work/case studies | Draft, edit, preview, publish/unpublish |
| `/admin/testimonials` | Reviews | Verify permission, edit, publish/unpublish; no fabricated reviews |
| `/admin/team` | Agency team | List staff, roles, active status, invite staff/admins, revoke pending invitations |
| `/admin/team/invitations` | Invitations | Pending/accepted/expired/revoked, resend/revoke |
| `/admin/contact-messages` | Contact inbox | View and mark general enquiries handled |
| `/admin/audit-log` | Sensitive action history | Role changes, invitations, status changes, deletion/publication events |
| `/admin/settings` | Operations settings | Agency contact email, default currency, notification recipients, business settings |

For v1, `/admin/clients/[id]`, `/admin/team/invitations`, and some list/detail pairs can be tabs or panels rather than separate complex screens. Keep route boundaries based on workflows, not on a desire to create many pages.

## 3. Layout system

### PublicLayout
- Sticky or static header: logo, Services, Work, How it works/About, Pricing, Contact.
- Primary CTA: `Get a Quote` or `Start a Project`.
- Secondary account link: `Sign in`.
- Main content width and spacing consistent across routes.
- Footer: services, work, contact, social links, privacy, terms, copyright.

### AuthLayout
- Centered narrow card, brand mark, clear title, Google sign-in, optional email/password form, links to terms/privacy, useful error/loading states.
- Do not include the public mega-navigation or dashboard sidebar.

### ClientDashboardLayout
- Sidebar: Overview, Projects, Requests, Profile, Settings.
- Topbar: breadcrumb/page title, notifications (later), profile/logout.
- Dashboard uses clear project statuses and next actions, not vanity charts.

### AdminDashboardLayout
- Sidebar: Overview, Quotes, Projects, Clients, Services, Packages, Portfolio, Testimonials, Team, Contact Inbox, Audit Log, Settings.
- Only show links permitted to the signed-in role, but **also enforce permissions on every backend route**.
- Include loading, empty, error, and no-permission states. Confirm destructive or irreversible actions.

## 4. Roles and permissions

Recommended application roles:

- `CUSTOMER`: manages their own profile and views only their own requests/projects/deliverables.
- `STAFF`: can access assigned projects and perform the work permissions you grant.
- `ADMIN`: can manage operations, leads, projects, services, portfolio, testimonials, and team invitations according to policy.
- `OWNER`: initial business owner; full access including admin-role changes and settings.

If you want an existing admin to invite another admin, permit that operation only in a protected server route and record it in the audit log. A safer default is: `OWNER` can grant `ADMIN`; `ADMIN` can invite `STAFF`. Either policy is fine if implemented intentionally. Staff/customer accounts must never be able to promote themselves. Do not rely on hiding a button in the UI as authorization.

For initial setup, create the first OWNER with a one-time seed script or controlled database operation using a verified auth user ID/email. Never make the first user who signs up an admin automatically in production.

## 5. Database responsibilities

### Better Auth-managed models

Better Auth manages its core authentication tables: user, session, account, and verification. The user record stores `email`, `emailVerified`, `name`, profile image, and timestamps. Google provider linkage belongs in the account table, and session tokens belong in the session table. Do not create your own password table or duplicate Google credentials. Better Auth supports extra user fields; configure an app role as server-owned (`input: false`). Use the Better Auth CLI to generate/update its schema, then use Prisma migrations and regenerate the client. See the official [Prisma adapter guide](https://better-auth.com/docs/adapters/prisma) and [database schema guide](https://better-auth.com/docs/concepts/database).

### AdSpolisher domain models

- `Service`: public service details.
- `ServicePackage`: a named price/package for a service.
- `QuoteRequest`: guest or authenticated lead, contact email, project brief, budget/deadline, workflow status, optional service/package/user/assignee.
- `Project`: accepted job owned by a customer, service/package, timeline, status, assignee, optional originating quote.
- `ProjectMessage`: project conversation and internal notes; clients must never receive `INTERNAL` messages.
- `Deliverable`: file URL and version metadata for a project's output.
- `ContactMessage`: general contact form enquiries not requiring a quote.
- `PortfolioItem`: published case studies/creative examples.
- `Testimonial`: customer review/approval and publication state.
- `StaffInvitation`: invite email, invited role, one-time token hash, expiry/revocation/acceptance, inviter.
- `AuditLog`: security-relevant actor/action/target/time record.

### Why there are two email locations

1. `User.email` is the canonical login/contact email for an authenticated account.
2. `QuoteRequest.email` and `ContactMessage.email` store the email the visitor typed when submitting that form. They are required because a visitor may not have an account, and the submitted contact details should remain attached to the original request even if their account changes later.

When a signed-in customer submits a quote, also store `userId`; snapshot the submitted email to the quote row. When a guest quote later becomes a client, verify the email/account match before linking it to a user.

## 6. Prisma domain schema additions

**Important:** this is the AdSpolisher domain portion, not a replacement for the Better Auth schema. First run Better Auth schema generation for your configured version/plugins. Then add the domain models below and merge the `User` additions into the generated `model User`. If the generated model uses different names/mappings, preserve those names and add relations to that actual model. The schema uses PostgreSQL and assumes Prisma ORM 7-style project setup.

```prisma
enum ServiceStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum QuoteStatus {
  NEW
  IN_REVIEW
  NEEDS_INFORMATION
  ACCEPTED
  DECLINED
  CONVERTED
  ARCHIVED
}

enum ProjectStatus {
  INTAKE
  PLANNED
  IN_PROGRESS
  IN_REVIEW
  WAITING_FOR_CLIENT
  COMPLETED
  ON_HOLD
  CANCELLED
}

enum DeliverableStatus {
  DRAFT
  SHARED
  CHANGES_REQUESTED
  APPROVED
}

enum ContactMessageStatus {
  NEW
  IN_PROGRESS
  RESOLVED
  SPAM
}

enum TestimonialStatus {
  DRAFT
  PUBLISHED
  HIDDEN
}

enum MessageVisibility {
  CLIENT_VISIBLE
  INTERNAL
}

// Add these fields/relations to Better Auth's generated model User.
// Keep all the generated core fields and its Session/Account relations.
// `appRole` is a custom field, separate from Better Auth's optional Admin plugin `role`.
// Configure it in Better Auth with input: false so signup cannot set it.
// appRole String @default("CUSTOMER")
// quoteRequests QuoteRequest[]
// clientProjects Project[] @relation("ProjectClient")
// assignedProjects Project[] @relation("ProjectAssignee")
// assignedQuotes QuoteRequest[] @relation("QuoteAssignee")
// sentInvitations StaffInvitation[] @relation("InvitationSender")
// acceptedInvitations StaffInvitation[] @relation("InvitationAcceptedBy")
// projectMessages ProjectMessage[]
// uploadedDeliverables Deliverable[] @relation("DeliverableUploader")
// auditLogs AuditLog[]

model Service {
  id              String          @id @default(cuid())
  name            String
  slug            String          @unique
  shortDescription String
  description     String          @db.Text
  status          ServiceStatus   @default(DRAFT)
  featured        Boolean         @default(false)
  sortOrder       Int             @default(0)
  coverImageUrl   String?
  packages        ServicePackage[]
  quoteRequests   QuoteRequest[]
  projects        Project[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  @@index([status, sortOrder])
}

model ServicePackage {
  id               String          @id @default(cuid())
  serviceId        String
  service          Service         @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  name             String
  slug             String
  description      String          @db.Text
  price             Decimal?        @db.Decimal(10, 2)
  currency          String          @default("USD") @db.VarChar(3)
  deliverables      Json?
  turnaroundDays   Int?
  revisionLimit    Int?
  isActive          Boolean         @default(true)
  sortOrder         Int             @default(0)
  quoteRequests     QuoteRequest[]
  projects          Project[]
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@unique([serviceId, slug])
  @@index([serviceId, isActive, sortOrder])
}

model QuoteRequest {
  id               String       @id @default(cuid())
  name             String
  email            String
  companyName      String?
  companyWebsite   String?
  country          String?
  message          String       @db.Text
  goals            String?      @db.Text
  budgetRange      String?
  desiredDeadline  DateTime?
  attachments      Json?
  status           QuoteStatus  @default(NEW)
  internalNotes    String?      @db.Text

  userId           String?
  user             User?        @relation(fields: [userId], references: [id], onDelete: SetNull)
  serviceId        String?
  service          Service?     @relation(fields: [serviceId], references: [id], onDelete: SetNull)
  packageId        String?
  package          ServicePackage? @relation(fields: [packageId], references: [id], onDelete: SetNull)
  assignedToId     String?
  assignedTo       User?        @relation("QuoteAssignee", fields: [assignedToId], references: [id], onDelete: SetNull)
  project          Project?

  source           String?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  @@index([status, createdAt])
  @@index([email])
  @@index([userId, createdAt])
  @@index([assignedToId, status])
}

model Project {
  id               String        @id @default(cuid())
  projectCode      String        @unique
  title            String
  brief            String        @db.Text
  status           ProjectStatus @default(INTAKE)
  budget           Decimal?      @db.Decimal(10, 2)
  currency         String        @default("USD") @db.VarChar(3)
  startDate        DateTime?
  dueDate          DateTime?
  completedAt      DateTime?

  clientId         String
  client           User          @relation("ProjectClient", fields: [clientId], references: [id], onDelete: Restrict)
  assignedToId     String?
  assignedTo       User?         @relation("ProjectAssignee", fields: [assignedToId], references: [id], onDelete: SetNull)
  serviceId        String?
  service          Service?      @relation(fields: [serviceId], references: [id], onDelete: SetNull)
  packageId        String?
  package          ServicePackage? @relation(fields: [packageId], references: [id], onDelete: SetNull)
  quoteRequestId   String?       @unique
  quoteRequest     QuoteRequest? @relation(fields: [quoteRequestId], references: [id], onDelete: SetNull)

  messages         ProjectMessage[]
  deliverables     Deliverable[]
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@index([clientId, updatedAt])
  @@index([status, dueDate])
  @@index([assignedToId, status])
}

model ProjectMessage {
  id          String           @id @default(cuid())
  projectId   String
  project     Project          @relation(fields: [projectId], references: [id], onDelete: Cascade)
  senderId    String
  sender      User             @relation(fields: [senderId], references: [id], onDelete: Restrict)
  body        String           @db.Text
  visibility  MessageVisibility @default(CLIENT_VISIBLE)
  createdAt   DateTime         @default(now())

  @@index([projectId, createdAt])
  @@index([senderId, createdAt])
}

model Deliverable {
  id             String            @id @default(cuid())
  projectId      String
  project        Project           @relation(fields: [projectId], references: [id], onDelete: Cascade)
  title          String
  description    String?           @db.Text
  fileUrl        String
  previewUrl     String?
  version        Int               @default(1)
  status         DeliverableStatus @default(DRAFT)
  uploadedById   String?
  uploadedBy     User?             @relation("DeliverableUploader", fields: [uploadedById], references: [id], onDelete: SetNull)
  sharedAt       DateTime?
  approvedAt     DateTime?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  @@index([projectId, createdAt])
  @@index([projectId, status])
}

model ContactMessage {
  id          String              @id @default(cuid())
  name        String
  email       String
  subject     String?
  message     String              @db.Text
  status      ContactMessageStatus @default(NEW)
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  @@index([status, createdAt])
  @@index([email])
}

model PortfolioItem {
  id               String    @id @default(cuid())
  title            String
  slug             String    @unique
  summary          String    @db.Text
  industry         String?
  challenge        String?   @db.Text
  approach         String?   @db.Text
  outcomes         String?   @db.Text
  coverImageUrl    String?
  gallery          Json?
  isConceptWork    Boolean   @default(false)
  isPublished      Boolean   @default(false)
  publishedAt      DateTime?
  sortOrder        Int       @default(0)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@index([isPublished, sortOrder])
}

model Testimonial {
  id             String            @id @default(cuid())
  customerName   String
  customerTitle  String?
  companyName    String?
  quote          String            @db.Text
  rating         Int?
  permissionConfirmed Boolean      @default(false)
  status         TestimonialStatus @default(DRAFT)
  sortOrder      Int               @default(0)
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  @@index([status, sortOrder])
}

model StaffInvitation {
  id             String    @id @default(cuid())
  email          String
  invitedRole    String    // e.g. STAFF or ADMIN; validated against an allow-list in the API
  tokenHash      String    @unique
  invitedById    String
  invitedBy      User      @relation("InvitationSender", fields: [invitedById], references: [id], onDelete: Restrict)
  acceptedById   String?
  acceptedBy     User?     @relation("InvitationAcceptedBy", fields: [acceptedById], references: [id], onDelete: SetNull)
  expiresAt      DateTime
  acceptedAt     DateTime?
  revokedAt      DateTime?
  createdAt      DateTime  @default(now())

  @@index([email, createdAt])
  @@index([expiresAt, acceptedAt, revokedAt])
}

model AuditLog {
  id          String   @id @default(cuid())
  actorId     String?
  actor       User?    @relation(fields: [actorId], references: [id], onDelete: SetNull)
  action      String
  targetType  String?
  targetId    String?
  metadata    Json?
  createdAt   DateTime @default(now())

  @@index([actorId, createdAt])
  @@index([targetType, targetId, createdAt])
  @@index([action, createdAt])
}
```

### Schema integration notes

- The `User` relation additions shown as comments must be added inside the **actual Better Auth-generated** `User` model. `appRole` is an actual field; the relation lines are fields to add too.
- In `auth.ts`, configure `user.additionalFields.appRole` as a string with a default of `CUSTOMER` and `input: false`. Never accept role values from a public sign-up payload.
- If you install Better Auth's Admin plugin, it introduces its own `role` field and user-management powers. Decide whether to use that plugin or your custom `appRole` permission system; don't casually maintain two sources of truth for administrator status.
- `Json` fields are intentionally flexible for v1 attachments/gallery/package deliverables. Use structured models instead if you need rich search/reporting over their contents.
- `fileUrl` and `coverImageUrl` should point to object storage/CDN, not contain file bytes.
- If using Prisma 7 with PostgreSQL, follow the configured generator output path and driver adapter already present in your repo. Do not replace a working generated-client setup with an example copied from a different Prisma version.
- Before running a migration against existing data, inspect `prisma/schema.prisma`, the generated Better Auth models, and the current migration state.

## 7. Email flows

Create a backend email service abstraction so controllers don't contain provider-specific code. In v1, emails to send:

1. Quote received → visitor's submitted `QuoteRequest.email`.
2. New quote alert → agency inbox/admins.
3. Contact form received → visitor's `ContactMessage.email` and optionally the agency inbox.
4. Staff invite → `StaffInvitation.email` with a one-time acceptance link.
5. Project status/update → customer's verified user email.
6. Deliverable ready / approval requested → customer's email.
7. Authentication verification/reset emails → Better Auth's configured callbacks/provider.

Use a verified sender domain, store the provider's message ID and delivery outcome if useful, rate-limit public forms, validate with Zod, and avoid putting passwords, auth tokens, or private client files into logs. A later `EmailEvent`/outbox model can make retries and delivery tracking more reliable; it is optional for the first local prototype.

## 8. API boundaries

Example route groups (exact names can follow the existing Express project):

- Better Auth: `/api/auth/*`.
- Public: `GET /api/v1/services`, `GET /api/v1/services/:slug`, `GET /api/v1/portfolio`, `GET /api/v1/portfolio/:slug`.
- Forms: `POST /api/v1/quotes`, `POST /api/v1/contact`.
- Current user: `GET /api/v1/me`, `PATCH /api/v1/me`.
- Client: `GET /api/v1/me/projects`, `GET /api/v1/projects/:id`, `GET /api/v1/projects/:id/deliverables`, `POST /api/v1/projects/:id/messages`, `POST /api/v1/deliverables/:id/approval`.
- Admin: `/api/v1/admin/quotes`, `/projects`, `/clients`, `/services`, `/packages`, `/portfolio`, `/testimonials`, `/team/invitations`, `/contact-messages`, `/audit-log`, `/settings`.

Every protected request should: resolve the Better Auth session on the backend, validate payloads with Zod, check role/permission, enforce ownership/assignment for client and staff project reads, then query Prisma. Do not use an email or user ID supplied by the browser as proof of identity.

## 9. Development milestones

### Phase 1 — Foundation
- Confirm Better Auth and Prisma versions/setup.
- Generate Better Auth schema, add `appRole`, run migration, generate client.
- Configure Google OAuth and cookie/CORS origins for local development.
- Build public/auth/client/admin layout shells and protected route handling.
- Add API health check and current-user endpoint.

### Phase 2 — Leads and marketing content
- Build service/package models and seed initial service content.
- Build landing, services, work, contact, and quote pages.
- Save quote/contact submissions in PostgreSQL with Zod validation.
- Send quote-received and agency-notification emails.
- Build admin quote inbox and service/package management.

### Phase 3 — Delivery workflow
- Add project creation from accepted quotes.
- Add project statuses, assignees, client portal list/detail pages.
- Add deliverable metadata and storage uploads.
- Add approval/change requests and client-visible vs internal messages.

### Phase 4 — Admin/team safety and polish
- Add OWNER bootstrapping, staff invitations, role checks, audit log.
- Add portfolio and testimonial publishing.
- Add responsive/empty/loading/error states, accessibility, rate limiting, backups, and production-origin/security checks.

### Later, only when needed
- Invoices and online payments, automated contracts, recurring retainers, real-time chat, richer notification preferences, a self-service marketplace, analytics, and client-team organizations.

## 10. Pre-launch security checklist

- No public role selector; role is always assigned server-side.
- An initial OWNER is created via controlled seed/operation, not “first user wins.”
- Role changes/invitations are authorized in the API and written to `AuditLog`.
- Invite tokens are random, single-use, stored as hashes, expire, and require the invited email to match the signed-in account.
- Customer endpoints verify `project.clientId === session.user.id`.
- Staff access follows assignment/permission rules; internal notes never appear in client responses.
- Public forms have Zod validation, length limits, rate limiting, spam controls, and safe error messages.
- Secrets (Google client secret, Better Auth secret, database URL, email provider key) are backend-only environment variables.
- Production CORS/trusted origins are allow-listed; don't use wildcard credentialed CORS.
- File access uses appropriate private storage permissions or time-limited signed URLs.
- Keep privacy policy consistent with the user data and emails actually collected/sent.
