function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function formatPrice(price, currency) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(price));
  } catch {
    return `${currency} ${price}`;
  }
}

export default function getProposalEmailHtml({
  clientName,
  title,
  summary,
  deliverables = [],
  price,
  currency,
  timeline,
  revisionLimit,
  paymentTerms,
  expiresAt,
  proposalUrl,
}) {
  const safeDeliverables = deliverables
    .map((item) => `<li style="margin:0 0 8px 0;">${escapeHtml(item)}</li>`)
    .join("");
  const expiryText = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "No expiry date specified";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Your AdsPolisher proposal</title>
    <style>
      body { margin:0; background:#f6f4ef; color:#181817; font-family:Arial,Helvetica,sans-serif; }
      .shell { width:100%; padding:32px 12px; }
      .card { width:100%; max-width:600px; margin:0 auto; background:#fff; border:1px solid #e8e4dc; border-radius:20px; overflow:hidden; }
      .pad { padding:32px 36px; }
      .muted { color:#68665f; }
      .label { color:#77736a; font-size:11px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; }
      .button { display:inline-block; padding:14px 20px; border-radius:10px; background:#171716; color:#fff !important; font-weight:700; text-decoration:none; }
      .metric { background:#faf9f6; border:1px solid #ebe8e1; border-radius:12px; padding:16px; }
      @media only screen and (max-width:620px) { .pad { padding:26px 20px !important; } .h1 { font-size:25px !important; } }
    </style>
  </head>
  <body>
    <div class="shell">
      <div class="card">
        <div class="pad" style="padding-bottom:22px; border-bottom:1px solid #ebe8e1;">
          <div style="font-size:22px; font-weight:800; letter-spacing:-.5px;">AdsPolisher</div>
          <div class="label" style="margin-top:18px;">Creative proposal</div>
        </div>
        <div class="pad">
          <h1 class="h1" style="margin:0 0 16px; font-size:29px; line-height:1.2; letter-spacing:-.7px;">Your proposal is ready</h1>
          <p style="margin:0 0 20px; font-size:16px; line-height:1.65;">Hi ${escapeHtml(clientName)},</p>
          <p class="muted" style="margin:0 0 26px; font-size:15px; line-height:1.7;">Thanks for sharing your brief. We’ve prepared a tailored proposal for your team to review.</p>

          <div style="border-left:3px solid #4f46e5; padding-left:16px; margin-bottom:26px;">
            <div class="label">Project</div>
            <div style="margin-top:6px; font-size:20px; font-weight:700;">${escapeHtml(title)}</div>
          </div>

          <p style="margin:0 0 22px; font-size:15px; line-height:1.7;">${escapeHtml(summary)}</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
            <tr>
              <td width="50%" style="padding:0 8px 0 0; vertical-align:top;"><div class="metric"><div class="label">Project fee</div><div style="margin-top:6px; font-size:21px; font-weight:800;">${escapeHtml(formatPrice(price, currency))}</div></div></td>
              <td width="50%" style="padding:0 0 0 8px; vertical-align:top;"><div class="metric"><div class="label">Valid until</div><div style="margin-top:6px; font-size:16px; font-weight:700;">${escapeHtml(expiryText)}</div></div></td>
            </tr>
          </table>

          ${timeline ? `<p style="margin:0 0 10px; font-size:14px;"><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>` : ""}
          ${revisionLimit !== null && revisionLimit !== undefined ? `<p style="margin:0 0 10px; font-size:14px;"><strong>Included revisions:</strong> ${escapeHtml(revisionLimit)}</p>` : ""}
          ${paymentTerms ? `<p style="margin:0 0 22px; font-size:14px; line-height:1.6;"><strong>Payment terms:</strong> ${escapeHtml(paymentTerms)}</p>` : ""}

          ${safeDeliverables ? `<div style="margin:26px 0;"><div class="label" style="margin-bottom:12px;">Included deliverables</div><ul style="margin:0; padding-left:20px; font-size:14px; line-height:1.55;">${safeDeliverables}</ul></div>` : ""}

          <div style="margin:30px 0 12px;"><a class="button" href="${escapeHtml(proposalUrl)}">Review proposal</a></div>
          <p class="muted" style="margin:0; font-size:12px; line-height:1.6;">You can review the proposal securely in your AdsPolisher workspace. If you have questions, reply to this email and our team will help.</p>
        </div>
        <div class="pad" style="padding-top:20px; padding-bottom:24px; border-top:1px solid #ebe8e1; color:#88847b; font-size:12px; line-height:1.6;">
          AdsPolisher · Creative work that moves brands forward.<br />This is an automated proposal notification.
        </div>
      </div>
    </div>
  </body>
</html>`;
}
