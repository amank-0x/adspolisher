import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
// Better Auth automatically routes to /api/auth relative to baseURL.
// Strip any trailing /api or /api/auth to prevent duplicate paths.
const baseURL = API_URL.replace(/\/(?:api\/v1|api(?:\/auth)?)\/?$/, "");

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    inferAdditionalFields({
      user: {
        appRole: {
          type: "string",
          required: false,
          input: false,
          returned: true,
        },
      },
      session: {
        adminOtpVerified: {
          type: "boolean",
          required: false,
          input: false,
          returned: true,
        },
      },
    }),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;
