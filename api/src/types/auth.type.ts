import { z } from "zod";

export const sendResetLinkSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const resetPasswordOtpSchema = z.object({
  email: z.email(),
  otp: z.string().regex(/^\d{6}$/),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const adminLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const adminVerifyOtpSchema = z.object({
  challengeId: z.string().min(32).max(128),
  otp: z.string().regex(/^\d{6}$/),
});

export const adminResendOtpSchema = z.object({
  challengeId: z.string().min(32).max(128),
});
