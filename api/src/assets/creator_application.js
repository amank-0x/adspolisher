function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export default function getCreatorApplicationEmailHtml({
  applicantName,
  status,
  creatorLoginUrl,
}) {
  const isApproved = status === "APPROVED";
  const safeName = escapeHtml(applicantName);
  const safeLoginUrl = escapeHtml(creatorLoginUrl);
  const title = isApproved ? "Welcome to AdsPolisher Creator Studio" : "An update on your creator application";
  const eyebrow = isApproved ? "Creator application approved" : "Creator application update";
  const intro = isApproved
    ? "We’re excited to let you know that your application has been approved. You can now access the AdsPolisher Creator Studio and start working with our team."
    : "Thank you for taking the time to apply to become an AdsPolisher creator. After reviewing your application, we’re unable to approve it at this time.";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light only" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { margin:0; background:#f6f4ef; color:#181817; font-family:Arial,Helvetica,sans-serif; }
      .shell { width:100%; padding:32px 12px; }
      .card { width:100%; max-width:600px; margin:0 auto; background:#fff; border:1px solid #e8e4dc; border-radius:20px; overflow:hidden; }
      .pad { padding:32px 36px; }
      .muted { color:#68665f; }
      .label { color:#77736a; font-size:11px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; }
      .button { display:inline-block; padding:14px 20px; border-radius:10px; background:#171716; color:#fff !important; font-weight:700; text-decoration:none; }
      .callout { border-radius:12px; padding:16px; }
      @media only screen and (max-width:620px) { .pad { padding:26px 20px !important; } .h1 { font-size:25px !important; } }
    </style>
  </head>
  <body>
    <div class="shell">
      <div class="card">
        <div class="pad" style="padding-bottom:22px; border-bottom:1px solid #ebe8e1;">
          <div style="font-size:22px; font-weight:800; letter-spacing:-.5px;">AdsPolisher</div>
          <div class="label" style="margin-top:18px;">${escapeHtml(eyebrow)}</div>
        </div>
        <div class="pad">
          <h1 class="h1" style="margin:0 0 16px; font-size:29px; line-height:1.2; letter-spacing:-.7px;">${escapeHtml(title)}</h1>
          <p style="margin:0 0 20px; font-size:16px; line-height:1.65;">Hi ${safeName},</p>
          <p class="muted" style="margin:0 0 26px; font-size:15px; line-height:1.7;">${escapeHtml(intro)}</p>

          ${isApproved ? `
          <div class="callout" style="margin-bottom:26px; border:1px solid #bbf7d0; background:#f0fdf4;">
            <div style="font-size:16px; font-weight:700; color:#166534;">Your creator access is ready.</div>
            <div style="margin-top:7px; font-size:14px; line-height:1.6; color:#3f6212;">Sign in to review your workspace, assigned tasks, and feedback from the AdsPolisher team.</div>
          </div>
          <div style="margin:30px 0 12px;"><a class="button" href="${safeLoginUrl}">Open Creator Studio</a></div>
          <p class="muted" style="margin:0; font-size:12px; line-height:1.6;">Use the email address you applied with. If you have not set a password yet, use the password recovery option on the sign-in page.</p>
          ` : `
          <div class="callout" style="margin-bottom:26px; border:1px solid #e8e4dc; background:#faf9f6;">
            <div style="font-size:16px; font-weight:700; color:#292724;">Thank you for your interest.</div>
            <div style="margin-top:7px; font-size:14px; line-height:1.6; color:#68665f;">This decision does not prevent you from applying again in the future as your portfolio and experience grow.</div>
          </div>
          <p style="margin:0; font-size:15px; line-height:1.7;">We appreciate the work you shared with us and wish you the very best with your creative practice.</p>
          `}
        </div>
        <div class="pad" style="padding-top:20px; padding-bottom:24px; border-top:1px solid #ebe8e1; color:#88847b; font-size:12px; line-height:1.6;">
          AdsPolisher · Creative work that moves brands forward.<br />This is an automated creator application notification.
        </div>
      </div>
    </div>
  </body>
</html>`;
}
