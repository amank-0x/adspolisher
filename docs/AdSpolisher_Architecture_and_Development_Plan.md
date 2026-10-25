# AdSpolisher — Application Architecture & Development Plan

**Status:** Initial implementation guide  
**Product:** AdSpolisher  
**Architecture:** Next.js frontend + Express API + PostgreSQL  
**Deployment target:** Vercel (frontend) + Render (backend)  
**Repository strategy:** pnpm workspace monorepo

---

## 1. Purpose

AdSpolisher is launching as a marketing service business supported by AI-assisted workflows and human expertise. The initial website should help prospective customers:

- Understand the services offered.
- Review genuine portfolio work or clearly labelled concept examples.
- Submit project inquiries and request quotes.
- Eventually purchase clearly defined packages.
- Receive project updates and agreed deliverables through an appropriate workflow.

The initial release is **not a self-serve AI SaaS platform**. Build the smallest reliable application that helps the team receive inquiries and convert suitable ones into paid projects.

## 2. Architecture decision

Use two separate applications in one repository:

1. **`apps/web` — Next.js frontend**, deployed to Vercel.
2. **`apps/api` — Express + TypeScript backend**, deployed to Render.

Use a managed PostgreSQL database accessed by the backend through Prisma ORM.

### Why separate applications?

- The frontend and backend can be deployed independently.
- The Express API keeps business rules and database access out of UI components.
- The API can later serve additional clients, such as a mobile app or another frontend.
- This is useful for learning and demonstrating backend engineering with Express, Prisma, TypeScript, and Zod.

A separate backend is a deliberate architecture choice, not a technical requirement of Vercel. Next.js can also implement server-side endpoints itself. For this project, keep Express because an independent API is an explicit requirement.

### High-level diagram

```text
Customer's browser
       |
       v
Next.js website (Vercel)
       |
       | HTTPS / REST / JSON
       v
Express API (Render)
       |
       | Prisma ORM
       v
Managed PostgreSQL
```

The browser should communicate with the Express API for business operations. The Express API is responsible for validating requests, enforcing business rules, and accessing the database.

## 3. Technology stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js, React, TypeScript | Public pages and interactive UI |
| Styling | Tailwind CSS | Responsive styling |
| Backend | Node.js, Express, TypeScript | REST API and business logic |
| Validation | Zod | Validate incoming API data |
| Database | PostgreSQL | Persistent application data |
| ORM | Prisma | Database access, schema and migrations |
| Workspace | pnpm workspaces | Manage both apps in one repository |
| Frontend hosting | Vercel | Deploy the Next.js app |
| Backend hosting | Render | Deploy the Express API |
| Email | Transactional email provider | Inquiry acknowledgments and updates |
| Payments | Supported hosted checkout provider | Add after package scope and pricing are defined |
| File storage | Private object storage | Add when secure uploads are required |

Check current hosting-provider limits, database policies, payment eligibility, and pricing before production deployment. Free tiers and product policies can change.

## 4. Repository structure

Start with this structure. Add modules only when the corresponding feature is being implemented.

