function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


function formatFee(amount, currency) {
    const n = typeof amount === "number" ? amount : Number(amount);
    const value = Number.isFinite(n)
        ? n.toLocaleString("en-IN", { maximumFractionDigits: 2 })
        : String(amount);
    return `${currency} ${value}`;
}

function formatDeadline(deadline) {
    if (!deadline) return "To be agreed";
    if (deadline instanceof Date) {
        return deadline.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }
    return deadline;
}

/**
 * Sent to a creator when an admin offers them a project at a proposed fee.
 * The creator can accept, decline or counter-offer from their dashboard.
 */
export default function getCreatorOfferHtml(params) {
    const name = escapeHtml(params.creatorName);
    const offerId = escapeHtml(params.offerId);
    const project = escapeHtml(params.projectTitle);
    const category = params.projectCategory ? escapeHtml(params.projectCategory) : "";
    const role = escapeHtml(params.role);
    const scope = escapeHtml(params.scopeSummary || "Review the full scope in your creator dashboard.");
    const fee = escapeHtml(formatFee(params.feeAmount, params.currency));
    const deadline = escapeHtml(formatDeadline(params.deadline));
    const url = escapeHtml(params.reviewUrl);

    const projectLabel = category ? `${project} &mdash; ${category}` : project;

    const row = (label, value, last = false) => `
        <tr>
            <td class="label-col" width="35%" valign="top" style="padding:12px 0; ${last ? "" : "border-bottom:1px solid #E8EAED;"} font-size:14px; line-height:1.5; color:#5F6368;">${label}</td>
            <td class="value-col" valign="top" style="padding:12px 0; ${last ? "" : "border-bottom:1px solid #E8EAED;"} font-size:14px; line-height:1.5; color:#202124; font-weight:600;">${value}</td>
        </tr>`;

    return (
        `<!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="x-apple-disable-message-reformatting">
            <meta name="color-scheme" content="light only">
            <meta name="supported-color-schemes" content="light only">
            <title>New project offer from AdsPolisher</title>
            <style>
                body { margin: 0; padding: 0; width: 100% !important; background-color: #FFFFFF; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                a { text-decoration: none; }
                @media only screen and (max-width: 680px) {
                    .container { width: 100% !important; }
                    .px { padding-left: 20px !important; padding-right: 20px !important; }
                    .h1 { font-size: 24px !important; }
                    .label-col { display: block !important; width: 100% !important; padding-bottom: 2px !important; border-bottom: 0 !important; }
                    .value-col { display: block !important; width: 100% !important; padding-top: 0 !important; }
                }
            </style>
        </head>
        <body style="margin:0; padding:0; background-color:#FFFFFF; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#202124;">

            <!-- Preheader (hidden inbox preview text) -->
            <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
                ${role} on &ldquo;${project}&rdquo; &middot; ${fee}. Review the offer and accept, decline or counter.
                &#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;
            </div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFFFFF;">
                <tr>
                    <td align="center" style="padding:40px 0;">

                        <table role="presentation" class="container" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px; max-width:640px;">

                            <!-- Logo + label -->
                            <tr>
                                <td class="px" align="left" style="padding:0 40px 24px 40px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td align="left">
                                                <span style="font-size:28px; line-height:1; letter-spacing:-0.7px;"><span style="color:#8A8A8A; font-weight:500;">Ads</span><span style="color:#000000; font-weight:800;">Polisher</span></span>
                                            </td>
                                            <td align="right" style="font-size:11px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#5F6368;">
                                                Creator Offer
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Divider -->
                            <tr>
                                <td class="px" style="padding:0 40px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr><td height="1" style="height:1px; line-height:1px; font-size:0; background-color:#E8EAED;">&nbsp;</td></tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Main content -->
                            <tr>
                                <td class="px" style="padding:40px 40px 8px 40px;">

                                    <p style="margin:0 0 12px 0; font-size:12px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#0B63E5;">
                                        Creator project offer
                                    </p>

                                    <h1 class="h1" style="margin:0 0 28px 0; font-size:28px; line-height:1.3; font-weight:600; color:#202124;">
                                        A new project opportunity
                                    </h1>

                                    <p style="margin:0 0 16px 0; font-size:16px; line-height:1.7; color:#202124;">
                                        Hi ${name},
                                    </p>

                                    <p style="margin:0 0 28px 0; font-size:16px; line-height:1.7; color:#3C4043;">
                                        The AdsPolisher team would like to work with you on a project.
                                        Please review the scope and the proposed creator fee below, then accept, decline or send a counter-offer from your creator workspace.
                                    </p>

                                    <!-- Offer details -->
                                    <p style="margin:0 0 12px 0; font-size:12px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#5F6368;">
                                        Offer details
                                    </p>
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0; border-top:1px solid #E8EAED;">
                                        ${row("Offer ID", offerId)}
                                        ${row("Project", projectLabel)}
                                        ${row("Your role", role)}
                                        ${row("Project scope", scope)}
                                        ${row("Target deadline", deadline, true)}
                                    </table>

                                    <!-- Fee highlight -->
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0; background-color:#F8F9FA; border:1px solid #E8EAED; border-radius:8px;">
                                        <tr>
                                            <td align="center" style="padding:24px 16px;">
                                                <p style="margin:0 0 8px 0; font-size:11px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#5F6368;">
                                                    Proposed creator fee
                                                </p>
                                                <p style="margin:0; font-size:32px; line-height:1.2; font-weight:700; letter-spacing:-0.5px; color:#000000;">${fee}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Review link -->
                                    <p style="margin:0 0 24px 0; font-size:16px; line-height:1.6; font-weight:600;">
                                        <a href="${url}" target="_blank" style="color:#0B63E5; text-decoration:underline;">Review the offer and respond in your creator dashboard</a>
                                    </p>

                                    <!-- Raw link -->
                                    <p style="margin:0 0 4px 0; font-size:13px; line-height:1.6; color:#5F6368;">
                                        Or copy and paste this link into your browser:
                                    </p>
                                    <p style="margin:0 0 32px 0; font-size:13px; line-height:1.6; word-break:break-all; overflow-wrap:anywhere;">
                                        <a href="${url}" target="_blank" style="color:#0B63E5; text-decoration:underline;">${url}</a>
                                    </p>

                                    <!-- Your options -->
                                    <p style="margin:0 0 12px 0; font-size:12px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#5F6368;">
                                        Your options
                                    </p>
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0;">
                                        <tr>
                                            <td valign="top" width="20" style="padding:0 0 10px 0; font-size:14px; line-height:1.7; color:#202124;">&bull;</td>
                                            <td valign="top" style="padding:0 0 10px 0; font-size:14px; line-height:1.7; color:#3C4043;"><strong style="color:#202124;">Accept</strong> the offer as proposed and we'll confirm the project with you.</td>
                                        </tr>
                                        <tr>
                                            <td valign="top" width="20" style="padding:0 0 10px 0; font-size:14px; line-height:1.7; color:#202124;">&bull;</td>
                                            <td valign="top" style="padding:0 0 10px 0; font-size:14px; line-height:1.7; color:#3C4043;"><strong style="color:#202124;">Send a counter-offer</strong> if you'd like to suggest a different fee or timeline.</td>
                                        </tr>
                                        <tr>
                                            <td valign="top" width="20" style="padding:0; font-size:14px; line-height:1.7; color:#202124;">&bull;</td>
                                            <td valign="top" style="padding:0; font-size:14px; line-height:1.7; color:#3C4043;"><strong style="color:#202124;">Decline</strong> if this project isn't the right fit. There's no obligation.</td>
                                        </tr>
                                    </table>

                                    <!-- Note -->
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0; border-left:3px solid #0B63E5; background-color:#F5F9FF;">
                                        <tr>
                                            <td style="padding:16px 18px; font-size:14px; line-height:1.7; color:#3C4043;">
                                                <strong style="color:#202124;">Please note:</strong>
                                                this is an offer, not a confirmed booking. The project is only confirmed once you accept it from your dashboard.
                                                You may need to sign in to view it.
                                            </td>
                                        </tr>
                                    </table>

                                </td>
                            </tr>

                            <!-- Divider -->
                            <tr>
                                <td class="px" style="padding:0 40px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr><td height="1" style="height:1px; line-height:1px; font-size:0; background-color:#E8EAED;">&nbsp;</td></tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Not expecting -->
                            <tr>
                                <td class="px" style="padding:28px 40px 0 40px; font-size:14px; line-height:1.7; color:#5F6368;">
                                    <strong style="color:#202124;">Not expecting this?</strong>
                                    If you weren't expecting an offer from AdsPolisher, you can ignore this email or contact our team to let us know.
                                    Reference your Offer ID (${offerId}) if you get in touch.
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td class="px" align="left" style="padding:36px 40px 0 40px; font-size:12px; line-height:1.7; color:#80868B;">
                                    <span style="color:#8A8A8A; font-weight:500;">Ads</span><span style="color:#000000; font-weight:700;">Polisher</span><br>
                                    You are receiving this email because the AdsPolisher team sent you a project offer.<br>
                                    &copy; ${new Date().getFullYear()} AdsPolisher. All rights reserved.<br>
                                    This is an automated message, please do not reply.
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>
        </body>
        </html>`
    )
}
