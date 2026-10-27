

export default function getAdminOtpHtml(userName, otp, purpose = "sign-in") {
    const isPasswordReset = purpose === "password-reset";
    const safeName = String(userName).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
    const requestedAt = new Date().toUTCString().replace('GMT', 'UTC');

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
            <title>${isPasswordReset ? "AdsPolisher password reset code" : "AdsPolisher sign-in verification code"}</title>
            <style>
                body { margin: 0; padding: 0; width: 100% !important; background-color: #FFFFFF; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                a { text-decoration: none; }
                @media only screen and (max-width: 680px) {
                    .container { width: 100% !important; }
                    .px { padding-left: 20px !important; padding-right: 20px !important; }
                    .h1 { font-size: 24px !important; }
                    .otp { font-size: 32px !important; letter-spacing: 8px !important; padding-left: 8px !important; }
                    .label-col { display: block !important; width: 100% !important; padding-bottom: 2px !important; }
                    .value-col { display: block !important; width: 100% !important; padding-top: 0 !important; }
                }
            </style>
        </head>
        <body style="margin:0; padding:0; background-color:#FFFFFF; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#202124;">

            <!-- Preheader (hidden inbox preview text) -->
            <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
                ${isPasswordReset ? "Your password reset code. It expires in 5 minutes." : "Your administrator verification code. It expires in 5 minutes."} Do not share it with anyone.
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
                                        <span style="font-size:28px; line-height:1; letter-spacing:-0.7px;"><span style="color:#000000; font-weight:800;">AdsPolisher</span></span>
                                            </td>
                                            <td align="right" style="font-size:11px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#5F6368;">
                                                Admin Security
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

                                    <h1 class="h1" style="margin:0 0 28px 0; font-size:28px; line-height:1.3; font-weight:600; color:#202124;">
                                        ${isPasswordReset ? "Reset your password" : "Administrator sign-in verification"}
                                    </h1>

                                    <p style="margin:0 0 16px 0; font-size:16px; line-height:1.7; color:#202124;">
                                        Hi ${safeName},
                                    </p>

                                    <p style="margin:0 0 16px 0; font-size:16px; line-height:1.7; color:#3C4043;">
                                        ${isPasswordReset ? "We received a request to reset the password for your AdsPolisher account." : "A sign-in attempt was made to the AdsPolisher administrator console using your account. Because staff accounts have elevated access, we require an additional verification step before granting access."}
                                    </p>

                                    <p style="margin:0 0 28px 0; font-size:16px; line-height:1.7; color:#3C4043;">
                                        ${isPasswordReset ? "Enter this code on the password reset screen to choose a new password." : "To complete this sign-in, enter the verification code below on the login screen."}
                                    </p>

                                    <!-- OTP -->
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0; background-color:#F8F9FA; border:1px solid #E8EAED; border-radius:8px;">
                                        <tr>
                                            <td align="center" style="padding:32px 16px;">
                                                <p style="margin:0 0 12px 0; font-size:11px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#5F6368;">
                                                    ${isPasswordReset ? "Password reset code" : "Verification code"}
                                                </p>
                                                <p class="otp" style="margin:0; font-family:'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, 'Courier New', monospace; font-size:44px; line-height:1.2; font-weight:700; letter-spacing:14px; color:#000000; padding-left:14px;">${otp}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Expiry -->
                                    <p style="margin:0 0 32px 0; font-size:15px; line-height:1.6; color:#3C4043; text-align:center;">
                                        <strong style="color:#202124;">This code expires in 5 minutes</strong> and can only be used once.
                                    </p>

                                    <!-- Request details -->
                                    <p style="margin:0 0 12px 0; font-size:12px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#5F6368;">
                                        Request details
                                    </p>
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0; border-top:1px solid #E8EAED;">
                                        <tr>
                                            <td class="label-col" width="35%" valign="top" style="padding:12px 0; border-bottom:1px solid #E8EAED; font-size:14px; line-height:1.5; color:#5F6368;">Account</td>
                                            <td class="value-col" valign="top" style="padding:12px 0; border-bottom:1px solid #E8EAED; font-size:14px; line-height:1.5; color:#202124; font-weight:600;">${safeName}</td>
                                        </tr>
                                        <tr>
                                            <td class="label-col" width="35%" valign="top" style="padding:12px 0; border-bottom:1px solid #E8EAED; font-size:14px; line-height:1.5; color:#5F6368;">Action</td>
                                                <td class="value-col" valign="top" style="padding:12px 0; border-bottom:1px solid #E8EAED; font-size:14px; line-height:1.5; color:#202124; font-weight:600;">${isPasswordReset ? "Password reset" : "Administrator console sign-in"}</td>
                                        </tr>
                                        <tr>
                                            <td class="label-col" width="35%" valign="top" style="padding:12px 0; border-bottom:1px solid #E8EAED; font-size:14px; line-height:1.5; color:#5F6368;">Requested at</td>
                                            <td class="value-col" valign="top" style="padding:12px 0; border-bottom:1px solid #E8EAED; font-size:14px; line-height:1.5; color:#202124; font-weight:600;">${requestedAt}</td>
                                        </tr>
                                        <tr>
                                            <td class="label-col" width="35%" valign="top" style="padding:12px 0; border-bottom:1px solid #E8EAED; font-size:14px; line-height:1.5; color:#5F6368;">Validity</td>
                                            <td class="value-col" valign="top" style="padding:12px 0; border-bottom:1px solid #E8EAED; font-size:14px; line-height:1.5; color:#202124; font-weight:600;">5 minutes, single use</td>
                                        </tr>
                                    </table>

                                    <!-- Do not share warning -->
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0; border-left:3px solid #D93025; background-color:#FDF3F2;">
                                        <tr>
                                            <td style="padding:16px 18px; font-size:14px; line-height:1.7; color:#5F2120;">
                                                <strong style="color:#B3261E;">Do not share this code.</strong>
                                                AdsPolisher staff will never ask you for this code. ${isPasswordReset ? "This code can only be used once to reset your password." : "Never share it with anyone."}
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Security practices -->
                                    <p style="margin:0 0 12px 0; font-size:12px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#5F6368;">
                                        ${isPasswordReset ? "Keep your account secure" : "Keep your admin account secure"}
                                    </p>
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0;">
                                        <tr>
                                            <td valign="top" width="20" style="padding:0 0 10px 0; font-size:14px; line-height:1.7; color:#202124;">&bull;</td>
                                            <td valign="top" style="padding:0 0 10px 0; font-size:14px; line-height:1.7; color:#3C4043;">Only enter this code on the official AdsPolisher ${isPasswordReset ? "password reset" : "login"} page. Check the web address before you type it.</td>
                                        </tr>
                                        <tr>
                                            <td valign="top" width="20" style="padding:0 0 10px 0; font-size:14px; line-height:1.7; color:#202124;">&bull;</td>
                                            <td valign="top" style="padding:0 0 10px 0; font-size:14px; line-height:1.7; color:#3C4043;">Use a strong, unique password for your admin account and never reuse it on other services.</td>
                                        </tr>
                                        <tr>
                                            <td valign="top" width="20" style="padding:0 0 10px 0; font-size:14px; line-height:1.7; color:#202124;">&bull;</td>
                                            <td valign="top" style="padding:0 0 10px 0; font-size:14px; line-height:1.7; color:#3C4043;">Always sign out when you finish, especially on shared or public devices.</td>
                                        </tr>
                                        <tr>
                                            <td valign="top" width="20" style="padding:0; font-size:14px; line-height:1.7; color:#202124;">&bull;</td>
                                            <td valign="top" style="padding:0; font-size:14px; line-height:1.7; color:#3C4043;">If you request a new code, previous codes should be treated as invalid. Use only the most recent email.</td>
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

                            <!-- Wasn't you -->
                            <tr>
                                <td class="px" style="padding:28px 40px 0 40px; font-size:14px; line-height:1.7; color:#5F6368;">
                                    <strong style="color:#202124;">Wasn't you?</strong>
                                    If you did not try to sign in, do not enter this code. Someone may know your password.
                                    ${isPasswordReset ? "If you did not request a password reset, you can ignore this email. Your password will remain unchanged." : "If you did not attempt to sign in, change your password immediately and notify your system administrator."}
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td class="px" align="left" style="padding:36px 40px 0 40px; font-size:12px; line-height:1.7; color:#80868B;">
                                    <span style="color:#8A8A8A; font-weight:500;">View</span><span style="color:#000000; font-weight:700;">Galaxies</span><br>
                                    ${isPasswordReset ? "You are receiving this email because a password reset was requested for your account." : "You are receiving this email because a sign-in to the administrator console was requested for your account."}<br>
                                    &copy; ${new Date().getFullYear()} AdsPolisher. All rights reserved.<br>
                                    This is an automated security message, please do not reply.
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