```text
adspolisher/
├── apps/
│   ├── web/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (marketing)/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── services/
│   │   │   │   │   ├── portfolio/
│   │   │   │   │   ├── how-it-works/
│   │   │   │   │   ├── contact/
│   │   │   │   │   └── legal/
│   │   │   │   ├── (conversion)/
│   │   │   │   │   ├── get-a-quote/
│   │   │   │   │   └── start-project/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   ├── layout/
│   │   │   │   ├── marketing/
│   │   │   │   └── forms/
│   │   │   ├── features/
│   │   │   │   ├── services/
│   │   │   │   ├── leads/
│   │   │   │   └── quotes/
│   │   │   └── lib/
│   │   │       ├── api-client.ts
│   │   │       └── env.ts
│   │   └── package.json
│   │
│   └── api/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── src/
│       │   ├── app.ts
│       │   ├── server.ts
│       │   ├── config/
│       │   ├── lib/
│       │   │   └── prisma.ts
│       │   ├── middlewares/
│       │   │   ├── error.middleware.ts
│       │   │   ├── validate.middleware.ts
│       │   │   ├── rate-limit.middleware.ts
│       │   │   └── not-found.middleware.ts
│       │   ├── modules/
│       │   │   ├── health/
│       │   │   ├── services/
│       │   │   ├── leads/
│       │   │   ├── quotes/
│       │   │   ├── orders/
│       │   │   ├── projects/
│       │   │   ├── payments/
│       │   │   ├── auth/
│       │   │   └── admin/
│       │   └── utils/
│       ├── tests/
│       └── package.json
│
├── packages/
│   └── contracts/                 # Optional shared Zod schemas/types
│       ├── src/
│       └── package.json
├── .gitignore
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

### Backend module convention

For example, `apps/api/src/modules/leads/` may contain:

```text
leads/
├── lead.routes.ts
├── lead.controller.ts
├── lead.service.ts
├── lead.repository.ts
├── lead.validation.ts
└── lead.types.ts
```

Responsibilities:

- **Routes:** Define paths and attach middleware.
- **Controller:** Translate HTTP requests into service calls and HTTP responses.
- **Service:** Implement business rules and coordinate operations.
- **Repository:** Encapsulate Prisma queries when that abstraction is useful.
- **Validation:** Define Zod schemas for request data.
- **Types:** Add module-specific types that are not already inferred from schemas.

Do not create empty layers just to follow a pattern. For a small module, combine files where doing so improves clarity. Keep database access and business rules out of route handlers.

## 5. Frontend pages

### Initial public pages

| Page | Purpose |
|---|---|
| Home | Explain the value proposition and direct visitors to services or a quote |
| Services | Explain active services, deliverables, exclusions, and indicative prices |
| Service detail | Give each important service a focused landing page when needed |
| Portfolio | Show authorized work or clearly labelled concept projects |
| How It Works | Explain the steps from inquiry to delivery |
| Get a Quote | Collect enough information to assess a project |
| Contact | Provide genuine contact details and expected response time |
| Legal | Publish relevant privacy, service, cancellation/refund and terms pages |

### Quote form fields

Start with fields that help the team assess a project:

- Name and work email.
- Business name and website.
- Country or time zone.
- Requested service and advertising platform, if relevant.
- Business goal and project description.
- Budget range and desired deadline.
- Optional relevant links or uploads.
- Consent and privacy notice.

Do not request passwords or advertising-account credentials in a general inquiry form. Collect only information needed to assess the project.

### Frontend implementation guidance

- Use Next.js Server Components for public pages where practical.
- Use Client Components for interactive forms and browser-side interactions.
- Centralize API calls in `apps/web/src/lib/api-client.ts`.
- Handle loading, validation, success, and error states in forms.
- Validate on the frontend for usability, but always validate again in the backend.
- Keep secrets and database credentials out of `NEXT_PUBLIC_` variables.

## 6. Backend architecture and request flow

Use a versioned API prefix: `/api/v1`.

Example: quote inquiry submission.

```text
Quote form in Next.js
        |
        | POST /api/v1/leads
        v
Express route
        |
        v
Validation middleware (Zod)
        |
        v
Controller
        |
        v
Service (business rules)
        |
        v
Repository / Prisma
        |
        v
PostgreSQL
        |
        v
HTTP response to the frontend
```

A controller should not implement the entire workflow or contain all database queries. Keep validation, business rules, and persistence organized so that they can be tested independently.

## 7. Initial API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/services` | List active service packages |
| `GET` | `/api/v1/services/:slug` | Fetch a service |
| `POST` | `/api/v1/leads` | Submit a project inquiry |
| `POST` | `/api/v1/quotes/requests` | Submit a custom quote request |

