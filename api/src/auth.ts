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
  databaseHooks: {
    session: {
      create: {
        before: async (session, context) => {
          const user = await prismaClient.user.findUnique({
            where: { id: session.userId },
            select: { role: true },
          });

          // Admin sessions must explicitly carry proof that the OTP step
          // succeeded. This blocks password, OAuth, and other session paths
          // from bypassing the second factor.
          if (user?.role === "ADMIN" && session.adminOtpVerified !== true) {
            return false;
          }
        },
      },
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
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        // Public signup and update requests must never be able to
        // promote themselves to AUTHOR or ADMIN.
        input: false,
        returned: true,
      },
      avatarId: {
        type: "string",
        required: false,
      },
    },
  },
  trustedOrigins: ["http://localhost:3000", "http://localhost:5173"],
});