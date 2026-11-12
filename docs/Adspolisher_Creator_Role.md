# AdSpolisher Creator Dashboard: Product and Technical Spec

**Version 1.0** · Covers layout, navigation, Project Requests (offers and negotiation), Earnings, task workspace, data model, permissions and build phases.

---

## 1. Purpose and principles

The admin portal is an operations command center. The creator dashboard is a creative workspace: creators see only what is assigned to them, understand what to deliver, get paid fairly, upload work and respond to feedback.

### Core principles:
- **Offer → Project → Tasks → Submissions → Earnings** is the creator's real lifecycle. Everything else supports it.
- Creators see only their own offers, projects, tasks, files and money. Never other creators' pay, never the client's budget, never admin margin or internal notes.
- Money is tracked per creator agreement, not on `Project.budget`.
- Same visual language as the admin portal: warm light background, white rounded cards, indigo/purple primary buttons, fixed left sidebar, minimal top bar (search, notifications, avatar).

---

## 2. Why Project Requests and Earnings are required

Yes, both are required. Because creators are paid, the platform needs a formal agreement step and a payment ledger.

| Need | Feature | What it solves |
| --- | --- | --- |
| Admin offers a creator a project at a price (for example 6,000) | **Project Requests** | Creator can accept, reject or negotiate. Acceptance creates the project access. |
| Creator wants to know what they earned and when they get paid | **Earnings** | Pending, payable and paid amounts, per project, with payout history. |

**Key money rule:** `Project.budget` is what the client pays AdSpolisher. Creator pay is stored on the offer. Example: client pays 15,000, Creator A is offered 6,000, Creator B 3,000, AdSpolisher keeps the rest. Each creator on a project can have a different agreement.

---

## 3. Sidebar and navigation

**CREATOR** badge under the AdSpolisher logo.

- **Overview**
- **WORKSPACE:** Project Requests (with badge count), My Projects, My Tasks, Submissions, Feedback and Messages, My Teams
- **FINANCE:** Earnings
- **PERSONAL:** My Portfolio, My Profile, Settings

**Top bar:** global search, notification bell (new offers, counter-offers, feedback, payments), avatar menu.

### Routes

```text
/creator
├── /                         Overview
├── /requests                 Project Requests (offers inbox)
│   └── /[offerId]            Offer detail and negotiation
├── /projects
│   └── /[projectId]          Project details (only after accepting an offer)
├── /tasks
│   └── /[taskId]             Task workspace and upload
├── /submissions              Uploaded work and versions
├── /feedback                 Feedback and messages
├── /teams                    My Teams
├── /earnings
│   ├── /                     Summary, per-project earnings
│   └── /payouts              Payout history and payout details
├── /portfolio                My Portfolio
├── /profile                  My Profile
└── /settings                 Account settings
```

---

## 4. Page specifications

### 4.1 Overview
Directs the creator to the next action; not just statistics.
- **Stat cards:** Pending requests, Assigned projects, Active tasks, Due soon, Revisions, Payable balance.
- **Action needed strip:** offers waiting for response (with expiry countdown), counter-offers from admin, revision requests.
- **Today's priorities:** (tasks), active project cards with progress, upcoming deadlines, recent feedback, recent activity.

### 4.2 Project Requests
The inbox for offers sent by admin.

**List view:** tabs *Needs response*, *Waiting on admin*, *Accepted*, *Declined / Expired*.  
Each row/card shows: offer code, project title, service category, offered amount and currency, deadline, role, expiry date, status chip and a **View request** button.

**Offer detail page shows:**
- **Project brief:** (creator-safe version: no client contact details, no client budget).
- **Role and scope:** what the creator is expected to deliver, number of deliverables, formats, reference files.
- **Timeline:** start date, due date, response deadline.
- **Payment:** offered amount, currency, payment terms (for example paid after final approval, or milestones).
- **Negotiation history timeline:** (every offer and counter, with who and when).
- **Action buttons:**
  - **Accept** (confirm dialog restating amount and deadline)
  - **Counter-offer** (propose amount and optional new deadline plus a message)
  - **Decline** (optional reason, picked from a list plus free text)

#### Negotiation rules:
1. Admin sends offer (round 1).
2. Creator accepts, declines or counters. A counter needs an amount and a message.
3. Admin accepts the counter, sends a revised offer, or withdraws.
4. Repeat up to a maximum of 3 rounds (configurable); after that the admin must accept, decline or withdraw.
5. Whoever's turn it is gets the notification; the other side's buttons are disabled.
6. Offers expire at `expiresAt`; expired offers cannot be accepted.
7. Once accepted, the amount is locked. Changes need a new offer (an amendment) or an admin adjustment recorded in the ledger.

