import { createHash } from "node:crypto";
import { rateLimit } from "express-rate-limit";

const RATE_LIMIT_MESSAGE = {
  message: "Too many password recovery requests. Please try again later.",
};

const commonOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: true as const,
  legacyHeaders: false,
  message: RATE_LIMIT_MESSAGE,
};

// Limits requests from one client, including requests that rotate through
// different email addresses.
export const forgotPasswordIpLimiter = rateLimit({
  ...commonOptions,
  limit: 5,
});

// Also limits repeated requests for one account across different client IPs.
// Hash the email before using it as a store key so the in-memory store does
// not retain readable addresses.
export const forgotPasswordEmailLimiter = rateLimit({
  ...commonOptions,
  limit: 3,
  keyGenerator: (request) => {
    const email =
      typeof request.body?.email === "string"
        ? request.body.email.trim().toLowerCase()
        : "";

    return createHash("sha256").update(email).digest("hex");
  },
  skip: (request) =>
    typeof request.body?.email !== "string" ||
    request.body.email.trim().length === 0,
});

export const resetPasswordIpLimiter = rateLimit({
  ...commonOptions,
  limit: 10,
});