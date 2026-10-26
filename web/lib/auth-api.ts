import { authClient } from "./auth-client";

type EmailCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type SignUpCredentials = EmailCredentials & {
  name: string;
};

export async function signInWithEmail(credentials: EmailCredentials) {
  const { error } = await authClient.signIn.email({
    email: credentials.email,
    password: credentials.password,
    rememberMe: credentials.rememberMe,
  });

  if (error) {
    throw new Error(error.message || "Invalid email or password.");
  }
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

export async function signInWithGoogle() {
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: `${window.location.origin}/dashboard`,
  });

  if (error) {
    throw new Error(error.message || "Google sign-in failed. Please try again.");
  }
}