#### On acceptance (single database transaction):
- Offer status becomes `ACCEPTED`, `acceptedAmount` and `respondedAt` are stored.
- A `ProjectTeamMember` row is created (linked to the offer) with the agreed role title.
- An `EarningEntry` is created with status `PENDING` for the agreed amount.
- The project appears in the creator's My Projects; the admin is notified.
- If a task template exists for the role, tasks are generated or the admin is prompted to assign tasks.

### 4.3 My Projects
Only projects where the creator has a `ProjectTeamMember` row linked to an accepted offer. Card: project name and code, client/business name, service category, your role, deadline, progress, status, Open project. The creator sees only their own tasks, files and instructions inside each project.

### 4.4 My Tasks
**Filters:** All, To do, In progress, Submitted, Revision requested, Approved.  
**Columns:** task, project, due date, status. Clicking opens the task workspace.

### 4.5 Task workspace (upload page)
**Route:** `/creator/projects/[projectId]/tasks/[taskId]` (also reachable via `/creator/tasks/[taskId]`).

**Sections:** header (project, status, deadline), instructions, details (deliverables, format, dimensions), reference assets, upload area, submission note, version history, feedback thread.

**Upload rules:** a file is saved as a `Deliverable` with `storageKey`, `originalName`, `mimeType`, `sizeBytes`, `version` and a task link before **Submit for review** is enabled. Uploading again creates a new version; old versions are never overwritten. Allowed types and size limits are validated on the server and by pre-signed upload.

**Task workflow:**  
`ASSIGNED` → `IN_PROGRESS` → `SUBMITTED` → `REVISION_REQUESTED` → (re-upload) → `SUBMITTED` → `APPROVED`.

### 4.6 Submissions
History of all uploaded files: file name, task, project, version, date, review status, admin feedback, and a Resubmit action on revision-requested items.

### 4.7 Feedback and Messages
Conversations are tied to a project or task, not free-floating chats. Includes admin feedback, revision instructions, project messages (internal visibility only, never client-visible), and notification feed.

### 4.8 My Teams
Teammates on the same projects, their roles, who the lead is, and the project team chat. No internal admin notes, no client private details, and no teammates' payment amounts.

### 4.9 Earnings

#### Summary cards

| Card | Meaning |
| --- | --- |
| Total earned | All entries ever marked paid |
| Pending | Agreed but work not yet approved |
| Payable | Approved by admin, waiting for payout |
| Paid this month | Paid in the current calendar month |
| On hold | Held due to dispute or review |

- **Per-project earnings table:** project, offer code, agreed amount, status, expected payment date, paid date.
- **Payout history:** date, amount, method, reference/transaction ID, included projects, status.
- **Payout details (settings tab inside Earnings):** bank account/UPI, PAN or tax details where required, with masked display and encrypted storage. Payouts are blocked until details are verified.

#### Payment lifecycle:
1. Offer accepted → ledger entry `PENDING`.
2. Creator's deliverables approved (or milestone approved) → entry `APPROVED` (payable).
3. Admin batches entries into a payout → `IN_PAYOUT`.
4. Payment sent and reference recorded → `PAID`.
5. Disputes or review issues → `ON_HOLD`; cancelled project/offer → `CANCELLED`.

*Payment trigger (when `PENDING` becomes `APPROVED`) is a business decision. Recommended default: on admin approval of the creator's final deliverable, with optional milestone splits (for example 30 percent on acceptance, 70 percent on approval).*

### 4.10 Portfolio, Profile, Settings
- **Portfolio:** intro, skills, tools, experience, work samples, external links. Publishing to the public `/work` page requires admin approval, especially for client work.
- **Profile:** name, photo, bio, skills, contact info, availability.
- **Settings:** password, email/notification preferences, active sessions, sign out.

---

## 5. Data model

The models below extend your existing `Project`, `ProjectTeamMember`, `ProjectMessage` and `Deliverable`. Enum and model names are suggestions; adapt to your naming. Assumes an existing User model with a creator role.

### 5.1 Enums

