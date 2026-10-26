import { Suspense } from "react";
import { LoginPage } from "@/components/auth/Auth";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-screen bg-slate-900" />}>
      <LoginPage />
    </Suspense>
  );
}
