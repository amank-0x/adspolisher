import { Resend } from "resend";
import getCreatorApplicationEmailHtml from "../assets/creator_application.js";

type CreatorApplicationEmailInput = {
  applicantName: string;
  status: "APPROVED" | "REJECTED";
  creatorLoginUrl: string;
};

export async function sendCreatorApplicationEmail(to: string, input: CreatorApplicationEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const isApproved = input.status === "APPROVED";
  const response = await resend.emails.send({
    from: "AdsPolisher <info@adspolisher.com>",
    to,
    subject: isApproved
      ? "Welcome to AdsPolisher Creator Studio"
      : "An update on your AdsPolisher creator application",
    html: getCreatorApplicationEmailHtml(input),
  });

  if (response.error) {
    console.error("Creator application email provider rejected the message", response.error);
    throw new Error("Creator application email could not be delivered");
  }
}
