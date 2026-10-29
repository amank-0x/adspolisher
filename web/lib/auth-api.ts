import { authClient } from "./auth-client";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

async function requestPasswordRecovery(path: string, body: Record<string, string>) {
  const response = await fetch(`${API_URL}/api/v1/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) throw new Error(result.message || "Password recovery failed. Please try again.");
  return result;
}

export function requestPasswordReset(email: string) {
  return requestPasswordRecovery("forget-password", { email });
}

export function resetPasswordWithMagicLink(token: string, password: string) {
  return requestPasswordRecovery(`reset-password?token=${encodeURIComponent(token)}`, { password });
}

export function resetPasswordWithOtp(email: string, otp: string, password: string) {
  return requestPasswordRecovery("reset-password/otp", { email, otp, password });
}

type EmailCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type SignUpCredentials = EmailCredentials & {
  name: string;
};

export async function signInWithEmail(credentials: EmailCredentials) {
  const { data, error } = await authClient.signIn.email({
    email: credentials.email,
    password: credentials.password,
    rememberMe: credentials.rememberMe,
  });

  if (error) {
    throw new Error(error.message || "Invalid email or password.");
  }

  return String(data?.user?.appRole ?? "CUSTOMER").toUpperCase();
}

export async function signUpWithEmail(credentials: SignUpCredentials) {
  const { error } = await authClient.signUp.email({
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message || "Account creation failed. Please try again.");
  }
}

export async function signInWithGoogle(callbackURL = `${window.location.origin}/dashboard`) {
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL,
  });

  if (error) {
    throw new Error(error.message || "Google sign-in failed. Please try again.");
  }
}
