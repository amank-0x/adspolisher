# Admin proposal API

All proposal endpoints are served by the Express API under `/api/v1` and require an authenticated Better Auth session whose `appRole` is `ADMIN`.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/admin/proposals?requestId={id}` | List proposal drafts and sent proposals |
| `POST` | `/admin/proposals` | Create a proposal draft |
| `PATCH` | `/admin/proposals/{id}` | Edit a draft or revise a sent proposal |
| `POST` | `/admin/proposals/{id}/send` | Send the proposal email through Resend and mark it `SENT` |

`POST /admin/proposals` accepts `quoteRequestId`, `title`, `summary`, `deliverables`, `price`, `currency`, `timeline`, `revisionLimit`, `paymentTerms`, and `expiresAt`.

Proposal drafts are persisted in the `Proposal` table. Sending records `sentAt`, writes an `AuditLog` entry, and moves a new quote request to `IN_REVIEW`. The email includes the scope, fee, timeline, revisions, payment terms, expiry, and a secure workspace link.
