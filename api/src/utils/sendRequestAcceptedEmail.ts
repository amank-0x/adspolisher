import { Resend } from "resend";

export async function sendRequestAcceptedEmail(to: string, name: string, appUrl: string) {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
  const safeName = name.replace(/[&<>"']/g, "");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: "AdsPolisher <info@adspolisher.com>", to,
    subject: "Your AdsPolisher project is accepted",
    html: `<!doctype html><html><body style="margin:0;background:#f6f4ef;font-family:Arial,sans-serif;color:#181817"><main style="max-width:600px;margin:32px auto;background:#fff;border:1px solid #e8e4dc;border-radius:20px;padding:36px"><strong style="font-size:22px">AdsPolisher</strong><p style="margin-top:28px;color:#77736a;font-size:11px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase">Project update</p><h1>Your project is accepted</h1><p style="line-height:1.7">Hi ${safeName}, we’re pleased to confirm that we’ve accepted your project request. Our team will follow up with next steps and keep your project progress in your workspace.</p><p style="margin:28px 0"><a href="${appUrl.replace(/\/$/, "")}/dashboard/projects" style="background:#171716;color:#fff;padding:14px 20px;border-radius:10px;text-decoration:none;font-weight:bold">Open your workspace</a></p><p style="color:#68665f;font-size:12px">AdsPolisher · Creative work that moves brands forward.</p></main></body></html>`,
  });
  if (response.error) throw new Error("Project acceptance email could not be delivered");
}
