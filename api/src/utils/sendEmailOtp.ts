import { Resend } from "resend";
import getAdminOtpHtml from "../assets/admin_otp.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailOtp = async (
  to: string,
  name: string,
  otp: string,
  purpose: "sign-in" | "password-reset" = "sign-in",
) => {
  const message = getAdminOtpHtml(name, otp, purpose);

  const response = await resend.emails.send({
    from: "AdsPolisher <info@adspolisher.com>",
    to,
    subject: purpose === "password-reset" ? "Reset your AdSpolisher password" : "Login to your admin dashboard",
    html: message,
  });

  if (response.error) {
    throw new Error("Unable to deliver password recovery code");
  }
};