```prisma
enum OfferStatus {
  DRAFT                // admin is preparing, creator cannot see it
  SENT                 // waiting for creator
  COUNTERED_BY_CREATOR // waiting for admin
  COUNTERED_BY_ADMIN   // waiting for creator
  ACCEPTED
  DECLINED             // creator declined
  WITHDRAWN            // admin withdrew
  EXPIRED
}

enum NegotiationAction {
  OFFER
  COUNTER
  ACCEPT
  DECLINE
  WITHDRAW
  EXPIRE
  NOTE
}

enum NegotiationActor {
  ADMIN
  CREATOR
  SYSTEM
}

enum EarningType {
  PROJECT_PAYMENT
  MILESTONE
  BONUS
  ADJUSTMENT
  DEDUCTION
}

enum EarningStatus {
  PENDING
  APPROVED
  IN_PAYOUT
  PAID
  ON_HOLD
  CANCELLED
}

enum PayoutStatus {
  PROCESSING
  PAID
  FAILED
  CANCELLED
}

enum PayoutMethod {
  BANK_TRANSFER
  UPI
  PAYPAL
  OTHER
}

enum TaskStatus {
  ASSIGNED
  IN_PROGRESS
  SUBMITTED
  REVISION_REQUESTED
  APPROVED
  CANCELLED
}
```

### 5.2 ProjectOffer (the project request sent to a creator)
One row per admin-to-creator offer. A project can have many offers (one per creator, or several to compare).

```prisma
model ProjectOffer {
  id        String @id @default(cuid())
  offerCode String @unique // e.g. OFR-2026-0001

  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  creatorId String
  creator   User    @relation("OfferCreator", fields: [creatorId], references: [id], onDelete: Restrict)
  offeredById String
  offeredBy   User    @relation("OfferAdmin", fields: [offeredById], references: [id], onDelete: Restrict)

  roleTitle    String  @default("Creator")
  scopeSummary String  @db.Text           // what the creator must deliver
  paymentTerms String? @db.Text           // e.g. paid after final approval

  // Money (creator side only; never Project.budget)
  currency       String   @default("INR") @db.VarChar(3)
  currentAmount  Decimal  @db.Decimal(10, 2) // latest proposed figure
  acceptedAmount Decimal? @db.Decimal(10, 2) // locked on acceptance

  proposedStartDate DateTime?
  proposedDueDate   DateTime?
  expiresAt         DateTime?

  status        OfferStatus @default(DRAFT)
  currentRound  Int         @default(1)
  maxRounds     Int         @default(3)
  declineReason String?     @db.Text
  sentAt        DateTime?
  respondedAt   DateTime?

  negotiation    OfferNegotiationEntry[]
  teamMember     ProjectTeamMember?
  earningEntries EarningEntry[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([creatorId, status])
  @@index([projectId, status])
  @@index([status, expiresAt])
}
```

### 5.3 OfferNegotiationEntry (immutable history)
Every send, counter, accept and decline is a new row. Never edit past rows; this is your audit trail.

```prisma
model OfferNegotiationEntry {
  id        String @id @default(cuid())
  offerId   String
  offer     ProjectOffer @relation(fields: [offerId], references: [id], onDelete: Cascade)
  round     Int
  action    NegotiationAction
  actorRole NegotiationActor
  actorId   String?
  actor     User? @relation("NegotiationActor", fields: [actorId], references: [id], onDelete: SetNull)

  amount    Decimal? @db.Decimal(10, 2)
  dueDate   DateTime?
  message   String?  @db.Text
  createdAt DateTime @default(now())

  @@index([offerId, createdAt])
}
```

### 5.4 Changes to existing models

```prisma
model ProjectTeamMember {
  // existing fields ...
  offerId String?       @unique
  offer   ProjectOffer? @relation(fields: [offerId], references: [id], onDelete: SetNull)
  isLead  Boolean       @default(false)
  tasks   ProjectTask[]
}

model Deliverable {
  // existing fields ...
  taskId         String?
  task           ProjectTask? @relation(fields: [taskId], references: [id], onDelete: SetNull)
  reviewFeedback String?      @db.Text
  reviewedAt     DateTime?

  @@index([taskId, version])
}
```

The existing `Deliverable.version` already supports versioning: when a creator re-uploads for the same task, create a new row with version + 1 and keep the old one.

Add back-relations on `Project` (`offers ProjectOffer[]`, `tasks ProjectTask[]`) and on `User` (`offersReceived`, `offersSent`, `earnings`, `payouts`, `payoutAccount`).

### 5.5 ProjectTask

