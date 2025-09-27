import { useState } from "react";
import { useLocation, useNavigate, type Location as RRLocation } from "react-router-dom";

import { signIn } from "@/features/auth/api/auth";
import type { SignInInput } from "@/features/auth/schemas/auth";
import { SignInForm } from "@/features/auth/components/SignInForm";

type FromState = { from?: RRLocation };

export function AuthPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as FromState | undefined)?.from?.pathname ?? "/recipes";

  async function handleSubmit(values: SignInInput) {
    setError(null);
    try {
      await signIn(values.email, values.password);
      navigate(from, { replace: true });
    } catch (e) {
      setError("Unable to sign in. Please check your email/password and try again.");
    }
  }

  return (
    <section>
      <h1>Sign in</h1>
      <SignInForm onSubmit={handleSubmit} />
      {error && <small role="alert">{error}</small>}
    </section>
  );
}
