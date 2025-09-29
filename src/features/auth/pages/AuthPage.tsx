import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { SignInForm } from '@/features/auth/components/SignInForm';
import { SignUpForm } from '@/features/auth/components/SignUpForm';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

type Mode = 'signin' | 'signup' | 'reset';

function useMode(): Mode {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const raw = (params.get('mode') ?? 'signin').toLowerCase();
  return ['signin', 'signup', 'reset'].includes(raw) ? (raw as Mode) : 'signin';
}

export function AuthPage() {
  const mode = useMode();
  const navigate = useNavigate();

  const title = useMemo(
    () =>
      ({
        signin: 'Sign In',
        signup: 'Create Account',
        reset: 'Reset Password',
      }[mode]),
    [mode]
  );

  return (
    <main>
      <h1>{title}</h1>

      {mode === 'signin' && (
        <>
          <SignInForm />
          <p>
            <a onClick={() => navigate('/auth?mode=signup')}>Don't have an account?</a> ·{' '}
            <a onClick={() => navigate('/auth?mode=reset')}>Forgot password?</a>
          </p>
        </>
      )}

      {mode === 'signup' && (
        <>
          <SignUpForm />
          <p>
            <a onClick={() => navigate('/auth?mode=signin')}>Already have an account?</a>
          </p>
        </>
      )}

      {mode === 'reset' && (
        <>
          <ResetPasswordForm />
          <p>
            <a onClick={() => navigate('/auth?mode=signin')}>Back to sign in</a>
          </p>
        </>
      )}
    </main>
  );
}