Add these after the initial workflow is working:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/admin/leads` | List leads for authenticated staff |
| `PATCH` | `/api/v1/admin/leads/:id` | Update lead status |
| `POST` | `/api/v1/admin/quotes` | Create/send a quote |
| `PATCH` | `/api/v1/admin/projects/:id` | Update project status |
| `POST` | `/api/v1/payments/checkout` | Create hosted checkout session |
| `POST` | `/api/v1/payments/webhook` | Receive verified payment events |

Protect administrative endpoints with authentication and authorization. Do not let a public quote request automatically approve a quote, set an authoritative price, or mark an order as paid.

## 8. Database design

Use one PostgreSQL database initially, accessed only by the backend through Prisma.

### Core models

**Lead**
- Contact information, company and website.
- Requested service, project description, goal and budget range.
- Lead status and timestamps.

**ServicePackage**
- Name, slug, description and active status.
- Price and currency where a fixed price is appropriate.
- Deliverables, exclusions, turnaround and revision limits.

**Quote**
- Lead reference.
- Proposed scope, amount, currency, timeline, expiry and status.
- Record the accepted terms and relevant timestamps.

**Order**
- Customer/lead reference and accepted quote reference where applicable.
- Snapshot of agreed scope, package details, amount and currency.
- Payment and fulfillment statuses.

**Payment**
- Order reference, provider, provider payment/session reference.
- Amount, currency, payment status and relevant timestamps.
- Webhook event IDs or an equivalent idempotency mechanism.

**Project**
- Order reference, project status, agreed deadline and milestones.

**ProjectUpdate**
- Project reference, update content, visibility and timestamp.

**ProjectFile** (when uploads are implemented)
- Project reference, storage key, safe display filename, MIME type, size and access metadata.

### Data-model rules

- Represent monetary amounts with a suitable decimal or integer-minor-unit strategy; do not use floating-point numbers for money.
- Store currency explicitly, such as `USD`.
- Snapshot the accepted package terms and price on the order so later catalog edits do not rewrite an existing agreement.
- Add foreign keys, timestamps, useful indexes, and unique constraints.
- Use defined statuses for leads, quotes, orders, payments and projects.
- Never store card numbers or security codes in your database.
- Keep files in private object storage when possible; store metadata and storage references in PostgreSQL.
- Design webhook processing to safely handle duplicate delivery.

Avoid adding customer accounts, complex roles, multi-tenancy, or a full client portal until a real workflow requires them.

## 9. Validation, errors and security

### Validation

Use Zod to validate all untrusted incoming request data. If you share Zod schemas between apps, place them in `packages/contracts` and import them through a correctly configured workspace package.

The backend remains the security boundary even when both apps share schemas.

### Middleware

Implement as needed:

- JSON body parsing with a reasonable body-size limit.
- CORS with explicit allowed origins.
- Helmet security headers.
- Rate limiting, especially for public forms and authentication.
- Zod validation middleware.
- Centralized error handling and a not-found handler.
- Authentication and authorization for protected routes.
- Request logging that avoids passwords, tokens and unnecessary personal data.

### Environment variables

Example local configuration:

`apps/web/.env.local`

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

`apps/api/.env`

```dotenv
PORT=4000
DATABASE_URL=your_postgresql_connection_string
WEB_ORIGIN=http://localhost:3000
```

These are examples for local development. Configure production values in the respective hosting dashboards. Never commit real credentials.

## 10. Deployment plan

### Vercel — frontend

- Connect the repository to Vercel.
- Configure the project root directory as `apps/web`, with the correct workspace settings.
- Set `NEXT_PUBLIC_API_URL` to the deployed Express API URL.
- Deploy and verify the public pages and form submissions.

### Render — backend

- Create a web service from the same repository.
- Configure the service root/build/start commands to work with `apps/api` and the pnpm workspace.
- Set `PORT`, `DATABASE_URL`, and `WEB_ORIGIN` in Render's environment configuration.
- Listen on the port provided by the host and bind to `0.0.0.0`.
- Configure a health-check path such as `/api/v1/health`.
- Run production database migrations as a controlled deployment step, not on every application startup.

### PostgreSQL

Choose a managed provider after checking its current free-tier limits, connection limits, storage, backups, inactivity policies, and production suitability. Keep database access restricted to the backend.

### Cross-origin requests

During local development, the frontend and API typically use different origins. Configure Express CORS to allow the exact frontend origins needed for development and production.

If authentication later uses cookies across different origins, configure credentialed CORS, secure cookie attributes, and CSRF protection as appropriate. Do not use a wildcard allowed origin with credentialed requests.

### Free-tier caveat

Free hosting plans can have cold starts, sleeping services, limited resources, or changing policies. Verify current provider documentation before launch. A free plan is useful for learning and an MVP, but do not promise production availability based on it.

## 11. Development milestones

### Milestone 1 — Repository and connectivity

- [ ] Create the pnpm workspace.
- [ ] Set up the Next.js app.
- [ ] Set up the Express TypeScript app.
- [ ] Connect Prisma to PostgreSQL.
- [ ] Implement and test `/api/v1/health`.
- [ ] Confirm Next.js can call the API.

**Completion criterion:** Both apps run independently and the API can connect to the database.

### Milestone 2 — Public website

- [ ] Build the layout, navigation, footer and responsive design.
- [ ] Implement Home, Services, Portfolio and How It Works.
- [ ] Add Contact and required legal-page placeholders/content.
- [ ] Use accurate service claims and genuine or clearly labelled sample work.

**Completion criterion:** Visitors can understand the service and navigate the site on desktop and mobile.

### Milestone 3 — Lead capture

- [ ] Implement the Lead Prisma model and migration.
- [ ] Create Zod validation.
- [ ] Implement `POST /api/v1/leads`.
- [ ] Connect the quote form.
- [ ] Add success/error states and spam controls.
- [ ] Add an inquiry acknowledgment email if a suitable provider is configured.

**Completion criterion:** A test inquiry is validated, saved, and made available to the team.

### Milestone 4 — Internal workflow

- [ ] Add protected admin authentication.
- [ ] List and filter leads.
- [ ] Update lead statuses.
- [ ] Create and send quotes.
- [ ] Track project status and updates.

**Completion criterion:** The team can manage inquiries without direct database editing.

### Milestone 5 — Orders and payments

- [ ] Confirm package scope and pricing.
- [ ] Finalize service terms, cancellation and refund policies.
- [ ] Select a supported payment provider.
- [ ] Implement hosted checkout and verified webhooks.
- [ ] Record payment events idempotently.
- [ ] Test successful, failed, cancelled and duplicate payment events.

**Completion criterion:** Test purchases produce correct order and payment records.

### Milestone 6 — Production launch

- [ ] Add automated tests and CI checks.
- [ ] Deploy frontend and backend independently.
- [ ] Configure production environment variables and HTTPS.
- [ ] Verify CORS, database connectivity and migrations.
- [ ] Set up backups, logging and error monitoring appropriate to the hosting setup.
- [ ] Test the complete inquiry workflow in production.

**Completion criterion:** The deployed site can reliably receive inquiries and the team can process them.

## 12. Testing strategy

Start with the most important business paths.

- **Unit tests:** Validation and business rules.
- **API integration tests:** Lead creation, invalid inputs, missing records, and authorization.
- **Frontend tests:** Form validation, loading states and success/error feedback.
- **End-to-end tests:** Visitor submits an inquiry; the lead is persisted and available to staff.
- **Payment tests:** Use the provider's test mode and webhook test events before accepting live payments.

Never use production customer data in tests unless it is specifically authorized and properly protected.

## 13. What not to build yet

Avoid spending early development time on:

- A subscription billing system.
- A self-service AI marketing generator.
- A full client dashboard.
- Complex role and permission hierarchies.
- Multi-tenant SaaS infrastructure.
- Automated ad-account changes.
- Elaborate file-delivery workflows before the delivery process is defined.

Add features in response to real customer and operational needs.

## 14. First implementation checklist

The first useful end-to-end slice should be:

1. Create the monorepo and run both apps.
2. Connect Express to PostgreSQL with Prisma.
3. Implement `GET /api/v1/health`.
4. Implement the Lead model and migration.
5. Implement `POST /api/v1/leads` with Zod validation.
6. Build the Next.js quote form.
7. Connect the form to the API.
8. Verify that a valid inquiry is stored and an invalid one is rejected.

**First milestone:** A prospective customer submits a legitimate inquiry, the backend validates and stores it, and the team can follow up.

That is a better foundation than building many incomplete features in parallel.

---

## Reference business-plan decisions

This architecture follows the initial AdSpolisher plan:

- Launch as a service business rather than a self-serve SaaS product.
- Start with a focused set of services and validate pricing.
- Use the website to explain services, show proof, capture leads, and support quotes or fixed-price purchases.
- Keep AI-assisted work subject to human review.
- Defer customer dashboards and other complex features until the workflow justifies them.

The business plan treats proposed service prices and customer targets as hypotheses to validate, not established facts. Final service scope, payment eligibility, legal requirements and customer workflows should be confirmed with the business owner before launch.