```prisma
model ProjectTask {
  id              String @id @default(cuid())
  projectId       String
  project         Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assigneeId      String                 // ProjectTeamMember
  assignee        ProjectTeamMember @relation(fields: [assigneeId], references: [id], onDelete: Cascade)
  title           String
  instructions    String? @db.Text
  deliverableSpec String? @db.Text  // formats, dimensions, count
  status          TaskStatus @default(ASSIGNED)
  dueDate         DateTime?
  completedAt     DateTime?
  deliverables    Deliverable[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([assigneeId, status])
  @@index([projectId, status])
}
```

### 5.6 EarningEntry (the ledger)
Append-style ledger. Corrections are new `ADJUSTMENT` or `DEDUCTION` rows, not edits of paid rows.

```prisma
model EarningEntry {
  id        String @id @default(cuid())
  creatorId String
  creator   User    @relation("EarningCreator", fields: [creatorId], references: [id], onDelete: Restrict)
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Restrict)
  offerId   String?
  offer     ProjectOffer? @relation(fields: [offerId], references: [id], onDelete: SetNull)

  type     EarningType   @default(PROJECT_PAYMENT)
  status   EarningStatus @default(PENDING)
  label    String?       // e.g. Final approval, Milestone 1
  currency String        @default("INR") @db.VarChar(3)
  amount   Decimal       @db.Decimal(10, 2) // negative for deductions

  approvedAt DateTime?
  paidAt     DateTime?
  holdReason String? @db.Text

  payoutId String?
  payout   Payout? @relation(fields: [payoutId], references: [id], onDelete: SetNull)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([creatorId, status])
  @@index([projectId])
  @@index([payoutId])
}
```

### 5.7 Payout and PayoutAccount

```prisma
model Payout {
  id          String @id @default(cuid())
  payoutCode  String @unique // PAY-2026-0001
  creatorId   String
  creator     User @relation("PayoutCreator", fields: [creatorId], references: [id], onDelete: Restrict)
  method      PayoutMethod
  currency    String @default("INR") @db.VarChar(3)
  totalAmount Decimal @db.Decimal(10, 2)
  status      PayoutStatus @default(PROCESSING)
  reference   String?      // bank/UPI transaction ID
  paidById    String?
  paidBy      User? @relation("PayoutAdmin", fields: [paidById], references: [id], onDelete: SetNull)
  paidAt      DateTime?
  entries     EarningEntry[]
  createdAt   DateTime @default(now())

  @@index([creatorId, createdAt])
}

model PayoutAccount {
  id                String @id @default(cuid())
  userId            String @unique
  user              User @relation(fields: [userId], references: [id], onDelete: Cascade)
  method            PayoutMethod
  accountHolderName String
  encryptedDetails  String   @db.Text // encrypt at app level; never store plain
  last4             String?          // for masked display
  taxId             String?
  verified          Boolean @default(false)
  verifiedAt        DateTime?
  updatedAt         DateTime @updatedAt
}
```

---

## 6. Business rules and permissions

| Rule | Detail |
| --- | --- |
| **Visibility** | Creators can only read offers where `creatorId` is their own, only non-DRAFT. |
| **Project access** | Project, task and file endpoints require a `ProjectTeamMember` row for the user. An offer alone does not grant file access except the creator-safe brief. |
| **Hidden fields** | `Project.budget`, client contact details, admin notes and other creators' amounts are never returned in creator APIs. Use dedicated DTOs. |
| **One accepted offer per creator per project** | Enforced by `@@unique([projectId, userId])` on `ProjectTeamMember` plus a check before creating offers. |
| **Locked amount** | After `ACCEPTED`, `acceptedAmount` is immutable. Changes need an amendment offer or an `ADJUSTMENT` ledger row. |
| **Margin guard (admin side)** | Warn admin if the sum of accepted and pending creator amounts exceeds a threshold share of `Project.budget`. |
| **Concurrency** | Accept, counter and decline run inside transactions and check the current status first, so two clicks or two admins cannot both win. |
| **Expiry** | A scheduled job moves overdue `SENT` offers to `EXPIRED` and writes an `EXPIRE` negotiation entry. |
| **Currency** | Offer and earnings currency must be consistent per offer; do not mix currencies in one payout. |
| **Audit** | All offer and payout state changes write history rows; money tables are never hard-deleted. |

---

## 7. Offer state machine

