import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { signIn } from '@/features/auth/api/auth';
import { signInSchema, type SignInInput } from '@/features/auth/schemas/auth';

import type { z } from 'zod';

export function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setServerError(null);
    try {
      await signIn(values.email, values.password);
      reset({ email: '', password: '' });
    } catch (e: any) {
      setServerError(e?.message ?? 'Sign-in failed');
    }
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
        <input type="password" autoComplete="current-password" {...register('password')} />
      </label>
      {errors.password && <small role="alert">{errors.password.message}</small>}

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
