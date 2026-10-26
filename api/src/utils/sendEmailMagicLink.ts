import { Resend } from "resend";
import getUserResetLinkHtml from "../assets/user_link.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailResetLink = async (to: string, name: string, link: string) => {
    try {
        const message = getUserResetLinkHtml(name, link);

        const res = await resend.emails.send({
            from: "AdSpolisher <auth@viewgalaxies.com>",
            to: to,
            subject: "Reset your AdSpolisher password",
            html: message
        })

        if (res.error) {
            console.error("Password reset email provider rejected the message", res.error);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Password reset email delivery failed", error);
        return false;
    }
};