```text
DRAFT ──send──▶ SENT ──creator accepts──▶ ACCEPTED
                 │ ├─creator declines──▶ DECLINED
                 │ └─creator counters──▶ COUNTERED_BY_CREATOR
                 │                          │ admin accepts ──▶ ACCEPTED
                 │                          │ admin counters ─▶ COUNTERED_BY_ADMIN ──▶ (creator responds)
                 │                          └ admin withdraws ─▶ WITHDRAWN
                 ├─ admin withdraws ─────────▶ WITHDRAWN
                 └─ expiresAt passes ────────▶ EXPIRED
```

Every transition appends an `OfferNegotiationEntry` and triggers a notification to the party whose turn it now is.

---

## 8. API outline (Next.js route handlers or server actions)

### Creator
- `GET /api/creator/offers?status=` list own offers
- `GET /api/creator/offers/:id` detail with negotiation history (creator-safe DTO)
- `POST /api/creator/offers/:id/accept`
- `POST /api/creator/offers/:id/counter` body: amount, dueDate?, message
- `POST /api/creator/offers/:id/decline` body: reason
- `GET /api/creator/earnings/summary`, `GET /api/creator/earnings/entries`, `GET /api/creator/payouts`
- `PUT /api/creator/payout-account`
- `GET /api/creator/tasks`, `POST /api/creator/tasks/:id/upload-url`, `POST /api/creator/tasks/:id/submit`

### Admin (needed to complete the loop)
- `POST /api/admin/projects/:id/offers` create and send an offer (pick creator, amount, scope, deadline, expiry)
- `POST /api/admin/offers/:id/accept-counter`, `/counter`, `/withdraw`
- `POST /api/admin/earnings/:id/approve`, `POST /api/admin/payouts` (batch approved entries), `POST /api/admin/payouts/:id/mark-paid`

---

## 9. Notifications

| Event | Recipient |
| --- | --- |
| New offer sent | Creator |
| Counter-offer from creator | Admin |
| Counter-offer from admin | Creator |
| Offer accepted or declined | Admin |
| Offer expiring in 24 hours | Creator |
| Offer expired or withdrawn | Both |
| Task assigned, revision requested, work approved | Creator |
| Earning approved, payout sent, payout failed | Creator |

**Channels:** in-app first, email second.

---

## 10. Admin-side additions

- **Project page:** a Creator offers panel showing each offer, status, amount and negotiation, plus a Send offer button. Show a margin summary (client budget vs. total creator cost).
- **Creators page:** a payments tab per creator (earned, payable, paid).
- **Payouts page:** list of approved entries, batch into payouts, mark as paid with reference.

---

## 11. Edge cases

- **Creator accepts at the same moment admin withdraws:** transaction with status check; loser gets a clear message.
- **Offer accepted after the project was cancelled:** block acceptance if the project status is cancelled or closed.
- **Creator removed from a project after acceptance:** entry becomes `ON_HOLD` or `CANCELLED` with admin decision and reason; partial payment via an `ADJUSTMENT`.
- **Client refund or dispute:** admin places related entries `ON_HOLD`.
- **Creator has no payout details:** entries can reach `APPROVED`, but payout creation is blocked and the creator sees a prompt to add details.
- **Multiple creators offered the same role:** allow parallel offers; when one is accepted, admin can withdraw others in one action.
- **Taxes (TDS/GST):** store tax info on the payout account and add deduction rows later; keep the ledger flexible enough to add them.

---

## 12. Build phases

### Phase 1 (must have)
- Creator layout, sidebar, overview
- Project Requests: list, detail, accept, decline, counter-offer, admin send and respond
- My Projects, My Tasks, task workspace with versioned upload
- Submissions, admin feedback, profile and settings
- Earnings: summary, per-project entries, payout history (read-only for creator), admin approve and mark paid

### Phase 2
- My Teams, milestone payments, payout account verification, notification emails
- Public portfolio publishing with admin approval

### Phase 3
- Earnings analytics, invoices or payment statements (PDF), tax handling, automated payouts through a payment provider

---

## 13. Open decisions for you

1. When does a creator become payable? On final deliverable approval, on client approval, or in milestones?
2. How many negotiation rounds are allowed (spec assumes 3)?
3. Payout method and schedule: bank transfer or UPI, weekly or monthly batches, minimum payout amount?
4. Currency: your `Project.currency` defaults to USD but offers here use INR. Decide whether payouts are always INR or follow the project currency.
5. Can creators see the overall project scope (all tasks of other creators) or only their own part? This spec assumes only their own part.

---

*This spec is ready to turn into the visual design (sidebar, Project Requests page, offer detail with negotiation timeline, Earnings page) and into Prisma migrations.*
