import { Resend } from "resend";
import getProjectOfferEmail from "../assets/project_offer_email.js";

type ProjectOfferEmailInput = {
  name: string;
  projectTitle: string;
  offerCode: string;
  amount: string;
  currency: string;
  roleTitle: string;
  dueDate: Date | null;
  offerUrl: string;
};

export async function sendProjectOfferEmail(to: string, input: ProjectOfferEmailInput) {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
  const response = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "AdsPolisher <info@adspolisher.com>",
    to,
    subject: `New project offer: ${input.projectTitle}`,
    html: getProjectOfferEmail(input),
  });
  if (response.error) throw new Error("Project offer email could not be delivered");
}
