import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prismaClient from "./config/db.js";

export const auth = betterAuth({
  database: prismaAdapter(prismaClient, {
    provider: "postgresql",
  }),
  // DDoS / Brute-force protection
  rateLimit: {
    enabled: true,
    window: 60, // 60 seconds window
    max: 20, // Max requests per IP per window
    customRules: {
      "/sign-in/email": { window: 60, max: 5 }, // Max 5 login attempts/min
      "/sign-up/email": { window: 60, max: 3 }, // Max 3 signups/min per IP
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      // Email/password signups are not verified by email in this app. Allow
      // linking only when Google itself confirms ownership of the same email.
      // Better Auth still rejects unverified Google identities by default.
      requireLocalEmailVerified: false,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
    },
  },
  session: {
    additionalFields: {
      adminOtpVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
        returned: true,
      },
    },
  },
  user: {
    additionalFields: {
      appRole: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        // Public signup and update requests must never be able to
        // promote themselves to an elevated application role.
        input: false,
        returned: true,
      },
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.NEXT_APP_URL,
    ...((process.env.WEB_ORIGIN || "").split(",").map((origin) => origin.trim()).filter(Boolean)),
  ].filter((origin): origin is string => Boolean(origin)),
});
