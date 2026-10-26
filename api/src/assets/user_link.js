

export default function getUserResetLinkHtml(userName, link) {
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
    const safeName = escapeHtml(userName);
    const safeLink = escapeHtml(link);
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
                <title>Reset your AdSpolisher password</title>
                <style>
                    body { margin: 0; padding: 0; width: 100% !important; background-color: #FFFFFF; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    a { text-decoration: none; }
                    @media only screen and (max-width: 600px) {
                        .container { width: 100% !important; }
                        .px { padding-left: 20px !important; padding-right: 20px !important; }
                        .h1 { font-size: 22px !important; }
                    }
                </style>
            </head>
            <body style="margin:0; padding:0; background-color:#FFFFFF; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#202124;">

                <!-- Preheader (hidden inbox preview text) -->
                <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
                    Use this link to set a new password. It expires in 10 minutes.
                    &#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;
                </div>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFFFFF;">
                    <tr>
                        <td align="center" style="padding:32px 0;">

                            <table role="presentation" class="container" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px; max-width:560px;">

                                <!-- Logo -->
                                <tr>
                                    <td class="px" align="left" style="padding:0 24px 20px 24px;">
                                            <span style="font-size:24px; line-height:1; letter-spacing:-0.6px;"><span style="color:#000000; font-weight:800;">AdSpolisher</span></span>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td class="px" style="padding:0 24px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr><td height="1" style="height:1px; line-height:1px; font-size:0; background-color:#E8EAED;">&nbsp;</td></tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td class="px" style="padding:32px 24px 8px 24px;">

                                        <h1 class="h1" style="margin:0 0 24px 0; font-size:24px; line-height:1.3; font-weight:600; color:#202124;">
                                            Reset your password
                                        </h1>

                                        <p style="margin:0 0 16px 0; font-size:15px; line-height:1.6; color:#202124;">
                                            Hi ${safeName},
                                        </p>

                                        <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#3C4043;">
                                            We received a request to reset the password for your AdSpolisher account.
                                            Please click the link below to create a new password.
                                        </p>

                                        <!-- Reset link -->
                                        <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; font-weight:600;">
                                            <a href="${safeLink}" target="_blank" style="color:#0B63E5; text-decoration:underline;">Click here to reset your password</a>
                                        </p>

                                        <!-- Raw link -->
                                        <p style="margin:0 0 4px 0; font-size:13px; line-height:1.6; color:#5F6368;">
                                            Or copy and paste this link into your browser:
                                        </p>
                                        <p style="margin:0 0 24px 0; font-size:13px; line-height:1.6; word-break:break-all; overflow-wrap:anywhere;">
                                            <a href="${safeLink}" target="_blank" style="color:#0B63E5; text-decoration:underline;">${safeLink}</a>
                                        </p>

                                        <!-- Expiry -->
                                        <p style="margin:0 0 32px 0; font-size:14px; line-height:1.6; color:#3C4043;">
                                            <strong style="color:#202124;">This link expires in 10 minutes</strong> and can only be used once.
                                        </p>

                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td class="px" style="padding:0 24px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr><td height="1" style="height:1px; line-height:1px; font-size:0; background-color:#E8EAED;">&nbsp;</td></tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Security note -->
                                <tr>
                                    <td class="px" style="padding:24px 24px 0 24px; font-size:13px; line-height:1.6; color:#5F6368;">
                                        <strong style="color:#202124;">Didn't request this?</strong>
                                        You can safely ignore this email &mdash; your password will not change.
                                        Never share this link with anyone.
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td class="px" align="left" style="padding:32px 24px 0 24px; font-size:12px; line-height:1.7; color:#80868B;">
                                        <span style="color:#000000; font-weight:700;">AdSpolisher</span><br>
                                        &copy; ${new Date().getFullYear()} AdSpolisher. All rights reserved.<br>
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
