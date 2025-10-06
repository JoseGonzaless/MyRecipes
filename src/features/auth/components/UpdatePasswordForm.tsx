import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { signOut } from '@/features/auth/api/auth';
import { updatePassword } from '@/features/auth/api/updatePassword';
import { updatePasswordSchema, type UpdatePasswordInput } from '@/features/auth/schemas/update';

import type { z } from 'zod';

export function UpdatePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: '', confirm: '' },
  });

  async function onSubmit(values: z.infer<typeof updatePasswordSchema>) {
    setServerError(null);
    try {
      await updatePassword(values.password);
      setDone(true);
      reset({ password: '', confirm: '' });
    } catch (e: any) {
      setServerError(e?.message ?? 'Could not update password');
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/auth?mode=signin');
    } catch (e: any) {
      console.error('Error signing out:', e);
      navigate('/auth?mode=signin');
    }
  }

  if (done) {
    return (
      <>
        <p>Password updated successfully!</p>

        <button onClick={handleSignOut}>Sign in with your new password.</button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        New password
        <input type="password" autoComplete="new-password" {...register('password')} />
      </label>
      {errors.password && <small role="alert">{errors.password.message}</small>}

      <label>
        Confirm new password
        <input type="password" autoComplete="new-password" {...register('confirm')} />
      </label>
      {errors.confirm && <small role="alert">{errors.confirm.message}</small>}

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Update password'}
      </button>

      <button type="button" disabled={isSubmitting} onClick={handleSignOut}>
        Cancel
      </button>
    </form>
  );
}
