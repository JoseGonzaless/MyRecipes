import { useState } from 'react';
import type { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { resetPasswordForEmail } from '@/features/auth/api/auth';
import { resetSchema, type ResetInput } from '@/features/auth/schemas/auth';

export function ResetPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    setServerError(null);
    try {
      await resetPasswordForEmail(values.email);
      setSent(true);
      reset({ email: '' });
    } catch (e: any) {
      setServerError(e?.message ?? 'Could not send reset email');
    }
  }

  if (sent) {
    return <p>If an account exists for that email, we have sent a password reset link</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Email
        <input type="email" autoComplete="email" {...register('email')} />
      </label>
      {errors.email && <small role="alert">{errors.email.message}</small>}

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
}
