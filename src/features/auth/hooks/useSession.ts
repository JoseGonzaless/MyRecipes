import { useEffect, useRef, useState } from 'react';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Track the last user id we saw to detect changes
  const previousUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();

      if (!isMounted) return;

      setSession(data.session ?? null);
      previousUserIdRef.current = data.session?.user?.id ?? null;
      setLoading(false);
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, nextSession) => {
        const nextUserId = nextSession?.user?.id ?? null;

        if (previousUserIdRef.current !== nextUserId) {
          queryClient.clear();
          previousUserIdRef.current = nextUserId;
        }

        setSession(nextSession);
      }
    );

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    loading,
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
  };
}
