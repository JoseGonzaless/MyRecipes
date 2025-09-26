import { SignInForm } from "../components/SignInForm";

export default function AuthPage() {
  // Replace with Supabase later
  return (
    <section>
      <h1>Sign in</h1>
      <SignInForm onSubmit={(data) => console.log("signIn", data)} />
    </section>
  );
}
