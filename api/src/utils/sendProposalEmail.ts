import { Resend } from "resend";
import getProposalEmailHtml from "../assets/proposal_email.js";

type ProposalEmailInput = {
  clientName: string;
  title: string;
  summary: string;
  deliverables?: string[];
  price: string;
  currency: string;
  timeline?: string | null;
  revisionLimit?: number | null;
  paymentTerms?: string | null;
  expiresAt?: Date | null;
  proposalUrl: string;
};

export async function sendProposalEmail(to: string, input: ProposalEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: "AdsPolisher <info@adspolisher.com>",
    to,
    subject: `Your AdsPolisher proposal: ${input.title}`,
    html: getProposalEmailHtml(input),
  });

  if (response.error) {
    console.error("Proposal email provider rejected the message", response.error);
    throw new Error("Proposal email could not be delivered");
  }
}
