import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { signUp } from '@/features/auth/api/auth';
import { signUpSchema, type SignUpInput } from '@/features/auth/schemas/auth';

import type { z } from 'zod';

export function SignUpForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirm: '' },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setServerError(null);
    try {
      await signUp(values.email, values.password);
      setDone(true);
      reset({ email: '', password: '', confirm: '' });
    } catch (e: any) {
      setServerError(e?.message ?? 'Sign up failed');
    }
  }

  if (done) {
    return <p>Account created. Please check your inbox to verify your email before signing in.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Email
        <input type="email" autoComplete="email" {...register('email')} />
      </label>
      {errors.email && <small role="alert">{errors.email.message}</small>}

      <label>
        Password
        <input type="password" autoComplete="new-password" {...register('password')} />
      </label>
      {errors.password && <small role="alert">{errors.password.message}</small>}

      <label>
        Confirm password
        <input type="password" autoComplete="new-password" {...register('confirm')} />
      </label>
      {errors.confirm && <small role="alert">{errors.confirm.message}</small>}

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create account'}
      </button>
    </form>
  );
}
