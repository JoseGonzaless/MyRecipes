import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInInput } from '../schemas/auth';

export function SignInForm({ onSubmit }: { onSubmit: (data: SignInInput) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Email
        <input type="email" {...register('email')} />
        {errors.email && <small>{errors.email.message}</small>}
      </label>

      <label>
        Password
        <input type="password" {...register('password')} />
        {errors.password && <small>{errors.password.message}</small>}
      </label>

      <button type="submit" disabled={isSubmitting}>
        Sign in
      </button>
    </form>
  );
}
